import {
  CodeTestCase,
  CompileAndRunResult,
  CompilerDiagnostic,
  TestCaseRunResult,
  TraceStep,
} from '../types/curriculum';

type AlgoValue = number | string | boolean | AlgoValue[] | { [key: string]: AlgoValue };

interface AlgoFunctionDef {
  name: string;
  params: { name: string; byRef: boolean }[];
  bodyLines: { lineNum: number; text: string }[];
  isProcedure: boolean;
  startLine: number;
}

interface ParsedBlock {
  type:
    | 'assign'
    | 'read'
    | 'print'
    | 'if'
    | 'switch'
    | 'for'
    | 'while'
    | 'repeat'
    | 'return'
    | 'call'
    | 'decl';
  line: number;
  raw: string;
  // assign
  target?: string;
  expr?: string;
  // read / print
  args?: string[];
  // if
  branches?: { cond: string | null; body: ParsedBlock[]; line: number }[];
  // switch
  switchExpr?: string;
  cases?: { values: string[]; body: ParsedBlock[]; line: number }[];
  defaultBody?: ParsedBlock[];
  // for
  iterator?: string;
  startExpr?: string;
  endExpr?: string;
  stepExpr?: string;
  body?: ParsedBlock[];
  // while / repeat
  cond?: string;
  // call
  funcName?: string;
}

function normalizeKeyword(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function stripInlineComment(line: string): string {
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === "'" && !inDouble) inSingle = !inSingle;
    else if (ch === '"' && !inSingle) inDouble = !inDouble;
    else if (!inSingle && !inDouble && ch === '/' && line[i + 1] === '/') {
      return line.slice(0, i).trim();
    }
  }
  return line.trim();
}

function splitTopLevelArgs(argStr: string): string[] {
  const result: string[] = [];
  let current = '';
  let depth = 0;
  let inQuotes: string | null = null;

  for (let i = 0; i < argStr.length; i++) {
    const ch = argStr[i];
    if (inQuotes) {
      current += ch;
      if (ch === inQuotes && argStr[i - 1] !== '\\') {
        inQuotes = null;
      }
      continue;
    }
    if (ch === '"' || ch === "'") {
      inQuotes = ch;
      current += ch;
    } else if (ch === '(' || ch === '[') {
      depth++;
      current += ch;
    } else if (ch === ')' || ch === ']') {
      depth--;
      current += ch;
    } else if (ch === ',' && depth === 0) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim().length > 0) {
    result.push(current.trim());
  }
  return result;
}

