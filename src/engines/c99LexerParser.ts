import { CompilerDiagnostic } from '../types/curriculum';
import {
  ASTExpr,
  ASTFunctionDef,
  ASTFunctionParam,
  ASTProgram,
  ASTStmt,
  CBaseType,
  CStructDef,
  CStructFieldDef,
  CTypeInfo,
  Token,
  VarDeclItem,
} from './c99Types';

const C_KEYWORDS = new Set([
  'void',
  'char',
  'short',
  'int',
  'long',
  'float',
  'double',
  'signed',
  'unsigned',
  'const',
  'static',
  'struct',
  'typedef',
  'enum',
  'sizeof',
  'if',
  'else',
  'switch',
  'case',
  'default',
  'while',
  'do',
  'for',
  'break',
  'continue',
  'return',
  'bool',
  '_Bool',
  'true',
  'false',
  'NULL',
  'size_t',
  'FILE',
]);

const KNOWN_HEADERS = new Set([
  'stdio.h',
  'stdlib.h',
  'string.h',
  'stdbool.h',
  'math.h',
  'ctype.h',
  'limits.h',
  'assert.h',
  'time.h',
  'stddef.h',
  'stdint.h',
]);

export function getScalarSize(base: CBaseType): number {
  switch (base) {
    case 'char':
    case 'bool':
      return 1;
    case 'short':
      return 2;
    case 'int':
    case 'long':
    case 'float':
    case 'size_t':
    case 'FILE':
      return 4;
    case 'double':
      return 8;
    default:
      return 4;
  }
}

export function getTypeByteSize(
  type: CTypeInfo,
  structs: Map<string, CStructDef>
): number {
  if (type.pointerDepth > 0) {
    let mult = 1;
    for (const d of type.arrayDims) mult *= Math.max(1, d);
    return 4 * mult;
  }
  let baseSize = 4;
  if (type.base === 'struct' && type.structName) {
    const def = structs.get(type.structName);
    baseSize = def ? def.totalSize : 4;
  } else {
    baseSize = getScalarSize(type.base);
  }
  let mult = 1;
  for (const d of type.arrayDims) {
    mult *= Math.max(1, d);
  }
  return baseSize * mult;
}

