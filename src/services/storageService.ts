import {
  Chapter,
  ChapterProgressState,
  ErrorClassification,
  Exercise,
  ExerciseProgressState,
  LabSnippet,
  LastLocationState,
  StudentProgressState,
  UserPreferences,
} from '../types/curriculum';

const LOCAL_STORAGE_STATE_KEY = 'algo_c_student_state_v1';
const LOCAL_STORAGE_PREFS_KEY = 'algo_c_user_prefs_v1';
const IDB_NAME = 'AlgoCPlatformDB';
const IDB_VERSION = 1;
const IDB_STORE = 'student_progression';
const IDB_KEY = 'current_student';

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'light',
  editorFontSize: 'md',
  showCompilerWarnings: true,
  showMemoryInspectorByDefault: true,
};

export const DEFAULT_LAB_SNIPPETS: LabSnippet[] = [
  {
    id: 'lab-default-c-1',
    title: 'Premier programme & Pointeurs en C',
    language: 'c',
    stdin: '14\n18\n',
    updatedAt: new Date().toISOString(),
    code: `#include <stdio.h>

void echanger(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main(void) {
    int note1 = 0;
    int note2 = 0;

    if (scanf("%d %d", &note1, &note2) == 2) {
        printf("Avant echange : note1 = %d, note2 = %d\\n", note1, note2);
        echanger(&note1, &note2);
        printf("Apres echange : note1 = %d, note2 = %d\\n", note1, note2);
        double moyenne = (double)(note1 + note2) / 2.0;
        printf("Moyenne exacte : %.2f\\n", moyenne);
    }
    return 0;
}`,
  },
  {
    id: 'lab-default-pseudo-1',
    title: 'Recherche du maximum (Pseudo-code)',
    language: 'pseudo',
    stdin: '4\n12\n25\n9\n19\n',
    updatedAt: new Date().toISOString(),
    code: `Algorithme RechercheMaximum
Variables
    n, i, valeur, max : Entier
Debut
    Lire(n)
    Lire(max)
    Pour i de 2 a n Faire
        Lire(valeur)
        Si valeur > max Alors
            max <- valeur
        FinSi
    FinPour
    Afficher("Maximum :", max)
Fin`,
  },
];

export function createInitialProgressState(): StudentProgressState {
  const now = new Date().toISOString();
  return {
    schemaVersion: 1,
    createdAt: now,
    lastActivityAt: now,
    lastLocation: {
      screen: 'dashboard',
      trackId: 'algo',
      chapterId: 'A01',
    },
    preferences: { ...DEFAULT_PREFERENCES },
    chapters: {},
    exercises: {},
    labSnippets: [...DEFAULT_LAB_SNIPPETS],
  };
}

/**
 * Evaluates whether a chapter satisfies all validation requirements:
 * 1. The lesson comprehension quiz must be completed (lessonCompleted === true)
 * 2. At least 75% of the chapter's exercises must be passed
 * 3. Every exercise flagged with isCoreValidationExercise must be passed
 */
export function evaluateChapterValidation(
  state: StudentProgressState,
  chapter: Chapter
): boolean {
  const chapState = state.chapters[chapter.id];
  if (!chapState || !chapState.lessonCompleted) {
    return false;
  }
  if (chapter.exercises.length === 0) {
    return true;
  }

  let passedCount = 0;
  for (const ex of chapter.exercises) {
    const exState = state.exercises[ex.id];
    const isPassed = Boolean(exState?.passed);
    if (isPassed) {
      passedCount++;
    } else if (ex.isCoreValidationExercise) {
      return false;
    }
  }

  const requiredCount = Math.ceil(chapter.exercises.length * 0.75);
  return passedCount >= requiredCount;
}

export function markChapterConsulted(
  state: StudentProgressState,
  chapterId: string
): StudentProgressState {
  const now = new Date().toISOString();
  const existing = state.chapters[chapterId];
  const updatedChapter: ChapterProgressState = existing
    ? {
        ...existing,
        consulted: true,
        lastConsultedAt: now,
      }
    : {
        chapterId,
        consulted: true,
        firstConsultedAt: now,
        lastConsultedAt: now,
        lessonQuizAnswers: {},
        lessonCompleted: false,
        validated: false,
      };

  return {
    ...state,
    lastActivityAt: now,
    chapters: {
      ...state.chapters,
      [chapterId]: updatedChapter,
    },
  };
}

