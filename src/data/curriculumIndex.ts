import {
  AnnotatedExample,
  Chapter,
  CommonMistake,
  Exercise,
  TrackId,
  VocabularyEntry,
} from '../types/curriculum';
import { ALGO_CHAPTERS_PART1 } from './algoChaptersPart1';
import { ALGO_CHAPTERS_PART2 } from './algoChaptersPart2';
import { C_CHAPTERS_PART1 } from './cChaptersPart1';
import { C_CHAPTERS_PART2 } from './cChaptersPart2';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeExample(rawEx: any, defaultTrack: TrackId): AnnotatedExample {
  const lang: 'pseudo' | 'c' =
    rawEx.language === 'c' || defaultTrack === 'c' ? 'c' : 'pseudo';
  const lineExplanations = Array.isArray(rawEx.lineExplanations)
    ? rawEx.lineExplanations
    : Array.isArray(rawEx.lineByLine)
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rawEx.lineByLine.map((lb: any, idx: number) => ({
        lineNumber: idx + 1,
        code: lb.line ?? '',
        explanation: lb.explanation ?? '',
      }))
    : [];

  return {
    title: rawEx.title ?? '',
    description: rawEx.description ?? '',
    language: lang,
    code: rawEx.code ?? '',
    stdin: rawEx.stdin,
    expectedOutput: rawEx.expectedOutput ?? '',
    lineExplanations,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeChapter(raw: any): Chapter {
  const trackId: TrackId = raw.trackId;
  const vocabulary: VocabularyEntry[] = (raw.lesson.vocabulary ?? []).map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => ({
      fr: v.fr ?? v.french ?? '',
      en: v.en ?? v.english ?? '',
      definition: v.definition ?? '',
    })
  );

  const commonMistakes: CommonMistake[] = (raw.lesson.commonMistakes ?? []).map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (cm: any) => {
      if (cm.title) return cm as CommonMistake;
      return {
        title: cm.mistake ?? 'Erreur fréquente',
        wrongCode: cm.wrongCode ?? '',
        rightCode: cm.rightCode ?? '',
        explanation: `${cm.whyItHappens ?? ''} — Correction : ${cm.howToFix ?? ''}`,
        errorType: 'logique',
      };
    }
  );

  const summary: string[] = Array.isArray(raw.lesson.summary)
    ? raw.lesson.summary
    : [String(raw.lesson.summary ?? '')];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const exercises: Exercise[] = (raw.exercises ?? []).map((ex: any) => {
    const options: string[] | undefined = ex.options ?? ex.choices;
    const correctOptionIndex: number | undefined =
      typeof ex.correctOptionIndex === 'number'
        ? ex.correctOptionIndex
        : options && typeof ex.expectedAnswer === 'string'
        ? Math.max(0, options.indexOf(ex.expectedAnswer))
        : undefined;

    const rawHints: string[] = Array.isArray(ex.hints) ? ex.hints : [];
    const hints: [string, string, string] = [
      rawHints[0] ?? 'Relisez attentivement les objectifs et exemples de la leçon.',
      rawHints[1] ?? rawHints[0] ?? 'Vérifiez les types et les cas limites.',
      rawHints[2] ?? ex.explanation ?? ex.detailedExplanation ?? 'Consultez la correction détaillée.',
    ];

    const testCases = Array.isArray(ex.testCases)
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ex.testCases.map((tc: any) => ({
          id: tc.id,
          label: tc.label,
          category: tc.category ?? (tc.isHidden ? 'limite' : 'normal'),
          stdin: tc.stdin ?? '',
          expectedStdout: tc.expectedStdout ?? '',
          expectedExitCode: tc.expectedExitCode,
          mustContainConstructs: tc.mustContainConstructs,
          forbiddenConstructs: tc.forbiddenConstructs,
          explanation: tc.explanation ?? tc.label ?? '',
        }))
      : undefined;

    return {
      id: ex.id,
      chapterId: ex.chapterId ?? raw.id,
      trackId: ex.trackId ?? trackId,
      title: ex.title,
      difficulty: ex.difficulty ?? 'debutant',
      category: ex.category,
      testedSkill: ex.testedSkill ?? ex.title,
      prerequisites: ex.prerequisites ?? raw.prerequisites ?? [],
      statement: ex.statement ?? ex.prompt ?? '',
      isCoreValidationExercise: ex.isCoreValidationExercise ?? true,
      bridgeTargetChapterId: ex.bridgeTargetChapterId ?? ex.bridgeTargetExerciseId,
      options,
      correctOptionIndex,
      errorClassificationTarget: ex.errorClassificationTarget,
      codeSnippet: ex.codeSnippet,
      codeLanguage: ex.codeLanguage ?? (trackId === 'algo' ? 'pseudo' : 'c'),
      stdinForPrediction: ex.stdinForPrediction,
      expectedOutputAnswer: ex.expectedOutputAnswer ?? ex.expectedAnswer,
      ignoreWhitespaceInPrediction: ex.ignoreWhitespaceInPrediction ?? true,
      traceSpec: ex.traceSpec,
      scrambledLines: ex.scrambledLines,
      correctOrderIndices:
        ex.correctOrderIndices ??
        (Array.isArray(ex.scrambledLines)
          ? ex.scrambledLines.map((_: unknown, idx: number) => idx)
          : undefined),
      templateWithGaps: ex.templateWithGaps,
      gaps: ex.gaps,
      starterCode: ex.starterCode,
      referenceSolution: ex.referenceSolution,
      testCases,
      bridgePseudoStarter: ex.bridgePseudoStarter,
      bridgePseudoSolution: ex.bridgePseudoSolution,
      hints,
      detailedExplanation: ex.detailedExplanation ?? ex.explanation ?? '',
    };
  });

  return {
    id: raw.id,
    trackId,
    number: raw.number ?? raw.order ?? 1,
    title: raw.title,
    subtitle: raw.subtitle,
    estimatedMinutes: raw.estimatedMinutes ?? 45,
    prerequisites: raw.prerequisites ?? [],
    relatedChapters: raw.relatedChapters ?? raw.bridgeChapterIds ?? [],
    coreConcepts: raw.coreConcepts ?? raw.tags ?? [],
    successCriteria:
      raw.successCriteria ?? raw.objectives ?? raw.lesson?.objectives ?? [],
    lesson: {
      objectives: raw.lesson.objectives ?? raw.objectives ?? [],
      intuition: raw.lesson.intuition ?? raw.lesson.intuitiveExplanation ?? '',
      formalDefinition: raw.lesson.formalDefinition ?? '',
      analogy:
        typeof raw.lesson.analogy === 'string'
          ? { title: 'Analogie concrète', content: raw.lesson.analogy }
          : raw.lesson.analogy,
      vocabulary,
      simpleExample: normalizeExample(raw.lesson.simpleExample, trackId),
      intermediateExample: normalizeExample(raw.lesson.intermediateExample, trackId),
      commonMistakes,
      summary,
      comprehensionQuestions: raw.lesson.comprehensionQuestions ?? [],
    },
    exercises,
  };
}

