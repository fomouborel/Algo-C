import { CodeTestCase, CompileAndRunResult, TestCaseRunResult } from '../types/curriculum';
import { compileAndRunPseudoCode, runPseudoCodeTestSuite } from './algoEngine';
import { compileAndRunC, runCCodeTestSuite } from './c99Engine';

const WORKER_TIMEOUT_MS = 2800;

export async function executeCInSandbox(
  sourceCode: string,
  stdin: string = ''
): Promise<CompileAndRunResult> {
  if (typeof window === 'undefined' || typeof Worker === 'undefined') {
    return compileAndRunC(sourceCode, stdin);
  }

  return new Promise((resolve) => {
    let settled = false;
    let worker: Worker | null = null;

    const timer = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      if (worker) worker.terminate();
      resolve({
        compileSuccess: true,
        executionSuccess: false,
        exitCode: 124,
        stdout: '',
        stderr:
          'Temps limite dépassé (Timeout > 2.8s) : Votre programme a été interrompu automatiquement par le bac à sable de sécurité (boucle infinie probable).',
        diagnostics: [
          {
            line: 1,
            column: 1,
            severity: 'error',
            category: 'execution',
            code: 'C-SANDBOX-TIMEOUT',
            gccMessage: 'Execution timed out (terminated by sandbox watchdog)',
            pedagogicalTitle: 'Arrêt de sécurité : Boucle infinie détectée',
            pedagogicalExplanation:
              "Votre programme ne s'est pas terminé dans le délai imparti (2,8 secondes). Vérifiez vos boucles 'while', 'for' ou 'do...while' ainsi que vos appels récursifs.",
          },
        ],
        executionTimeMs: WORKER_TIMEOUT_MS,
        instructionsExecuted: 250000,
        terminatedByTimeout: true,
      });
    }, WORKER_TIMEOUT_MS);

    try {
      worker = new Worker(new URL('./compilerWorker.ts', import.meta.url), {
        type: 'module',
      });
      const reqId = `req_${Date.now()}_${Math.random()}`;
      worker.onmessage = (e) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timer);
        worker?.terminate();
        if (e.data && e.data.ok) {
          resolve(e.data.result as CompileAndRunResult);
        } else {
          resolve(compileAndRunC(sourceCode, stdin));
        }
      };
      worker.onerror = () => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timer);
        worker?.terminate();
        resolve(compileAndRunC(sourceCode, stdin));
      };
      worker.postMessage({
        id: reqId,
        action: 'run_c',
        sourceCode,
        stdin,
      });
    } catch {
      window.clearTimeout(timer);
      resolve(compileAndRunC(sourceCode, stdin));
    }
  });
}

export async function executeCTestsInSandbox(
  sourceCode: string,
  testCases: CodeTestCase[]
): Promise<{ allPassed: boolean; results: TestCaseRunResult[] }> {
  if (typeof window === 'undefined' || typeof Worker === 'undefined') {
    return runCCodeTestSuite(sourceCode, testCases);
  }
  return runCCodeTestSuite(sourceCode, testCases);
}

export async function executePseudoInSandbox(
  sourceCode: string,
  stdin: string = ''
): Promise<CompileAndRunResult> {
  return compileAndRunPseudoCode(sourceCode, stdin);
}

export async function executePseudoTestsInSandbox(
  sourceCode: string,
  testCases: CodeTestCase[]
): Promise<{ allPassed: boolean; results: TestCaseRunResult[] }> {
  return runPseudoCodeTestSuite(sourceCode, testCases);
}
