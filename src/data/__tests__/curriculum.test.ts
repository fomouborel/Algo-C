import { describe, it, expect } from 'vitest';
import {
  ALGO_CHAPTERS,
  C_CHAPTERS,
  PROJET_CHAPTERS,
  ALL_CHAPTERS,
  LAB_TEMPLATES,
  getBridgePairs,
} from '../curriculumIndex';
import { runPseudoCodeTestSuite, compileAndRunPseudoCode } from '../../engines/algoEngine';
import { runCCodeTestSuite, compileAndRunC } from '../../engines/c99Engine';

describe('Validation intégrale du programme pédagogique (A01-A16, B01-B16 et C01-C10)', () => {
  it('contient 16 chapitres Algorithmique (A01..A16), 16 chapitres C (B01..B16) et 10 chapitres Projet (C01..C10)', () => {
    expect(ALGO_CHAPTERS.length).toBe(16);
    expect(C_CHAPTERS.length).toBe(16);
    expect(PROJET_CHAPTERS.length).toBe(10);
    expect(ALL_CHAPTERS.length).toBe(42);

    for (let i = 1; i <= 10; i++) {
      expect(PROJET_CHAPTERS[i - 1].id).toBe(`C${String(i).padStart(2, '0')}`);
    }

    for (let i = 1; i <= 16; i++) {
      const aId = `A${String(i).padStart(2, '0')}`;
      const bId = `B${String(i).padStart(2, '0')}`;
      expect(ALGO_CHAPTERS[i - 1].id).toBe(aId);
      expect(C_CHAPTERS[i - 1].id).toBe(bId);
    }
  });

  it('chaque chapitre possède une leçon complète, du vocabulaire FR/EN, 2 exemples, des erreurs classiques et des exercices', () => {
    for (const ch of ALL_CHAPTERS) {
      expect(ch.lesson.objectives.length).toBeGreaterThanOrEqual(2);
      expect(ch.lesson.intuition.length).toBeGreaterThan(30);
      expect(ch.lesson.formalDefinition.length).toBeGreaterThan(30);
      expect(ch.lesson.analogy.content.length).toBeGreaterThan(20);
      expect(ch.lesson.vocabulary.length).toBeGreaterThanOrEqual(2);
      expect(ch.lesson.simpleExample.code.length).toBeGreaterThan(15);
      expect(ch.lesson.intermediateExample.code.length).toBeGreaterThan(15);
      expect(ch.lesson.commonMistakes.length).toBeGreaterThanOrEqual(1);
      expect(ch.lesson.comprehensionQuestions.length).toBeGreaterThanOrEqual(1);
      expect(ch.exercises.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('toutes les solutions de référence (referenceSolution) des exercices programmatiques passent 100% de leurs cas de test', () => {
    for (const ch of ALL_CHAPTERS) {
      for (const ex of ch.exercises) {
        if (ex.referenceSolution && ex.testCases && ex.testCases.length > 0) {
          const isAlgo = ch.trackId === 'algo';
          const result = isAlgo
            ? runPseudoCodeTestSuite(ex.referenceSolution, ex.testCases)
            : runCCodeTestSuite(ex.referenceSolution, ex.testCases);

          if (!result.allPassed) {
            throw new Error(
              `Échec sur l'exercice ${ex.id} (${ex.title}) : ` +
                JSON.stringify(result.results, null, 2)
            );
          }
          expect(result.allPassed).toBe(true);
        }
      }
    }
  });

  it('tous les modèles du Laboratoire (LAB_TEMPLATES) compilent et s’exécutent sans erreur', () => {
    for (const tpl of LAB_TEMPLATES) {
      const res =
        tpl.language === 'c'
          ? compileAndRunC(tpl.code, tpl.stdin)
          : compileAndRunPseudoCode(tpl.code, tpl.stdin);
      expect(res.compileSuccess).toBe(true);
      expect(res.executionSuccess).toBe(true);
      expect(res.stdout.trim().length).toBeGreaterThan(0);
    }
  });

  it('les passerelles Algo -> C relient des chapitres et exercices existants', () => {
    const pairs = getBridgePairs();
    expect(pairs.length).toBeGreaterThanOrEqual(6);
    for (const p of pairs) {
      expect(p.algoChapter).toBeDefined();
      expect(p.cChapter).toBeDefined();
    }
  });
});