export const ALGO_CHAPTERS: Chapter[] = [
  ...ALGO_CHAPTERS_PART1.map(normalizeChapter),
  ...ALGO_CHAPTERS_PART2.map(normalizeChapter),
];

export const C_CHAPTERS: Chapter[] = [
  ...C_CHAPTERS_PART1.map(normalizeChapter),
  ...C_CHAPTERS_PART2.map(normalizeChapter),
];

export const ALL_CHAPTERS: Chapter[] = [
  ...ALGO_CHAPTERS,
  ...C_CHAPTERS,
];

export function getChaptersByTrack(trackId: TrackId): Chapter[] {
  return trackId === 'algo' ? ALGO_CHAPTERS : C_CHAPTERS;
}

export function getChapterById(chapterId: string): Chapter | undefined {
  return ALL_CHAPTERS.find((ch) => ch.id === chapterId);
}

export function getExerciseById(exerciseId: string): { chapter: Chapter; exercise: Exercise } | undefined {
  for (const chapter of ALL_CHAPTERS) {
    const exercise = chapter.exercises.find((ex) => ex.id === exerciseId);
    if (exercise) {
      return { chapter, exercise };
    }
  }
  return undefined;
}

export interface BridgePair {
  id: string;
  title: string;
  description: string;
  algoChapter: Chapter;
  cChapter: Chapter;
  algoExercise?: Exercise;
  cExercise?: Exercise;
}

