import { compileAndRunPseudoCode, runPseudoCodeTestSuite } from './algoEngine';
import { compileAndRunC, runCCodeTestSuite } from './c99Engine';
import { CodeTestCase } from '../types/curriculum';

export interface WorkerRequestMessage {
  id: string;
  action: 'run_c' | 'test_c' | 'run_pseudo' | 'test_pseudo';
  sourceCode: string;
  stdin?: string;
  testCases?: CodeTestCase[];
}

self.onmessage = (event: MessageEvent<WorkerRequestMessage>) => {
  const req = event.data;
  try {
    if (req.action === 'run_c') {
      const result = compileAndRunC(req.sourceCode, req.stdin ?? '');
      self.postMessage({ id: req.id, ok: true, result });
    } else if (req.action === 'test_c') {
      const result = runCCodeTestSuite(req.sourceCode, req.testCases ?? []);
      self.postMessage({ id: req.id, ok: true, result });
    } else if (req.action === 'run_pseudo') {
      const result = compileAndRunPseudoCode(req.sourceCode, req.stdin ?? '');
      self.postMessage({ id: req.id, ok: true, result });
    } else if (req.action === 'test_pseudo') {
      const result = runPseudoCodeTestSuite(req.sourceCode, req.testCases ?? []);
      self.postMessage({ id: req.id, ok: true, result });
    }
  } catch (err) {
    self.postMessage({
      id: req.id,
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }
};
