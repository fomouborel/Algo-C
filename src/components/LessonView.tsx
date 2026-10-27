import React, { useEffect, useState } from 'react';
import {
  AlertOctagon,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FlaskConical,
  HelpCircle,
  Languages,
  Lightbulb,
  ListChecks,
  Play,
  Sparkles,
  Target,
} from 'lucide-react';
import { getChapterById, getChaptersByTrack, TRACK_LABELS } from '../data/curriculumIndex';
import { executeCInSandbox, executePseudoInSandbox } from '../engines/workerClient';
import {
  AnnotatedExample,
  Chapter,
  CompileAndRunResult,
  StudentProgressState,
} from '../types/curriculum';
import { MemoryAndTraceInspector } from './MemoryAndTraceInspector';
import { RichText } from './RichText';

interface LessonViewProps {
  chapter: Chapter;
  progress: StudentProgressState;
  onSubmitQuiz: (answers: Record<string, number>) => {
    allCorrect: boolean;
    score: number;
    total: number;
  };
  onOpenExercise: (chapterId: string, exerciseId: string) => void;
  onSelectChapter: (chapterId: string) => void;
  onBackToChapters: () => void;
  onOpenInLab: (title: string, language: 'c' | 'pseudo', code: string, stdin: string) => void;
}

export const LessonView: React.FC<LessonViewProps> = ({
  chapter,
  progress,
  onSubmitQuiz,
  onOpenExercise,
  onSelectChapter,
  onBackToChapters,
  onOpenInLab,
}) => {
  const chapProgress = progress.chapters[chapter.id];
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>(
    chapProgress?.lessonQuizAnswers ?? {}
  );
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(
    Boolean(chapProgress?.lessonCompleted)
  );
  const [quizResultBanner, setQuizResultBanner] = useState<{
    allCorrect: boolean;
    score: number;
    total: number;
  } | null>(null);

  const [simpleRunResult, setSimpleRunResult] = useState<CompileAndRunResult | null>(null);
  const [intermediateRunResult, setIntermediateRunResult] =
    useState<CompileAndRunResult | null>(null);

  useEffect(() => {
    const saved = progress.chapters[chapter.id];
    setQuizAnswers(saved?.lessonQuizAnswers ?? {});
    setQuizSubmitted(Boolean(saved?.lessonCompleted));
    setQuizResultBanner(null);
    setSimpleRunResult(null);
    setIntermediateRunResult(null);
  }, [chapter.id]);

  const trackChapters = getChaptersByTrack(chapter.trackId);
  const currentIdx = trackChapters.findIndex((c) => c.id === chapter.id);
  const prevChapter = currentIdx > 0 ? trackChapters[currentIdx - 1] : undefined;
  const nextChapter =
    currentIdx >= 0 && currentIdx < trackChapters.length - 1
      ? trackChapters[currentIdx + 1]
      : undefined;

  const handleRunExample = async (
    example: AnnotatedExample,
    target: 'simple' | 'intermediate'
  ) => {
    const res =
      example.language === 'c'
        ? await executeCInSandbox(example.code, example.stdin ?? '')
        : await executePseudoInSandbox(example.code, example.stdin ?? '');

    if (target === 'simple') {
      setSimpleRunResult(res);
    } else {
      setIntermediateRunResult(res);
    }
  };

  const handleVerifyQuiz = () => {
    const res = onSubmitQuiz(quizAnswers);
    setQuizSubmitted(true);
    setQuizResultBanner(res);
  };

  const renderAnnotatedExample = (
    example: AnnotatedExample,
    badgeLabel: string,
    target: 'simple' | 'intermediate',
    runResult: CompileAndRunResult | null
  ) => (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
      <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="inline-block px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-[11px] font-bold uppercase mr-2">
            {badgeLabel}
          </span>
          <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
            {example.title}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleRunExample(example, target)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Exécuter cet exemple</span>
          </button>
          <button
            type="button"
            onClick={() =>
              onOpenInLab(
                `${chapter.id} — ${example.title}`,
                example.language,
                example.code,
                example.stdin ?? ''
              )
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium transition cursor-pointer"
          >
            <FlaskConical className="w-3.5 h-3.5 text-amber-500" />
            <span>Ouvrir dans le Laboratoire</span>
          </button>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {example.description && (
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {example.description}
          </p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Code Block */}
          <div className="lg:col-span-7 space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Code ({example.language === 'c' ? 'Langage C99' : 'Pseudo-code'})
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs sm:text-sm overflow-x-auto leading-6 border border-slate-800">
              {example.code.split('\n').map((line, i) => (
                <div key={i} className="table-row">
                  <span className="table-cell pr-4 text-right select-none text-slate-500">
                    {i + 1}
                  </span>
                  <span className="table-cell whitespace-pre">{line}</span>
                </div>
              ))}
            </pre>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {example.stdin && (
                <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/70 text-xs font-mono">
                  <span className="block text-[10px] font-sans font-bold uppercase text-slate-500 mb-0.5">
                    Entrée standard (stdin) :
                  </span>
                  <span className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                    {example.stdin}
                  </span>
                </div>
              )}
              <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs font-mono">
                <span className="block text-[10px] font-sans font-bold uppercase text-emerald-700 dark:text-emerald-400 mb-0.5">
                  Résultat attendu (stdout) :
                </span>
                <span className="text-emerald-900 dark:text-emerald-200 whitespace-pre-wrap">
                  {example.expectedOutput}
                </span>
              </div>
            </div>
          </div>

          {/* Line-by-line Explanation */}
          <div className="lg:col-span-5 space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Explication ligne par ligne
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {example.lineExplanations.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-xs"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-[10px] font-bold">
                      L.{item.lineNumber}
                    </span>
                    <code className="font-mono text-blue-700 dark:text-blue-300 font-semibold truncate">
                      {item.code}
                    </code>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {item.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Sandbox Execution Output if clicked */}
        {runResult && (
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            <MemoryAndTraceInspector
              result={runResult}
              language={example.language}
              showWarnings={progress.preferences.showCompilerWarnings}
              defaultTab={example.language === 'c' ? 'memory' : 'trace'}
            />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Top Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBackToChapters}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            Retour au sommaire (Parcours {TRACK_LABELS[chapter.trackId].letter})
          </span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {prevChapter && (
            <button
              type="button"
              onClick={() => onSelectChapter(prevChapter.id)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              ← {prevChapter.id}
            </button>
          )}
          {chapter.exercises.length > 0 && (
            <button
              type="button"
              onClick={() => onOpenExercise(chapter.id, chapter.exercises[0].id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm cursor-pointer"
            >
              <span>Passer aux exercices ({chapter.exercises.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
          {nextChapter && (
            <button
              type="button"
              onClick={() => onSelectChapter(nextChapter.id)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              {nextChapter.id} →
            </button>
          )}
        </div>
      </div>

      {/* Chapter Title Banner */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span
            className={`px-2.5 py-1 rounded-md font-mono text-xs font-bold ${
              chapter.trackId === 'algo'
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                : chapter.trackId === 'c'
                ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                : 'bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300'
            }`}
          >
            Parcours {TRACK_LABELS[chapter.trackId].letter} • {TRACK_LABELS[chapter.trackId].short}{' '}
            — Chapitre {chapter.id}
          </span>
          {chapProgress?.validated && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Chapitre Validé
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
          {chapter.title}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mb-4">
          {chapter.subtitle}
        </p>

        {/* Objectives & Prerequisites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 mb-2">
              <Target className="w-4 h-4" />
              <span>Objectifs d&apos;apprentissage</span>
            </div>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              {chapter.lesson.objectives.map((obj, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Prérequis &amp; Passerelles associées
              </div>
              <div className="flex flex-wrap gap-1.5">
                {chapter.prerequisites.length === 0 ? (
                  <span className="text-xs text-slate-500">
                    Aucun prérequis (accessible aux débutants absolus)
                  </span>
                ) : (
                  chapter.prerequisites.map((preId) => {
                    const preChap = getChapterById(preId);
                    return (
                      <button
                        key={preId}
                        type="button"
                        onClick={() => onSelectChapter(preId)}
                        className="px-2.5 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium hover:border-blue-400 cursor-pointer"
                      >
                        Prérequis : <strong>{preId}</strong>{' '}
                        {preChap ? `(${preChap.title})` : ''}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {chapter.relatedChapters.length > 0 && (
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1.5">
                  Chapitres liés / Passerelles inter-parcours :
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {chapter.relatedChapters.map((relId) => {
                    const relChap = getChapterById(relId);
                    return (
                      <button
                        key={relId}
                        type="button"
                        onClick={() => onSelectChapter(relId)}
                        className="px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium hover:opacity-90 cursor-pointer"
                      >
                        ↔ <strong>{relId}</strong> {relChap ? relChap.title : ''}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 1. Intuition, Formal Definition & Concrete Analogy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>1. Comprendre intuitivement la notion</span>
            </h2>
            <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              <RichText text={chapter.lesson.intuition} />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>2. Définition rigoureuse &amp; Règles formelles</span>
            </h2>
            <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-x-auto">
              <RichText text={chapter.lesson.formalDefinition} />
            </div>
          </div>
        </div>

        {/* Analogy Card */}
        <div className="rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 text-xs font-bold mb-3">
              <Lightbulb className="w-4 h-4" />
              <span>Analogie concrète</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              {chapter.lesson.analogy.title}
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              <RichText text={chapter.lesson.analogy.content} />
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-amber-200/70 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-300">
            <strong>Pourquoi cette analogie ?</strong> Relier un concept abstrait à un mécanisme physique facilite la mémorisation durable et évite les confusions lors du débogage.
          </div>
        </div>
      </div>

      {/* 2. Bilingual Technical Vocabulary Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
          <Languages className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <span>3. Vocabulaire technique Français / Anglais</span>
        </h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                <th className="py-2.5 px-4">Terme Français</th>
                <th className="py-2.5 px-4">Terme Anglais (Standard international)</th>
                <th className="py-2.5 px-4">Définition opérationnelle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {chapter.lesson.vocabulary.map((voc, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">
                    {voc.fr}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-purple-700 dark:text-purple-300 font-semibold">
                    {voc.en}
                  </td>
                  <td className="py-2.5 px-4 text-slate-700 dark:text-slate-300">
                    {voc.definition}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Simple Annotated Example */}
      {renderAnnotatedExample(
        chapter.lesson.simpleExample,
        'Exemple Fondamental (Pas à pas)',
        'simple',
        simpleRunResult
      )}

      {/* 4. Intermediate Annotated Example */}
      {renderAnnotatedExample(
        chapter.lesson.intermediateExample,
        'Exemple Intermédiaire (Mise en situation)',
        'intermediate',
        intermediateRunResult
      )}

      {/* 5. Common Mistakes */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
          <AlertOctagon className="w-5 h-5 text-red-600 dark:text-red-400" />
          <span>4. Erreurs classiques à éviter absolument</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {chapter.lesson.commonMistakes.map((mistake, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/30 dark:bg-red-950/15 space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {mistake.title}
                </span>
                <span className="px-2 py-0.5 rounded bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 text-[10px] font-bold uppercase">
                  Erreur de {mistake.errorType}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-red-950/90 text-red-200 border border-red-800">
                  <div className="text-[10px] font-sans font-bold uppercase text-red-400 mb-1">
                    ✗ Code incorrect :
                  </div>
                  <pre className="whitespace-pre-wrap">{mistake.wrongCode}</pre>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-950/90 text-emerald-200 border border-emerald-800">
                  <div className="text-[10px] font-sans font-bold uppercase text-emerald-400 mb-1">
                    ✓ Code correct :
                  </div>
                  <pre className="whitespace-pre-wrap">{mistake.rightCode}</pre>
                </div>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {mistake.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Lesson Summary */}
      <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
          <ListChecks className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>5. L&apos;essentiel à retenir (Synthèse du cours)</span>
        </h2>
        <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          {chapter.lesson.summary.map((point, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <RichText text={point} />
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* 7. Comprehension Quiz */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>6. Quiz de vérification de compréhension de la leçon</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Répondez correctement à ces questions pour valider la lecture active du cours avant de passer aux exercices pratiques.
            </p>
          </div>
          {chapProgress?.lessonCompleted && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              Quiz de leçon validé
            </span>
          )}
        </div>

        <div className="space-y-4">
          {chapter.lesson.comprehensionQuestions.map((q, qIdx) => {
            const selected = quizAnswers[q.id];
            const isCorrect = selected === q.correctIndex;

            return (
              <div
                key={q.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3"
              >
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  Question {qIdx + 1} : {q.question}
                </div>
                <div className="space-y-2">
                  {q.options.map((opt, oIdx) => {
                    const isChecked = selected === oIdx;
                    let optionStyle =
                      'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200';
                    if (quizSubmitted) {
                      if (oIdx === q.correctIndex) {
                        optionStyle =
                          'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-semibold';
                      } else if (isChecked && oIdx !== q.correctIndex) {
                        optionStyle =
                          'border-red-400 bg-red-50 dark:bg-red-950/60 text-red-900 dark:text-red-200';
                      }
                    } else if (isChecked) {
                      optionStyle =
                        'border-blue-500 bg-blue-50 dark:bg-blue-950/50 text-blue-900 dark:text-blue-200 font-semibold';
                    }

                    return (
                      <label
                        key={oIdx}
                        className={`flex items-center gap-3 p-3 rounded-lg border text-xs sm:text-sm cursor-pointer transition ${optionStyle}`}
                      >
                        <input
                          type="radio"
                          name={`quiz-${chapter.id}-${q.id}`}
                          checked={isChecked}
                          onChange={() => {
                            setQuizAnswers((prev) => ({ ...prev, [q.id]: oIdx }));
                            setQuizSubmitted(false);
                          }}
                          className="accent-blue-600"
                        />
                        <span>{opt}</span>
                      </label>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <div
                    className={`p-3 rounded-lg text-xs ${
                      isCorrect
                        ? 'bg-emerald-100/70 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200'
                        : 'bg-amber-100/70 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200'
                    }`}
                  >
                    <strong>{isCorrect ? '✓ Bonne réponse : ' : '✗ Explication : '}</strong>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {quizResultBanner && (
          <div
            className={`p-4 rounded-xl border text-sm font-medium ${
              quizResultBanner.allCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                : 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200'
            }`}
          >
            {quizResultBanner.allCorrect ? (
              <span>
                🎉 Parfait ({quizResultBanner.score}/{quizResultBanner.total}) ! Vous avez validé la compréhension théorique de ce chapitre. Passez maintenant aux exercices d&apos;application.
              </span>
            ) : (
              <span>
                Score actuel : {quizResultBanner.score}/{quizResultBanner.total}. Lisez les explications affichées sous chaque question et corrigez vos réponses pour valider le quiz.
              </span>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleVerifyQuiz}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow transition cursor-pointer"
          >
            Vérifier mes réponses au quiz
          </button>

          {chapter.exercises.length > 0 && (
            <button
              type="button"
              onClick={() => onOpenExercise(chapter.id, chapter.exercises[0].id)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow transition cursor-pointer"
            >
              <span>Commencer l&apos;Exercice 1 : {chapter.exercises[0].title}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