export function recordLessonQuizSubmission(
  state: StudentProgressState,
  chapter: Chapter,
  answers: Record<string, number>
): { nextState: StudentProgressState; allCorrect: boolean; score: number; total: number } {
  const now = new Date().toISOString();
  const questions = chapter.lesson.comprehensionQuestions;
  let correctCount = 0;

  for (const q of questions) {
    if (answers[q.id] === q.correctIndex) {
      correctCount++;
    }
  }

  const allCorrect = questions.length === 0 || correctCount === questions.length;
  const existing = state.chapters[chapter.id] ?? {
    chapterId: chapter.id,
    consulted: true,
    firstConsultedAt: now,
    lessonQuizAnswers: {},
    lessonCompleted: false,
    validated: false,
  };

  const lessonCompleted = existing.lessonCompleted || allCorrect;
  const tempChapterState: ChapterProgressState = {
    ...existing,
    consulted: true,
    lastConsultedAt: now,
    lessonQuizAnswers: { ...existing.lessonQuizAnswers, ...answers },
    lessonCompleted,
    lessonCompletedAt: lessonCompleted ? existing.lessonCompletedAt ?? now : undefined,
  };

  const nextState: StudentProgressState = {
    ...state,
    lastActivityAt: now,
    chapters: {
      ...state.chapters,
      [chapter.id]: tempChapterState,
    },
  };

  const isValidated = evaluateChapterValidation(nextState, chapter);
  nextState.chapters[chapter.id] = {
    ...tempChapterState,
    validated: existing.validated || isValidated,
    validatedAt:
      existing.validated || isValidated ? existing.validatedAt ?? now : undefined,
  };

  return {
    nextState,
    allCorrect,
    score: correctCount,
    total: questions.length,
  };
}

export interface ExerciseSubmissionUpdate {
  passed: boolean;
  savedCode?: string;
  savedSecondaryCode?: string;
  savedAnswers?: Record<string, string>;
  savedOptionIndex?: number;
  savedOrder?: number[];
  errorCategory?: ErrorClassification;
}

export function recordExerciseSubmission(
  state: StudentProgressState,
  chapter: Chapter,
  exercise: Exercise,
  update: ExerciseSubmissionUpdate
): StudentProgressState {
  const now = new Date().toISOString();
  const existing: ExerciseProgressState = state.exercises[exercise.id] ?? {
    exerciseId: exercise.id,
    attemptsCount: 0,
    passed: false,
    hintsUnlocked: 0,
    failedAttemptsBeforePass: 0,
  };

  const alreadyPassed = existing.passed;
  const nowPassed = alreadyPassed || update.passed;

  const updatedExercise: ExerciseProgressState = {
    ...existing,
    attemptsCount: existing.attemptsCount + 1,
    passed: nowPassed,
    firstPassedAt: nowPassed ? existing.firstPassedAt ?? now : undefined,
    lastAttemptAt: now,
    savedCode: update.savedCode !== undefined ? update.savedCode : existing.savedCode,
    savedSecondaryCode:
      update.savedSecondaryCode !== undefined
        ? update.savedSecondaryCode
        : existing.savedSecondaryCode,
    savedAnswers:
      update.savedAnswers !== undefined ? update.savedAnswers : existing.savedAnswers,
    savedOptionIndex:
      update.savedOptionIndex !== undefined
        ? update.savedOptionIndex
        : existing.savedOptionIndex,
    savedOrder: update.savedOrder !== undefined ? update.savedOrder : existing.savedOrder,
    lastErrorCategory: update.passed ? undefined : update.errorCategory,
    failedAttemptsBeforePass:
      !alreadyPassed && !update.passed
        ? existing.failedAttemptsBeforePass + 1
        : existing.failedAttemptsBeforePass,
  };

  const existingChap = state.chapters[chapter.id] ?? {
    chapterId: chapter.id,
    consulted: true,
    firstConsultedAt: now,
    lastConsultedAt: now,
    lessonQuizAnswers: {},
    lessonCompleted: false,
    validated: false,
  };

  const nextState: StudentProgressState = {
    ...state,
    lastActivityAt: now,
    chapters: {
      ...state.chapters,
      [chapter.id]: existingChap,
    },
    exercises: {
      ...state.exercises,
      [exercise.id]: updatedExercise,
    },
  };

  const isValidated = evaluateChapterValidation(nextState, chapter);
  nextState.chapters[chapter.id] = {
    ...existingChap,
    validated: existingChap.validated || isValidated,
    validatedAt:
      existingChap.validated || isValidated ? existingChap.validatedAt ?? now : undefined,
  };

  return nextState;
}

