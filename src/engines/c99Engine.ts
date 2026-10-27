import {
  CodeTestCase,
  CompileAndRunResult,
  CompilerDiagnostic,
  HeapBlockSnapshot,
  MemorySnapshot,
  MemoryVariableSnapshot,
  StackFrameSnapshot,
  TestCaseRunResult,
  TraceStep,
} from '../types/curriculum';
import {
  getScalarSize,
  getTypeByteSize,
  parseCProgram,
  preprocessC,
  tokenizeC,
} from './c99LexerParser';
import {
  ASTExpr,
  ASTStmt,
  CStructDef,
  CTypeInfo,
  VarDeclItem,
} from './c99Types';

interface VarAllocation {
  name: string;
  type: CTypeInfo;
  address: number;
  sizeBytes: number;
  initialized: boolean;
  scopeName: string;
}

interface HeapBlockMeta {
  address: number;
  sizeBytes: number;
  allocatedAtLine: number;
  freed: boolean;
  freedAtLine?: number;
}

interface EvalValue {
  value: number; // Scalar numeric value or memory address
  type: CTypeInfo;
  lvalueAddress?: number;
  arrayBounds?: { baseAddr: number; length: number; elemSize: number };
}

class CRuntimeSignal {
  constructor(
    public kind: 'return' | 'break' | 'continue' | 'exit',
    public value: number = 0,
    public structSourceAddr?: number
  ) {}
}

class CRuntimeTrap extends Error {
  constructor(
    public line: number,
    public code: string,
    public title: string,
    public explanation: string
  ) {
    super(explanation);
  }
}

function isFloatType(t: CTypeInfo): boolean {
  return t.pointerDepth === 0 && t.arrayDims.length === 0 && (t.base === 'float' || t.base === 'double');
}

function formatTypeString(t: CTypeInfo): string {
  let s = '';
  if (t.isConst) s += 'const ';
  if (t.unsigned) s += 'unsigned ';
  if (t.base === 'struct' && t.structName) {
    s += `struct ${t.structName}`;
  } else {
    s += t.base;
  }
  if (t.pointerDepth > 0) {
    s += ' ' + '*'.repeat(t.pointerDepth);
  }
  for (const d of t.arrayDims) {
    s += `[${d}]`;
  }
  return s;
}

