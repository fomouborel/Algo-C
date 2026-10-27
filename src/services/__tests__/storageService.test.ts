import { describe, expect, it } from 'vitest';
import { getChapterById } from '../../data/curriculumIndex';
import {
  createInitialProgressState,
  evaluateChapterValidation,
  exportProgressToJson,
  markChapterConsulted,
  recordExerciseSubmission,
  recordLessonQuizSubmission,
  unlockExerciseHint,
  validateAndImportProgressJson,
} from '../storageService';

describe('Local Persistence, Progression Rules & JSON Export/Import', () => {
  it('ne valide pas un chapitre simplement consulté sans quiz ni exercices réussis', () => {
    const chA01 = getChapterById('A01')!;
    let state = createInitialProgressState();
    state = markChapterConsulted(state, 'A01');

    expect(state.chapters['A01']?.consulted).toBe(true);
    expect(evaluateChapterValidation(state, chA01)).toBe(false);
    expect(state.chapters['A01']?.validated).toBe(false);
  });

  it('valide un chapitre uniquement lorsque le quiz de leçon ET les exercices requis sont réussis', () => {
    const chA01 = getChapterById('A01')!;
    let state = createInitialProgressState();

    // 1. Submit correct answers for all comprehension questions
    const correctAnswers: Record<string, number> = {};
    for (const q of chA01.lesson.comprehensionQuestions) {
      correctAnswers[q.id] = q.correctIndex;
    }
    const quizRes = recordLessonQuizSubmission(state, chA01, correctAnswers);
    expect(quizRes.allCorrect).toBe(true);
    state = quizRes.nextState;
    expect(state.chapters['A01']?.lessonCompleted).toBe(true);
    // Still not validated because exercises are not passed yet
    expect(state.chapters['A01']?.validated).toBe(false);

    // 2. Pass all exercises in A01
    for (const ex of chA01.exercises) {
      state = recordExerciseSubmission(state, chA01, ex, {
        passed: true,
        savedCode: ex.referenceSolution,
      });
    }

    expect(evaluateChapterValidation(state, chA01)).toBe(true);
    expect(state.chapters['A01']?.validated).toBe(true);
  });

  it('débloque progressivement les 3 indices sans dépasser 3', () => {
    let state = createInitialProgressState();
    state = unlockExerciseHint(state, 'B01_E1');
    expect(state.exercises['B01_E1']?.hintsUnlocked).toBe(1);
    state = unlockExerciseHint(state, 'B01_E1');
    state = unlockExerciseHint(state, 'B01_E1');
    state = unlockExerciseHint(state, 'B01_E1');
    expect(state.exercises['B01_E1']?.hintsUnlocked).toBe(3);
  });

  it('exporte et réimporte fidèlement une sauvegarde JSON complète et rejette un JSON corrompu', () => {
    const chB01 = getChapterById('B01')!;
    let state = createInitialProgressState();
    state = recordExerciseSubmission(state, chB01, chB01.exercises[0], {
      passed: true,
      savedOptionIndex: 1,
    });

    const exportedJson = exportProgressToJson(state);
    const importRes = validateAndImportProgressJson(exportedJson);
    expect(importRes.valid).toBe(true);
    expect(importRes.state?.exercises[chB01.exercises[0].id]?.passed).toBe(true);

    // Invalid JSON syntax
    const badSyntax = validateAndImportProgressJson('{corrupted_json');
    expect(badSyntax.valid).toBe(false);

    // Unsupported schemaVersion
    const wrongVersion = validateAndImportProgressJson(
      JSON.stringify({ schemaVersion: 99, chapters: {}, exercises: {} })
    );
    expect(wrongVersion.valid).toBe(false);
  });
});