export function unlockExerciseHint(
  state: StudentProgressState,
  exerciseId: string
): StudentProgressState {
  const now = new Date().toISOString();
  const existing: ExerciseProgressState = state.exercises[exerciseId] ?? {
    exerciseId,
    attemptsCount: 0,
    passed: false,
    hintsUnlocked: 0,
    failedAttemptsBeforePass: 0,
  };

  return {
    ...state,
    lastActivityAt: now,
    exercises: {
      ...state.exercises,
      [exerciseId]: {
        ...existing,
        hintsUnlocked: Math.min(3, existing.hintsUnlocked + 1),
      },
    },
  };
}

export function saveExerciseDraftCode(
  state: StudentProgressState,
  exerciseId: string,
  code: string,
  secondaryCode?: string
): StudentProgressState {
  const existing: ExerciseProgressState = state.exercises[exerciseId] ?? {
    exerciseId,
    attemptsCount: 0,
    passed: false,
    hintsUnlocked: 0,
    failedAttemptsBeforePass: 0,
  };

  return {
    ...state,
    exercises: {
      ...state.exercises,
      [exerciseId]: {
        ...existing,
        savedCode: code,
        savedSecondaryCode:
          secondaryCode !== undefined ? secondaryCode : existing.savedSecondaryCode,
      },
    },
  };
}

export function updateLastLocation(
  state: StudentProgressState,
  location: Partial<LastLocationState>
): StudentProgressState {
  return {
    ...state,
    lastActivityAt: new Date().toISOString(),
    lastLocation: {
      ...state.lastLocation,
      ...location,
    },
  };
}

export function updatePreferences(
  state: StudentProgressState,
  prefs: Partial<UserPreferences>
): StudentProgressState {
  return {
    ...state,
    preferences: {
      ...state.preferences,
      ...prefs,
    },
  };
}

// ============================================================================
// EXPORT / IMPORT & VALIDATION
// ============================================================================

export interface ExportBackupEnvelope {
  platform: 'algo-c-ingenieur-plateforme';
  schemaVersion: 1;
  exportedAt: string;
  data: StudentProgressState;
}

export function exportProgressToJson(state: StudentProgressState): string {
  const envelope: ExportBackupEnvelope = {
    platform: 'algo-c-ingenieur-plateforme',
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    data: state,
  };
  return JSON.stringify(envelope, null, 2);
}