export function getBridgePairs(): BridgePair[] {
  const pairs: BridgePair[] = [
    {
      id: 'bridge-1',
      title: 'Passerelle 1 : Variables, Types & Calculs (DIV/MOD -> int/double/%)',
      description: 'Passer du modèle logique des boîtes typées et de la division euclidienne au typage C99 et aux casts explicites (double).',
      algoChapter: getChapterById('A03')!,
      cChapter: getChapterById('B04')!,
      algoExercise: getExerciseById('A03_E3')?.exercise,
      cExercise: getExerciseById('B04_E2')?.exercise,
    },
    {
      id: 'bridge-2',
      title: 'Passerelle 2 : Entrées / Sorties (LIRE/AFFICHER -> scanf/printf & adresse)',
      description: 'Comprendre comment LIRE(x) se traduit en C par scanf("%d", &x) en transmettant l’adresse mémoire de la variable.',
      algoChapter: getChapterById('A04')!,
      cChapter: getChapterById('B05')!,
      algoExercise: getExerciseById('A04_E2')?.exercise,
      cExercise: getExerciseById('B05_E2')?.exercise,
    },
    {
      id: 'bridge-3',
      title: 'Passerelle 3 : Conditions & Boucles (SI/POUR/TANT QUE -> if/for/while)',
      description: 'Traduire les structures de contrôle algorithmiques en C tout en évitant le piège if (a = b).',
      algoChapter: getChapterById('A07')!,
      cChapter: getChapterById('B07')!,
      algoExercise: getExerciseById('A07_E3')?.exercise,
      cExercise: getExerciseById('B07_E2')?.exercise,
    },
    {
      id: 'bridge-4',
      title: 'Passerelle 4 : Fonctions, Récursivité & Pile d’appels',
      description: 'Observer comment les fonctions et l’algorithme d’Euclide récursif s’exécutent sur la pile d’appels (Stack Frames).',
      algoChapter: getChapterById('A09')!,
      cChapter: getChapterById('B08')!,
      algoExercise: getExerciseById('A09_E2')?.exercise,
      cExercise: getExerciseById('B08_E2')?.exercise,
    },
    {
      id: 'bridge-5',
      title: 'Passerelle 5 : Tableaux, Pointeurs & Adresses Mémoire',
      description: 'Relier le parcours de tableaux [0..N-1] à la contiguïté mémoire, aux pointeurs (* / &) et à l’allocation dynamique (malloc/free).',
      algoChapter: getChapterById('A11')!,
      cChapter: getChapterById('B12')!,
      algoExercise: getExerciseById('A11_E2')?.exercise,
      cExercise: getExerciseById('B12_E2')?.exercise,
    },
    {
      id: 'bridge-6',
      title: 'Passerelle 6 : Synthèse Complète (Nombres premiers & Statistiques)',
      description: 'Du pseudo-code complet validé à l’implémentation C99 modulaire avec pointeurs et jeux de tests.',
      algoChapter: getChapterById('A16')!,
      cChapter: getChapterById('B16')!,
      algoExercise: getExerciseById('A16_E1')?.exercise,
      cExercise: getExerciseById('B16_E1')?.exercise,
    },
  ];
  return pairs;
}

export interface LabTemplate {
  id: string;
  label: string;
  language: 'c' | 'pseudocode';
  description: string;
  code: string;
  stdin: string;
}

