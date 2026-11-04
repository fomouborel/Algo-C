import { describe, it, expect } from 'vitest';
import { DEFI_CHAPTERS, PROJET_CHAPTERS } from '../curriculumIndex';
import { compileAndRunC, runCCodeTestSuite } from '../../engines/c99Engine';

const TRACKS = [
  { nom: 'Parcours C — concepts du projet ShopFlow', trackId: 'projet', chapitres: PROJET_CHAPTERS },
  { nom: 'Parcours D — défis d’approfondissement ShopFlow', trackId: 'defi', chapitres: DEFI_CHAPTERS },
];

describe.each(TRACKS)('$nom', ({ trackId, chapitres }) => {
  it('chaque exemple de leçon compile, s’exécute sans fuite et produit la sortie annoncée', () => {
    for (const ch of chapitres) {
      for (const ex of [ch.lesson.simpleExample, ch.lesson.intermediateExample]) {
        const res = compileAndRunC(ex.code, ex.stdin ?? '');
        const label = `${ch.id} — ${ex.title}`;
        expect(res.compileSuccess, `${label} : ${res.stderr}`).toBe(true);
        expect(res.executionSuccess, `${label} : ${res.stderr}`).toBe(true);
        expect(res.diagnostics.filter((d) => d.severity !== 'info').map((d) => d.code), label).toEqual([]);
        expect(res.stdout.trim(), label).toBe(ex.expectedOutput.trim());
      }
    }
  });

  it('chaque solution de référence passe ses tests et le code de départ ne les passe pas tous', () => {
    for (const ch of chapitres) {
      for (const ex of ch.exercises) {
        if (!ex.referenceSolution || !ex.testCases) continue;
        const ref = runCCodeTestSuite(ex.referenceSolution, ex.testCases);
        const failures = ref.results.filter((r) => !r.passed).map((r) => `${r.testCase.id}: ${r.failureReason} | ${r.actualStdout} ${r.actualStderr}`);
        expect(failures, `${ex.id}`).toEqual([]);
        const refRun = compileAndRunC(ex.referenceSolution, ex.testCases[0].stdin);
        expect(refRun.diagnostics.filter((d) => d.severity === 'warning').map((d) => d.code), `${ex.id} avertissements`).toEqual([]);
        if (ex.starterCode) {
          expect(runCCodeTestSuite(ex.starterCode, ex.testCases).allPassed, `${ex.id} starter`).toBe(false);
        }
      }
    }
  });

  it('les exercices de prédiction annoncent la sortie réelle du programme', () => {
    for (const ch of chapitres) {
      for (const ex of ch.exercises) {
        if (ex.category !== 'prediction' || !ex.codeSnippet) continue;
        const res = compileAndRunC(ex.codeSnippet, ex.stdinForPrediction ?? '');
        expect(res.stdout.trim(), ex.id).toBe((ex.expectedOutputAnswer ?? '').trim());
      }
    }
  });

  it('les QCM, ordonnancements, traces et complétions sont cohérents', () => {
    const ids = new Set<string>();
    for (const ch of chapitres) {
      expect(ch.trackId).toBe(trackId);
      expect(ch.exercises.length).toBeGreaterThanOrEqual(3);
      for (const q of ch.lesson.comprehensionQuestions) {
        expect(q.correctIndex).toBeLessThan(q.options.length);
      }
      for (const ex of ch.exercises) {
        expect(ids.has(ex.id), ex.id).toBe(false);
        ids.add(ex.id);
        expect(ex.hints.length).toBe(3);
        if (ex.options) expect(ex.correctOptionIndex!).toBeLessThan(ex.options.length);
        if (ex.scrambledLines) {
          expect([...ex.correctOrderIndices!].sort((a, b) => a - b)).toEqual(ex.scrambledLines.map((_, i) => i));
          expect(ex.correctOrderIndices).not.toEqual(ex.scrambledLines.map((_, i) => i));
        }
        if (ex.traceSpec) {
          for (const key of Object.keys(ex.traceSpec.expectedAnswers)) {
            const [row, col] = [Number(key.split(':')[0]), key.slice(key.indexOf(':') + 1)];
            expect(ex.traceSpec.prefilledRows[row]?.[col], `${ex.id} ${key}`).toBe('?');
          }
        }
        if (ex.templateWithGaps && ex.gaps) {
          for (const g of ex.gaps) expect(ex.templateWithGaps).toContain(`{{${g.id}}}`);
        }
      }
    }
  });
});

describe('Parcours D — niveau approfondi', () => {
  it('chaque chapitre a une explication approfondie et des exercices liés au projet et guidés', () => {
    expect(DEFI_CHAPTERS.map((c) => c.id)).toEqual(['D01', 'D02', 'D03', 'D04']);
    for (const ch of DEFI_CHAPTERS) {
      expect(ch.lesson.deepDive?.length ?? 0).toBeGreaterThanOrEqual(5);
      expect(ch.exercises.length).toBeGreaterThanOrEqual(6);
      expect(ch.exercises.filter((e) => e.projectLink).length).toBeGreaterThanOrEqual(4);
      const codeExercises = ch.exercises.filter((e) => e.referenceSolution);
      expect(codeExercises.length).toBeGreaterThanOrEqual(2);
      for (const ex of codeExercises) expect(ex.guidedSteps?.length ?? 0, ex.id).toBeGreaterThanOrEqual(3);
    }
  });
});