export function compileAndRunPseudoCode(
  sourceCode: string,
  stdinInput: string = '',
  maxSteps: number = 25000
): CompileAndRunResult {
  const startTime = performance.now();
  const diagnostics: CompilerDiagnostic[] = [];
  const rawLines = sourceCode.split(/\r?\n/);
  const cleanedLines: { lineNum: number; text: string }[] = [];

  for (let i = 0; i < rawLines.length; i++) {
    const text = stripInlineComment(rawLines[i]);
    if (text.length > 0) {
      cleanedLines.push({ lineNum: i + 1, text });
    }
  }

  if (cleanedLines.length === 0) {
    diagnostics.push({
      line: 1,
      column: 1,
      severity: 'error',
      category: 'syntaxe',
      code: 'ALGO-EMPTY',
      gccMessage: 'error: empty algorithm source',
      pedagogicalTitle: 'Algorithme vide',
      pedagogicalExplanation:
        "Votre éditeur ne contient aucune instruction. Un algorithme commence généralement par 'Algorithme Nom', suivi de 'Variables', 'Début' et 'Fin'.",
    });
    return {
      compileSuccess: false,
      executionSuccess: false,
      exitCode: 1,
      stdout: '',
      stderr: 'Erreur : Algorithme vide.',
      diagnostics,
      executionTimeMs: performance.now() - startTime,
      instructionsExecuted: 0,
      terminatedByTimeout: false,
    };
  }

  const functions = new Map<string, AlgoFunctionDef>();
  const mainLines: { lineNum: number; text: string }[] = [];

  // Extract Fonction / Procedure blocks first
  let idx = 0;
  while (idx < cleanedLines.length) {
    const { lineNum, text } = cleanedLines[idx];
    const norm = normalizeKeyword(text);

    const funcMatch = text.match(
      /^(?:Fonction|Proc[eé]dure)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)/i
    );
    if (funcMatch) {
      const isProcedure = norm.startsWith('procedure');
      const funcName = funcMatch[1];
      const rawParams = funcMatch[2].trim();
      const params: { name: string; byRef: boolean }[] = [];
      if (rawParams.length > 0) {
        for (const p of splitTopLevelArgs(rawParams)) {
          const cleanP = p.split(':')[0].trim();
          const byRef = /^(?:var|ref|entree\/sortie|sortie)\s+/i.test(cleanP);
          const pName = cleanP
            .replace(/^(?:var|ref|entree\/sortie|sortie|entree)\s+/i, '')
            .trim();
          if (pName) {
            params.push({ name: pName, byRef });
          }
        }
      }
      const bodyLines: { lineNum: number; text: string }[] = [];
      idx++;
      let foundEnd = false;
      while (idx < cleanedLines.length) {
        const inner = cleanedLines[idx];
        const innerNorm = normalizeKeyword(inner.text);
        if (
          innerNorm === 'finfonction' ||
          innerNorm === 'fin fonction' ||
          innerNorm === 'finprocedure' ||
          innerNorm === 'fin procedure'
        ) {
          foundEnd = true;
          idx++;
          break;
        }
        bodyLines.push(inner);
        idx++;
      }
      if (!foundEnd) {
        diagnostics.push({
          line: lineNum,
          column: 1,
          severity: 'error',
          category: 'syntaxe',
          code: 'ALGO-UNCLOSED-FUNC',
          gccMessage: `error: unclosed function '${funcName}'`,
          pedagogicalTitle: 'Fonction ou procédure non refermée',
          pedagogicalExplanation: `La fonction ou procédure '${funcName}' déclarée ligne ${lineNum} n'est pas terminée par 'FinFonction' ou 'FinProcédure'.`,
        });
      }
      functions.set(funcName.toLowerCase(), {
        name: funcName,
        params,
        bodyLines,
        isProcedure,
        startLine: lineNum,
      });
    } else {
      mainLines.push(cleanedLines[idx]);
      idx++;
    }
  }

  // Parse blocks recursively
  function parseStatements(
    lines: { lineNum: number; text: string }[],
    startIdx: number,
    stopKeywords: string[]
  ): { blocks: ParsedBlock[]; nextIdx: number; stoppedBy: string | null } {
    const blocks: ParsedBlock[] = [];
    let i = startIdx;

    while (i < lines.length) {
      const { lineNum, text } = lines[i];
      const norm = normalizeKeyword(text);

      for (const kw of stopKeywords) {
        if (
          norm === kw ||
          norm.startsWith(kw + ' ') ||
          norm.startsWith(kw + '(') ||
          norm.startsWith(kw + ':')
        ) {
          return { blocks, nextIdx: i, stoppedBy: kw };
        }
      }

      // Skip structural headers
      if (
        norm.startsWith('algorithme ') ||
        norm === 'algorithme' ||
        norm === 'variables' ||
        norm === 'variable' ||
        norm === 'constantes' ||
        norm === 'constante' ||
        norm === 'debut' ||
        norm === 'fin'
      ) {
        i++;
        continue;
      }

      // Variable / Constant declarations: "a, b : Entier" or "Constante MAX = 100"
      if (
        /^[a-zA-Z_][a-zA-Z0-9_,\s\[\]]*\s*:\s*(?:Entier|R[eé]el|Caract[eè]re|Cha[iî]ne|Bool[eé]en|Tableau)/i.test(
          text
        ) &&
        !text.includes('<-') &&
        !text.includes('←') &&
        !text.includes(':=')
      ) {
        blocks.push({ type: 'decl', line: lineNum, raw: text });
        i++;
        continue;
      }

      // Si ... Alors
      const siMatch = text.match(/^Si\s+(.+?)(?:\s+Alors)?$/i);
      if (siMatch && /^si\b/i.test(text)) {
        const branches: { cond: string | null; body: ParsedBlock[]; line: number }[] = [];
        const firstCond = siMatch[1].replace(/\s+Alors$/i, '').trim();
        let curLine = lineNum;
        let curCond: string | null = firstCond;
        i++;

        let closed = false;
        while (i <= lines.length) {
          const sub = parseStatements(lines, i, [
            'sinonsi',
            'sinon si',
            'sinon',
            'finsi',
            'fin si',
          ]);
          branches.push({ cond: curCond, body: sub.blocks, line: curLine });
          i = sub.nextIdx;

          if (!sub.stoppedBy) {
            break;
          }
          const stopLine = lines[i];
          const stopNorm = normalizeKeyword(stopLine.text);
          if (stopNorm === 'finsi' || stopNorm === 'fin si') {
            closed = true;
            i++;
            break;
          } else if (stopNorm.startsWith('sinonsi') || stopNorm.startsWith('sinon si')) {
            const m = stopLine.text.match(/^Sinon\s*Si\s+(.+?)(?:\s+Alors)?$/i);
            curCond = m ? m[1].replace(/\s+Alors$/i, '').trim() : 'Faux';
            curLine = stopLine.lineNum;
            i++;
          } else if (stopNorm === 'sinon') {
            curCond = null;
            curLine = stopLine.lineNum;
            i++;
          } else {
            break;
          }
        }

        if (!closed) {
          diagnostics.push({
            line: lineNum,
            column: 1,
            severity: 'error',
            category: 'syntaxe',
            code: 'ALGO-UNCLOSED-IF',
            gccMessage: `error: missing 'FinSi' for 'Si' at line ${lineNum}`,
            pedagogicalTitle: "Structure 'Si' non refermée par 'FinSi'",
            pedagogicalExplanation: `La condition 'Si' ouverte à la ligne ${lineNum} n'a pas de 'FinSi' correspondant.`,
          });
        }
        blocks.push({ type: 'if', line: lineNum, raw: text, branches });
        continue;
      }

      // Selon ... Faire
      const selonMatch = text.match(/^Selon\s+(.+?)(?:\s+Faire)?$/i);
      if (selonMatch && /^selon\b/i.test(text)) {
        const switchExpr = selonMatch[1].replace(/\s+Faire$/i, '').trim();
        const cases: { values: string[]; body: ParsedBlock[]; line: number }[] = [];
        let defaultBody: ParsedBlock[] | undefined;
        i++;
        let closed = false;

        while (i < lines.length) {
          const cur = lines[i];
          const curNorm = normalizeKeyword(cur.text);
          if (curNorm === 'finselon' || curNorm === 'fin selon') {
            closed = true;
            i++;
            break;
          }
          const casMatch = cur.text.match(/^(?:Cas\s+)?(.+?)\s*:\s*(.*)$/i);
          const isDefault = /^(?:Autrement|Sinon|D[eé]faut|Defaut)\s*:?\s*(.*)$/i.test(
            cur.text
          );

          if (isDefault) {
            const inline = cur.text.replace(
              /^(?:Autrement|Sinon|D[eé]faut|Defaut)\s*:?\s*/i,
              ''
            );
            i++;
            const sub = parseStatements(lines, i, [
              'cas',
              'autrement',
              'defaut',
              'finselon',
              'fin selon',
            ]);
            defaultBody = sub.blocks;
            if (inline.trim()) {
              const inlineParsed = parseStatements(
                [{ lineNum: cur.lineNum, text: inline.trim() }],
                0,
                []
              );
              defaultBody = [...inlineParsed.blocks, ...defaultBody];
            }
            i = sub.nextIdx;
          } else if (casMatch) {
            const valPart = casMatch[1].replace(/^Cas\s+/i, '').trim();
            const inline = casMatch[2].trim();
            const values = splitTopLevelArgs(valPart);
            i++;
            const sub = parseStatements(lines, i, [
              'cas',
              'autrement',
              'defaut',
              'finselon',
              'fin selon',
            ]);
            let body = sub.blocks;
            if (inline) {
              const inlineParsed = parseStatements(
                [{ lineNum: cur.lineNum, text: inline }],
                0,
                []
              );
              body = [...inlineParsed.blocks, ...body];
            }
            cases.push({ values, body, line: cur.lineNum });
            i = sub.nextIdx;
          } else {
            i++;
          }
        }
        if (!closed) {
          diagnostics.push({
            line: lineNum,
            column: 1,
            severity: 'error',
            category: 'syntaxe',
            code: 'ALGO-UNCLOSED-SWITCH',
            gccMessage: `error: missing 'FinSelon' at line ${lineNum}`,
            pedagogicalTitle: "Structure 'Selon' non refermée",
            pedagogicalExplanation: `Le bloc 'Selon' ouvert ligne ${lineNum} doit se terminer par 'FinSelon'.`,
          });
        }
        blocks.push({
          type: 'switch',
          line: lineNum,
          raw: text,
          switchExpr,
          cases,
          defaultBody,
        });
        continue;
      }

      // Pour i de ... à ... [pas ...] Faire
      const pourMatch = text.match(
        /^Pour\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+(?:allant\s+)?(?:de|<-|←|=)\s+(.+?)\s+[aà]\s+(.+?)(?:\s+(?:pas|par\s+pas\s+de)\s+(.+?))?(?:\s+Faire)?$/i
      );
      if (pourMatch) {
        const iterator = pourMatch[1].trim();
        const startExpr = pourMatch[2].trim();
        const endExpr = pourMatch[3].replace(/\s+Faire$/i, '').trim();
        const stepExpr = pourMatch[4]
          ? pourMatch[4].replace(/\s+Faire$/i, '').trim()
          : '1';
        i++;
        const sub = parseStatements(lines, i, ['finpour', 'fin pour', 'fpour']);
        if (!sub.stoppedBy) {
          diagnostics.push({
            line: lineNum,
            column: 1,
            severity: 'error',
            category: 'syntaxe',
            code: 'ALGO-UNCLOSED-FOR',
            gccMessage: `error: missing 'FinPour' for loop at line ${lineNum}`,
            pedagogicalTitle: "Boucle 'Pour' non refermée",
            pedagogicalExplanation: `La boucle 'Pour' ouverte ligne ${lineNum} doit être refermée par 'FinPour'.`,
          });
        } else {
          i = sub.nextIdx + 1;
        }
        blocks.push({
          type: 'for',
          line: lineNum,
          raw: text,
          iterator,
          startExpr,
          endExpr,
          stepExpr,
          body: sub.blocks,
        });
        continue;
      }

      // TantQue ... Faire
      const tqMatch = text.match(/^Tant\s*Que\s+(.+?)(?:\s+Faire)?$/i);
      if (tqMatch) {
        const cond = tqMatch[1].replace(/\s+Faire$/i, '').trim();
        i++;
        const sub = parseStatements(lines, i, [
          'fintantque',
          'fin tantque',
          'fin tant que',
          'ftq',
        ]);
        if (!sub.stoppedBy) {
          diagnostics.push({
            line: lineNum,
            column: 1,
            severity: 'error',
            category: 'syntaxe',
            code: 'ALGO-UNCLOSED-WHILE',
            gccMessage: `error: missing 'FinTantQue' for loop at line ${lineNum}`,
            pedagogicalTitle: "Boucle 'TantQue' non refermée",
            pedagogicalExplanation: `La boucle 'TantQue' ouverte ligne ${lineNum} doit être refermée par 'FinTantQue'.`,
          });
        } else {
          i = sub.nextIdx + 1;
        }
        blocks.push({
          type: 'while',
          line: lineNum,
          raw: text,
          cond,
          body: sub.blocks,
        });
        continue;
      }

      // Répéter ... Jusqu'à ...
      if (norm === 'repeter') {
        i++;
        const sub = parseStatements(lines, i, ['jusqua', "jusqu'a", 'tantque', 'tant que']);
        let cond = 'Vrai';
        if (sub.stoppedBy && sub.nextIdx < lines.length) {
          const stopText = lines[sub.nextIdx].text;
          const m = stopText.match(/^(?:Jusqu'?[aà]|Tant\s*Que)\s+(.+)$/i);
          cond = m ? m[1].trim() : 'Vrai';
          i = sub.nextIdx + 1;
        } else {
          diagnostics.push({
            line: lineNum,
            column: 1,
            severity: 'error',
            category: 'syntaxe',
            code: 'ALGO-UNCLOSED-REPEAT',
            gccMessage: `error: missing 'Jusqu'à' for 'Répéter' at line ${lineNum}`,
            pedagogicalTitle: "Boucle 'Répéter' sans condition de sortie 'Jusqu'à'",
            pedagogicalExplanation: `La boucle 'Répéter' ouverte ligne ${lineNum} doit se terminer par 'Jusqu'à <condition>'.`,
          });
        }
        blocks.push({
          type: 'repeat',
          line: lineNum,
          raw: text,
          cond,
          body: sub.blocks,
        });
        continue;
      }

      // Lire(...) / Saisir(...)
      const lireMatch = text.match(/^(?:Lire|Saisir)\s*\((.*)\)\s*;?$/i);
      if (lireMatch) {
        const args = splitTopLevelArgs(lireMatch[1]);
        blocks.push({ type: 'read', line: lineNum, raw: text, args });
        i++;
        continue;
      }

      // Afficher(...) / Ecrire(...)
      const printMatch = text.match(/^(?:Afficher|[EÉeé]crire)\s*\((.*)\)\s*;?$/i);
      if (printMatch) {
        const args = splitTopLevelArgs(printMatch[1]);
        blocks.push({ type: 'print', line: lineNum, raw: text, args });
        i++;
        continue;
      }

      // Retourner ...
      const retMatch = text.match(/^(?:Retourner|Renvoyer)\s+(.+?)\s*;?$/i);
      if (retMatch) {
        blocks.push({ type: 'return', line: lineNum, raw: text, expr: retMatch[1] });
        i++;
        continue;
      }

      // Assignment: x <- expr, x ← expr, x := expr, or Constante X = expr
      const constMatch = text.match(/^Constante\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*(?:=|<-|←)\s*(.+)$/i);
      if (constMatch) {
        blocks.push({
          type: 'assign',
          line: lineNum,
          raw: text,
          target: constMatch[1].trim(),
          expr: constMatch[2].trim(),
        });
        i++;
        continue;
      }

      const assignMatch = text.match(/^([a-zA-Z_][a-zA-Z0-9_]*(?:\[[^\]]+\])*)\s*(?:<-|←|:=|=)\s*(.+)$/);
      if (assignMatch) {
        blocks.push({
          type: 'assign',
          line: lineNum,
          raw: text,
          target: assignMatch[1].trim(),
          expr: assignMatch[2].replace(/;$/, '').trim(),
        });
        i++;
        continue;
      }

      // Procedure call: NomProc(arg1, arg2)
      const callMatch = text.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*\((.*)\)\s*;?$/);
      if (callMatch) {
        blocks.push({
          type: 'call',
          line: lineNum,
          raw: text,
          funcName: callMatch[1],
          args: splitTopLevelArgs(callMatch[2]),
        });
        i++;
        continue;
      }

      // Unrecognized instruction
      diagnostics.push({
        line: lineNum,
        column: 1,
        severity: 'error',
        category: 'syntaxe',
        code: 'ALGO-SYN-UNKNOWN',
        gccMessage: `error: unrecognized pseudo-code statement '${text}'`,
        pedagogicalTitle: 'Instruction pseudo-code non reconnue',
        pedagogicalExplanation: `La ligne ${lineNum} (« ${text} ») n'a pas pu être interprétée. Vérifiez la syntaxe de votre affectation (ex: x <- 5), de votre condition (Si ... Alors ... FinSi) ou de votre appel (Afficher(...), Lire(...)).`,
      });
      i++;
    }

    return { blocks, nextIdx: i, stoppedBy: null };
  }

  const parsedMain = parseStatements(mainLines, 0, []);
  if (diagnostics.some((d) => d.severity === 'error')) {
    return {
      compileSuccess: false,
      executionSuccess: false,
      exitCode: 1,
      stdout: '',
      stderr: diagnostics.map((d) => `Ligne ${d.line} : ${d.pedagogicalTitle}`).join('\n'),
      diagnostics,
      executionTimeMs: performance.now() - startTime,
      instructionsExecuted: 0,
      terminatedByTimeout: false,
    };
  }

  // Prepare stdin tokens (split by whitespace or line depending on context)
  const stdinTokens = stdinInput
    .trim()
    .split(/\s+/)
    .filter((t) => t.length > 0);
  let stdinCursor = 0;

  let stdout = '';
  const traceSteps: TraceStep[] = [];
  let stepCounter = 0;
  let terminatedByTimeout = false;

  function formatVal(v: AlgoValue): string {
    if (v === undefined || v === null) return '?';
    if (typeof v === 'boolean') return v ? 'Vrai' : 'Faux';
    if (Array.isArray(v)) return `[${v.map(formatVal).join(', ')}]`;
    if (typeof v === 'number') {
      return Number.isInteger(v) ? String(v) : Number(v.toFixed(4)).toString();
    }
    return String(v);
  }

  function snapshotEnv(env: Map<string, AlgoValue>): Record<string, string> {
    const snap: Record<string, string> = {};
    for (const [k, v] of env.entries()) {
      snap[k] = formatVal(v);
    }
    return snap;
  }

  function evalExpression(expr: string, env: Map<string, AlgoValue>, lineNum: number): AlgoValue {
    const trimmed = expr.trim();
    if (!trimmed) return 0;

    // Translate French pseudo-code expression to safe JS expression evaluated against scope
    // First replace user function calls and array indexing
    let jsExpr = '';
    let i = 0;
    while (i < trimmed.length) {
      const ch = trimmed[i];
      if (ch === '"' || ch === "'") {
        const quote = ch;
        let lit = '"';
        i++;
        while (i < trimmed.length && trimmed[i] !== quote) {
          if (trimmed[i] === '\\' && i + 1 < trimmed.length) {
            lit += trimmed[i] + trimmed[i + 1];
            i += 2;
          } else {
            if (trimmed[i] === '"') lit += '\\"';
            else lit += trimmed[i];
            i++;
          }
        }
        i++; // closing quote
        lit += '"';
        jsExpr += lit;
        continue;
      }

      if (trimmed.slice(i, i + 2) === '<>') {
        jsExpr += ' !== ';
        i += 2;
        continue;
      }
      if (trimmed.slice(i, i + 2) === '<=' || trimmed[i] === '≤') {
        jsExpr += ' <= ';
        i += trimmed[i] === '≤' ? 1 : 2;
        continue;
      }
      if (trimmed.slice(i, i + 2) === '>=' || trimmed[i] === '≥') {
        jsExpr += ' >= ';
        i += trimmed[i] === '≥' ? 1 : 2;
        continue;
      }
      if (trimmed.slice(i, i + 2) === '!=' || trimmed[i] === '≠') {
        jsExpr += ' !== ';
        i += trimmed[i] === '≠' ? 1 : 2;
        continue;
      }
      if (trimmed.slice(i, i + 2) === '==') {
        jsExpr += ' === ';
        i += 2;
        continue;
      }
      if (ch === '=') {
        jsExpr += ' === ';
        i++;
        continue;
      }

      // Identifiers or keywords
      const idMatch = trimmed.slice(i).match(/^[a-zA-Z_\u00C0-\u017F][a-zA-Z0-9_\u00C0-\u017F]*/);
      if (idMatch) {
        const word = idMatch[0];
        const norm = normalizeKeyword(word);
        i += word.length;

        // Check if followed by '(' -> function call
        const restAfterSpaces = trimmed.slice(i).trimStart();
        if (restAfterSpaces.startsWith('(') && !['et', 'ou', 'non', 'div', 'mod'].includes(norm)) {
          // Find matching ')'
          const openPos = trimmed.indexOf('(', i);
          let depth = 1;
          let p = openPos + 1;
          let inQ: string | null = null;
          while (p < trimmed.length && depth > 0) {
            const c = trimmed[p];
            if (inQ) {
              if (c === inQ && trimmed[p - 1] !== '\\') inQ = null;
            } else if (c === '"' || c === "'") {
              inQ = c;
            } else if (c === '(') depth++;
            else if (c === ')') depth--;
            p++;
          }
          const innerArgStr = trimmed.slice(openPos + 1, p - 1);
          const argExprs = splitTopLevelArgs(innerArgStr);
          const evaledArgs = argExprs.map((a) => evalExpression(a, env, lineNum));
          const callRes = invokeFunction(word, evaledArgs, argExprs, env, lineNum);
          jsExpr += JSON.stringify(callRes);
          i = p;
          continue;
        }

        if (norm === 'et' || norm === 'and') {
          jsExpr += ' && ';
        } else if (norm === 'ou' || norm === 'or') {
          jsExpr += ' || ';
        } else if (norm === 'non' || norm === 'not') {
          jsExpr += ' ! ';
        } else if (norm === 'vrai' || norm === 'true') {
          jsExpr += ' true ';
        } else if (norm === 'faux' || norm === 'false') {
          jsExpr += ' false ';
        } else if (norm === 'div') {
          jsExpr += ' / '; // handled with Math.trunc wrapper or post-op
        } else if (norm === 'mod') {
          jsExpr += ' % ';
        } else {
          // Variable lookup (case-insensitive fallback)
          jsExpr += `__getVar(${JSON.stringify(word)})`;
        }
        continue;
      }

      jsExpr += ch;
      i++;
    }

    // Handle integer division DIV if present in original expression
    const hasDivKeyword = /\bdiv\b/i.test(trimmed);

    const __getVar = (name: string): AlgoValue => {
      if (env.has(name)) return env.get(name)!;
      const lower = name.toLowerCase();
      for (const [k, v] of env.entries()) {
        if (k.toLowerCase() === lower) return v;
      }
      return 0;
    };

    try {
      const fn = new Function('__getVar', 'Math', `return (${jsExpr});`);
      const res = fn(__getVar, Math);
      if (hasDivKeyword && typeof res === 'number') {
        return Math.trunc(res);
      }
      return res;
    } catch (e) {
      throw new Error(
        `Erreur d'évaluation ligne ${lineNum} dans l'expression « ${expr} » : ${
          e instanceof Error ? e.message : String(e)
        }`
      );
    }
  }

  function setVar(env: Map<string, AlgoValue>, target: string, value: AlgoValue): void {
    const arrMatch = target.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\[(.+)\](?:\[(.+)\])?$/);
    if (arrMatch) {
      const baseName = arrMatch[1];
      const idx1 = Number(evalExpression(arrMatch[2], env, 0));
      let actualKey = baseName;
      for (const k of env.keys()) {
        if (k.toLowerCase() === baseName.toLowerCase()) {
          actualKey = k;
          break;
        }
      }
      let arr = env.get(actualKey);
      if (!Array.isArray(arr)) {
        arr = [];
        env.set(actualKey, arr);
      }
      if (arrMatch[3] !== undefined) {
        const idx2 = Number(evalExpression(arrMatch[3], env, 0));
        if (!Array.isArray(arr[idx1])) {
          arr[idx1] = [];
        }
        (arr[idx1] as AlgoValue[])[idx2] = value;
      } else {
        arr[idx1] = value;
      }
      return;
    }

    let actualKey = target;
    for (const k of env.keys()) {
      if (k.toLowerCase() === target.toLowerCase()) {
        actualKey = k;
        break;
      }
    }
    env.set(actualKey, value);
  }

  function invokeFunction(
    funcName: string,
    args: AlgoValue[],
    rawArgExprs: string[],
    callerEnv: Map<string, AlgoValue>,
    lineNum: number
  ): AlgoValue {
    const norm = normalizeKeyword(funcName);
    if (norm === 'longueur' || norm === 'len' || norm === 'taille') {
      const v = args[0];
      if (typeof v === 'string' || Array.isArray(v)) return v.length;
      return 0;
    }
    if (norm === 'abs') return Math.abs(Number(args[0]));
    if (norm === 'racine' || norm === 'sqrt') return Math.sqrt(Number(args[0]));
    if (norm === 'entier' || norm === 'floor' || norm === 'tronc') {
      return Math.trunc(Number(args[0]));
    }
    if (norm === 'caractere' || norm === 'char') {
      const s = String(args[0] ?? '');
      const idx = Number(args[1] ?? 0);
      return s[idx] ?? '';
    }

    const def = functions.get(funcName.toLowerCase());
    if (!def) {
      throw new Error(`Fonction ou procédure inconnue : '${funcName}' (ligne ${lineNum}).`);
    }

    const localEnv = new Map<string, AlgoValue>();
    for (let i = 0; i < def.params.length; i++) {
      const val = args[i] ?? 0;
      localEnv.set(def.params[i].name, Array.isArray(val) ? [...val] : val);
    }

    const parsedBody = parseStatements(def.bodyLines, 0, []);
    const ret = executeBlocks(parsedBody.blocks, localEnv);

    // Copy back byRef parameters
    for (let i = 0; i < def.params.length; i++) {
      if (def.params[i].byRef && rawArgExprs[i]) {
        const updated = localEnv.get(def.params[i].name);
        if (updated !== undefined) {
          setVar(callerEnv, rawArgExprs[i].trim(), updated);
        }
      }
    }

    return ret.returned ? ret.value : 0;
  }

  function recordTrace(
    line: number,
    summary: string,
    env: Map<string, AlgoValue>,
    outputDelta?: string
  ) {
    if (traceSteps.length < 300) {
      traceSteps.push({
        stepNumber: traceSteps.length + 1,
        line,
        instructionSummary: summary,
        variables: snapshotEnv(env),
        outputDelta,
      });
    }
  }

  function executeBlocks(
    blocks: ParsedBlock[],
    env: Map<string, AlgoValue>
  ): { returned: boolean; value: AlgoValue } {
    for (const b of blocks) {
      stepCounter++;
      if (stepCounter > maxSteps) {
        terminatedByTimeout = true;
        throw new Error(
          `Limite d'exécution dépassée (${maxSteps} étapes). Vérifiez la condition d'arrêt de votre boucle (risque de boucle infinie).`
        );
      }

      if (b.type === 'decl') {
        const parts = b.raw.split(':');
        const names = parts[0].split(',').map((s) => s.trim());
        const typeStr = (parts[1] ?? '').toLowerCase();
        for (const n of names) {
          const arrDecl = n.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\[(\d+)\]$/);
          if (arrDecl) {
            env.set(arrDecl[1], new Array(Number(arrDecl[2])).fill(0));
          } else if (typeStr.includes('tableau')) {
            env.set(n, []);
          } else if (typeStr.includes('chaine')) {
            env.set(n, '');
          } else if (typeStr.includes('booleen')) {
            env.set(n, false);
          } else {
            env.set(n, 0);
          }
        }
        continue;
      }

      if (b.type === 'assign' && b.target && b.expr !== undefined) {
        const val = evalExpression(b.expr, env, b.line);
        setVar(env, b.target, val);
        recordTrace(b.line, `${b.target} <- ${formatVal(val)}`, env);
        continue;
      }

      if (b.type === 'read' && b.args) {
        for (const target of b.args) {
          const rawToken = stdinTokens[stdinCursor++] ?? '0';
          const num = Number(rawToken);
          const parsedVal: AlgoValue =
            !Number.isNaN(num) && rawToken.trim() !== '' ? num : rawToken;
          setVar(env, target, parsedVal);
          recordTrace(b.line, `Lire(${target}) -> ${formatVal(parsedVal)}`, env);
        }
        continue;
      }

      if (b.type === 'print' && b.args) {
        const rendered = b.args
          .map((arg) => {
            const v = evalExpression(arg, env, b.line);
            return typeof v === 'boolean' ? (v ? 'Vrai' : 'Faux') : String(v);
          })
          .join(' ');
        stdout += rendered + '\n';
        recordTrace(b.line, `Afficher: ${rendered}`, env, rendered);
        continue;
      }

      if (b.type === 'if' && b.branches) {
        for (const br of b.branches) {
          if (br.cond === null) {
            recordTrace(br.line, `Sinon`, env);
            const res = executeBlocks(br.body, env);
            if (res.returned) return res;
            break;
          } else {
            const condVal = Boolean(evalExpression(br.cond, env, br.line));
            recordTrace(br.line, `Test (${br.cond}) -> ${condVal ? 'Vrai' : 'Faux'}`, env);
            if (condVal) {
              const res = executeBlocks(br.body, env);
              if (res.returned) return res;
              break;
            }
          }
        }
        continue;
      }

      if (b.type === 'switch' && b.switchExpr && b.cases) {
        const swVal = evalExpression(b.switchExpr, env, b.line);
        let matched = false;
        for (const c of b.cases) {
          for (const vExpr of c.values) {
            const cVal = evalExpression(vExpr, env, c.line);
            if (swVal === cVal) {
              matched = true;
              recordTrace(c.line, `Cas ${formatVal(cVal)} retenu`, env);
              const res = executeBlocks(c.body, env);
              if (res.returned) return res;
              break;
            }
          }
          if (matched) break;
        }
        if (!matched && b.defaultBody) {
          recordTrace(b.line, `Cas Autrement retenu`, env);
          const res = executeBlocks(b.defaultBody, env);
          if (res.returned) return res;
        }
        continue;
      }

      if (
        b.type === 'for' &&
        b.iterator &&
        b.startExpr !== undefined &&
        b.endExpr !== undefined &&
        b.body
      ) {
        const startVal = Number(evalExpression(b.startExpr, env, b.line));
        const endVal = Number(evalExpression(b.endExpr, env, b.line));
        const stepVal = Number(evalExpression(b.stepExpr ?? '1', env, b.line));
        if (stepVal === 0) {
          throw new Error(`Ligne ${b.line} : Le pas d'une boucle Pour ne peut pas être 0.`);
        }
        setVar(env, b.iterator, startVal);
        while (
          stepVal > 0
            ? Number(evalExpression(b.iterator, env, b.line)) <= endVal
            : Number(evalExpression(b.iterator, env, b.line)) >= endVal
        ) {
          const curIter = Number(evalExpression(b.iterator, env, b.line));
          recordTrace(b.line, `Pour ${b.iterator} = ${curIter}`, env);
          const res = executeBlocks(b.body, env);
          if (res.returned) return res;
          const nextIter = Number(evalExpression(b.iterator, env, b.line)) + stepVal;
          setVar(env, b.iterator, nextIter);
        }
        continue;
      }

      if (b.type === 'while' && b.cond && b.body) {
        while (true) {
          stepCounter++;
          if (stepCounter > maxSteps) {
            terminatedByTimeout = true;
            throw new Error(
              `Boucle infinie détectée à la ligne ${b.line} (TantQue ${b.cond}). Vérifiez que les variables de la condition évoluent dans la boucle.`
            );
          }
          const condVal = Boolean(evalExpression(b.cond, env, b.line));
          recordTrace(b.line, `TantQue (${b.cond}) -> ${condVal ? 'Vrai' : 'Faux'}`, env);
          if (!condVal) break;
          const res = executeBlocks(b.body, env);
          if (res.returned) return res;
        }
        continue;
      }

      if (b.type === 'repeat' && b.cond && b.body) {
        while (true) {
          stepCounter++;
          if (stepCounter > maxSteps) {
            terminatedByTimeout = true;
            throw new Error(`Boucle infinie détectée dans Répéter ... Jusqu'à (ligne ${b.line}).`);
          }
          const res = executeBlocks(b.body, env);
          if (res.returned) return res;
          const condVal = Boolean(evalExpression(b.cond, env, b.line));
          recordTrace(b.line, `Jusqu'à (${b.cond}) -> ${condVal ? 'Vrai' : 'Faux'}`, env);
          if (condVal) break;
        }
        continue;
      }

      if (b.type === 'call' && b.funcName && b.args) {
        const evaledArgs = b.args.map((a) => evalExpression(a, env, b.line));
        invokeFunction(b.funcName, evaledArgs, b.args, env, b.line);
        continue;
      }

      if (b.type === 'return' && b.expr !== undefined) {
        const val = evalExpression(b.expr, env, b.line);
        recordTrace(b.line, `Retourner ${formatVal(val)}`, env);
        return { returned: true, value: val };
      }
    }
    return { returned: false, value: 0 };
  }

  const globalEnv = new Map<string, AlgoValue>();
  try {
    executeBlocks(parsedMain.blocks, globalEnv);
    return {
      compileSuccess: true,
      executionSuccess: true,
      exitCode: 0,
      stdout,
      stderr: '',
      diagnostics,
      executionTimeMs: performance.now() - startTime,
      instructionsExecuted: stepCounter,
      terminatedByTimeout: false,
      traceSteps,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    diagnostics.push({
      line: 1,
      column: 1,
      severity: 'error',
      category: 'execution',
      code: terminatedByTimeout ? 'ALGO-TIMEOUT' : 'ALGO-RUNTIME',
      gccMessage: msg,
      pedagogicalTitle: terminatedByTimeout
        ? 'Arrêt de sécurité : boucle infinie probable'
        : "Erreur d'exécution de l'algorithme",
      pedagogicalExplanation: msg,
    });
    return {
      compileSuccess: true,
      executionSuccess: false,
      exitCode: 1,
      stdout,
      stderr: msg,
      diagnostics,
      executionTimeMs: performance.now() - startTime,
      instructionsExecuted: stepCounter,
      terminatedByTimeout,
      traceSteps,
    };
  }
}