export function validateAndImportProgressJson(rawJson: string): {
  valid: boolean;
  state?: StudentProgressState;
  error?: string;
} {
  try {
    const parsed = JSON.parse(rawJson);
    if (!parsed || typeof parsed !== 'object') {
      return { valid: false, error: 'Le fichier JSON ne contient pas un objet valide.' };
    }

    // Support either envelope format or raw StudentProgressState
    const candidate: unknown =
      parsed.platform === 'algo-c-ingenieur-plateforme' && parsed.data
        ? parsed.data
        : parsed;

    if (!candidate || typeof candidate !== 'object') {
      return { valid: false, error: 'Structure de sauvegarde introuvable dans le fichier.' };
    }

    const obj = candidate as Record<string, unknown>;
    if (obj.schemaVersion !== 1) {
      return {
        valid: false,
        error: `Version de sauvegarde non prise en charge (reçu : ${String(
          obj.schemaVersion
        )}, attendu : 1).`,
      };
    }

    if (!obj.chapters || typeof obj.chapters !== 'object' || Array.isArray(obj.chapters)) {
      return {
        valid: false,
        error: 'Le champ "chapters" de la sauvegarde est manquant ou corrompu.',
      };
    }

    if (
      !obj.exercises ||
      typeof obj.exercises !== 'object' ||
      Array.isArray(obj.exercises)
    ) {
      return {
        valid: false,
        error: 'Le champ "exercises" de la sauvegarde est manquant ou corrompu.',
      };
    }

    const base = createInitialProgressState();
    const prefsRaw =
      obj.preferences && typeof obj.preferences === 'object'
        ? (obj.preferences as Partial<UserPreferences>)
        : {};

    const locRaw =
      obj.lastLocation && typeof obj.lastLocation === 'object'
        ? (obj.lastLocation as Partial<LastLocationState>)
        : {};

    const restored: StudentProgressState = {
      schemaVersion: 1,
      createdAt: typeof obj.createdAt === 'string' ? obj.createdAt : base.createdAt,
      lastActivityAt: new Date().toISOString(),
      lastLocation: {
        screen:
          locRaw.screen &&
          [
            'dashboard',
            'tracks',
            'chapters',
            'lesson',
            'exercise',
            'lab',
            'report',
            'settings',
          ].includes(locRaw.screen)
            ? locRaw.screen
            : 'dashboard',
        trackId:
          locRaw.trackId === 'c' || locRaw.trackId === 'projet' ? locRaw.trackId : 'algo',
        chapterId:
          typeof locRaw.chapterId === 'string' && locRaw.chapterId.length > 0
            ? locRaw.chapterId
            : 'A01',
        exerciseId:
          typeof locRaw.exerciseId === 'string' ? locRaw.exerciseId : undefined,
      },
      preferences: {
        theme: prefsRaw.theme === 'dark' ? 'dark' : 'light',
        editorFontSize:
          prefsRaw.editorFontSize && ['sm', 'md', 'lg'].includes(prefsRaw.editorFontSize)
            ? prefsRaw.editorFontSize
            : 'md',
        showCompilerWarnings:
          typeof prefsRaw.showCompilerWarnings === 'boolean'
            ? prefsRaw.showCompilerWarnings
            : true,
        showMemoryInspectorByDefault:
          typeof prefsRaw.showMemoryInspectorByDefault === 'boolean'
            ? prefsRaw.showMemoryInspectorByDefault
            : true,
      },
      chapters: obj.chapters as Record<string, ChapterProgressState>,
      exercises: obj.exercises as Record<string, ExerciseProgressState>,
      labSnippets: Array.isArray(obj.labSnippets)
        ? (obj.labSnippets as LabSnippet[])
        : base.labSnippets,
    };

    return { valid: true, state: restored };
  } catch (err) {
    return {
      valid: false,
      error: `Erreur de syntaxe JSON lors de la lecture du fichier : ${
        err instanceof Error ? err.message : String(err)
      }`,
    };
  }
}

// ============================================================================
// BROWSER STORAGE ADAPTER (IndexedDB + localStorage synchronous mirror)
// ============================================================================

export function loadProgressFromLocalStorage(): StudentProgressState {
  if (typeof window === 'undefined' || !window.localStorage) {
    return createInitialProgressState();
  }
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_STATE_KEY);
    if (!raw) {
      return createInitialProgressState();
    }
    const result = validateAndImportProgressJson(raw);
    if (result.valid && result.state) {
      return result.state;
    }
    return createInitialProgressState();
  } catch {
    return createInitialProgressState();
  }
}

export function saveProgressToStorage(state: StudentProgressState): void {
  if (typeof window === 'undefined') return;
  try {
    if (window.localStorage) {
      window.localStorage.setItem(LOCAL_STORAGE_STATE_KEY, JSON.stringify(state));
      window.localStorage.setItem(
        LOCAL_STORAGE_PREFS_KEY,
        JSON.stringify(state.preferences)
      );
    }
  } catch {
    // Ignore quota errors on localStorage and rely on IndexedDB
  }

  saveToIndexedDB(state).catch(() => {
    // IndexedDB unavailable in private browsing or test environment
  });
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      reject(new Error('IndexedDB non disponible'));
      return;
    }
    const request = window.indexedDB.open(IDB_NAME, IDB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveToIndexedDB(state: StudentProgressState): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readwrite');
    const store = tx.objectStore(IDB_STORE);
    store.put(state, IDB_KEY);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

export async function loadFromIndexedDB(): Promise<StudentProgressState | null> {
  try {
    const db = await openDatabase();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const store = tx.objectStore(IDB_STORE);
      const req = store.get(IDB_KEY);
      req.onsuccess = () => {
        db.close();
        if (req.result) {
          const check = validateAndImportProgressJson(JSON.stringify(req.result));
          resolve(check.valid && check.state ? check.state : null);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => {
        db.close();
        reject(req.error);
      };
    });
  } catch {
    return null;
  }
}

export async function clearAllStoredProgress(): Promise<StudentProgressState> {
  const fresh = createInitialProgressState();
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.removeItem(LOCAL_STORAGE_STATE_KEY);
    window.localStorage.removeItem(LOCAL_STORAGE_PREFS_KEY);
  }
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).delete(IDB_KEY);
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        resolve();
      };
    });
  } catch {
    // Ignore
  }
  saveProgressToStorage(fresh);
  return fresh;
}
