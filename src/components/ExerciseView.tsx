import React, { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BookOpen,
  CheckCircle2,
  Eye,
  GitCompareArrows,
  HelpCircle,
  Lightbulb,
  Play,
  ShieldCheck,
  Terminal,
  XCircle,
} from 'lucide-react';
import { getChapterById, getExerciseById } from '../data/curriculumIndex';
import {
  executeCInSandbox,
  executeCTestsInSandbox,
  executePseudoInSandbox,
  executePseudoTestsInSandbox,
} from '../engines/workerClient';
import { ExerciseSubmissionUpdate } from '../services/storageService';
import {
  Chapter,
  CompileAndRunResult,
  ErrorClassification,
  Exercise,
  StudentProgressState,
  TestCaseRunResult,
} from '../types/curriculum';
import { CodeEditorWithLines } from './CodeEditorWithLines';
import { MemoryAndTraceInspector } from './MemoryAndTraceInspector';
import { RichText } from './RichText';

interface ExerciseViewProps {
  chapter: Chapter;
  exercise: Exercise;
  progress: StudentProgressState;
  onRecordSubmission: (update: ExerciseSubmissionUpdate) => void;
  onUnlockHint: () => void;
  onSaveDraftCode: (code: string, secondaryCode?: string) => void;
  onSelectExercise: (chapterId: string, exerciseId: string) => void;
  onBackToLesson: () => void;
  onOpenChapterLesson: (chapterId: string) => void;
}

const CATEGORY_LABELS: Record<Exercise['category'], string> = {
  qcm: 'QCM Conceptuel',
  prediction: 'Prédiction de Résultat',
  trace: 'Table de Trace d’Exécution',
  ordering: 'Remise en Ordre d’Instructions',
  completion: 'Complétion de Code',
  bugfix: 'Correction de Bug (Débogage)',
  error_spot: 'Détection d’Erreur',
  pseudocode: 'Écriture de Pseudo-code',
  c_code: 'Programmation en Langage C',
  synthesis: 'Problème de Synthèse',
};

const DIFFICULTY_STYLES: Record<Exercise['difficulty'], { label: string; badge: string }> = {
  debutant: {
    label: 'Débutant',
    badge: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300',
  },
  intermediaire: {
    label: 'Intermédiaire',
    badge: 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300',
  },
  avance: {
    label: 'Avancé',
    badge: 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300',
  },
  synthese: {
    label: 'Synthèse',
    badge: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300',
  },
};