export function compileAndRunC(
  sourceCode: string,
  stdinInput: string = '',
  maxInstructions: number = 250000
): CompileAndRunResult {
  const startTime = performance.now();
  const diagnostics: CompilerDiagnostic[] = [];

  if (!sourceCode.trim()) {
    diagnostics.push({
      line: 1,
      column: 1,
      severity: 'error',
      category: 'syntaxe',
      code: 'C-EMPTY',
      gccMessage: 'error: empty translation unit',
      pedagogicalTitle: 'Programme C vide',
      pedagogicalExplanation:
        "Le fichier source est vide. Un programme C valide doit au minimum définir la fonction principale 'int main(void) { ... }'.",
    });
    return {
      compileSuccess: false,
      executionSuccess: false,
      exitCode: 1,
      stdout: '',
      stderr: 'error: empty translation unit',
      diagnostics,
      executionTimeMs: performance.now() - startTime,
      instructionsExecuted: 0,
      terminatedByTimeout: false,
    };
  }

  // 1. Preprocessor
  const { processed } = preprocessC(sourceCode, diagnostics);

  // 2. Lexer
  const tokens = tokenizeC(processed, diagnostics);

  // 3. Parser
  const ast = parseCProgram(tokens, diagnostics);

  // 4. Semantic check for main()
  const mainFn = ast.functions.get('main');
  if (!mainFn || !mainFn.body) {
    diagnostics.push({
      line: 1,
      column: 1,
      severity: 'error',
      category: 'compilation',
      code: 'C-LINK-NO-MAIN',
      gccMessage: "undefined reference to `main'",
      pedagogicalTitle: "Fonction principale 'main' introuvable",
      pedagogicalExplanation:
        "Tout programme C exécutable doit comporter une fonction 'int main(void) { ... }' qui constitue le point d'entrée du programme.",
    });
  }

  const hasErrors = diagnostics.some((d) => d.severity === 'error');
  if (hasErrors) {
    const stderrText = diagnostics
      .map((d) => `ligne ${d.line}:${d.column}: ${d.gccMessage}\n  -> ${d.pedagogicalTitle}`)
      .join('\n');
    return {
      compileSuccess: false,
      executionSuccess: false,
      exitCode: 1,
      stdout: '',
      stderr: stderrText,
      diagnostics,
      executionTimeMs: performance.now() - startTime,
      instructionsExecuted: 0,
      terminatedByTimeout: false,
    };
  }

  // ============================================================================
  // 5. LINEAR MEMORY SETUP (WebAssembly.Memory)
  // ============================================================================
  const wasmMemory = new WebAssembly.Memory({ initial: 4 }); // 4 * 64KB = 256 KB
  const memBytes = new Uint8Array(wasmMemory.buffer);
  const memView = new DataView(wasmMemory.buffer);

  // Shadow initialization map: 0 = uninitialized, 1 = initialized, 2 = redzone (out-of-bounds guard)
  const shadowInit = new Uint8Array(wasmMemory.buffer.byteLength);

  let rodataPtr = 0x0100; // 0x0100 .. 0x1fff
  let globalPtr = 0x2000; // 0x2000 .. 0x3fff
  let stackPtr = 0x4000; // 0x4000 .. 0xffff
  let heapPtr = 0x10000; // 0x10000 .. 0x3ffff

  const stringLiteralCache = new Map<string, number>();
  const globalEnv = new Map<string, VarAllocation>();
  const staticEnv = new Map<string, VarAllocation>();
  const heapBlocks = new Map<number, HeapBlockMeta>();
  const arrayBoundsByBase = new Map<number, { length: number; elemSize: number; name: string }>();

  const callStackFrames: {
    functionName: string;
    returnLine: number;
    baseAddress: number;
    scopes: Map<string, VarAllocation>[];
  }[] = [];

  let stdout = '';
  let stderr = '';
  let instructionsExecuted = 0;
  let terminatedByTimeout = false;
  let prngState = 123456789;
  const traceSteps: TraceStep[] = [];

  // Stdin stream cursor
  let stdinPos = 0;

  function align4(addr: number): number {
    return addr % 4 === 0 ? addr : addr + (4 - (addr % 4));
  }

  function allocateStringLiteral(str: string): number {
    if (stringLiteralCache.has(str)) {
      return stringLiteralCache.get(str)!;
    }
    const addr = rodataPtr;
    for (let i = 0; i < str.length; i++) {
      memBytes[rodataPtr] = str.charCodeAt(i) & 0xff;
      shadowInit[rodataPtr] = 1;
      rodataPtr++;
    }
    memBytes[rodataPtr] = 0; // Null terminator '\0'
    shadowInit[rodataPtr] = 1;
    rodataPtr = align4(rodataPtr + 1);
    stringLiteralCache.set(str, addr);
    return addr;
  }

  function readCString(addr: number, line: number): string {
    if (addr === 0) {
      throw new CRuntimeTrap(
        line,
        'C-RUN-NULL-STR',
        'Déréférencement de pointeur NULL (chaîne de caractères)',
        `Ligne ${line} : Tentative de lecture d'une chaîne de caractères à l'adresse NULL (0x0000).`
      );
    }
    if (addr < 0x0100 || addr >= memBytes.length) {
      throw new CRuntimeTrap(
        line,
        'C-RUN-SEGFAULT-STR',
        `Segmentation Fault : Adresse mémoire invalide (0x${addr.toString(16)})`,
        `Ligne ${line} : Le pointeur de chaîne (0x${addr.toString(16)}) pointe en dehors de la mémoire valide.`
      );
    }
    let out = '';
    let p = addr;
    let guard = 0;
    while (p < memBytes.length && memBytes[p] !== 0 && guard < 4096) {
      out += String.fromCharCode(memBytes[p]);
      p++;
      guard++;
    }
    return out;
  }

  function writeCString(addr: number, str: string, line: number): void {
    if (addr === 0) {
      throw new CRuntimeTrap(
        line,
        'C-RUN-NULL-WRITE',
        "Écriture à l'adresse NULL (0x0000)",
        `Ligne ${line} : Impossible d'écrire une chaîne à l'adresse NULL (0x0000).`
      );
    }
    if (addr < 0x1000 || addr >= memBytes.length) {
      throw new CRuntimeTrap(
        line,
        'C-RUN-RODATA-WRITE',
        `Écriture mémoire invalide à l'adresse 0x${addr.toString(16)}`,
        `Ligne ${line} : Tentative d'écriture dans une zone mémoire protégée ou invalide (0x${addr.toString(16)}).`
      );
    }
    for (let i = 0; i < str.length; i++) {
      if (shadowInit[addr + i] === 2) {
        throw new CRuntimeTrap(
          line,
          'C-RUN-BUFFER-OVERFLOW',
          'Dépassement de capacité de tableau (Buffer Overflow)',
          `Ligne ${line} : La chaîne écrite (${str.length} caractères + '\\0') dépasse la taille du tableau de caractères alloué en mémoire !`
        );
      }
      memBytes[addr + i] = str.charCodeAt(i) & 0xff;
      shadowInit[addr + i] = 1;
    }
    if (shadowInit[addr + str.length] === 2) {
      throw new CRuntimeTrap(
        line,
        'C-RUN-BUFFER-OVERFLOW-NULL',
        "Dépassement de tableau pour le caractère nul '\\0'",
        `Ligne ${line} : Il manque 1 octet dans votre tableau de caractères pour stocker la sentinelle de fin de chaîne '\\0'. Un mot de N lettres nécessite un tableau de taille N + 1.`
      );
    }
    memBytes[addr + str.length] = 0;
    shadowInit[addr + str.length] = 1;
  }

  function checkAddressValid(addr: number, size: number, isWrite: boolean, line: number): void {
    if (addr === 0) {
      throw new CRuntimeTrap(
        line,
        'C-RUN-NULL-DEREF',
        'Erreur fatale : Déréférencement du pointeur NULL (0x0000)',
        `Ligne ${line} : Vous avez tenté de ${
          isWrite ? 'modifier' : 'lire'
        } la valeur pointée par un pointeur NULL (*p alors que p == NULL). Vérifiez que votre pointeur est bien initialisé avec une adresse valide avant d'utiliser '*'.`
      );
    }
    if (addr < 0x0100 || addr + size > memBytes.length) {
      throw new CRuntimeTrap(
        line,
        'C-RUN-SEGFAULT',
        `Erreur de segmentation (Segmentation Fault) à l'adresse 0x${addr.toString(16)}`,
        `Ligne ${line} : Accès mémoire interdit à l'adresse 0x${addr.toString(
          16
        )}. Cela arrive lorsqu'un pointeur n'est pas initialisé, lorsqu'il vous manque '&' dans scanf, ou lors d'un débordement de tableau.`
      );
    }
    for (let k = 0; k < size; k++) {
      if (shadowInit[addr + k] === 2) {
        throw new CRuntimeTrap(
          line,
          'C-RUN-OUT-OF-BOUNDS',
          'Dépassement des bornes du tableau (Out-of-Bounds Access)',
          `Ligne ${line} : Accès mémoire hors des limites du tableau à l'adresse 0x${addr.toString(
            16
          )}. Rappel : en C, un tableau de taille N possède des indices valides allant de 0 à N - 1.`
        );
      }
    }
    // Check if inside a freed heap block
    for (const hb of heapBlocks.values()) {
      if (hb.freed && addr >= hb.address && addr < hb.address + hb.sizeBytes) {
        throw new CRuntimeTrap(
          line,
          'C-RUN-USE-AFTER-FREE',
          'Utilisation de mémoire déjà libérée (Use-After-Free)',
          `Ligne ${line} : Vous accédez au bloc mémoire 0x${hb.address.toString(
            16
          )} qui a déjà été libéré par free() à la ligne ${hb.freedAtLine}.`
        );
      }
    }
  }

  function readScalarFromMemory(addr: number, type: CTypeInfo, line: number): number {
    checkAddressValid(addr, 1, false, line);
    if (type.pointerDepth > 0) {
      return memView.getInt32(addr, true);
    }
    switch (type.base) {
      case 'char':
        return type.unsigned ? memView.getUint8(addr) : memView.getInt8(addr);
      case 'bool':
        return memView.getUint8(addr) !== 0 ? 1 : 0;
      case 'short':
        return type.unsigned ? memView.getUint16(addr, true) : memView.getInt16(addr, true);
      case 'int':
      case 'long':
      case 'size_t':
      case 'FILE':
        return type.unsigned ? memView.getUint32(addr, true) : memView.getInt32(addr, true);
      case 'float':
        return memView.getFloat32(addr, true);
      case 'double':
        return memView.getFloat64(addr, true);
      default:
        return memView.getInt32(addr, true);
    }
  }

  function writeScalarToMemory(
    addr: number,
    type: CTypeInfo,
    value: number,
    line: number
  ): number {
    const byteSize = type.pointerDepth > 0 ? 4 : getScalarSize(type.base);
    checkAddressValid(addr, byteSize, true, line);
    for (let k = 0; k < byteSize; k++) {
      shadowInit[addr + k] = 1;
    }

    if (type.pointerDepth > 0) {
      const v = Math.trunc(value);
      memView.setInt32(addr, v, true);
      return v;
    }
    switch (type.base) {
      case 'char': {
        const v = Math.trunc(value);
        if (type.unsigned) {
          memView.setUint8(addr, v & 0xff);
          return memView.getUint8(addr);
        } else {
          memView.setInt8(addr, v);
          return memView.getInt8(addr);
        }
      }
      case 'bool': {
        const v = value !== 0 ? 1 : 0;
        memView.setUint8(addr, v);
        return v;
      }
      case 'short': {
        const v = Math.trunc(value);
        if (type.unsigned) {
          memView.setUint16(addr, v & 0xffff, true);
          return memView.getUint16(addr, true);
        } else {
          memView.setInt16(addr, v, true);
          return memView.getInt16(addr, true);
        }
      }
      case 'int':
      case 'long':
      case 'size_t':
      case 'FILE': {
        const v = Math.trunc(value);
        if (type.unsigned) {
          memView.setUint32(addr, v >>> 0, true);
          return memView.getUint32(addr, true);
        } else {
          memView.setInt32(addr, v | 0, true);
          return memView.getInt32(addr, true);
        }
      }
      case 'float': {
        memView.setFloat32(addr, value, true);
        return memView.getFloat32(addr, true);
      }
      case 'double': {
        memView.setFloat64(addr, value, true);
        return memView.getFloat64(addr, true);
      }
      default: {
        const v = Math.trunc(value);
        memView.setInt32(addr, v, true);
        return v;
      }
    }
  }

  function lookupVariable(name: string, line: number): VarAllocation {
    if (callStackFrames.length > 0) {
      const topFrame = callStackFrames[callStackFrames.length - 1];
      for (let s = topFrame.scopes.length - 1; s >= 0; s--) {
        const found = topFrame.scopes[s].get(name);
        if (found) return found;
      }
    }
    if (globalEnv.has(name)) {
      return globalEnv.get(name)!;
    }
    throw new CRuntimeTrap(
      line,
      'C-COMP-UNDECLARED',
      `Identifiant '${name}' non déclaré`,
      `Ligne ${line} : La variable '${name}' est utilisée sans avoir été déclarée au préalable dans cette portée.`
    );
  }

  function allocateVariableInSegment(
    decl: VarDeclItem,
    isGlobalOrStatic: boolean,
    scopeName: string
  ): VarAllocation {
    const sizeBytes = Math.max(4, getTypeByteSize(decl.type, ast.structs));
    let addr: number;

    if (isGlobalOrStatic) {
      globalPtr = align4(globalPtr);
      addr = globalPtr;
      globalPtr += sizeBytes;
      // Globals and static variables are zero-initialized by default in C
      for (let i = 0; i < sizeBytes; i++) {
        memBytes[addr + i] = 0;
        shadowInit[addr + i] = 1;
      }
    } else {
      stackPtr = align4(stackPtr);
      // Add 4-byte pre-redzone if array
      if (decl.type.arrayDims.length > 0) {
        for (let r = 0; r < 4; r++) shadowInit[stackPtr + r] = 2;
        stackPtr += 4;
      }
      addr = stackPtr;
      for (let i = 0; i < sizeBytes; i++) {
        memBytes[addr + i] = 0;
        shadowInit[addr + i] = 0; // Uninitialized local stack memory
      }
      stackPtr += sizeBytes;
      if (decl.type.arrayDims.length > 0) {
        for (let r = 0; r < 4; r++) shadowInit[stackPtr + r] = 2;
        stackPtr += 4;
      }
    }

    if (decl.type.arrayDims.length > 0) {
      const elemType: CTypeInfo = {
        ...decl.type,
        arrayDims: decl.type.arrayDims.slice(1),
      };
      const elemSize = getTypeByteSize(elemType, ast.structs);
      arrayBoundsByBase.set(addr, {
        length: decl.type.arrayDims[0],
        elemSize,
        name: decl.name,
      });
    }

    const alloc: VarAllocation = {
      name: decl.name,
      type: { ...decl.type, arrayDims: [...decl.type.arrayDims] },
      address: addr,
      sizeBytes,
      initialized: isGlobalOrStatic || decl.type.base === 'struct' || decl.type.arrayDims.length > 0,
      scopeName,
    };

    if (decl.init) {
      initializeAllocation(alloc, decl.init, decl.line);
      alloc.initialized = true;
    }

    return alloc;
  }

  function initializeAllocation(alloc: VarAllocation, init: ASTExpr, line: number): void {
    // 1. Char array initialized with string literal: char s[] = "abc";
    if (
      alloc.type.base === 'char' &&
      alloc.type.pointerDepth === 0 &&
      alloc.type.arrayDims.length === 1 &&
      init.kind === 'string_lit'
    ) {
      for (let i = 0; i < alloc.sizeBytes; i++) {
        memBytes[alloc.address + i] = 0;
        shadowInit[alloc.address + i] = 1;
      }
      writeCString(alloc.address, init.value, line);
      return;
    }

    // 2. Array initialized with { e1, e2, ... }
    if (alloc.type.arrayDims.length > 0 && init.kind === 'init_list') {
      // Zero-fill entire array first (standard C rule for partial initializer lists like {0})
      for (let i = 0; i < alloc.sizeBytes; i++) {
        memBytes[alloc.address + i] = 0;
        shadowInit[alloc.address + i] = 1;
      }
      const subType: CTypeInfo = {
        ...alloc.type,
        arrayDims: alloc.type.arrayDims.slice(1),
      };
      const elemSize = getTypeByteSize(subType, ast.structs);
      for (let idx = 0; idx < init.elements.length; idx++) {
        const elemExpr = init.elements[idx];
        const elemAddr = alloc.address + idx * elemSize;
        if (subType.arrayDims.length > 0 && elemExpr.kind === 'init_list') {
          const subAlloc: VarAllocation = {
            name: `${alloc.name}[${idx}]`,
            type: subType,
            address: elemAddr,
            sizeBytes: elemSize,
            initialized: true,
            scopeName: alloc.scopeName,
          };
          initializeAllocation(subAlloc, elemExpr, line);
        } else if (
          subType.base === 'char' &&
          subType.arrayDims.length === 1 &&
          elemExpr.kind === 'string_lit'
        ) {
          writeCString(elemAddr, elemExpr.value, line);
        } else {
          const v = evalExpr(elemExpr);
          writeScalarToMemory(elemAddr, subType, v.value, line);
        }
      }
      return;
    }

    // 3. Struct initialized with { ... } or another struct expression
    if (
      alloc.type.base === 'struct' &&
      alloc.type.pointerDepth === 0 &&
      alloc.type.arrayDims.length === 0 &&
      alloc.type.structName
    ) {
      const sDef = ast.structs.get(alloc.type.structName);
      if (sDef) {
        for (let i = 0; i < alloc.sizeBytes; i++) {
          memBytes[alloc.address + i] = 0;
          shadowInit[alloc.address + i] = 1;
        }
        if (init.kind === 'init_list') {
          if (init.designated && init.designated.length > 0) {
            for (const d of init.designated) {
              const field = sDef.fields.find((f) => f.name === d.field);
              if (field) {
                const fAlloc: VarAllocation = {
                  name: field.name,
                  type: field.type,
                  address: alloc.address + field.offset,
                  sizeBytes: field.size,
                  initialized: true,
                  scopeName: alloc.scopeName,
                };
                initializeAllocation(fAlloc, d.expr, line);
              }
            }
          } else {
            for (let idx = 0; idx < Math.min(sDef.fields.length, init.elements.length); idx++) {
              const field = sDef.fields[idx];
              const fAlloc: VarAllocation = {
                name: field.name,
                type: field.type,
                address: alloc.address + field.offset,
                sizeBytes: field.size,
                initialized: true,
                scopeName: alloc.scopeName,
              };
              initializeAllocation(fAlloc, init.elements[idx], line);
            }
          }
          return;
        } else {
          const rhs = evalExpr(init);
          const srcAddr = rhs.lvalueAddress ?? rhs.value;
          for (let b = 0; b < sDef.totalSize; b++) {
            memBytes[alloc.address + b] = memBytes[srcAddr + b];
            shadowInit[alloc.address + b] = 1;
          }
          return;
        }
      }
    }

    // 4. Scalar variable initialization
    const val = evalExpr(init);
    writeScalarToMemory(alloc.address, alloc.type, val.value, line);
  }

  function getPointedElementSize(ptrType: CTypeInfo): number {
    if (ptrType.arrayDims.length > 0) {
      const sub: CTypeInfo = { ...ptrType, arrayDims: ptrType.arrayDims.slice(1) };
      return getTypeByteSize(sub, ast.structs);
    }
    if (ptrType.pointerDepth > 1) return 4;
    if (ptrType.base === 'struct' && ptrType.structName) {
      return ast.structs.get(ptrType.structName)?.totalSize ?? 4;
    }
    return getScalarSize(ptrType.base);
  }

  function evalExpr(expr: ASTExpr): EvalValue {
    instructionsExecuted++;
    if (instructionsExecuted > maxInstructions) {
      terminatedByTimeout = true;
      throw new CRuntimeTrap(
        expr.line,
        'C-RUN-TIMEOUT',
        'Temps limite dépassé : Boucle infinie ou récursion excessive',
        `Ligne ${expr.line} : Le programme a exécuté plus de ${maxInstructions} opérations sans se terminer. Vérifiez la condition d'arrêt et l'incrémentation de vos boucles.`
      );
    }

    switch (expr.kind) {
      case 'int_lit':
        return {
          value: expr.value,
          type: { base: 'int', pointerDepth: 0, arrayDims: [] },
        };
      case 'float_lit':
        return {
          value: expr.value,
          type: { base: 'double', pointerDepth: 0, arrayDims: [] },
        };
      case 'char_lit':
        return {
          value: expr.value,
          type: { base: 'char', pointerDepth: 0, arrayDims: [] },
        };
      case 'string_lit': {
        const addr = allocateStringLiteral(expr.value);
        return {
          value: addr,
          type: { base: 'char', isConst: true, pointerDepth: 1, arrayDims: [] },
        };
      }
      case 'ident': {
        const alloc = lookupVariable(expr.name, expr.line);
        // Array decays to pointer to its first element when evaluated as an expression
        if (alloc.type.arrayDims.length > 0) {
          const bounds = arrayBoundsByBase.get(alloc.address);
          return {
            value: alloc.address,
            type: {
              ...alloc.type,
              pointerDepth: alloc.type.pointerDepth + 1,
              arrayDims: alloc.type.arrayDims.slice(1),
            },
            lvalueAddress: alloc.address,
            arrayBounds: bounds
              ? {
                  baseAddr: alloc.address,
                  length: bounds.length,
                  elemSize: bounds.elemSize,
                }
              : undefined,
          };
        }
        if (alloc.type.base === 'struct' && alloc.type.pointerDepth === 0) {
          return {
            value: alloc.address,
            type: alloc.type,
            lvalueAddress: alloc.address,
          };
        }
        const val = readScalarFromMemory(alloc.address, alloc.type, expr.line);
        return {
          value: val,
          type: alloc.type,
          lvalueAddress: alloc.address,
        };
      }

      case 'sizeof_type':
        return {
          value: getTypeByteSize(expr.targetType, ast.structs),
          type: { base: 'size_t', unsigned: true, pointerDepth: 0, arrayDims: [] },
        };

      case 'sizeof_expr': {
        if (expr.expr.kind === 'ident') {
          const alloc = lookupVariable(expr.expr.name, expr.line);
          return {
            value: alloc.sizeBytes,
            type: { base: 'size_t', unsigned: true, pointerDepth: 0, arrayDims: [] },
          };
        }
        const ev = evalExpr(expr.expr);
        return {
          value: getTypeByteSize(ev.type, ast.structs),
          type: { base: 'size_t', unsigned: true, pointerDepth: 0, arrayDims: [] },
        };
      }

      case 'cast': {
        const inner = evalExpr(expr.expr);
        if (
          expr.targetType.pointerDepth === 0 &&
          expr.targetType.base !== 'float' &&
          expr.targetType.base !== 'double'
        ) {
          return {
            value: Math.trunc(inner.value),
            type: expr.targetType,
          };
        }
        return {
          value: inner.value,
          type: expr.targetType,
        };
      }

      case 'index': {
        const arrVal = evalExpr(expr.array);
        const idxVal = evalExpr(expr.index);
        const index = Math.trunc(idxVal.value);

        const baseAddr = arrVal.value;
        let elemType: CTypeInfo;
        if (arrVal.type.arrayDims.length > 0) {
          elemType = {
            ...arrVal.type,
            arrayDims: arrVal.type.arrayDims.slice(1),
          };
        } else {
          elemType = {
            ...arrVal.type,
            pointerDepth: Math.max(0, arrVal.type.pointerDepth - 1),
            arrayDims: [],
          };
        }
        const elemSize = getTypeByteSize(elemType, ast.structs);

        // Bounds check if baseAddr corresponds to a known array
        const knownBounds = arrayBoundsByBase.get(baseAddr);
        if (knownBounds && (index < 0 || index >= knownBounds.length)) {
          throw new CRuntimeTrap(
            expr.line,
            'C-RUN-ARRAY-OOB',
            `Dépassement d'indice sur le tableau '${knownBounds.name}' : indice ${index} invalide`,
            `Ligne ${expr.line} : Vous tentez d'accéder à '${knownBounds.name}[${index}]', alors que le tableau '${knownBounds.name}' est de taille ${knownBounds.length} (les indices valides vont de 0 à ${
              knownBounds.length - 1
            }).`
          );
        }

        const elemAddr = baseAddr + index * elemSize;
        if (elemType.arrayDims.length > 0 || (elemType.base === 'struct' && elemType.pointerDepth === 0)) {
          return {
            value: elemAddr,
            type: elemType,
            lvalueAddress: elemAddr,
          };
        }
        const val = readScalarFromMemory(elemAddr, elemType, expr.line);
        return {
          value: val,
          type: elemType,
          lvalueAddress: elemAddr,
        };
      }

      case 'member': {
        const objVal = evalExpr(expr.object);
        const structAddr = expr.isArrow ? objVal.value : objVal.lvalueAddress ?? objVal.value;
        if (structAddr === 0) {
          throw new CRuntimeTrap(
            expr.line,
            'C-RUN-NULL-STRUCT',
            `Déréférencement de pointeur de structure NULL (->${expr.field})`,
            `Ligne ${expr.line} : Le pointeur de structure vaut NULL (0x0000). Impossible d'accéder au champ '${expr.field}'.`
          );
        }
        const sName = objVal.type.structName;
        const sDef = sName ? ast.structs.get(sName) : undefined;
        if (!sDef) {
          throw new CRuntimeTrap(
            expr.line,
            'C-COMP-UNKNOWN-STRUCT',
            `Structure inconnue pour l'accès au champ '${expr.field}'`,
            `Ligne ${expr.line} : Le type de l'objet ne correspond pas à une structure connue.`
          );
        }
        const field = sDef.fields.find((f) => f.name === expr.field);
        if (!field) {
          throw new CRuntimeTrap(
            expr.line,
            'C-COMP-UNKNOWN-FIELD',
            `Champ '${expr.field}' inexistant dans 'struct ${sDef.name}'`,
            `Ligne ${expr.line} : La structure '${sDef.name}' ne possède pas de champ nommé '${expr.field}'. Champs existants : ${sDef.fields
              .map((f) => f.name)
              .join(', ')}.`
          );
        }
        const fieldAddr = structAddr + field.offset;
        if (field.type.arrayDims.length > 0) {
          return {
            value: fieldAddr,
            type: {
              ...field.type,
              pointerDepth: field.type.pointerDepth + 1,
              arrayDims: field.type.arrayDims.slice(1),
            },
            lvalueAddress: fieldAddr,
          };
        }
        if (field.type.base === 'struct' && field.type.pointerDepth === 0) {
          return {
            value: fieldAddr,
            type: field.type,
            lvalueAddress: fieldAddr,
          };
        }
        const val = readScalarFromMemory(fieldAddr, field.type, expr.line);
        return {
          value: val,
          type: field.type,
          lvalueAddress: fieldAddr,
        };
      }

      case 'unary': {
        if (expr.op === '&') {
          const target = evalExpr(expr.operand);
          if (target.lvalueAddress === undefined) {
            throw new CRuntimeTrap(
              expr.line,
              'C-COMP-LVALUE-ADDR',
              "Opérateur '&' sur une expression sans adresse mémoire",
              `Ligne ${expr.line} : L'opérateur '&' ne peut être appliqué qu'à une variable, un élément de tableau ou un champ de structure.`
            );
          }
          return {
            value: target.lvalueAddress,
            type: {
              ...target.type,
              pointerDepth: target.type.pointerDepth + 1,
              arrayDims: [],
            },
          };
        }

        if (expr.op === '*') {
          const ptrVal = evalExpr(expr.operand);
          const targetAddr = Math.trunc(ptrVal.value);
          const derefType: CTypeInfo = {
            ...ptrVal.type,
            pointerDepth: Math.max(0, ptrVal.type.pointerDepth - 1),
            arrayDims: [],
          };
          if (derefType.base === 'struct' && derefType.pointerDepth === 0) {
            checkAddressValid(targetAddr, 4, false, expr.line);
            return {
              value: targetAddr,
              type: derefType,
              lvalueAddress: targetAddr,
            };
          }
          const val = readScalarFromMemory(targetAddr, derefType, expr.line);
          return {
            value: val,
            type: derefType,
            lvalueAddress: targetAddr,
          };
        }

        if (expr.op === '++' || expr.op === '--') {
          const operand = evalExpr(expr.operand);
          if (operand.lvalueAddress === undefined) {
            throw new CRuntimeTrap(
              expr.line,
              'C-COMP-INC-LVALUE',
              `Opérateur '${expr.op}' sur une expression non modifiable`,
              `Ligne ${expr.line} : '${expr.op}' nécessite une variable modifiable.`
            );
          }
          const step =
            operand.type.pointerDepth > 0 ? getPointedElementSize(operand.type) : 1;
          const delta = expr.op === '++' ? step : -step;
          const newVal = operand.value + delta;
          const stored = writeScalarToMemory(
            operand.lvalueAddress,
            operand.type,
            newVal,
            expr.line
          );
          if (expr.operand.kind === 'ident') {
            const alloc = lookupVariable(expr.operand.name, expr.line);
            alloc.initialized = true;
          }
          return {
            value: expr.prefix ? stored : operand.value,
            type: operand.type,
          };
        }

        const inner = evalExpr(expr.operand);
        if (expr.op === '-') return { value: -inner.value, type: inner.type };
        if (expr.op === '+') return { value: +inner.value, type: inner.type };
        if (expr.op === '!') {
          return {
            value: inner.value === 0 ? 1 : 0,
            type: { base: 'int', pointerDepth: 0, arrayDims: [] },
          };
        }
        if (expr.op === '~') {
          return {
            value: ~Math.trunc(inner.value),
            type: { base: 'int', pointerDepth: 0, arrayDims: [] },
          };
        }
        return inner;
      }

      case 'binary': {
        // Short-circuit logical operators
        if (expr.op === '&&') {
          const l = evalExpr(expr.left);
          if (l.value === 0) {
            return { value: 0, type: { base: 'int', pointerDepth: 0, arrayDims: [] } };
          }
          const r = evalExpr(expr.right);
          return {
            value: r.value !== 0 ? 1 : 0,
            type: { base: 'int', pointerDepth: 0, arrayDims: [] },
          };
        }
        if (expr.op === '||') {
          const l = evalExpr(expr.left);
          if (l.value !== 0) {
            return { value: 1, type: { base: 'int', pointerDepth: 0, arrayDims: [] } };
          }
          const r = evalExpr(expr.right);
          return {
            value: r.value !== 0 ? 1 : 0,
            type: { base: 'int', pointerDepth: 0, arrayDims: [] },
          };
        }

        const l = evalExpr(expr.left);
        const r = evalExpr(expr.right);
        const isFloat = isFloatType(l.type) || isFloatType(r.type);
        const resType: CTypeInfo = {
          base: isFloat ? 'double' : 'int',
          pointerDepth: 0,
          arrayDims: [],
        };

        // Pointer arithmetic support
        if (expr.op === '+' && (l.type.pointerDepth > 0 || r.type.pointerDepth > 0)) {
          if (l.type.pointerDepth > 0 && r.type.pointerDepth === 0) {
            const scale = getPointedElementSize(l.type);
            return { value: l.value + Math.trunc(r.value) * scale, type: l.type };
          }
          if (r.type.pointerDepth > 0 && l.type.pointerDepth === 0) {
            const scale = getPointedElementSize(r.type);
            return { value: r.value + Math.trunc(l.value) * scale, type: r.type };
          }
        }
        if (expr.op === '-' && l.type.pointerDepth > 0) {
          const scale = getPointedElementSize(l.type);
          if (r.type.pointerDepth > 0) {
            return {
              value: Math.trunc((l.value - r.value) / scale),
              type: { base: 'int', pointerDepth: 0, arrayDims: [] },
            };
          }
          return { value: l.value - Math.trunc(r.value) * scale, type: l.type };
        }

        switch (expr.op) {
          case '+':
            return { value: isFloat ? l.value + r.value : Math.trunc(l.value + r.value), type: resType };
          case '-':
            return { value: isFloat ? l.value - r.value : Math.trunc(l.value - r.value), type: resType };
          case '*':
            return { value: isFloat ? l.value * r.value : Math.trunc(l.value * r.value), type: resType };
          case '/': {
            if (r.value === 0) {
              throw new CRuntimeTrap(
                expr.line,
                'C-RUN-DIV-ZERO',
                'Erreur fatale : Division par zéro',
                `Ligne ${expr.line} : Le dénominateur de votre division vaut 0. En C, diviser par zéro provoque un crash immédiat (Floating point exception / SIGFPE).`
              );
            }
            return {
              value: isFloat ? l.value / r.value : Math.trunc(l.value / r.value),
              type: resType,
            };
          }
          case '%': {
            if (Math.trunc(r.value) === 0) {
              throw new CRuntimeTrap(
                expr.line,
                'C-RUN-MOD-ZERO',
                'Erreur fatale : Modulo par zéro (% 0)',
                `Ligne ${expr.line} : Le second opérande de l'opérateur modulo '%' vaut 0.`
              );
            }
            return {
              value: Math.trunc(l.value) % Math.trunc(r.value),
              type: { base: 'int', pointerDepth: 0, arrayDims: [] },
            };
          }
          case '==':
            return { value: l.value === r.value ? 1 : 0, type: { base: 'int', pointerDepth: 0, arrayDims: [] } };
          case '!=':
            return { value: l.value !== r.value ? 1 : 0, type: { base: 'int', pointerDepth: 0, arrayDims: [] } };
          case '<':
            return { value: l.value < r.value ? 1 : 0, type: { base: 'int', pointerDepth: 0, arrayDims: [] } };
          case '<=':
            return { value: l.value <= r.value ? 1 : 0, type: { base: 'int', pointerDepth: 0, arrayDims: [] } };
          case '>':
            return { value: l.value > r.value ? 1 : 0, type: { base: 'int', pointerDepth: 0, arrayDims: [] } };
          case '>=':
            return { value: l.value >= r.value ? 1 : 0, type: { base: 'int', pointerDepth: 0, arrayDims: [] } };
          case '&':
            return { value: Math.trunc(l.value) & Math.trunc(r.value), type: resType };
          case '|':
            return { value: Math.trunc(l.value) | Math.trunc(r.value), type: resType };
          case '^':
            return { value: Math.trunc(l.value) ^ Math.trunc(r.value), type: resType };
          case '<<':
            return { value: Math.trunc(l.value) << Math.trunc(r.value), type: resType };
          case '>>':
            return { value: Math.trunc(l.value) >> Math.trunc(r.value), type: resType };
          default:
            return { value: 0, type: resType };
        }
      }

      case 'ternary': {
        const c = evalExpr(expr.cond);
        return c.value !== 0 ? evalExpr(expr.thenExpr) : evalExpr(expr.elseExpr);
      }

      case 'assign': {
        const lhs = evalExpr(expr.left);
        const rhs = evalExpr(expr.right);
        if (lhs.lvalueAddress === undefined) {
          throw new CRuntimeTrap(
            expr.line,
            'C-COMP-ASSIGN-LVALUE',
            'Cible d’affectation invalide',
            `Ligne ${expr.line} : Le membre gauche d'une affectation ('${expr.op}') doit être une variable, un élément de tableau, un champ ou un pointeur déréférencé.`
          );
        }

        // Struct assignment copies bytes
        if (
          lhs.type.base === 'struct' &&
          lhs.type.pointerDepth === 0 &&
          lhs.type.structName &&
          expr.op === '='
        ) {
          const sDef = ast.structs.get(lhs.type.structName);
          const srcAddr = rhs.lvalueAddress ?? rhs.value;
          if (sDef && srcAddr > 0) {
            for (let b = 0; b < sDef.totalSize; b++) {
              memBytes[lhs.lvalueAddress + b] = memBytes[srcAddr + b];
              shadowInit[lhs.lvalueAddress + b] = 1;
            }
          }
          return {
            value: lhs.lvalueAddress,
            type: lhs.type,
            lvalueAddress: lhs.lvalueAddress,
          };
        }

        let computed = rhs.value;
        const scale =
          lhs.type.pointerDepth > 0 ? getPointedElementSize(lhs.type) : 1;

        switch (expr.op) {
          case '=':
            computed = rhs.value;
            break;
          case '+=':
            computed = lhs.value + rhs.value * scale;
            break;
          case '-=':
            computed = lhs.value - rhs.value * scale;
            break;
          case '*=':
            computed = lhs.value * rhs.value;
            break;
          case '/=':
            if (rhs.value === 0) {
              throw new CRuntimeTrap(
                expr.line,
                'C-RUN-DIV-ZERO',
                'Division par zéro (/= 0)',
                `Ligne ${expr.line} : Division par zéro lors de l'opération '/='.`
              );
            }
            computed = isFloatType(lhs.type)
              ? lhs.value / rhs.value
              : Math.trunc(lhs.value / rhs.value);
            break;
          case '%=':
            computed = Math.trunc(lhs.value) % Math.trunc(rhs.value);
            break;
          case '&=':
            computed = Math.trunc(lhs.value) & Math.trunc(rhs.value);
            break;
          case '|=':
            computed = Math.trunc(lhs.value) | Math.trunc(rhs.value);
            break;
          case '^=':
            computed = Math.trunc(lhs.value) ^ Math.trunc(rhs.value);
            break;
          case '<<=':
            computed = Math.trunc(lhs.value) << Math.trunc(rhs.value);
            break;
          case '>>=':
            computed = Math.trunc(lhs.value) >> Math.trunc(rhs.value);
            break;
        }

        const stored = writeScalarToMemory(lhs.lvalueAddress, lhs.type, computed, expr.line);
        if (expr.left.kind === 'ident') {
          const alloc = lookupVariable(expr.left.name, expr.line);
          alloc.initialized = true;
        }
        return { value: stored, type: lhs.type, lvalueAddress: lhs.lvalueAddress };
      }

      case 'call':
        return invokeCFunction(expr.callee, expr.args, expr.line);

      case 'init_list':
        return { value: 0, type: { base: 'int', pointerDepth: 0, arrayDims: [] } };
    }
  }

  // ============================================================================
  // STANDARD LIBRARY & USER FUNCTION INVOCATION
  // ============================================================================

  function formatPrintf(fmt: string, argValues: EvalValue[], line: number): string {
    let out = '';
    let argIdx = 0;
    let i = 0;

    while (i < fmt.length) {
      if (fmt[i] !== '%') {
        out += fmt[i];
        i++;
        continue;
      }
      if (fmt[i + 1] === '%') {
        out += '%';
        i += 2;
        continue;
      }

      const specMatch = fmt
        .slice(i)
        .match(/^%([-+0 #]*)(\d+)?(?:\.(\d+))?(hh|h|ll|l|z|L)?([diuoxXfFeEgGaAcsp])/);
      if (!specMatch) {
        out += fmt[i];
        i++;
        continue;
      }

      const [fullMatch, flags, widthStr, precStr, , conv] = specMatch;
      i += fullMatch.length;

      const arg = argValues[argIdx++] ?? {
        value: 0,
        type: { base: 'int', pointerDepth: 0, arrayDims: [] },
      };

      let formatted = '';
      switch (conv) {
        case 'd':
        case 'i':
          formatted = String(Math.trunc(arg.value));
          break;
        case 'u':
        case 'z':
          formatted = String(Math.trunc(arg.value) >>> 0);
          break;
        case 'x':
          formatted = (Math.trunc(arg.value) >>> 0).toString(16);
          break;
        case 'X':
          formatted = (Math.trunc(arg.value) >>> 0).toString(16).toUpperCase();
          break;
        case 'o':
          formatted = (Math.trunc(arg.value) >>> 0).toString(8);
          break;
        case 'f':
        case 'F': {
          const prec = precStr !== undefined ? Number(precStr) : 6;
          formatted = Number(arg.value).toFixed(prec);
          break;
        }
        case 'e':
        case 'E': {
          const prec = precStr !== undefined ? Number(precStr) : 6;
          formatted = Number(arg.value).toExponential(prec);
          if (conv === 'E') formatted = formatted.toUpperCase();
          break;
        }
        case 'g':
        case 'G': {
          formatted = String(Number(arg.value.toPrecision(precStr ? Number(precStr) : 6)));
          break;
        }
        case 'c':
          formatted = String.fromCharCode(Math.trunc(arg.value) & 0xff);
          break;
        case 's': {
          let s = readCString(Math.trunc(arg.value), line);
          if (precStr !== undefined) {
            s = s.slice(0, Number(precStr));
          }
          formatted = s;
          break;
        }
        case 'p': {
          const addr = Math.trunc(arg.value) >>> 0;
          formatted = addr === 0 ? '(nil)' : `0x${addr.toString(16).padStart(4, '0')}`;
          break;
        }
        default:
          formatted = String(arg.value);
      }

      if (
        flags.includes('+') &&
        ['d', 'i', 'f', 'F', 'e', 'E', 'g', 'G'].includes(conv) &&
        !formatted.startsWith('-')
      ) {
        formatted = '+' + formatted;
      }

      if (widthStr !== undefined) {
        const w = Number(widthStr);
        if (formatted.length < w) {
          if (flags.includes('-')) {
            formatted = formatted.padEnd(w, ' ');
          } else if (flags.includes('0') && !flags.includes('-')) {
            if (formatted.startsWith('-') || formatted.startsWith('+')) {
              formatted =
                formatted[0] + formatted.slice(1).padStart(w - 1, '0');
            } else {
              formatted = formatted.padStart(w, '0');
            }
          } else {
            formatted = formatted.padStart(w, ' ');
          }
        }
      }

      out += formatted;
    }

    return out;
  }

  function executeScanfFromBuffer(
    inputSource: string,
    startPos: number,
    fmt: string,
    targetArgs: EvalValue[],
    rawArgExprs: ASTExpr[],
    line: number
  ): { count: number; newPos: number } {
    let pos = startPos;
    let assigned = 0;
    let argIdx = 0;
    let fIdx = 0;

    function skipWhitespace() {
      while (pos < inputSource.length && /\s/.test(inputSource[pos])) {
        pos++;
      }
    }

    // If input is completely exhausted before reading anything
    skipWhitespace();
    if (pos >= inputSource.length && fmt.includes('%')) {
      return { count: -1, newPos: pos }; // EOF
    }
    pos = startPos;

    while (fIdx < fmt.length) {
      if (/\s/.test(fmt[fIdx])) {
        skipWhitespace();
        fIdx++;
        continue;
      }
      if (fmt[fIdx] !== '%') {
        if (inputSource[pos] === fmt[fIdx]) {
          pos++;
          fIdx++;
          continue;
        } else {
          break;
        }
      }
      if (fmt[fIdx + 1] === '%') {
        if (inputSource[pos] === '%') pos++;
        fIdx += 2;
        continue;
      }

      const m = fmt.slice(fIdx).match(/^%(\*)?(\d+)?(hh|h|ll|l|z)?([diuoxXfFeEgGaAcsp])/);
      if (!m) {
        fIdx++;
        continue;
      }
      const [full, suppress, widthStr, lenMod, conv] = m;
      fIdx += full.length;

      if (conv !== 'c') {
        skipWhitespace();
      }
      if (pos >= inputSource.length) {
        break;
      }

      const maxWidth = widthStr ? Number(widthStr) : Infinity;
      const targetArg = targetArgs[argIdx];
      const rawExpr = rawArgExprs[argIdx];
      if (!suppress) argIdx++;

      // Check for common beginner error: passing `x` instead of `&x`
      if (
        !suppress &&
        targetArg &&
        rawExpr &&
        rawExpr.kind === 'ident' &&
        targetArg.type.pointerDepth === 0
      ) {
        throw new CRuntimeTrap(
          line,
          'C-RUN-SCANF-MISSING-AMP',
          `Erreur fatale dans scanf() : oubli du '&' devant '${rawExpr.name}'`,
          `Ligne ${line} : Vous avez écrit 'scanf(..., ${rawExpr.name})' au lieu de 'scanf(..., &${rawExpr.name})'. Sans l'opérateur d'adresse '&', scanf tente d'écrire à l'adresse mémoire ${targetArg.value} (la valeur de '${rawExpr.name}'), ce qui provoque une erreur de segmentation (Segmentation Fault) !`
        );
      }

      const destAddr = targetArg ? Math.trunc(targetArg.value) : 0;

      if (conv === 'c') {
        const chCode = inputSource.charCodeAt(pos);
        pos++;
        if (!suppress) {
          writeScalarToMemory(
            destAddr,
            { base: 'char', pointerDepth: 0, arrayDims: [] },
            chCode,
            line
          );
          assigned++;
        }
        continue;
      }

      if (conv === 's') {
        let token = '';
        while (
          pos < inputSource.length &&
          !/\s/.test(inputSource[pos]) &&
          token.length < maxWidth
        ) {
          token += inputSource[pos];
          pos++;
        }
        if (token.length === 0) break;
        if (!suppress) {
          writeCString(destAddr, token, line);
          assigned++;
        }
        continue;
      }

      if (['d', 'i', 'u', 'x', 'X', 'o'].includes(conv)) {
        const slice = inputSource.slice(pos, pos + (Number.isFinite(maxWidth) ? maxWidth : 64));
        const numMatch =
          conv === 'x' || conv === 'X'
            ? slice.match(/^[+-]?(?:0[xX])?[0-9a-fA-F]+/)
            : slice.match(/^[+-]?[0-9]+/);
        if (!numMatch) break;
        const rawNum = numMatch[0];
        pos += rawNum.length;
        const parsed =
          conv === 'x' || conv === 'X'
            ? parseInt(rawNum, 16)
            : conv === 'o'
            ? parseInt(rawNum, 8)
            : parseInt(rawNum, 10);
        if (!suppress) {
          const writeType: CTypeInfo = {
            base: lenMod === 'h' ? 'short' : 'int',
            unsigned: conv === 'u' || conv === 'x' || conv === 'X',
            pointerDepth: 0,
            arrayDims: [],
          };
          writeScalarToMemory(destAddr, writeType, parsed, line);
          assigned++;
        }
        continue;
      }

      if (['f', 'F', 'e', 'E', 'g', 'G', 'a', 'A'].includes(conv)) {
        const slice = inputSource.slice(pos, pos + (Number.isFinite(maxWidth) ? maxWidth : 64));
        const fltMatch = slice.match(/^[+-]?(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)(?:[eE][+-]?[0-9]+)?/);
        if (!fltMatch) break;
        const rawFlt = fltMatch[0];
        pos += rawFlt.length;
        const parsed = parseFloat(rawFlt);
        if (!suppress) {
          const writeType: CTypeInfo = {
            base: lenMod === 'l' ? 'double' : 'float',
            pointerDepth: 0,
            arrayDims: [],
          };
          writeScalarToMemory(destAddr, writeType, parsed, line);
          assigned++;
        }
        continue;
      }
    }

    return { count: assigned, newPos: pos };
  }

  function invokeCFunction(
    callee: string,
    argExprs: ASTExpr[],
    line: number
  ): EvalValue {
    const evaledArgs = argExprs.map((a) => evalExpr(a));
    const intRet = (v: number): EvalValue => ({
      value: Math.trunc(v),
      type: { base: 'int', pointerDepth: 0, arrayDims: [] },
    });
    const dblRet = (v: number): EvalValue => ({
      value: v,
      type: { base: 'double', pointerDepth: 0, arrayDims: [] },
    });
    const ptrRet = (addr: number, base: CTypeInfo['base'] = 'void'): EvalValue => ({
      value: Math.trunc(addr),
      type: { base, pointerDepth: 1, arrayDims: [] },
    });

    // <stdio.h>
    if (callee === 'printf') {
      if (evaledArgs.length === 0) return intRet(0);
      const fmt = readCString(evaledArgs[0].value, line);
      const text = formatPrintf(fmt, evaledArgs.slice(1), line);
      stdout += text;
      return intRet(text.length);
    }

    if (callee === 'fprintf') {
      if (evaledArgs.length < 2) return intRet(0);
      const fmt = readCString(evaledArgs[1].value, line);
      const text = formatPrintf(fmt, evaledArgs.slice(2), line);
      stdout += text;
      return intRet(text.length);
    }

    if (callee === 'sprintf' || callee === 'snprintf') {
      const isSn = callee === 'snprintf';
      const bufAddr = evaledArgs[0]?.value ?? 0;
      const fmtAddr = isSn ? evaledArgs[2]?.value ?? 0 : evaledArgs[1]?.value ?? 0;
      const rest = isSn ? evaledArgs.slice(3) : evaledArgs.slice(2);
      const fmt = readCString(fmtAddr, line);
      let text = formatPrintf(fmt, rest, line);
      if (isSn && evaledArgs[1]) {
        const maxLen = Math.max(0, Math.trunc(evaledArgs[1].value) - 1);
        text = text.slice(0, maxLen);
      }
      writeCString(bufAddr, text, line);
      return intRet(text.length);
    }

    if (callee === 'puts') {
      const s = readCString(evaledArgs[0]?.value ?? 0, line);
      stdout += s + '\n';
      return intRet(s.length + 1);
    }

    if (callee === 'putchar') {
      const c = String.fromCharCode(Math.trunc(evaledArgs[0]?.value ?? 0) & 0xff);
      stdout += c;
      return intRet(c.charCodeAt(0));
    }

    if (callee === 'getchar') {
      if (stdinPos >= stdinInput.length) return intRet(-1); // EOF
      const code = stdinInput.charCodeAt(stdinPos++);
      return intRet(code);
    }

    if (callee === 'fgets') {
      const bufAddr = evaledArgs[0]?.value ?? 0;
      const maxCount = Math.trunc(evaledArgs[1]?.value ?? 64);
      if (stdinPos >= stdinInput.length || maxCount <= 0) {
        return ptrRet(0, 'char');
      }
      let out = '';
      while (stdinPos < stdinInput.length && out.length < maxCount - 1) {
        const ch = stdinInput[stdinPos++];
        out += ch;
        if (ch === '\n') break;
      }
      writeCString(bufAddr, out, line);
      return ptrRet(bufAddr, 'char');
    }

    if (callee === 'scanf') {
      if (evaledArgs.length === 0) return intRet(0);
      const fmt = readCString(evaledArgs[0].value, line);
      const res = executeScanfFromBuffer(
        stdinInput,
        stdinPos,
        fmt,
        evaledArgs.slice(1),
        argExprs.slice(1),
        line
      );
      stdinPos = res.newPos;
      return intRet(res.count);
    }

    if (callee === 'sscanf') {
      if (evaledArgs.length < 2) return intRet(0);
      const srcStr = readCString(evaledArgs[0].value, line);
      const fmt = readCString(evaledArgs[1].value, line);
      const res = executeScanfFromBuffer(
        srcStr,
        0,
        fmt,
        evaledArgs.slice(2),
        argExprs.slice(2),
        line
      );
      return intRet(res.count);
    }

    // <stdlib.h>
    if (callee === 'malloc' || callee === 'calloc') {
      let totalBytes = 0;
      if (callee === 'malloc') {
        totalBytes = Math.max(0, Math.trunc(evaledArgs[0]?.value ?? 0));
      } else {
        const count = Math.max(0, Math.trunc(evaledArgs[0]?.value ?? 0));
        const sz = Math.max(0, Math.trunc(evaledArgs[1]?.value ?? 0));
        totalBytes = count * sz;
      }
      if (totalBytes === 0) return ptrRet(0);
      heapPtr = align4(heapPtr);
      const addr = heapPtr;
      const allocBytes = align4(totalBytes);
      if (addr + allocBytes + 8 >= memBytes.length) {
        return ptrRet(0); // Out of memory -> returns NULL
      }
      for (let i = 0; i < totalBytes; i++) {
        memBytes[addr + i] = 0;
        shadowInit[addr + i] = callee === 'calloc' ? 1 : 0;
      }
      for (let r = 0; r < 4; r++) {
        shadowInit[addr + totalBytes + r] = 2; // Heap redzone
      }
      heapPtr += allocBytes + 8;
      heapBlocks.set(addr, {
        address: addr,
        sizeBytes: totalBytes,
        allocatedAtLine: line,
        freed: false,
      });
      return ptrRet(addr);
    }

    if (callee === 'realloc') {
      const oldAddr = Math.trunc(evaledArgs[0]?.value ?? 0);
      const newSize = Math.max(0, Math.trunc(evaledArgs[1]?.value ?? 0));
      if (oldAddr === 0) {
        return invokeCFunction('malloc', [argExprs[1]], line);
      }
      const existing = heapBlocks.get(oldAddr);
      if (!existing || existing.freed) {
        throw new CRuntimeTrap(
          line,
          'C-RUN-INVALID-REALLOC',
          'Pointeur invalide passé à realloc()',
          `Ligne ${line} : L'adresse 0x${oldAddr.toString(16)} passée à realloc() n'est pas un bloc actif du tas (heap).`
        );
      }
      heapPtr = align4(heapPtr);
      const newAddr = heapPtr;
      const copyLen = Math.min(existing.sizeBytes, newSize);
      for (let i = 0; i < copyLen; i++) {
        memBytes[newAddr + i] = memBytes[oldAddr + i];
        shadowInit[newAddr + i] = shadowInit[oldAddr + i];
      }
      existing.freed = true;
      existing.freedAtLine = line;
      heapPtr += align4(newSize) + 8;
      heapBlocks.set(newAddr, {
        address: newAddr,
        sizeBytes: newSize,
        allocatedAtLine: line,
        freed: false,
      });
      return ptrRet(newAddr);
    }

    if (callee === 'free') {
      const addr = Math.trunc(evaledArgs[0]?.value ?? 0);
      if (addr === 0) return intRet(0); // free(NULL) is a valid no-op in C
      const hb = heapBlocks.get(addr);
      if (!hb) {
        throw new CRuntimeTrap(
          line,
          'C-RUN-INVALID-FREE',
          'Erreur fatale : free() sur un pointeur non alloué par malloc/calloc',
          `Ligne ${line} : Vous avez appelé free(0x${addr.toString(
            16
          )}), mais cette adresse n'a pas été allouée sur le tas (elle appartient peut-être à la pile / variable locale).`
        );
      }
      if (hb.freed) {
        throw new CRuntimeTrap(
          line,
          'C-RUN-DOUBLE-FREE',
          'Erreur fatale : Double libération mémoire (Double Free)',
          `Ligne ${line} : Le bloc mémoire 0x${addr.toString(
            16
          )} a déjà été libéré par free() à la ligne ${hb.freedAtLine} !`
        );
      }
      hb.freed = true;
      hb.freedAtLine = line;
      return intRet(0);
    }

    if (callee === 'abs' || callee === 'labs') {
      return intRet(Math.abs(Math.trunc(evaledArgs[0]?.value ?? 0)));
    }
    if (callee === 'atoi' || callee === 'atol') {
      const s = readCString(evaledArgs[0]?.value ?? 0, line).trim();
      const n = parseInt(s, 10);
      return intRet(Number.isNaN(n) ? 0 : n);
    }
    if (callee === 'atof') {
      const s = readCString(evaledArgs[0]?.value ?? 0, line).trim();
      const n = parseFloat(s);
      return dblRet(Number.isNaN(n) ? 0 : n);
    }
    if (callee === 'exit') {
      throw new CRuntimeSignal('exit', Math.trunc(evaledArgs[0]?.value ?? 0));
    }
    if (callee === 'srand') {
      prngState = Math.trunc(evaledArgs[0]?.value ?? 1) || 1;
      return intRet(0);
    }
    if (callee === 'rand') {
      prngState = (prngState * 1103515245 + 12345) & 0x7fffffff;
      return intRet((prngState >>> 16) & 0x7fff);
    }
    if (callee === 'time') {
      return intRet(1700000000);
    }

    // <string.h>
    if (callee === 'strlen') {
      const s = readCString(evaledArgs[0]?.value ?? 0, line);
      return intRet(s.length);
    }
    if (callee === 'strcpy' || callee === 'strncpy') {
      const dest = evaledArgs[0]?.value ?? 0;
      let src = readCString(evaledArgs[1]?.value ?? 0, line);
      if (callee === 'strncpy' && evaledArgs[2]) {
        src = src.slice(0, Math.max(0, Math.trunc(evaledArgs[2].value)));
      }
      writeCString(dest, src, line);
      return ptrRet(dest, 'char');
    }
    if (callee === 'strcat' || callee === 'strncat') {
      const dest = evaledArgs[0]?.value ?? 0;
      const existing = readCString(dest, line);
      let add = readCString(evaledArgs[1]?.value ?? 0, line);
      if (callee === 'strncat' && evaledArgs[2]) {
        add = add.slice(0, Math.max(0, Math.trunc(evaledArgs[2].value)));
      }
      writeCString(dest, existing + add, line);
      return ptrRet(dest, 'char');
    }
    if (callee === 'strcmp' || callee === 'strncmp') {
      let s1 = readCString(evaledArgs[0]?.value ?? 0, line);
      let s2 = readCString(evaledArgs[1]?.value ?? 0, line);
      if (callee === 'strncmp' && evaledArgs[2]) {
        const n = Math.max(0, Math.trunc(evaledArgs[2].value));
        s1 = s1.slice(0, n);
        s2 = s2.slice(0, n);
      }
      if (s1 === s2) return intRet(0);
      return intRet(s1 < s2 ? -1 : 1);
    }
    if (callee === 'strchr') {
      const addr = evaledArgs[0]?.value ?? 0;
      const s = readCString(addr, line);
      const ch = String.fromCharCode(Math.trunc(evaledArgs[1]?.value ?? 0) & 0xff);
      const idx = s.indexOf(ch);
      return ptrRet(idx === -1 ? 0 : addr + idx, 'char');
    }
    if (callee === 'strstr') {
      const addr = evaledArgs[0]?.value ?? 0;
      const hay = readCString(addr, line);
      const needle = readCString(evaledArgs[1]?.value ?? 0, line);
      const idx = hay.indexOf(needle);
      return ptrRet(idx === -1 ? 0 : addr + idx, 'char');
    }
    if (callee === 'memset') {
      const dest = evaledArgs[0]?.value ?? 0;
      const byteVal = Math.trunc(evaledArgs[1]?.value ?? 0) & 0xff;
      const count = Math.trunc(evaledArgs[2]?.value ?? 0);
      checkAddressValid(dest, count, true, line);
      for (let i = 0; i < count; i++) {
        memBytes[dest + i] = byteVal;
        shadowInit[dest + i] = 1;
      }
      return ptrRet(dest);
    }
    if (callee === 'memcpy' || callee === 'memmove') {
      const dest = evaledArgs[0]?.value ?? 0;
      const src = evaledArgs[1]?.value ?? 0;
      const count = Math.trunc(evaledArgs[2]?.value ?? 0);
      checkAddressValid(dest, count, true, line);
      checkAddressValid(src, count, false, line);
      const tmp = new Uint8Array(count);
      for (let i = 0; i < count; i++) tmp[i] = memBytes[src + i];
      for (let i = 0; i < count; i++) {
        memBytes[dest + i] = tmp[i];
        shadowInit[dest + i] = 1;
      }
      return ptrRet(dest);
    }

    // <ctype.h>
    if (callee === 'isalpha') {
      const c = String.fromCharCode(Math.trunc(evaledArgs[0]?.value ?? 0));
      return intRet(/^[a-zA-Z]$/.test(c) ? 1 : 0);
    }
    if (callee === 'isdigit') {
      const c = String.fromCharCode(Math.trunc(evaledArgs[0]?.value ?? 0));
      return intRet(/^[0-9]$/.test(c) ? 1 : 0);
    }
    if (callee === 'isalnum') {
      const c = String.fromCharCode(Math.trunc(evaledArgs[0]?.value ?? 0));
      return intRet(/^[a-zA-Z0-9]$/.test(c) ? 1 : 0);
    }
    if (callee === 'isspace') {
      const c = String.fromCharCode(Math.trunc(evaledArgs[0]?.value ?? 0));
      return intRet(/^\s$/.test(c) ? 1 : 0);
    }
    if (callee === 'isupper') {
      const c = String.fromCharCode(Math.trunc(evaledArgs[0]?.value ?? 0));
      return intRet(/^[A-Z]$/.test(c) ? 1 : 0);
    }
    if (callee === 'islower') {
      const c = String.fromCharCode(Math.trunc(evaledArgs[0]?.value ?? 0));
      return intRet(/^[a-z]$/.test(c) ? 1 : 0);
    }
    if (callee === 'tolower') {
      const code = Math.trunc(evaledArgs[0]?.value ?? 0);
      return intRet(String.fromCharCode(code).toLowerCase().charCodeAt(0));
    }
    if (callee === 'toupper') {
      const code = Math.trunc(evaledArgs[0]?.value ?? 0);
      return intRet(String.fromCharCode(code).toUpperCase().charCodeAt(0));
    }

    // <math.h>
    if (callee === 'sqrt') return dblRet(Math.sqrt(evaledArgs[0]?.value ?? 0));
    if (callee === 'pow')
      return dblRet(Math.pow(evaledArgs[0]?.value ?? 0, evaledArgs[1]?.value ?? 0));
    if (callee === 'fabs') return dblRet(Math.abs(evaledArgs[0]?.value ?? 0));
    if (callee === 'ceil') return dblRet(Math.ceil(evaledArgs[0]?.value ?? 0));
    if (callee === 'floor') return dblRet(Math.floor(evaledArgs[0]?.value ?? 0));
    if (callee === 'round') return dblRet(Math.round(evaledArgs[0]?.value ?? 0));
    if (callee === 'sin') return dblRet(Math.sin(evaledArgs[0]?.value ?? 0));
    if (callee === 'cos') return dblRet(Math.cos(evaledArgs[0]?.value ?? 0));
    if (callee === 'tan') return dblRet(Math.tan(evaledArgs[0]?.value ?? 0));
    if (callee === 'exp') return dblRet(Math.exp(evaledArgs[0]?.value ?? 0));
    if (callee === 'log') return dblRet(Math.log(evaledArgs[0]?.value ?? 0));
    if (callee === 'log10') return dblRet(Math.log10(evaledArgs[0]?.value ?? 0));
    if (callee === 'fmod')
      return dblRet((evaledArgs[0]?.value ?? 0) % (evaledArgs[1]?.value ?? 1));

    // <assert.h>
    if (callee === 'assert') {
      const cond = evaledArgs[0]?.value ?? 0;
      if (cond === 0) {
        throw new CRuntimeTrap(
          line,
          'C-RUN-ASSERT-FAIL',
          `Échec d'assertion assert() à la ligne ${line}`,
          `Ligne ${line} : La condition vérifiée par assert(...) est fausse (0). Le programme a été interrompu volontairement pour signaler une incohérence logique.`
        );
      }
      return intRet(0);
    }

    // User-defined function
    const fnDef = ast.functions.get(callee);
    if (!fnDef || !fnDef.body) {
      throw new CRuntimeTrap(
        line,
        'C-LINK-UNDEF-FUNC',
        `Fonction '${callee}' non définie`,
        `Ligne ${line} : Vous appelez la fonction '${callee}()', mais aucune définition correspondante n'a été trouvée dans votre programme.`
      );
    }

    if (callStackFrames.length >= 200) {
      throw new CRuntimeTrap(
        line,
        'C-RUN-STACK-OVERFLOW',
        'Débordement de la pile d’appels (Stack Overflow)',
        `Ligne ${line} : Plus de 200 appels de fonctions imbriqués (probablement une récursion infinie dans '${callee}()' sans cas de base valide).`
      );
    }

    const savedStackPtr = stackPtr;
    const paramScope = new Map<string, VarAllocation>();

    for (let i = 0; i < fnDef.params.length; i++) {
      const param = fnDef.params[i];
      const argVal = evaledArgs[i] ?? {
        value: 0,
        type: param.type,
      };
      const pSize = Math.max(4, getTypeByteSize(param.type, ast.structs));
      stackPtr = align4(stackPtr);
      const pAddr = stackPtr;
      stackPtr += pSize;

      if (
        param.type.base === 'struct' &&
        param.type.pointerDepth === 0 &&
        param.type.structName
      ) {
        const sDef = ast.structs.get(param.type.structName);
        const srcAddr = argVal.lvalueAddress ?? argVal.value;
        if (sDef && srcAddr > 0) {
          for (let b = 0; b < sDef.totalSize; b++) {
            memBytes[pAddr + b] = memBytes[srcAddr + b];
            shadowInit[pAddr + b] = 1;
          }
        }
      } else {
        writeScalarToMemory(pAddr, param.type, argVal.value, line);
      }

      paramScope.set(param.name, {
        name: param.name,
        type: param.type,
        address: pAddr,
        sizeBytes: pSize,
        initialized: true,
        scopeName: callee,
      });
    }

    callStackFrames.push({
      functionName: callee,
      returnLine: line,
      baseAddress: savedStackPtr,
      scopes: [paramScope],
    });

    let returnValue = 0;
    let structReturnCopyAddr: number | undefined;

    try {
      executeStmt(fnDef.body);
    } catch (sig) {
      if (sig instanceof CRuntimeSignal && sig.kind === 'return') {
        returnValue = sig.value;
        if (
          fnDef.returnType.base === 'struct' &&
          fnDef.returnType.pointerDepth === 0 &&
          fnDef.returnType.structName &&
          sig.structSourceAddr
        ) {
          const sDef = ast.structs.get(fnDef.returnType.structName);
          if (sDef) {
            // Copy returned struct into a temporary slot at savedStackPtr before popping frame
            const tempStructBytes = new Uint8Array(sDef.totalSize);
            for (let b = 0; b < sDef.totalSize; b++) {
              tempStructBytes[b] = memBytes[sig.structSourceAddr + b];
            }
            callStackFrames.pop();
            stackPtr = align4(savedStackPtr);
            structReturnCopyAddr = stackPtr;
            for (let b = 0; b < sDef.totalSize; b++) {
              memBytes[structReturnCopyAddr + b] = tempStructBytes[b];
              shadowInit[structReturnCopyAddr + b] = 1;
            }
            stackPtr += align4(sDef.totalSize);
            return {
              value: structReturnCopyAddr,
              type: fnDef.returnType,
              lvalueAddress: structReturnCopyAddr,
            };
          }
        }
      } else {
        callStackFrames.pop();
        stackPtr = savedStackPtr;
        throw sig;
      }
    }

    // Before popping `main`, capture the rich memory snapshot so the student can inspect `main`'s local variables!
    if (callee === 'main') {
      lastMainMemorySnapshot = buildMemorySnapshot();
    }

    callStackFrames.pop();
    stackPtr = savedStackPtr;

    return {
      value: returnValue,
      type: fnDef.returnType,
    };
  }

  function executeStmt(stmt: ASTStmt): void {
    instructionsExecuted++;
    if (instructionsExecuted > maxInstructions) {
      terminatedByTimeout = true;
      throw new CRuntimeTrap(
        stmt.line,
        'C-RUN-TIMEOUT',
        'Temps limite dépassé : Boucle infinie détectée',
        `Ligne ${stmt.line} : Le programme a dépassé ${maxInstructions} instructions. Vérifiez que la condition de votre boucle finit toujours par devenir fausse.`
      );
    }

    const currentFrame = callStackFrames[callStackFrames.length - 1];

    switch (stmt.kind) {
      case 'block': {
        currentFrame.scopes.push(new Map());
        try {
          for (const s of stmt.statements) {
            executeStmt(s);
          }
        } finally {
          currentFrame.scopes.pop();
        }
        break;
      }

      case 'var_decl': {
        const currentScope = currentFrame.scopes[currentFrame.scopes.length - 1];
        for (const d of stmt.decls) {
          if (stmt.isStatic) {
            const staticKey = `${currentFrame.functionName}::${d.name}`;
            if (!staticEnv.has(staticKey)) {
              const alloc = allocateVariableInSegment(d, true, currentFrame.functionName);
              staticEnv.set(staticKey, alloc);
            }
            currentScope.set(d.name, staticEnv.get(staticKey)!);
          } else {
            const alloc = allocateVariableInSegment(d, false, currentFrame.functionName);
            currentScope.set(d.name, alloc);
          }
        }
        break;
      }

      case 'expr_stmt': {
        if (stmt.expr) {
          evalExpr(stmt.expr);
        }
        break;
      }

      case 'if': {
        const c = evalExpr(stmt.cond);
        if (c.value !== 0) {
          executeStmt(stmt.thenBranch);
        } else if (stmt.elseBranch) {
          executeStmt(stmt.elseBranch);
        }
        break;
      }

      case 'switch': {
        const swVal = Math.trunc(evalExpr(stmt.expr).value);
        let matchIndex = -1;
        let defaultIndex = -1;

        for (let i = 0; i < stmt.cases.length; i++) {
          const c = stmt.cases[i];
          if (c.value === null) {
            defaultIndex = i;
          } else {
            const v = Math.trunc(evalExpr(c.value).value);
            if (v === swVal) {
              matchIndex = i;
              break;
            }
          }
        }

        const startIdx = matchIndex !== -1 ? matchIndex : defaultIndex;
        if (startIdx !== -1) {
          try {
            for (let i = startIdx; i < stmt.cases.length; i++) {
              for (const s of stmt.cases[i].stmts) {
                executeStmt(s);
              }
            }
          } catch (sig) {
            if (sig instanceof CRuntimeSignal && sig.kind === 'break') {
              // Break exits switch cleanly
            } else {
              throw sig;
            }
          }
        }
        break;
      }

      case 'while': {
        while (evalExpr(stmt.cond).value !== 0) {
          try {
            executeStmt(stmt.body);
          } catch (sig) {
            if (sig instanceof CRuntimeSignal) {
              if (sig.kind === 'break') break;
              if (sig.kind === 'continue') continue;
            }
            throw sig;
          }
        }
        break;
      }

      case 'do_while': {
        do {
          try {
            executeStmt(stmt.body);
          } catch (sig) {
            if (sig instanceof CRuntimeSignal) {
              if (sig.kind === 'break') break;
              if (sig.kind === 'continue') {
                // proceed to condition check
              } else {
                throw sig;
              }
            } else {
              throw sig;
            }
          }
        } while (evalExpr(stmt.cond).value !== 0);
        break;
      }

      case 'for': {
        currentFrame.scopes.push(new Map());
        try {
          if (stmt.init) {
            executeStmt(stmt.init);
          }
          while (stmt.cond ? evalExpr(stmt.cond).value !== 0 : true) {
            try {
              executeStmt(stmt.body);
            } catch (sig) {
              if (sig instanceof CRuntimeSignal) {
                if (sig.kind === 'break') break;
                if (sig.kind === 'continue') {
                  // Execute step below
                } else {
                  throw sig;
                }
              } else {
                throw sig;
              }
            }
            if (stmt.step) {
              evalExpr(stmt.step);
            }
          }
        } finally {
          currentFrame.scopes.pop();
        }
        break;
      }

      case 'return': {
        if (!stmt.expr) {
          throw new CRuntimeSignal('return', 0);
        }
        const v = evalExpr(stmt.expr);
        throw new CRuntimeSignal('return', v.value, v.lvalueAddress);
      }

      case 'break':
        throw new CRuntimeSignal('break');

      case 'continue':
        throw new CRuntimeSignal('continue');
    }
  }

  function formatAllocSnapshot(alloc: VarAllocation): MemoryVariableSnapshot {
    const addressHex = `0x${alloc.address.toString(16).padStart(4, '0')}`;
    let valueFormatted = '?';
    let pointsToAddressHex: string | undefined;
    let isArray = false;
    let arrayElements: string[] | undefined;
    let isStruct = false;
    let structFields: Record<string, string> | undefined;

    try {
      if (alloc.type.arrayDims.length > 0) {
        isArray = true;
        if (alloc.type.base === 'char' && alloc.type.arrayDims.length === 1) {
          const strVal = readCString(alloc.address, 0);
          valueFormatted = `"${strVal}"`;
          arrayElements = [];
          for (let i = 0; i < Math.min(12, alloc.type.arrayDims[0]); i++) {
            const b = memBytes[alloc.address + i];
            arrayElements.push(b === 0 ? "'\\0'" : `'${String.fromCharCode(b)}'`);
          }
        } else {
          const elemType: CTypeInfo = {
            ...alloc.type,
            arrayDims: alloc.type.arrayDims.slice(1),
          };
          const elemSize = getTypeByteSize(elemType, ast.structs);
          const count = Math.min(16, alloc.type.arrayDims[0]);
          arrayElements = [];
          for (let i = 0; i < count; i++) {
            const v = readScalarFromMemory(alloc.address + i * elemSize, elemType, 0);
            arrayElements.push(
              isFloatType(elemType) ? Number(v.toFixed(2)).toString() : String(v)
            );
          }
          valueFormatted = `{ ${arrayElements.join(', ')} }`;
        }
      } else if (
        alloc.type.base === 'struct' &&
        alloc.type.pointerDepth === 0 &&
        alloc.type.structName
      ) {
        isStruct = true;
        structFields = {};
        const sDef = ast.structs.get(alloc.type.structName);
        if (sDef) {
          for (const f of sDef.fields) {
            const fAddr = alloc.address + f.offset;
            if (f.type.base === 'char' && f.type.arrayDims.length === 1) {
              structFields[f.name] = `"${readCString(fAddr, 0)}"`;
            } else {
              const fv = readScalarFromMemory(fAddr, f.type, 0);
              structFields[f.name] = isFloatType(f.type)
                ? Number(fv.toFixed(2)).toString()
                : String(fv);
            }
          }
        }
        valueFormatted = `{ ${Object.entries(structFields)
          .map(([k, v]) => `.${k} = ${v}`)
          .join(', ')} }`;
      } else if (alloc.type.pointerDepth > 0) {
        const ptrVal = readScalarFromMemory(alloc.address, alloc.type, 0) >>> 0;
        if (ptrVal === 0) {
          valueFormatted = 'NULL (0x0000)';
        } else {
          pointsToAddressHex = `0x${ptrVal.toString(16).padStart(4, '0')}`;
          valueFormatted = pointsToAddressHex;
        }
      } else {
        const v = readScalarFromMemory(alloc.address, alloc.type, 0);
        if (alloc.type.base === 'char') {
          const ch = v >= 32 && v <= 126 ? String.fromCharCode(v) : `\\x${(v & 0xff).toString(16)}`;
          valueFormatted = `${v} ('${ch}')`;
        } else if (isFloatType(alloc.type)) {
          valueFormatted = Number(v.toFixed(4)).toString();
        } else {
          valueFormatted = String(v);
        }
      }
    } catch {
      valueFormatted = '(non initialisé)';
    }

    return {
      name: alloc.name,
      type: formatTypeString(alloc.type),
      scope: alloc.scopeName,
      addressHex,
      sizeBytes: alloc.sizeBytes,
      valueFormatted,
      initialized: alloc.initialized,
      pointsToAddressHex,
      isArray,
      arrayElements,
      isStruct,
      structFields,
    };
  }

  function buildMemorySnapshot(): MemorySnapshot {
    const globalsSnap: MemoryVariableSnapshot[] = [];
    for (const g of globalEnv.values()) {
      globalsSnap.push(formatAllocSnapshot(g));
    }

    const stackSnap: StackFrameSnapshot[] = [];
    for (const frame of callStackFrames) {
      const vars: MemoryVariableSnapshot[] = [];
      for (const sc of frame.scopes) {
        for (const v of sc.values()) {
          vars.push(formatAllocSnapshot(v));
        }
      }
      stackSnap.push({
        functionName: frame.functionName,
        returnLine: frame.returnLine,
        baseAddressHex: `0x${frame.baseAddress.toString(16).padStart(4, '0')}`,
        variables: vars,
      });
    }

    const heapSnap: HeapBlockSnapshot[] = [];
    let leakedBytes = 0;
    for (const hb of heapBlocks.values()) {
      if (!hb.freed) {
        leakedBytes += hb.sizeBytes;
      }
      const previewInts: number[] = [];
      for (let offset = 0; offset + 4 <= Math.min(16, hb.sizeBytes); offset += 4) {
        previewInts.push(memView.getInt32(hb.address + offset, true));
      }
      heapSnap.push({
        addressHex: `0x${hb.address.toString(16).padStart(4, '0')}`,
        sizeBytes: hb.sizeBytes,
        allocatedAtLine: hb.allocatedAtLine,
        freed: hb.freed,
        freedAtLine: hb.freedAtLine,
        valuesPreview: previewInts.length > 0 ? `[${previewInts.join(', ')}]` : 'octets',
      });
    }

    return {
      globals: globalsSnap,
      callStack: stackSnap,
      heapBlocks: heapSnap,
      leakedBytes,
      totalBytesUsed: (globalPtr - 0x2000) + (stackPtr - 0x4000) + (heapPtr - 0x10000),
    };
  }

  let lastMainMemorySnapshot: MemorySnapshot | undefined;

  // Execute global declarations then main()
  try {
    for (const gDecl of ast.globals) {
      const alloc = allocateVariableInSegment(gDecl, true, 'global');
      globalEnv.set(gDecl.name, alloc);
    }

    const mainResult = invokeCFunction('main', [], mainFn!.line);
    const finalSnapshot = lastMainMemorySnapshot ?? buildMemorySnapshot();

    // Update heap leak info after main finishes
    let leaked = 0;
    const updatedHeap: HeapBlockSnapshot[] = [];
    for (const hb of heapBlocks.values()) {
      if (!hb.freed) leaked += hb.sizeBytes;
      updatedHeap.push({
        addressHex: `0x${hb.address.toString(16).padStart(4, '0')}`,
        sizeBytes: hb.sizeBytes,
        allocatedAtLine: hb.allocatedAtLine,
        freed: hb.freed,
        freedAtLine: hb.freedAtLine,
        valuesPreview: `${hb.sizeBytes} octets`,
      });
    }
    finalSnapshot.heapBlocks = updatedHeap;
    finalSnapshot.leakedBytes = leaked;

    if (leaked > 0) {
      diagnostics.push({
        line: mainFn!.line,
        column: 1,
        severity: 'warning',
        category: 'execution',
        code: 'C-WARN-MEM-LEAK',
        gccMessage: `LeakSanitizer: detected memory leaks (${leaked} bytes allocated via malloc/calloc never freed)`,
        pedagogicalTitle: `Fuite mémoire détectée : ${leaked} octets non libérés par free()`,
        pedagogicalExplanation: `Votre programme a alloué ${leaked} octets sur le tas (avec malloc ou calloc) sans appeler free() avant la fin de main(). En C, toute mémoire allouée dynamiquement doit être libérée explicitement.`,
      });
    }

    return {
      compileSuccess: true,
      executionSuccess: true,
      exitCode: Math.trunc(mainResult.value),
      stdout,
      stderr,
      diagnostics,
      executionTimeMs: performance.now() - startTime,
      instructionsExecuted,
      terminatedByTimeout: false,
      memorySnapshot: finalSnapshot,
      traceSteps,
    };
  } catch (err) {
    if (err instanceof CRuntimeSignal && err.kind === 'exit') {
      return {
        compileSuccess: true,
        executionSuccess: err.value === 0,
        exitCode: err.value,
        stdout,
        stderr,
        diagnostics,
        executionTimeMs: performance.now() - startTime,
        instructionsExecuted,
        terminatedByTimeout: false,
        memorySnapshot: lastMainMemorySnapshot ?? buildMemorySnapshot(),
      };
    }

    if (err instanceof CRuntimeTrap) {
      diagnostics.push({
        line: err.line,
        column: 1,
        severity: 'error',
        category: 'execution',
        code: err.code,
        gccMessage: `runtime error at line ${err.line}: ${err.title}`,
        pedagogicalTitle: err.title,
        pedagogicalExplanation: err.explanation,
      });
      stderr = `${err.title}\n${err.explanation}`;
    } else {
      const msg = err instanceof Error ? err.message : String(err);
      diagnostics.push({
        line: 1,
        column: 1,
        severity: 'error',
        category: 'execution',
        code: 'C-RUN-ERROR',
        gccMessage: msg,
        pedagogicalTitle: "Erreur d'exécution",
        pedagogicalExplanation: msg,
      });
      stderr = msg;
    }

    return {
      compileSuccess: true,
      executionSuccess: false,
      exitCode: 139,
      stdout,
      stderr,
      diagnostics,
      executionTimeMs: performance.now() - startTime,
      instructionsExecuted,
      terminatedByTimeout,
      memorySnapshot: buildMemorySnapshot(),
    };
  }
}

export function runCCodeTestSuite(
  sourceCode: string,
  testCases: CodeTestCase[]
): { allPassed: boolean; results: TestCaseRunResult[] } {
  const results: TestCaseRunResult[] = [];
  let allPassed = true;

  for (const tc of testCases) {
    const run = compileAndRunC(sourceCode, tc.stdin);
    const actualTrimmed = run.stdout.trim().replace(/\r\n/g, '\n');
    const expectedTrimmed = tc.expectedStdout.trim().replace(/\r\n/g, '\n');

    let passed = run.compileSuccess && run.executionSuccess && actualTrimmed === expectedTrimmed;
    let failureReason: string | undefined;

    if (!run.compileSuccess) {
      failureReason =
        run.diagnostics[0]?.pedagogicalTitle ?? 'Erreur de compilation du programme C.';
      passed = false;
    } else if (!run.executionSuccess) {
      failureReason =
        run.diagnostics.find((d) => d.severity === 'error')?.pedagogicalTitle ??
        run.stderr ??
        "Erreur pendant l'exécution du programme.";
      passed = false;
    } else if (actualTrimmed !== expectedTrimmed) {
      failureReason = `Sortie obtenue (« ${actualTrimmed || '(vide)'} ») différente de la sortie attendue (« ${expectedTrimmed} »).`;
      passed = false;
    }

    if (passed && tc.mustContainConstructs) {
      for (const req of tc.mustContainConstructs) {
        if (!sourceCode.includes(req)) {
          passed = false;
          failureReason = `Votre programme C doit obligatoirement utiliser « ${req} » pour valider cette compétence.`;
          break;
        }
      }
    }

    if (passed && tc.forbiddenConstructs) {
      for (const forb of tc.forbiddenConstructs) {
        if (sourceCode.includes(forb)) {
          passed = false;
          failureReason = `L'utilisation de « ${forb} » n'est pas autorisée dans cet exercice.`;
          break;
        }
      }
    }

    if (!passed) allPassed = false;

    results.push({
      testCase: tc,
      passed,
      actualStdout: run.stdout,
      actualStderr: run.stderr,
      exitCode: run.exitCode,
      diagnostics: run.diagnostics,
      failureReason,
    });
  }

  return { allPassed, results };
}