export function preprocessC(
  source: string,
  diagnostics: CompilerDiagnostic[]
): { processed: string; includedHeaders: Set<string> } {
  const includedHeaders = new Set<string>();
  const objectMacros = new Map<string, string>([
    ['NULL', '0'],
    ['EOF', '(-1)'],
    ['EXIT_SUCCESS', '0'],
    ['EXIT_FAILURE', '1'],
    ['INT_MAX', '2147483647'],
    ['INT_MIN', '(-2147483648)'],
    ['CHAR_MAX', '127'],
    ['CHAR_MIN', '(-128)'],
    ['M_PI', '3.141592653589793'],
    ['RAND_MAX', '32767'],
    // Standard streams: the sandbox has a single input and output, the handle value is unused.
    ['stdin', '0'],
    ['stdout', '1'],
    ['stderr', '2'],
  ]);
  const funcMacros = new Map<string, { params: string[]; body: string }>();

  // 1. Strip block and line comments while preserving exact newlines
  let noComments = '';
  let i = 0;
  let line = 1;
  let inStr: string | null = null;

  while (i < source.length) {
    const ch = source[i];
    if (ch === '\n') {
      line++;
      noComments += '\n';
      i++;
      continue;
    }
    if (inStr) {
      noComments += ch;
      if (ch === '\\' && i + 1 < source.length) {
        noComments += source[i + 1];
        if (source[i + 1] === '\n') line++;
        i += 2;
        continue;
      }
      if (ch === inStr) inStr = null;
      i++;
      continue;
    }
    if (ch === '"' || ch === "'") {
      inStr = ch;
      noComments += ch;
      i++;
      continue;
    }
    if (ch === '/' && source[i + 1] === '/') {
      while (i < source.length && source[i] !== '\n') {
        i++;
      }
      continue;
    }
    if (ch === '/' && source[i + 1] === '*') {
      const startCommentLine = line;
      i += 2;
      let closed = false;
      while (i < source.length) {
        if (source[i] === '\n') {
          noComments += '\n';
          line++;
          i++;
        } else if (source[i] === '*' && source[i + 1] === '/') {
          closed = true;
          i += 2;
          break;
        } else {
          i++;
        }
      }
      if (!closed) {
        diagnostics.push({
          line: startCommentLine,
          column: 1,
          severity: 'error',
          category: 'syntaxe',
          code: 'C-PRE-UNCLOSED-COMMENT',
          gccMessage: 'error: unterminated /* comment',
          pedagogicalTitle: 'Commentaire multiligne non fermé',
          pedagogicalExplanation: `Le commentaire '/*' ouvert à la ligne ${startCommentLine} n'est jamais refermé par '*/'.`,
        });
      }
      continue;
    }
    noComments += ch;
    i++;
  }

  // 2. Process preprocessor directives line by line
  const lines = noComments.split('\n');
  const outLines: string[] = [];
  // Conditional compilation stack (#ifdef / #ifndef / #if / #else / #endif)
  const condStack: { parentActive: boolean; active: boolean }[] = [];
  const isActive = () => condStack.length === 0 || condStack[condStack.length - 1].active;
  const isDefined = (name: string) => objectMacros.has(name) || funcMacros.has(name);

  for (let ln = 0; ln < lines.length; ln++) {
    const rawLine = lines[ln];
    const trimmed = rawLine.trim();

    const condMatch = trimmed.match(/^#\s*(ifdef|ifndef|if|else|endif)\b\s*(.*)$/);
    if (condMatch) {
      const directive = condMatch[1];
      const arg = condMatch[2].trim();
      if (directive === 'ifdef' || directive === 'ifndef' || directive === 'if') {
        let cond: boolean;
        if (directive === 'if') {
          const defMatch = arg.match(/^(!?)\s*defined\s*\(?\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\)?$/);
          if (defMatch) {
            cond = defMatch[1] === '!' ? !isDefined(defMatch[2]) : isDefined(defMatch[2]);
          } else {
            const value = Number(objectMacros.get(arg) ?? arg);
            cond = Number.isNaN(value) ? true : value !== 0;
          }
        } else {
          const name = arg.split(/\s+/)[0] ?? '';
          cond = directive === 'ifdef' ? isDefined(name) : !isDefined(name);
        }
        const parentActive = isActive();
        condStack.push({ parentActive, active: parentActive && cond });
      } else if (directive === 'else') {
        const top = condStack[condStack.length - 1];
        if (top) top.active = top.parentActive && !top.active;
      } else {
        condStack.pop();
      }
      outLines.push('');
      continue;
    }

    if (!isActive()) {
      outLines.push('');
      continue;
    }

    if (trimmed.startsWith('#')) {
      const undefMatch = trimmed.match(/^#\s*undef\s+([a-zA-Z_][a-zA-Z0-9_]*)/);
      if (undefMatch) {
        objectMacros.delete(undefMatch[1]);
        funcMacros.delete(undefMatch[1]);
        outLines.push('');
        continue;
      }

      const incMatch = trimmed.match(/^#\s*include\s*[<"]([^>"]+)[>"]/);
      if (incMatch) {
        const hdr = incMatch[1].trim();
        includedHeaders.add(hdr);
        if (!KNOWN_HEADERS.has(hdr)) {
          diagnostics.push({
            line: ln + 1,
            column: 1,
            severity: 'warning',
            category: 'compilation',
            code: 'C-PRE-UNKNOWN-HEADER',
            gccMessage: `warning: unknown header <${hdr}>`,
            pedagogicalTitle: `En-tête <${hdr}> non standard ou inconnu`,
            pedagogicalExplanation: `L'en-tête <${hdr}> n'est pas reconnu parmi les bibliothèques standards de 1re année (<stdio.h>, <stdlib.h>, <string.h>, <stdbool.h>, <math.h>, <ctype.h>).`,
          });
        }
        outLines.push('');
        continue;
      }

      const funcDefMatch = trimmed.match(
        /^#\s*define\s+([a-zA-Z_][a-zA-Z0-9_]*)\(([^)]*)\)\s+(.*)$/
      );
      if (funcDefMatch) {
        const macroName = funcDefMatch[1];
        const params = funcDefMatch[2]
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        const body = funcDefMatch[3].trim();
        funcMacros.set(macroName, { params, body });
        outLines.push('');
        continue;
      }

      const objDefMatch = trimmed.match(/^#\s*define\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*(.*)$/);
      if (objDefMatch) {
        objectMacros.set(objDefMatch[1], objDefMatch[2].trim() || '1');
        outLines.push('');
        continue;
      }

      outLines.push('');
      continue;
    }

    // Expand function-like and object-like macros outside string literals
    let expanded = expandMacrosInLine(rawLine, objectMacros, funcMacros);
    outLines.push(expanded);
  }

  return { processed: outLines.join('\n'), includedHeaders };
}

function expandMacrosInLine(
  line: string,
  objectMacros: Map<string, string>,
  funcMacros: Map<string, { params: string[]; body: string }>
): string {
  let result = '';
  let i = 0;
  let inQ: string | null = null;

  while (i < line.length) {
    const ch = line[i];
    if (inQ) {
      result += ch;
      if (ch === '\\' && i + 1 < line.length) {
        result += line[i + 1];
        i += 2;
        continue;
      }
      if (ch === inQ) inQ = null;
      i++;
      continue;
    }
    if (ch === '"' || ch === "'") {
      inQ = ch;
      result += ch;
      i++;
      continue;
    }
    const idMatch = line.slice(i).match(/^[a-zA-Z_][a-zA-Z0-9_]*/);
    if (idMatch) {
      const word = idMatch[0];
      i += word.length;
      if (funcMacros.has(word) && line.slice(i).trimStart().startsWith('(')) {
        const fm = funcMacros.get(word)!;
        const openIdx = line.indexOf('(', i);
        let depth = 1;
        let p = openIdx + 1;
        while (p < line.length && depth > 0) {
          if (line[p] === '(') depth++;
          else if (line[p] === ')') depth--;
          p++;
        }
        const argsRaw = line
          .slice(openIdx + 1, p - 1)
          .split(',')
          .map((s) => s.trim());
        let replaced = fm.body;
        fm.params.forEach((param, idx) => {
          const re = new RegExp(`\\b${param}\\b`, 'g');
          replaced = replaced.replace(re, argsRaw[idx] ?? '0');
        });
        result += replaced;
        i = p;
        continue;
      }
      if (objectMacros.has(word)) {
        result += objectMacros.get(word)!;
        continue;
      }
      result += word;
      continue;
    }
    result += ch;
    i++;
  }
  return result;
}

function unescapeCString(raw: string): string {
  let out = '';
  let i = 0;
  while (i < raw.length) {
    if (raw[i] === '\\' && i + 1 < raw.length) {
      const next = raw[i + 1];
      switch (next) {
        case 'n':
          out += '\n';
          break;
        case 't':
          out += '\t';
          break;
        case 'r':
          out += '\r';
          break;
        case '0':
          out += '\0';
          break;
        case '\\':
          out += '\\';
          break;
        case '"':
          out += '"';
          break;
        case "'":
          out += "'";
          break;
        default:
          out += next;
          break;
      }
      i += 2;
    } else {
      out += raw[i];
      i++;
    }
  }
  return out;
}

export function tokenizeC(source: string, diagnostics: CompilerDiagnostic[]): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  let line = 1;
  let col = 1;

  const multiCharPuncts = [
    '<<=',
    '>>=',
    '==',
    '!=',
    '<=',
    '>=',
    '&&',
    '||',
    '++',
    '--',
    '+=',
    '-=',
    '*=',
    '/=',
    '%=',
    '&=',
    '|=',
    '^=',
    '<<',
    '>>',
    '->',
  ];

  while (i < source.length) {
    const ch = source[i];
    if (ch === '\n') {
      line++;
      col = 1;
      i++;
      continue;
    }
    if (/\s/.test(ch)) {
      col++;
      i++;
      continue;
    }

    // String literal
    if (ch === '"') {
      const startCol = col;
      i++;
      col++;
      let raw = '';
      let closed = false;
      while (i < source.length) {
        if (source[i] === '\n') {
          break;
        }
        if (source[i] === '\\' && i + 1 < source.length) {
          raw += source[i] + source[i + 1];
          i += 2;
          col += 2;
          continue;
        }
        if (source[i] === '"') {
          closed = true;
          i++;
          col++;
          break;
        }
        raw += source[i];
        i++;
        col++;
      }
      if (!closed) {
        diagnostics.push({
          line,
          column: startCol,
          severity: 'error',
          category: 'syntaxe',
          code: 'C-LEX-UNCLOSED-STR',
          gccMessage: 'error: missing terminating " character',
          pedagogicalTitle: 'Chaîne de caractères non refermée',
          pedagogicalExplanation: `Vous avez ouvert des guillemets doubles (") à la ligne ${line}, mais vous avez oublié de les refermer sur la même ligne.`,
        });
      }
      tokens.push({
        type: 'string_lit',
        value: unescapeCString(raw),
        line,
        column: startCol,
      });
      continue;
    }

    // Char literal
    if (ch === "'") {
      const startCol = col;
      i++;
      col++;
      let raw = '';
      let closed = false;
      while (i < source.length) {
        if (source[i] === '\n') break;
        if (source[i] === '\\' && i + 1 < source.length) {
          raw += source[i] + source[i + 1];
          i += 2;
          col += 2;
          continue;
        }
        if (source[i] === "'") {
          closed = true;
          i++;
          col++;
          break;
        }
        raw += source[i];
        i++;
        col++;
      }
      const unescaped = unescapeCString(raw);
      if (!closed || unescaped.length === 0) {
        diagnostics.push({
          line,
          column: startCol,
          severity: 'error',
          category: 'syntaxe',
          code: 'C-LEX-CHAR',
          gccMessage: "error: invalid character constant",
          pedagogicalTitle: 'Constante caractère invalide',
          pedagogicalExplanation: `Un caractère entre apostrophes simples ('a') doit contenir exactement un caractère (ou une séquence d'échappement comme '\\n' ou '\\0').`,
        });
      }
      const codeVal = unescaped.length > 0 ? unescaped.charCodeAt(0) : 0;
      tokens.push({
        type: 'char_lit',
        value: unescaped,
        numValue: codeVal,
        line,
        column: startCol,
      });
      continue;
    }

    // Numbers
    if (/[0-9]/.test(ch) || (ch === '.' && /[0-9]/.test(source[i + 1] ?? ''))) {
      const startCol = col;
      const slice = source.slice(i);
      const hexMatch = slice.match(/^0[xX][0-9a-fA-F]+[uUlL]*/);
      if (hexMatch) {
        const raw = hexMatch[0];
        const num = parseInt(raw.replace(/[uUlL]+$/, ''), 16);
        tokens.push({ type: 'int_lit', value: raw, numValue: num, line, column: startCol });
        i += raw.length;
        col += raw.length;
        continue;
      }
      const floatMatch = slice.match(
        /^(?:[0-9]+\.[0-9]*|\.[0-9]+)(?:[eE][+-]?[0-9]+)?[fFlL]?|^[0-9]+[eE][+-]?[0-9]+[fFlL]?/
      );
      if (floatMatch) {
        const raw = floatMatch[0];
        const num = parseFloat(raw.replace(/[fFlL]+$/, ''));
        tokens.push({
          type: 'float_lit',
          value: raw,
          numValue: num,
          line,
          column: startCol,
        });
        i += raw.length;
        col += raw.length;
        continue;
      }
      const intMatch = slice.match(/^[0-9]+[uUlL]*/);
      if (intMatch) {
        const raw = intMatch[0];
        const num = parseInt(raw.replace(/[uUlL]+$/, ''), 10);
        tokens.push({ type: 'int_lit', value: raw, numValue: num, line, column: startCol });
        i += raw.length;
        col += raw.length;
        continue;
      }
    }

    // Identifiers and keywords
    if (/[a-zA-Z_]/.test(ch)) {
      const startCol = col;
      const m = source.slice(i).match(/^[a-zA-Z_][a-zA-Z0-9_]*/)!;
      const word = m[0];
      i += word.length;
      col += word.length;

      if (word === 'true') {
        tokens.push({ type: 'int_lit', value: '1', numValue: 1, line, column: startCol });
      } else if (word === 'false' || word === 'NULL') {
        tokens.push({ type: 'int_lit', value: '0', numValue: 0, line, column: startCol });
      } else if (C_KEYWORDS.has(word)) {
        tokens.push({ type: 'keyword', value: word, line, column: startCol });
      } else {
        tokens.push({ type: 'ident', value: word, line, column: startCol });
      }
      continue;
    }

    // Multi-char punctuators
    let matchedPunct = '';
    for (const p of multiCharPuncts) {
      if (source.startsWith(p, i)) {
        matchedPunct = p;
        break;
      }
    }
    if (matchedPunct) {
      tokens.push({ type: 'punct', value: matchedPunct, line, column: col });
      i += matchedPunct.length;
      col += matchedPunct.length;
      continue;
    }

    // Single-char punctuators
    if ('+-*/%&|^~!<>=?:;,()[]{}.'.includes(ch)) {
      tokens.push({ type: 'punct', value: ch, line, column: col });
      i++;
      col++;
      continue;
    }

    diagnostics.push({
      line,
      column: col,
      severity: 'error',
      category: 'syntaxe',
      code: 'C-LEX-CHAR-INVALID',
      gccMessage: `error: stray '${ch}' in program`,
      pedagogicalTitle: `Caractère invalide '${ch}' dans le code`,
      pedagogicalExplanation: `Le caractère '${ch}' (ligne ${line}, colonne ${col}) n'est pas valide en langage C en dehors d'une chaîne de caractères.`,
    });
    i++;
    col++;
  }

  tokens.push({ type: 'eof', value: '', line, column: col });
  return tokens;
}

export function parseCProgram(
  tokens: Token[],
  diagnostics: CompilerDiagnostic[]
): ASTProgram {
  const structs = new Map<string, CStructDef>();
  const typedefs = new Map<string, CTypeInfo>();
  const enums = new Map<string, number>();
  const globals: VarDeclItem[] = [];
  const functions = new Map<string, ASTFunctionDef>();

  let pos = 0;

  function peek(offset = 0): Token {
    return tokens[Math.min(pos + offset, tokens.length - 1)];
  }

  function advance(): Token {
    const t = tokens[pos];
    if (pos < tokens.length - 1) pos++;
    return t;
  }

  function matchPunct(val: string): boolean {
    if (peek().type === 'punct' && peek().value === val) {
      advance();
      return true;
    }
    return false;
  }

  function matchKeyword(val: string): boolean {
    if (peek().type === 'keyword' && peek().value === val) {
      advance();
      return true;
    }
    return false;
  }

  function expectPunct(val: string, contextMsg: string): boolean {
    if (matchPunct(val)) return true;
    const prev = tokens[Math.max(0, pos - 1)];
    const cur = peek();
    const reportLine = val === ';' ? prev.line : cur.line;
    const reportCol = val === ';' ? prev.column + prev.value.length : cur.column;

    diagnostics.push({
      line: reportLine,
      column: reportCol,
      severity: 'error',
      category: 'syntaxe',
      code: val === ';' ? 'C-SYN-MISSING-SEMI' : 'C-SYN-EXPECTED-PUNCT',
      gccMessage: `error: expected '${val}' before '${cur.value || 'EOF'}'`,
      pedagogicalTitle:
        val === ';'
          ? `Point-virgule ';' manquant à la fin de la ligne ${reportLine}`
          : `Symbole '${val}' attendu (${contextMsg})`,
      pedagogicalExplanation:
        val === ';'
          ? `En langage C, chaque instruction ou déclaration doit impérativement se terminer par un point-virgule ';'. Vérifiez la fin de la ligne ${reportLine}.`
          : `Le compilateur attendait '${val}' (${contextMsg}), mais a trouvé '${cur.value || 'la fin du fichier'}' à la ligne ${cur.line}.`,
      suggestion: `Ajoutez '${val}' à la ligne ${reportLine}.`,
    });
    return false;
  }

  function isTypeStart(idx = pos): boolean {
    const t = tokens[idx];
    if (!t) return false;
    if (t.type === 'keyword') {
      return [
        'void',
        'char',
        'short',
        'int',
        'long',
        'float',
        'double',
        'signed',
        'unsigned',
        'const',
        'static',
        'struct',
        'enum',
        'bool',
        '_Bool',
        'size_t',
        'FILE',
      ].includes(t.value);
    }
    if (t.type === 'ident' && typedefs.has(t.value)) {
      return true;
    }
    return false;
  }

  function parseStructFields(): CStructFieldDef[] {
    const fields: CStructFieldDef[] = [];
    let currentOffset = 0;

    while (peek().type !== 'eof' && !(peek().type === 'punct' && peek().value === '}')) {
      const baseType = parseBaseTypeSpec();
      do {
        let ptrDepth = baseType.pointerDepth;
        while (matchPunct('*')) ptrDepth++;
        const fTok = advance();
        const arrayDims: number[] = [];
        while (matchPunct('[')) {
          let dim = 1;
          if (peek().type === 'int_lit') {
            dim = advance().numValue ?? 1;
          } else if (peek().type === 'ident' && enums.has(peek().value)) {
            dim = enums.get(advance().value)!;
          }
          expectPunct(']', 'taille de tableau dans struct');
          arrayDims.push(dim);
        }
        const fType: CTypeInfo = {
          ...baseType,
          pointerDepth: ptrDepth,
          arrayDims,
        };
        const fSize = getTypeByteSize(fType, structs);
        // Align to 4 bytes if >= 4
        if (fSize >= 4 && currentOffset % 4 !== 0) {
          currentOffset += 4 - (currentOffset % 4);
        }
        fields.push({
          name: fTok.value,
          type: fType,
          offset: currentOffset,
          size: fSize,
        });
        currentOffset += fSize;
      } while (matchPunct(','));
      expectPunct(';', 'fin de champ de structure');
    }
    return fields;
  }

  function parseBaseTypeSpec(): CTypeInfo {
    let isConst = false;
    let unsigned = false;
    let base: CBaseType = 'int';
    let structName: string | undefined;
    let pointerDepth = 0;
    let hasBase = false;

    while (peek().type !== 'eof') {
      const t = peek();
      if (t.type === 'keyword' && t.value === 'const') {
        isConst = true;
        advance();
      } else if (t.type === 'keyword' && t.value === 'static') {
        advance();
      } else if (t.type === 'keyword' && t.value === 'unsigned') {
        unsigned = true;
        advance();
      } else if (t.type === 'keyword' && t.value === 'signed') {
        advance();
      } else if (t.type === 'keyword' && t.value === 'struct') {
        advance();
        let sName = '';
        if (peek().type === 'ident') {
          sName = advance().value;
        } else {
          sName = `__anon_struct_${pos}`;
        }
        if (matchPunct('{')) {
          const fields = parseStructFields();
          expectPunct('}', 'fin de définition de struct');
          let totalSize = fields.reduce((acc, f) => Math.max(acc, f.offset + f.size), 0);
          if (totalSize % 4 !== 0) totalSize += 4 - (totalSize % 4);
          structs.set(sName, { name: sName, fields, totalSize: Math.max(4, totalSize) });
        }
        base = 'struct';
        structName = sName;
        hasBase = true;
        break;
      } else if (t.type === 'keyword' && t.value === 'enum') {
        advance();
        if (peek().type === 'ident') advance();
        if (matchPunct('{')) {
          let enumVal = 0;
          while (peek().type !== 'eof' && !(peek().type === 'punct' && peek().value === '}')) {
            const eName = advance().value;
            if (matchPunct('=')) {
              const sign = matchPunct('-') ? -1 : 1;
              const numTok = advance();
              enumVal = sign * (numTok.numValue ?? 0);
            }
            enums.set(eName, enumVal);
            enumVal++;
            matchPunct(',');
          }
          expectPunct('}', 'fin de enum');
        }
        base = 'int';
        hasBase = true;
        break;
      } else if (
        t.type === 'keyword' &&
        [
          'void',
          'char',
          'short',
          'int',
          'long',
          'float',
          'double',
          'bool',
          '_Bool',
          'size_t',
          'FILE',
        ].includes(t.value)
      ) {
        advance();
        if (t.value === '_Bool') base = 'bool';
        else if (t.value === 'long') {
          // Handle 'long int', 'long long', 'long double'
          if (peek().type === 'keyword' && peek().value === 'double') {
            advance();
            base = 'double';
          } else {
            if (peek().type === 'keyword' && (peek().value === 'int' || peek().value === 'long')) {
              advance();
            }
            base = 'long';
          }
        } else if (t.value === 'short') {
          if (peek().type === 'keyword' && peek().value === 'int') advance();
          base = 'short';
        } else {
          base = t.value as CBaseType;
        }
        hasBase = true;
        break;
      } else if (!hasBase && t.type === 'ident' && typedefs.has(t.value)) {
        const td = typedefs.get(t.value)!;
        advance();
        base = td.base;
        structName = td.structName;
        unsigned = td.unsigned ?? unsigned;
        pointerDepth = td.pointerDepth;
        hasBase = true;
        break;
      } else {
        break;
      }
    }

    while (peek().type === 'keyword' && peek().value === 'const') {
      isConst = true;
      advance();
    }

    while (matchPunct('*')) {
      pointerDepth++;
      while (peek().type === 'keyword' && peek().value === 'const') {
        advance();
      }
    }

    return { base, unsigned, isConst, pointerDepth, arrayDims: [], structName };
  }

  // Expression Parser (Precedence Climbing / Recursive Descent)
  function parseExpression(): ASTExpr {
    return parseAssignment();
  }

  function parseAssignment(): ASTExpr {
    const left = parseTernary();
    const t = peek();
    if (
      t.type === 'punct' &&
      ['=', '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '<<=', '>>='].includes(
        t.value
      )
    ) {
      const op = advance().value;
      const right = parseAssignment();
      return { kind: 'assign', op, left, right, line: t.line };
    }
    return left;
  }

  function parseTernary(): ASTExpr {
    const cond = parseLogicalOr();
    if (matchPunct('?')) {
      const thenExpr = parseExpression();
      expectPunct(':', 'opérateur ternaire ? :');
      const elseExpr = parseTernary();
      return { kind: 'ternary', cond, thenExpr, elseExpr, line: cond.line };
    }
    return cond;
  }

  function parseLogicalOr(): ASTExpr {
    let left = parseLogicalAnd();
    while (matchPunct('||')) {
      const right = parseLogicalAnd();
      left = { kind: 'binary', op: '||', left, right, line: left.line };
    }
    return left;
  }

  function parseLogicalAnd(): ASTExpr {
    let left = parseBitwiseOr();
    while (matchPunct('&&')) {
      const right = parseBitwiseOr();
      left = { kind: 'binary', op: '&&', left, right, line: left.line };
    }
    return left;
  }

  function parseBitwiseOr(): ASTExpr {
    let left = parseBitwiseXor();
    while (matchPunct('|')) {
      const right = parseBitwiseXor();
      left = { kind: 'binary', op: '|', left, right, line: left.line };
    }
    return left;
  }

  function parseBitwiseXor(): ASTExpr {
    let left = parseBitwiseAnd();
    while (matchPunct('^')) {
      const right = parseBitwiseAnd();
      left = { kind: 'binary', op: '^', left, right, line: left.line };
    }
    return left;
  }

  function parseBitwiseAnd(): ASTExpr {
    let left = parseEquality();
    while (matchPunct('&')) {
      const right = parseEquality();
      left = { kind: 'binary', op: '&', left, right, line: left.line };
    }
    return left;
  }

  function parseEquality(): ASTExpr {
    let left = parseRelational();
    while (peek().type === 'punct' && (peek().value === '==' || peek().value === '!=')) {
      const op = advance().value;
      const right = parseRelational();
      left = { kind: 'binary', op, left, right, line: left.line };
    }
    return left;
  }

  function parseRelational(): ASTExpr {
    let left = parseShift();
    while (
      peek().type === 'punct' &&
      ['<', '>', '<=', '>='].includes(peek().value)
    ) {
      const op = advance().value;
      const right = parseShift();
      left = { kind: 'binary', op, left, right, line: left.line };
    }
    return left;
  }

  function parseShift(): ASTExpr {
    let left = parseAdditive();
    while (peek().type === 'punct' && (peek().value === '<<' || peek().value === '>>')) {
      const op = advance().value;
      const right = parseAdditive();
      left = { kind: 'binary', op, left, right, line: left.line };
    }
    return left;
  }

  function parseAdditive(): ASTExpr {
    let left = parseMultiplicative();
    while (peek().type === 'punct' && (peek().value === '+' || peek().value === '-')) {
      const op = advance().value;
      const right = parseMultiplicative();
      left = { kind: 'binary', op, left, right, line: left.line };
    }
    return left;
  }

  function parseMultiplicative(): ASTExpr {
    let left = parseUnary();
    while (
      peek().type === 'punct' &&
      (peek().value === '*' || peek().value === '/' || peek().value === '%')
    ) {
      const op = advance().value;
      const right = parseUnary();
      left = { kind: 'binary', op, left, right, line: left.line };
    }
    return left;
  }

  function parseUnary(): ASTExpr {
    const t = peek();
    // sizeof(...)
    if (t.type === 'keyword' && t.value === 'sizeof') {
      advance();
      if (matchPunct('(')) {
        if (isTypeStart()) {
          const targetType = parseBaseTypeSpec();
          expectPunct(')', 'sizeof(type)');
          return { kind: 'sizeof_type', targetType, line: t.line };
        } else {
          const expr = parseExpression();
          expectPunct(')', 'sizeof(expr)');
          return { kind: 'sizeof_expr', expr, line: t.line };
        }
      }
      const expr = parseUnary();
      return { kind: 'sizeof_expr', expr, line: t.line };
    }

    // Type cast: (type) expr
    if (t.type === 'punct' && t.value === '(' && isTypeStart(pos + 1)) {
      advance(); // '('
      const targetType = parseBaseTypeSpec();
      expectPunct(')', 'cast de type');
      const expr = parseUnary();
      return { kind: 'cast', targetType, expr, line: t.line };
    }

    // Prefix unary operators
    if (
      t.type === 'punct' &&
      ['+', '-', '!', '~', '*', '&', '++', '--'].includes(t.value)
    ) {
      const op = advance().value;
      const operand = parseUnary();
      return { kind: 'unary', op, prefix: true, operand, line: t.line };
    }

    return parsePostfix();
  }

  function parsePostfix(): ASTExpr {
    let expr = parsePrimary();

    while (peek().type !== 'eof') {
      if (matchPunct('[')) {
        const index = parseExpression();
        expectPunct(']', "indice de tableau '[' ... ']'");
        expr = { kind: 'index', array: expr, index, line: expr.line };
      } else if (matchPunct('(')) {
        const args: ASTExpr[] = [];
        if (!(peek().type === 'punct' && peek().value === ')')) {
          do {
            args.push(parseAssignment());
          } while (matchPunct(','));
        }
        expectPunct(')', "appel de fonction '(' ... ')'");
        const callee = expr.kind === 'ident' ? expr.name : '__indirect';
        // Static lint check for scanf missing '&'
        if (callee === 'scanf' && args.length >= 2 && args[0].kind === 'string_lit') {
          lintScanfCall(args, expr.line);
        }
        expr = { kind: 'call', callee, args, line: expr.line };
      } else if (matchPunct('.')) {
        const fieldTok = advance();
        expr = {
          kind: 'member',
          object: expr,
          field: fieldTok.value,
          isArrow: false,
          line: expr.line,
        };
      } else if (matchPunct('->')) {
        const fieldTok = advance();
        expr = {
          kind: 'member',
          object: expr,
          field: fieldTok.value,
          isArrow: true,
          line: expr.line,
        };
      } else if (
        peek().type === 'punct' &&
        (peek().value === '++' || peek().value === '--')
      ) {
        const op = advance().value;
        expr = { kind: 'unary', op, prefix: false, operand: expr, line: expr.line };
      } else {
        break;
      }
    }

    return expr;
  }

  function parsePrimary(): ASTExpr {
    const t = peek();

    if (matchPunct('(')) {
      const expr = parseExpression();
      expectPunct(')', 'expression entre parenthèses');
      return expr;
    }

    if (matchPunct('{')) {
      const elements: ASTExpr[] = [];
      const designated: { field?: string; expr: ASTExpr }[] = [];
      if (!(peek().type === 'punct' && peek().value === '}')) {
        do {
          if (peek().type === 'punct' && peek().value === '}') break;
          if (matchPunct('.')) {
            const fName = advance().value;
            expectPunct('=', 'initialiseur désigné .champ = valeur');
            const valExpr = parseAssignment();
            designated.push({ field: fName, expr: valExpr });
            elements.push(valExpr);
          } else {
            const valExpr = parseAssignment();
            elements.push(valExpr);
          }
        } while (matchPunct(','));
      }
      expectPunct('}', "liste d'initialisation '{ ... }'");
      return {
        kind: 'init_list',
        elements,
        designated: designated.length > 0 ? designated : undefined,
        line: t.line,
      };
    }

    if (t.type === 'int_lit') {
      advance();
      return { kind: 'int_lit', value: t.numValue ?? 0, line: t.line };
    }
    if (t.type === 'float_lit') {
      advance();
      return { kind: 'float_lit', value: t.numValue ?? 0, line: t.line };
    }
    if (t.type === 'char_lit') {
      advance();
      return { kind: 'char_lit', value: t.numValue ?? 0, line: t.line };
    }
    if (t.type === 'string_lit') {
      advance();
      // Adjacent string literals in C are concatenated automatically
      let combined = t.value;
      while (peek().type === 'string_lit') {
        combined += advance().value;
      }
      return { kind: 'string_lit', value: combined, line: t.line };
    }
    if (t.type === 'ident') {
      advance();
      if (enums.has(t.value)) {
        return { kind: 'int_lit', value: enums.get(t.value)!, line: t.line };
      }
      return { kind: 'ident', name: t.value, line: t.line };
    }

    // Error recovery
    advance();
    diagnostics.push({
      line: t.line,
      column: t.column,
      severity: 'error',
      category: 'syntaxe',
      code: 'C-SYN-UNEXPECTED-TOKEN',
      gccMessage: `error: unexpected token '${t.value}'`,
      pedagogicalTitle: `Élément inattendu '${t.value || 'fin de fichier'}'`,
      pedagogicalExplanation: `Le compilateur n'a pas pu interpréter '${t.value}' à la ligne ${t.line}. Vérifiez qu'il ne manque pas une parenthèse, un opérateur ou une valeur.`,
    });
    return { kind: 'int_lit', value: 0, line: t.line };
  }

  function lintScanfCall(args: ASTExpr[], line: number) {
    const fmt = (args[0] as { kind: 'string_lit'; value: string }).value;
    const specs = fmt.match(/%[*0-9]*[lLh]?[diuoxXfFeEgGaAcsp]/g) ?? [];
    for (let idx = 0; idx < specs.length; idx++) {
      const arg = args[idx + 1];
      if (!arg) {
        diagnostics.push({
          line,
          column: 1,
          severity: 'warning',
          category: 'compilation',
          code: 'C-WARN-SCANF-ARGS',
          gccMessage: `warning: format '${specs[idx]}' expects a matching argument`,
          pedagogicalTitle: 'Nombre d’arguments insuffisant dans scanf()',
          pedagogicalExplanation: `Votre chaîne de format contient '${specs[idx]}', mais vous n'avez pas fourni la variable correspondante dans scanf().`,
        });
        continue;
      }
      // If specifier is not %s and argument is a bare variable identifier (not &x), warn strongly!
      if (!specs[idx].endsWith('s') && arg.kind === 'ident') {
        diagnostics.push({
          line,
          column: 1,
          severity: 'warning',
          category: 'compilation',
          code: 'C-WARN-SCANF-NO-AMP',
          gccMessage: `warning: format '${specs[idx]}' expects argument of type 'type *', but argument ${
            idx + 2
          } has value type (missing '&'?)`,
          pedagogicalTitle: `Oubli probable du '&' devant '${arg.name}' dans scanf()`,
          pedagogicalExplanation: `Dans scanf("${fmt}", ...), pour modifier la variable '${arg.name}', vous devez passer son ADRESSE mémoire avec '&${arg.name}' (et non sa valeur '${arg.name}').`,
          suggestion: `Remplacez '${arg.name}' par '&${arg.name}' dans l'appel à scanf.`,
        });
      }
    }
  }

  function parseVarDeclarations(
    firstType: CTypeInfo,
    firstName: string,
    line: number,
    requireSemicolon = true
  ): VarDeclItem[] {
    const decls: VarDeclItem[] = [];

    let curType = { ...firstType, arrayDims: [...firstType.arrayDims] };
    let curName = firstName;

    while (true) {
      const dims: number[] = [];
      while (matchPunct('[')) {
        if (peek().type === 'punct' && peek().value === ']') {
          advance();
          dims.push(0); // Inferred from initializer
        } else {
          const sizeExpr = parseExpression();
          let dimVal = 10;
          if (sizeExpr.kind === 'int_lit') dimVal = sizeExpr.value;
          expectPunct(']', 'taille de tableau');
          dims.push(dimVal);
        }
      }
      curType.arrayDims = dims;

      let init: ASTExpr | undefined;
      if (matchPunct('=')) {
        init = parseAssignment();
        // Infer array dimension if [0]
        if (curType.arrayDims.length === 1 && curType.arrayDims[0] === 0 && init) {
          if (init.kind === 'init_list') {
            curType.arrayDims[0] = Math.max(1, init.elements.length);
          } else if (init.kind === 'string_lit') {
            curType.arrayDims[0] = init.value.length + 1;
          }
        }
        // Lint integer division assigned to float/double
        if (
          (curType.base === 'float' || curType.base === 'double') &&
          curType.pointerDepth === 0 &&
          init.kind === 'binary' &&
          init.op === '/' &&
          init.left.kind === 'int_lit' &&
          init.right.kind === 'int_lit'
        ) {
          diagnostics.push({
            line,
            column: 1,
            severity: 'warning',
            category: 'logique',
            code: 'C-WARN-INT-DIV-FLOAT',
            gccMessage:
              'warning: integer division result assigned to floating-point variable',
            pedagogicalTitle:
              'Attention : division entière stockée dans un nombre à virgule',
            pedagogicalExplanation: `L'expression '${init.left.value} / ${init.right.value}' divise deux entiers : la partie décimale est perdue AVANT d'être stockée dans '${curName}'. Écrivez '${init.left.value}.0 / ${init.right.value}' ou utilisez un cast '(double)'.`,
          });
        }
      }

      decls.push({ name: curName, type: curType, init, line });

      if (!matchPunct(',')) break;
      let nextPtr = firstType.pointerDepth;
      // Note: in C, `int *a, b;` means `a` is pointer, `b` is int unless `*b` is written
      // So reset pointerDepth to 0 and count '*' before next identifier:
      nextPtr = 0;
      while (matchPunct('*')) nextPtr++;
      const nextTok = advance();
      curName = nextTok.value;
      curType = {
        ...firstType,
        pointerDepth: nextPtr,
        arrayDims: [],
      };
    }

    if (requireSemicolon) {
      expectPunct(';', 'fin de déclaration de variable');
    }
    return decls;
  }

  function parseStatement(): ASTStmt {
    const t = peek();

    if (matchPunct('{')) {
      const statements: ASTStmt[] = [];
      while (peek().type !== 'eof' && !(peek().type === 'punct' && peek().value === '}')) {
        statements.push(parseStatement());
      }
      expectPunct('}', "fermeture de bloc '}'");
      return { kind: 'block', statements, line: t.line };
    }

    if (matchKeyword('if')) {
      expectPunct('(', "condition du 'if'");
      const cond = parseExpression();
      expectPunct(')', "fin de condition du 'if'");

      // Pedagogical warning for `if (a = b)`
      if (cond.kind === 'assign' && cond.op === '=') {
        diagnostics.push({
          line: t.line,
          column: t.column,
          severity: 'warning',
          category: 'logique',
          code: 'C-WARN-ASSIGN-IN-IF',
          gccMessage:
            'warning: suggest parentheses around assignment used as truth value [-Wparentheses]',
          pedagogicalTitle: "Piège classique : '=' (affectation) au lieu de '==' (comparaison) dans un if",
          pedagogicalExplanation: `À la ligne ${t.line}, vous avez écrit '=' à l'intérieur de la condition du 'if'. En C, '=' modifie la variable au lieu de tester l'égalité ! Pour comparer deux valeurs, utilisez '=='.`,
          suggestion: "Remplacez '=' par '==' dans la condition du if.",
        });
      }

      const thenBranch = parseStatement();
      let elseBranch: ASTStmt | null = null;
      if (matchKeyword('else')) {
        elseBranch = parseStatement();
      }
      return { kind: 'if', cond, thenBranch, elseBranch, line: t.line };
    }

    if (matchKeyword('switch')) {
      expectPunct('(', "expression du 'switch'");
      const expr = parseExpression();
      expectPunct(')', "fin de l'expression du 'switch'");
      expectPunct('{', "corps du 'switch'");
      const cases: { value: ASTExpr | null; stmts: ASTStmt[]; line: number }[] = [];

      while (peek().type !== 'eof' && !(peek().type === 'punct' && peek().value === '}')) {
        if (matchKeyword('case')) {
          const val = parseExpression();
          expectPunct(':', "après 'case valeur'");
          const stmts: ASTStmt[] = [];
          while (
            peek().type !== 'eof' &&
            !(peek().type === 'punct' && peek().value === '}') &&
            !(
              peek().type === 'keyword' &&
              (peek().value === 'case' || peek().value === 'default')
            )
          ) {
            stmts.push(parseStatement());
          }
          cases.push({ value: val, stmts, line: val.line });
        } else if (matchKeyword('default')) {
          expectPunct(':', "après 'default'");
          const stmts: ASTStmt[] = [];
          while (
            peek().type !== 'eof' &&
            !(peek().type === 'punct' && peek().value === '}') &&
            !(
              peek().type === 'keyword' &&
              (peek().value === 'case' || peek().value === 'default')
            )
          ) {
            stmts.push(parseStatement());
          }
          cases.push({ value: null, stmts, line: t.line });
        } else {
          advance();
        }
      }
      expectPunct('}', "fin du 'switch'");
      return { kind: 'switch', expr, cases, line: t.line };
    }

    if (matchKeyword('while')) {
      expectPunct('(', "condition du 'while'");
      const cond = parseExpression();
      expectPunct(')', "fin de condition du 'while'");
      const body = parseStatement();
      return { kind: 'while', cond, body, line: t.line };
    }

    if (matchKeyword('do')) {
      const body = parseStatement();
      if (!matchKeyword('while')) {
        diagnostics.push({
          line: peek().line,
          column: peek().column,
          severity: 'error',
          category: 'syntaxe',
          code: 'C-SYN-DO-WHILE',
          gccMessage: "error: expected 'while' after 'do' body",
          pedagogicalTitle: "Mot-clé 'while' attendu après le bloc 'do'",
          pedagogicalExplanation:
            "Une boucle 'do { ... } while (condition);' doit obligatoirement se terminer par 'while (condition);'.",
        });
      }
      expectPunct('(', "condition du 'do ... while'");
      const cond = parseExpression();
      expectPunct(')', "fin de condition du 'do ... while'");
      expectPunct(';', "point-virgule obligatoire après 'do ... while (...);'");
      return { kind: 'do_while', body, cond, line: t.line };
    }

    if (matchKeyword('for')) {
      expectPunct('(', "ouverture du 'for'");
      let init: ASTStmt | null = null;
      if (!matchPunct(';')) {
        if (isTypeStart()) {
          const bType = parseBaseTypeSpec();
          const nameTok = advance();
          const decls = parseVarDeclarations(bType, nameTok.value, t.line, true);
          init = { kind: 'var_decl', decls, line: t.line };
        } else {
          const e = parseExpression();
          expectPunct(';', "1er point-virgule du 'for'");
          init = { kind: 'expr_stmt', expr: e, line: t.line };
        }
      }
      let cond: ASTExpr | null = null;
      if (!matchPunct(';')) {
        cond = parseExpression();
        expectPunct(';', "2e point-virgule du 'for'");
      }
      let step: ASTExpr | null = null;
      if (!matchPunct(')')) {
        step = parseExpression();
        expectPunct(')', "fermeture de l'en-tête du 'for'");
      }
      const body = parseStatement();
      return { kind: 'for', init, cond, step, body, line: t.line };
    }

    if (matchKeyword('return')) {
      if (matchPunct(';')) {
        return { kind: 'return', expr: null, line: t.line };
      }
      const expr = parseExpression();
      expectPunct(';', "après l'instruction 'return'");
      return { kind: 'return', expr, line: t.line };
    }

    if (matchKeyword('break')) {
      expectPunct(';', "après 'break'");
      return { kind: 'break', line: t.line };
    }

    if (matchKeyword('continue')) {
      expectPunct(';', "après 'continue'");
      return { kind: 'continue', line: t.line };
    }

    // Check for local variable or struct declaration
    if (isTypeStart()) {
      const isStatic = peek().type === 'keyword' && peek().value === 'static';
      const bType = parseBaseTypeSpec();
      if (matchPunct(';')) {
        // Standalone struct/enum declaration inside block
        return { kind: 'expr_stmt', expr: null, line: t.line };
      }
      const nameTok = advance();
      const decls = parseVarDeclarations(bType, nameTok.value, t.line, true);
      return { kind: 'var_decl', decls, isStatic, line: t.line };
    }

    if (matchPunct(';')) {
      return { kind: 'expr_stmt', expr: null, line: t.line };
    }

    const expr = parseExpression();
    expectPunct(';', "fin d'instruction");
    return { kind: 'expr_stmt', expr, line: t.line };
  }

  // Top-level declarations (typedef, struct, global variables, functions)
  while (peek().type !== 'eof') {
    const startTok = peek();

    if (matchKeyword('typedef')) {
      const underlying = parseBaseTypeSpec();
      const aliasTok = advance();
      const dims: number[] = [];
      while (matchPunct('[')) {
        const dTok = advance();
        dims.push(dTok.numValue ?? 1);
        expectPunct(']', 'typedef array');
      }
      typedefs.set(aliasTok.value, { ...underlying, arrayDims: dims });
      expectPunct(';', 'fin de typedef');
      continue;
    }

    if (isTypeStart()) {
      const bType = parseBaseTypeSpec();
      // Could be a standalone `struct Point { ... };`
      if (matchPunct(';')) {
        continue;
      }

      const nameTok = advance();
      // Check if function declaration/definition
      if (matchPunct('(')) {
        const params: ASTFunctionParam[] = [];
        if (
          !(
            peek().type === 'keyword' &&
            peek().value === 'void' &&
            peek(1).type === 'punct' &&
            peek(1).value === ')'
          )
        ) {
          if (!(peek().type === 'punct' && peek().value === ')')) {
            do {
              const pType = parseBaseTypeSpec();
              let pName = `param_${params.length}`;
              if (peek().type === 'ident') {
                pName = advance().value;
              }
              // Handle array parameter `int tab[]` or `int mat[][10]` -> decays to pointer in C
              while (matchPunct('[')) {
                if (!(peek().type === 'punct' && peek().value === ']')) {
                  parseExpression();
                }
                expectPunct(']', 'paramètre tableau');
                pType.pointerDepth++;
              }
              params.push({ name: pName, type: pType });
            } while (matchPunct(','));
          }
        } else {
          advance(); // consume 'void'
        }
        expectPunct(')', `paramètres de la fonction '${nameTok.value}'`);

        if (matchPunct(';')) {
          // Prototype only
          if (!functions.has(nameTok.value)) {
            functions.set(nameTok.value, {
              name: nameTok.value,
              returnType: bType,
              params,
              body: null,
              line: startTok.line,
            });
          }
        } else {
          const body = parseStatement();
          functions.set(nameTok.value, {
            name: nameTok.value,
            returnType: bType,
            params,
            body,
            line: startTok.line,
          });
        }
        continue;
      }

      // Otherwise it is one or more global variable declarations
      const decls = parseVarDeclarations(bType, nameTok.value, startTok.line, true);
      globals.push(...decls);
      continue;
    }

    // Unexpected top-level token
    const bad = advance();
    diagnostics.push({
      line: bad.line,
      column: bad.column,
      severity: 'error',
      category: 'syntaxe',
      code: 'C-SYN-TOPLEVEL',
      gccMessage: `error: expected declaration or function definition before '${bad.value}'`,
      pedagogicalTitle: `Instruction '${bad.value}' en dehors d'une fonction`,
      pedagogicalExplanation: `En langage C, les instructions exécutables doivent se trouver à l'intérieur d'une fonction (comme 'int main(void) { ... }'). Seules les déclarations de types, de prototypes ou de variables globales sont autorisées en dehors des fonctions.`,
    });
  }

  return { structs, typedefs, enums, globals, functions };
}