export const ExerciseView: React.FC<ExerciseViewProps> = ({
  chapter,
  exercise,
  progress,
  onRecordSubmission,
  onUnlockHint,
  onSaveDraftCode,
  onSelectExercise,
  onBackToLesson,
  onOpenChapterLesson,
}) => {
  const exState = progress.exercises[exercise.id];
  const isCodeExercise =
    Boolean(exercise.testCases && exercise.testCases.length > 0) ||
    ['pseudocode', 'c_code', 'bugfix', 'synthesis'].includes(exercise.category) ||
    (exercise.category === 'completion' && !exercise.gaps);

  // State for code exercises
  const [code, setCode] = useState<string>(
    exState?.savedCode ?? exercise.starterCode ?? exercise.templateWithGaps ?? ''
  );
  const [customStdin, setCustomStdin] = useState<string>(
    exercise.testCases?.[0]?.stdin ?? ''
  );
  const [sandboxResult, setSandboxResult] = useState<CompileAndRunResult | null>(null);
  const [testSuiteResults, setTestSuiteResults] = useState<TestCaseRunResult[] | null>(
    null
  );
  const [isRunning, setIsRunning] = useState(false);

  // State for QCM / Error spotting
  const [selectedOption, setSelectedOption] = useState<number | undefined>(
    exState?.savedOptionIndex
  );

  // State for Prediction
  const [predictedOutput, setPredictedOutput] = useState<string>(
    exState?.savedAnswers?.['prediction'] ?? ''
  );

  // State for Trace Table
  const [traceInputs, setTraceInputs] = useState<Record<string, string>>(
    exState?.savedAnswers ?? {}
  );

  // State for Ordering
  const [orderedIndices, setOrderedIndices] = useState<number[]>(() => {
    if (exState?.savedOrder && exState.savedOrder.length > 0) {
      return exState.savedOrder;
    }
    if (exercise.scrambledLines) {
      return exercise.scrambledLines.map((_, idx) => idx);
    }
    return [];
  });

  // State for Gap Completion
  const [gapAnswers, setGapAnswers] = useState<Record<string, string>>(
    exState?.savedAnswers ?? {}
  );

  // Evaluation feedback banner
  const [feedback, setFeedback] = useState<{
    submitted: boolean;
    passed: boolean;
    message: string;
    errorType?: ErrorClassification;
  } | null>(null);

  const [showSolution, setShowSolution] = useState(false);

  // Reset local state when exercise changes
  useEffect(() => {
    const saved = progress.exercises[exercise.id];
    setCode(saved?.savedCode ?? exercise.starterCode ?? exercise.templateWithGaps ?? '');
    setCustomStdin(exercise.testCases?.[0]?.stdin ?? '');
    setSandboxResult(null);
    setTestSuiteResults(null);
    setSelectedOption(saved?.savedOptionIndex);
    setPredictedOutput(saved?.savedAnswers?.['prediction'] ?? '');
    setTraceInputs(saved?.savedAnswers ?? {});
    setOrderedIndices(
      saved?.savedOrder && saved.savedOrder.length > 0
        ? saved.savedOrder
        : exercise.scrambledLines
        ? exercise.scrambledLines.map((_, idx) => idx)
        : []
    );
    setGapAnswers(saved?.savedAnswers ?? {});
    setFeedback(null);
    setShowSolution(false);
  }, [exercise.id]);

  const currentExIndex = chapter.exercises.findIndex((e) => e.id === exercise.id);
  const prevExercise =
    currentExIndex > 0 ? chapter.exercises[currentExIndex - 1] : undefined;
  const nextExercise =
    currentExIndex >= 0 && currentExIndex < chapter.exercises.length - 1
      ? chapter.exercises[currentExIndex + 1]
      : undefined;

  const hintsUnlocked = exState?.hintsUnlocked ?? 0;
  const attemptsCount = exState?.attemptsCount ?? 0;
  const canRevealSolution =
    Boolean(exState?.passed) || attemptsCount >= 2 || hintsUnlocked >= 2;

  const normalizeText = (s: string, ignoreWs = true) => {
    if (!ignoreWs) return s.replace(/\r\n/g, '\n').trim();
    return s.replace(/\r\n/g, '\n').replace(/\s+/g, ' ').trim().toLowerCase();
  };

  // Run code freely in sandbox
  const handleRunFree = async () => {
    setIsRunning(true);
    onSaveDraftCode(code);
    try {
      const lang =
        exercise.codeLanguage ?? (exercise.trackId === 'algo' ? 'pseudo' : 'c');
      const res =
        lang === 'c'
          ? await executeCInSandbox(code, customStdin)
          : await executePseudoInSandbox(code, customStdin);
      setSandboxResult(res);
    } finally {
      setIsRunning(false);
    }
  };

  // Evaluate submission across all 10 categories
  const handleEvaluateSubmission = async () => {
    // 1. Code Exercise with Test Cases
    if (isCodeExercise && exercise.testCases && exercise.testCases.length > 0) {
      setIsRunning(true);
      onSaveDraftCode(code);
      try {
        const lang =
          exercise.codeLanguage ?? (exercise.trackId === 'algo' ? 'pseudo' : 'c');
        const freeRes =
          lang === 'c'
            ? await executeCInSandbox(code, customStdin)
            : await executePseudoInSandbox(code, customStdin);
        setSandboxResult(freeRes);

        const suite =
          lang === 'c'
            ? await executeCTestsInSandbox(code, exercise.testCases)
            : await executePseudoTestsInSandbox(code, exercise.testCases);
        setTestSuiteResults(suite.results);

        const passedCount = suite.results.filter((r) => r.passed).length;
        const firstDiag = suite.results.flatMap((r) => r.diagnostics)[0];
        const errCat: ErrorClassification = firstDiag
          ? firstDiag.category
          : 'logique';

        setFeedback({
          submitted: true,
          passed: suite.allPassed,
          errorType: suite.allPassed ? undefined : errCat,
          message: suite.allPassed
            ? `Bravo ! Les ${suite.results.length} jeux de tests automatisés sont validés avec succès.`
            : `${passedCount} / ${suite.results.length} tests réussis. Consultez le détail des cas en échec ci-dessous.`,
        });

        onRecordSubmission({
          passed: suite.allPassed,
          savedCode: code,
          errorCategory: suite.allPassed ? undefined : errCat,
        });
      } finally {
        setIsRunning(false);
      }
      return;
    }

    // 2. QCM or Error Spotting with options
    if (exercise.options && exercise.options.length > 0) {
      if (selectedOption === undefined) {
        setFeedback({
          submitted: true,
          passed: false,
          message: 'Veuillez sélectionner une proposition avant de valider.',
        });
        return;
      }
      const isCorrect = selectedOption === exercise.correctOptionIndex;
      setFeedback({
        submitted: true,
        passed: isCorrect,
        errorType: isCorrect ? undefined : exercise.errorClassificationTarget ?? 'logique',
        message: isCorrect
          ? 'Excellente réponse ! Vous avez parfaitement identifié le comportement attendu.'
          : 'Cette réponse est incorrecte. Analysez l’explication ou débloquez un indice.',
      });
      onRecordSubmission({
        passed: isCorrect,
        savedOptionIndex: selectedOption,
        errorCategory: isCorrect ? undefined : 'logique',
      });
      return;
    }

    // 3. Trace Table
    if (exercise.traceSpec) {
      const expected = exercise.traceSpec.expectedAnswers;
      let allMatch = true;
      let totalCells = 0;
      let correctCells = 0;

      for (const [key, expVal] of Object.entries(expected)) {
        totalCells++;
        const userVal = traceInputs[key] ?? '';
        if (normalizeText(userVal, true) === normalizeText(expVal, true)) {
          correctCells++;
        } else {
          allMatch = false;
        }
      }

      setFeedback({
        submitted: true,
        passed: allMatch,
        errorType: allMatch ? undefined : 'logique',
        message: allMatch
          ? `Table de trace entièrement exacte (${correctCells}/${totalCells} cellules validées) !`
          : `${correctCells}/${totalCells} cellules exactes dans la table de trace. Vérifiez l’évolution des variables étape par étape.`,
      });
      onRecordSubmission({
        passed: allMatch,
        savedAnswers: traceInputs,
        errorCategory: allMatch ? undefined : 'logique',
      });
      return;
    }

    // 4. Instruction Ordering
    if (exercise.scrambledLines && exercise.correctOrderIndices) {
      const target = exercise.correctOrderIndices;
      const isCorrect =
        orderedIndices.length === target.length &&
        orderedIndices.every((val, idx) => {
          const userLine = exercise.scrambledLines![val]?.trim();
          const expectedLine = exercise.scrambledLines![target[idx]]?.trim();
          return userLine === expectedLine;
        });

      setFeedback({
        submitted: true,
        passed: isCorrect,
        errorType: isCorrect ? undefined : 'logique',
        message: isCorrect
          ? 'L’ordre séquentiel des instructions est parfaitement reconstitué !'
          : 'L’ordre de certaines instructions est incorrect. Vérifiez les dépendances entre déclarations, initialisations et calculs.',
      });
      onRecordSubmission({
        passed: isCorrect,
        savedOrder: orderedIndices,
        errorCategory: isCorrect ? undefined : 'logique',
      });
      return;
    }

    // 5. Code Completion with Gaps
    if (exercise.gaps && exercise.gaps.length > 0) {
      let allGapsCorrect = true;
      for (const gap of exercise.gaps) {
        const userAns = (gapAnswers[gap.id] ?? '').trim();
        const matched = gap.acceptedAnswers.some(
          (acc) => acc.trim().toLowerCase() === userAns.toLowerCase()
        );
        if (!matched) {
          allGapsCorrect = false;
        }
      }

      setFeedback({
        submitted: true,
        passed: allGapsCorrect,
        errorType: allGapsCorrect ? undefined : 'syntaxe',
        message: allGapsCorrect
          ? 'Tous les emplacements du code ont été complétés correctement !'
          : 'Un ou plusieurs champs complétés sont inexacts. Vérifiez la syntaxe exacte attendue.',
      });
      onRecordSubmission({
        passed: allGapsCorrect,
        savedAnswers: gapAnswers,
        errorCategory: allGapsCorrect ? undefined : 'syntaxe',
      });
      return;
    }

    // 6. Output Prediction (or general expectedOutputAnswer)
    if (exercise.expectedOutputAnswer !== undefined) {
      const isCorrect =
        normalizeText(predictedOutput, exercise.ignoreWhitespaceInPrediction ?? true) ===
        normalizeText(
          exercise.expectedOutputAnswer,
          exercise.ignoreWhitespaceInPrediction ?? true
        );

      setFeedback({
        submitted: true,
        passed: isCorrect,
        errorType: isCorrect ? undefined : 'logique',
        message: isCorrect
          ? 'Prédiction exacte ! Vous avez correctement déroulé l’exécution mentale du code.'
          : 'La sortie prédite ne correspond pas au résultat réel. Déroulez chaque tour de boucle et chaque condition.',
      });
      onRecordSubmission({
        passed: isCorrect,
        savedAnswers: { prediction: predictedOutput },
        errorCategory: isCorrect ? undefined : 'logique',
      });
    }
  };

  const moveOrderItem = (pos: number, direction: -1 | 1) => {
    const targetPos = pos + direction;
    if (targetPos < 0 || targetPos >= orderedIndices.length) return;
    const copy = [...orderedIndices];
    const tmp = copy[pos];
    copy[pos] = copy[targetPos];
    copy[targetPos] = tmp;
    setOrderedIndices(copy);
  };

  const errorLines = (sandboxResult?.diagnostics ?? [])
    .filter((d) => d.severity === 'error')
    .map((d) => d.line);
  const warningLines = (sandboxResult?.diagnostics ?? [])
    .filter((d) => d.severity === 'warning')
    .map((d) => d.line);

  // Resolve bridge target (can be a chapter ID like 'B04' or an exercise ID like 'B04_E2')
  const bridgeTarget = exercise.bridgeTargetChapterId;
  const resolvedBridgeExercise = bridgeTarget ? getExerciseById(bridgeTarget) : undefined;
  const resolvedBridgeChapter =
    bridgeTarget && !resolvedBridgeExercise ? getChapterById(bridgeTarget) : undefined;

  return (
    <div className="space-y-6">
      {/* Top Bar: Navigation between Lesson & Exercises */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBackToLesson}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            Retour au cours : {chapter.id} — {chapter.title}
          </span>
        </button>

        {/* Chapter exercises pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {chapter.exercises.map((ex, idx) => {
            const isCurrent = ex.id === exercise.id;
            const isPassed = Boolean(progress.exercises[ex.id]?.passed);
            return (
              <button
                key={ex.id}
                type="button"
                onClick={() => onSelectExercise(chapter.id, ex.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  isCurrent
                    ? 'bg-blue-600 text-white shadow-sm'
                    : isPassed
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                Exercice {idx + 1} {isPassed ? '✓' : ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* Exercise Header Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
              {exercise.id}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold">
              {CATEGORY_LABELS[exercise.category]}
            </span>
            <span
              className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                DIFFICULTY_STYLES[exercise.difficulty].badge
              }`}
            >
              Niveau : {DIFFICULTY_STYLES[exercise.difficulty].label}
            </span>
            {exercise.isCoreValidationExercise && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-semibold border border-amber-200 dark:border-amber-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                Requis pour valider le chapitre
              </span>
            )}
          </div>

          {exState?.passed && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              Exercice Validé ({exState.attemptsCount} essai{exState.attemptsCount > 1 ? 's' : ''})
            </span>
          )}
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1">
            {exercise.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Compétence évaluée : <strong className="text-slate-700 dark:text-slate-300">{exercise.testedSkill}</strong>
          </p>
        </div>

        {/* Statement */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap overflow-x-auto">
          <RichText text={exercise.statement} />
        </div>

        {/* Cross-track Bridge Banner if available */}
        {(resolvedBridgeExercise || resolvedBridgeChapter) && (
          <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-blue-900 dark:text-blue-200">
              <GitCompareArrows className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                <strong>Passerelle Algo ↔ C :</strong> Cet exercice possède un équivalent direct dans l&apos;autre parcours pour comparer la logique algorithmique et l&apos;implémentation C99.
              </span>
            </div>
            {resolvedBridgeExercise ? (
              <button
                type="button"
                onClick={() =>
                  onSelectExercise(
                    resolvedBridgeExercise.chapter.id,
                    resolvedBridgeExercise.exercise.id
                  )
                }
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold cursor-pointer"
              >
                Ouvrir l&apos;exercice lié ({resolvedBridgeExercise.exercise.id}) →
              </button>
            ) : resolvedBridgeChapter ? (
              <button
                type="button"
                onClick={() => onOpenChapterLesson(resolvedBridgeChapter.id)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold cursor-pointer"
              >
                Ouvrir le chapitre lié ({resolvedBridgeChapter.id}) →
              </button>
            ) : null}
          </div>
        )}
      </div>

      {/* Code Snippet if present on non-code exercise (e.g. QCM, Prediction, Error Spot) */}
      {!isCodeExercise && exercise.codeSnippet && (
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Extrait de code à analyser ({exercise.codeLanguage === 'c' ? 'C99' : 'Pseudo-code'}) :
          </div>
          <pre className="font-mono text-xs sm:text-sm text-slate-100 overflow-x-auto leading-6">
            {exercise.codeSnippet}
          </pre>
          {exercise.stdinForPrediction && (
            <div className="mt-3 p-2.5 rounded bg-slate-900 text-xs font-mono text-emerald-300">
              Entrée fournie (stdin) : {exercise.stdinForPrediction}
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          INTERACTIVE WORKSPACE BY CATEGORY
      ===================================================================== */}

      {/* CASE 1: Code Exercise (Pseudocode, C99, Bugfix, Synthesis) */}
      {isCodeExercise && (
        <div className="space-y-4">
          <CodeEditorWithLines
            code={code}
            onChange={(next) => {
              setCode(next);
              onSaveDraftCode(next);
            }}
            language={
              exercise.codeLanguage ?? (exercise.trackId === 'algo' ? 'pseudo' : 'c')
            }
            fontSize={progress.preferences.editorFontSize}
            errorLines={errorLines}
            warningLines={warningLines}
            onRunShortcut={handleRunFree}
            onReset={() => {
              const initial = exercise.starterCode ?? exercise.templateWithGaps ?? '';
              setCode(initial);
              onSaveDraftCode(initial);
            }}
            title={`${exercise.id} — ${exercise.title}`}
          />

          {/* Custom Stdin & Execution Bar */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex flex-col md:flex-row items-stretch md:items-end justify-between gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Entrée standard de test libre (stdin — une valeur par ligne ou séparée par espace) :
              </label>
              <textarea
                rows={2}
                value={customStdin}
                onChange={(e) => setCustomStdin(e.target.value)}
                placeholder="Ex: 12&#10;5"
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                disabled={isRunning}
                onClick={handleRunFree}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold transition cursor-pointer"
              >
                <Play className="w-4 h-4 text-emerald-400" />
                <span>Tester avec cette entrée</span>
              </button>

              <button
                type="button"
                disabled={isRunning}
                onClick={handleEvaluateSubmission}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow transition cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Valider mon programme ({exercise.testCases?.length ?? 1} tests)</span>
              </button>
            </div>
          </div>

          {/* Memory & Trace Inspector */}
          <MemoryAndTraceInspector
            result={sandboxResult}
            language={
              exercise.codeLanguage ?? (exercise.trackId === 'algo' ? 'pseudo' : 'c')
            }
            showWarnings={progress.preferences.showCompilerWarnings}
          />

          {/* Automated Test Suite Results */}
          {testSuiteResults && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-600" />
                <span>Résultats détaillés de la suite de tests déterministes</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {testSuiteResults.map((tr) => (
                  <div
                    key={tr.testCase.id}
                    className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                      tr.passed
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/25 border-emerald-200 dark:border-emerald-900'
                        : 'bg-red-50/50 dark:bg-red-950/25 border-red-200 dark:border-red-900'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        {tr.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                        )}
                        {tr.testCase.label}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 uppercase text-[10px] font-bold">
                        Cas {tr.testCase.category}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                      <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <div className="text-[10px] font-sans text-slate-400">Attendu :</div>
                        <pre className="whitespace-pre-wrap text-emerald-700 dark:text-emerald-300">
                          {tr.testCase.expectedStdout || '(vide)'}
                        </pre>
                      </div>
                      <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <div className="text-[10px] font-sans text-slate-400">Obtenu :</div>
                        <pre className="whitespace-pre-wrap text-slate-800 dark:text-slate-200">
                          {tr.actualStdout || '(vide)'}
                        </pre>
                      </div>
                    </div>

                    {!tr.passed && tr.failureReason && (
                      <p className="text-red-700 dark:text-red-300 font-medium">
                        Diagnostic : {tr.failureReason}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CASE 2: QCM or Error Spotting with Options */}
      {!isCodeExercise && exercise.options && exercise.options.length > 0 && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-sm">
          <div className="text-sm font-bold text-slate-900 dark:text-white">
            Sélectionnez la proposition exacte :
          </div>
          <div className="space-y-2.5">
            {exercise.options.map((opt, idx) => {
              const checked = selectedOption === idx;
              return (
                <label
                  key={idx}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border text-sm cursor-pointer transition ${
                    checked
                      ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-950 dark:text-blue-100 font-semibold'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <input
                    type="radio"
                    name={`ex-opt-${exercise.id}`}
                    checked={checked}
                    onChange={() => setSelectedOption(idx)}
                    className="mt-1 accent-blue-600"
                  />
                  <span className="font-mono text-xs sm:text-sm">{opt}</span>
                </label>
              );
            })}
          </div>
          <button
            type="button"
            onClick={handleEvaluateSubmission}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow cursor-pointer"
          >
            Valider ma réponse
          </button>
        </div>
      )}

      {/* CASE 3: Interactive Trace Table */}
      {!isCodeExercise && exercise.traceSpec && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-5">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Algorithme / Code à tracer :
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs sm:text-sm overflow-x-auto leading-6">
                {exercise.traceSpec.code}
              </pre>
            </div>

            <div className="lg:col-span-7 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Complétez les cases marquées par « ? » dans la table de trace :
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                      {exercise.traceSpec.columns.map((col) => (
                        <th key={col} className="py-2.5 px-3 font-mono">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                    {exercise.traceSpec.prefilledRows.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {exercise.traceSpec!.columns.map((col) => {
                          const cellKey = `${rIdx}:${col}`;
                          const isEditable =
                            row[col] === '?' ||
                            exercise.traceSpec!.expectedAnswers[cellKey] !== undefined;

                          return (
                            <td key={col} className="py-2 px-3">
                              {isEditable ? (
                                <input
                                  type="text"
                                  value={traceInputs[cellKey] ?? ''}
                                  onChange={(e) =>
                                    setTraceInputs((prev) => ({
                                      ...prev,
                                      [cellKey]: e.target.value,
                                    }))
                                  }
                                  placeholder="?"
                                  className="w-24 px-2 py-1 rounded border border-blue-400 dark:border-blue-600 bg-blue-50/40 dark:bg-slate-950 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              ) : (
                                <span className="text-slate-600 dark:text-slate-400">
                                  {row[col]}
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                type="button"
                onClick={handleEvaluateSubmission}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow cursor-pointer"
              >
                Vérifier la table de trace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CASE 4: Instruction Ordering */}
      {!isCodeExercise && exercise.scrambledLines && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-sm">
          <div className="text-sm font-bold text-slate-900 dark:text-white">
            Réordonnez les instructions ci-dessous avec les flèches Haut / Bas :
          </div>
          <div className="space-y-2">
            {orderedIndices.map((origIdx, pos) => (
              <div
                key={`${origIdx}-${pos}`}
                className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs sm:text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-bold">
                    {pos + 1}
                  </span>
                  <code className="text-slate-900 dark:text-slate-100">
                    {exercise.scrambledLines![origIdx]}
                  </code>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={pos === 0}
                    onClick={() => moveOrderItem(pos, -1)}
                    className="p-1.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 disabled:opacity-40 cursor-pointer"
                    title="Monter cette ligne"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={pos === orderedIndices.length - 1}
                    onClick={() => moveOrderItem(pos, 1)}
                    className="p-1.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 disabled:opacity-40 cursor-pointer"
                    title="Descendre cette ligne"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleEvaluateSubmission}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow cursor-pointer"
          >
            Vérifier l&apos;ordre des instructions
          </button>
        </div>
      )}

      {/* CASE 5: Code Completion with Gaps */}
      {!isCodeExercise && exercise.gaps && exercise.gaps.length > 0 && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-sm">
          {exercise.templateWithGaps && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Modèle de code à compléter :
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs sm:text-sm overflow-x-auto">
                {exercise.templateWithGaps}
              </pre>
            </div>
          )}

          <div className="space-y-3">
            {exercise.gaps.map((gap, idx) => (
              <div key={gap.id} className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Emplacement #{idx + 1} ({gap.id}) — {gap.explanation}
                </label>
                <input
                  type="text"
                  value={gapAnswers[gap.id] ?? ''}
                  onChange={(e) =>
                    setGapAnswers((prev) => ({ ...prev, [gap.id]: e.target.value }))
                  }
                  placeholder={gap.placeholder}
                  className="w-full max-w-md px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-sm text-slate-900 dark:text-white"
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleEvaluateSubmission}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow cursor-pointer"
          >
            Vérifier le code complété
          </button>
        </div>
      )}

      {/* CASE 6: Output Prediction (or general text answer when no options/trace/gaps) */}
      {!isCodeExercise &&
        !exercise.options &&
        !exercise.traceSpec &&
        !exercise.scrambledLines &&
        !exercise.gaps &&
        exercise.expectedOutputAnswer !== undefined && (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-sm">
            <label className="block text-sm font-bold text-slate-900 dark:text-white">
              Indiquez la sortie exacte produite par cette exécution :
            </label>
            <textarea
              rows={3}
              value={predictedOutput}
              onChange={(e) => setPredictedOutput(e.target.value)}
              placeholder="Saisissez le résultat affiché..."
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-sm text-slate-900 dark:text-white"
            />
            <button
              type="button"
              onClick={handleEvaluateSubmission}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow cursor-pointer"
            >
              Vérifier ma prédiction
            </button>
          </div>
        )}

      {/* Evaluation Feedback Banner */}
      {feedback && (
        <div
          className={`p-5 rounded-2xl border shadow-sm space-y-2 ${
            feedback.passed
              ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
              : 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-100'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-bold text-base">
              {feedback.passed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-amber-600 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
            {feedback.errorType && (
              <span className="px-2.5 py-0.5 rounded bg-amber-200/80 dark:bg-amber-900 text-amber-900 dark:text-amber-200 text-xs font-bold uppercase">
                Catégorie : Erreur de {feedback.errorType}
              </span>
            )}
          </div>

          {feedback.passed && exercise.detailedExplanation && (
            <div className="pt-2 border-t border-emerald-200 dark:border-emerald-800/80 text-xs sm:text-sm leading-relaxed">
              <strong>Explication pédagogique complète : </strong>
              <span className="whitespace-pre-line">
                <RichText text={exercise.detailedExplanation} />
              </span>
            </div>
          )}
        </div>
      )}

      {/* Progressive Hints & Solution Section */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Accompagnement progressif : Indices ({hintsUnlocked}/3) &amp; Correction commentée
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {hintsUnlocked < 3 && (
              <button
                type="button"
                onClick={onUnlockHint}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 hover:bg-amber-200 text-xs font-semibold transition cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Débloquer l&apos;indice {hintsUnlocked + 1}/3</span>
              </button>
            )}

            {canRevealSolution && (
              <button
                type="button"
                onClick={() => setShowSolution((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>
                  {showSolution ? 'Masquer la correction' : 'Afficher la correction détaillée'}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Unlocked Hints */}
        {hintsUnlocked > 0 && (
          <div className="space-y-2">
            {exercise.hints.slice(0, hintsUnlocked).map((hint, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs sm:text-sm text-slate-800 dark:text-slate-200"
              >
                <strong className="text-amber-800 dark:text-amber-300">
                  Indice {idx + 1} :{' '}
                </strong>
                {hint}
              </div>
            ))}
          </div>
        )}

        {/* Detailed Solution & Reference Code */}
        {showSolution && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Explication détaillée de la solution
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              <RichText text={exercise.detailedExplanation} />
            </p>

            {exercise.referenceSolution && (
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  Code de référence :
                </div>
                <pre className="p-3.5 rounded-lg bg-slate-950 text-emerald-300 font-mono text-xs overflow-x-auto">
                  {exercise.referenceSolution}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Prev / Next Exercise Bar */}
      <div className="flex items-center justify-between pt-2">
        {prevExercise ? (
          <button
            type="button"
            onClick={() => onSelectExercise(chapter.id, prevExercise.id)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exercice précédent : {prevExercise.title}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onBackToLesson}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Revenir au cours {chapter.id}</span>
          </button>
        )}

        {nextExercise && (
          <button
            type="button"
            onClick={() => onSelectExercise(chapter.id, nextExercise.id)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold shadow cursor-pointer"
          >
            <span>Exercice suivant : {nextExercise.title}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