export const LAB_TEMPLATES: LabTemplate[] = [
  {
    id: 'c-pointers-heap',
    label: 'C99 — Pointeurs, Pile (Stack) & Tas (malloc/free)',
    language: 'c',
    description: 'Observez dans l’inspecteur mémoire les adresses hexadécimales, les pointeurs et les blocs alloués sur le Tas.',
    stdin: '',
    code: `#include <stdio.h>
#include <stdlib.h>

void permuter(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main(void) {
    int x = 15;
    int y = 42;
    int *ptrX = &x;

    permuter(&x, &y);
    printf("Apres permutation : x = %d, y = %d (via *ptrX = %d)\\n", x, y, *ptrX);

    int *tableauTas = malloc(3 * sizeof(int));
    tableauTas[0] = 100;
    tableauTas[1] = 200;
    tableauTas[2] = x + y;
    printf("Tas : [%d, %d, %d]\\n", tableauTas[0], tableauTas[1], tableauTas[2]);

    free(tableauTas);
    return 0;
}`,
  },
  {
    id: 'c-structs-arrays',
    label: 'C99 — Structures, Tableaux & Recherche du Major',
    language: 'c',
    description: 'Définition d’une structure Etudiant et recherche de la meilleure note.',
    stdin: '',
    code: `#include <stdio.h>

typedef struct {
    int numero;
    int note;
} Etudiant;

int main(void) {
    Etudiant promo[3] = {{101, 12}, {102, 18}, {103, 15}};
    int meilleurIndice = 0;

    for (int i = 1; i < 3; i++) {
        if (promo[i].note > promo[meilleurIndice].note) {
            meilleurIndice = i;
        }
    }

    printf("Major : Etudiant #%d avec %d/20\\n",
           promo[meilleurIndice].numero,
           promo[meilleurIndice].note);
    return 0;
}`,
  },
  {
    id: 'algo-binary-search',
    label: 'Pseudo-code — Recherche Dichotomique & Table de Trace',
    language: 'pseudocode',
    description: 'Exécutez cet algorithme et observez l’évolution pas à pas de gauche, droite et milieu dans la table de trace.',
    stdin: '35\n',
    code: `ALGORITHME DichotomieLabo
VARIABLES
    tab : TABLEAU[7] DE ENTIER
    gauche, droite, milieu, cible, pos : ENTIER
DEBUT
    tab[0] <- 5
    tab[1] <- 12
    tab[2] <- 19
    tab[3] <- 24
    tab[4] <- 35
    tab[5] <- 48
    tab[6] <- 60
    LIRE(cible)
    gauche <- 0
    droite <- 6
    pos <- -1
    TANT QUE gauche <= droite ET pos == -1 FAIRE
        milieu <- (gauche + droite) DIV 2
        SI tab[milieu] == cible ALORS
            pos <- milieu
        SINON
            SI tab[milieu] < cible ALORS
                gauche <- milieu + 1
            SINON
                droite <- milieu - 1
            FINSI
        FINSI
    FINTANTQUE
    AFFICHER("Indice trouve =", pos)
FIN`,
  },
  {
    id: 'algo-euclide-recursif',
    label: 'Pseudo-code — Récursivité (PGCD d’Euclide)',
    language: 'pseudocode',
    description: 'Calcul récursif du Plus Grand Commun Diviseur de deux entiers lus en entrée.',
    stdin: '84\n36\n',
    code: `FONCTION pgcd(a : ENTIER, b : ENTIER) : ENTIER
DEBUT
    SI b == 0 ALORS
        RETOURNER a
    SINON
        RETOURNER pgcd(b, a MOD b)
    FINSI
FINFONCTION

ALGORITHME TestEuclide
VARIABLES
    x, y : ENTIER
DEBUT
    LIRE(x)
    LIRE(y)
    AFFICHER("PGCD =", pgcd(x, y))
FIN`,
  },
];