export function runPseudoCodeTestSuite(
  sourceCode: string,
  testCases: CodeTestCase[]
): { allPassed: boolean; results: TestCaseRunResult[] } {
  const results: TestCaseRunResult[] = [];
  let allPassed = true;

  for (const tc of testCases) {
    const run = compileAndRunPseudoCode(sourceCode, tc.stdin);
    const actualTrimmed = run.stdout.trim().replace(/\r\n/g, '\n');
    const expectedTrimmed = tc.expectedStdout.trim().replace(/\r\n/g, '\n');

    let passed = run.compileSuccess && run.executionSuccess && actualTrimmed === expectedTrimmed;
    let failureReason: string | undefined;

    if (!run.compileSuccess) {
      failureReason = 'Erreur de syntaxe dans le pseudo-code.';
      passed = false;
    } else if (!run.executionSuccess) {
      failureReason = run.stderr || "Erreur pendant l'exécution.";
      passed = false;
    } else if (actualTrimmed !== expectedTrimmed) {
      failureReason = `Sortie obtenue (« ${actualTrimmed || '(vide)'} ») différente de la sortie attendue (« ${expectedTrimmed} »).`;
      passed = false;
    }

    if (passed && tc.mustContainConstructs) {
      for (const req of tc.mustContainConstructs) {
        if (!sourceCode.toLowerCase().includes(req.toLowerCase())) {
          passed = false;
          failureReason = `Votre algorithme doit utiliser la structure « ${req} ».`;
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
