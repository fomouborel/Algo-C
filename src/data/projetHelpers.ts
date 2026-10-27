import { AnnotatedExample, LineExplanation } from '../types/curriculum';

/**
 * Builds the line-by-line explanations of an example by locating each snippet
 * in the code (in order), so that line numbers always match the displayed code.
 */
export function annotate(code: string, notes: [string, string][]): LineExplanation[] {
  const lines = code.split('\n');
  let from = 0;
  return notes.map(([snippet, explanation]) => {
    const idx = lines.findIndex((l, i) => i >= from && l.includes(snippet));
    if (idx < 0) {
      throw new Error(`Annotation introuvable dans l'exemple : « ${snippet} »`);
    }
    from = idx + 1;
    return { lineNumber: idx + 1, code: lines[idx].trim(), explanation };
  });
}

export function cExample(
  title: string,
  description: string,
  code: string,
  expectedOutput: string,
  notes: [string, string][],
  stdin?: string
): AnnotatedExample {
  return {
    title,
    description,
    language: 'c',
    code,
    stdin,
    expectedOutput,
    lineExplanations: annotate(code, notes),
  };
}
