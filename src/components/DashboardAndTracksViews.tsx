import React, { useState } from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Code2,
  Compass,
  FlaskConical,
  GitCompareArrows,
  Layers,
  Play,
  Search,
  Sparkles,
  Terminal,
} from 'lucide-react';
import {
  ALGO_CHAPTERS,
  C_CHAPTERS,
  ALL_CHAPTERS,
  getBridgePairs,
  getChapterById,
} from '../data/curriculumIndex';
import { Chapter, StudentProgressState, TrackId } from '../types/curriculum';

interface DashboardViewProps {
  progress: StudentProgressState;
  onResumeLearning: () => void;
  onSelectTrack: (trackId: TrackId) => void;
  onOpenChapterLesson: (chapterId: string) => void;
  onOpenExercise: (chapterId: string, exerciseId: string) => void;
  onNavigateScreen: (
    screen: 'dashboard' | 'tracks' | 'chapters' | 'lesson' | 'exercise' | 'lab' | 'report' | 'settings'
  ) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  progress,
  onResumeLearning,
  onSelectTrack,
  onOpenChapterLesson,
  onOpenExercise,
  onNavigateScreen,
}) => {
  const algoValidated = ALGO_CHAPTERS.filter((c) => progress.chapters[c.id]?.validated).length;
  const cValidated = C_CHAPTERS.filter((c) => progress.chapters[c.id]?.validated).length;
  const totalValidated = algoValidated + cValidated;

  const allExercises = ALL_CHAPTERS.flatMap((c) => c.exercises);
  const solvedExercises = allExercises.filter((ex) => progress.exercises[ex.id]?.passed).length;

  const lastChap = getChapterById(progress.lastLocation.chapterId) ?? ALGO_CHAPTERS[0];

  // Recommend next unvalidated chapter in each track
  const nextAlgoChapter =
    ALGO_CHAPTERS.find((c) => !progress.chapters[c.id]?.validated) ?? ALGO_CHAPTERS[0];
  const nextCChapter =
    C_CHAPTERS.find((c) => !progress.chapters[c.id]?.validated) ?? C_CHAPTERS[0];

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 shadow-md border border-blue-900/50">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Première année d&apos;École d&apos;Ingénieurs • Parcours Complet Autonome</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            De zéro aux fondamentaux de l&apos;Algorithmique et du Langage C
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Apprenez à construire un raisonnement algorithmique rigoureux, à tracer vos algorithmes
            pas à pas, puis à programmer, compiler et déboguer vos programmes C99 avec un inspecteur
            de mémoire (Pile &amp; Tas) intégré directement dans votre navigateur.
          </p>
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onResumeLearning}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow transition cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>
                Reprendre : {lastChap.id} — {lastChap.title}
              </span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateScreen('tracks')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium text-sm border border-slate-700 transition cursor-pointer"
            >
              <GitCompareArrows className="w-4 h-4 text-emerald-400" />
              <span>Passerelles Algo → C</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateScreen('lab')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium text-sm border border-slate-700 transition cursor-pointer"
            >
              <FlaskConical className="w-4 h-4 text-amber-400" />
              <span>Laboratoire C99 &amp; Pseudo-code</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Chapitres validés</span>
            <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {totalValidated} <span className="text-sm font-normal text-slate-400">/ 32</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Validation basée sur les acquis (quiz + ≥75% d&apos;exercices réussis)
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Exercices résolus</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {solvedExercises}{' '}
            <span className="text-sm font-normal text-slate-400">/ {allExercises.length}</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tests déterministes (cas normaux, limites et invalides)
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Parcours A — Algorithmique</span>
            <Code2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {Math.round((algoValidated / 16) * 100)}%
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 mt-2 overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all"
              style={{ width: `${(algoValidated / 16) * 100}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {algoValidated} / 16 chapitres validés
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Parcours B — Langage C (C99)</span>
            <Terminal className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {Math.round((cValidated / 16) * 100)}%
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 mt-2 overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all"
              style={{ width: `${(cValidated / 16) * 100}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {cValidated} / 16 chapitres validés
          </p>
        </div>
      </div>

      {/* Two Main Tracks Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Track A */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                <Code2 className="w-4 h-4" />
                PARCOURS A — ALGORITHMIQUE (A01 à A16)
              </span>
              <span className="text-xs text-slate-500">16 chapitres progressifs</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Construire un raisonnement logique et écrire du pseudo-code
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Variables, expressions, structures conditionnelles, boucles, sous-programmes,
              tableaux, recherches (séquentielle et dichotomique), tris élémentaires, traces
              d&apos;exécution, invariants de boucle et récursivité.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 mb-4">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Prochaine étape recommandée (Parcours A) :
              </div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">
                {nextAlgoChapter.id} — {nextAlgoChapter.title}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {nextAlgoChapter.subtitle}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => onOpenChapterLesson(nextAlgoChapter.id)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold transition cursor-pointer"
            >
              <span>Étudier {nextAlgoChapter.id}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onSelectTrack('algo')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-medium transition cursor-pointer"
            >
              <span>Voir les 16 chapitres Algo</span>
            </button>
          </div>
        </div>

        {/* Track B */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 text-xs font-bold">
                <Terminal className="w-4 h-4" />
                PARCOURS B — LANGAGE C ISO C99 (B01 à B16)
              </span>
              <span className="text-xs text-slate-500">Accès libre &amp; indépendant</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Maîtriser la programmation C, la compilation et la mémoire
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Structure d&apos;un programme C, types et conversions, <code>printf</code> /{' '}
              <code>scanf</code>, contrôle, fonctions, portée, tableaux, chaînes ASCIIZ, pointeurs
              et adresses mémoire, structures, <code>malloc</code> / <code>free</code> et débogage.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 mb-4">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Prochaine étape recommandée (Parcours B) :
              </div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">
                {nextCChapter.id} — {nextCChapter.title}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {nextCChapter.subtitle}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => onOpenChapterLesson(nextCChapter.id)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold transition cursor-pointer"
            >
              <span>Étudier {nextCChapter.id}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onSelectTrack('c')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-medium transition cursor-pointer"
            >
              <span>Voir les 16 chapitres C</span>
            </button>
          </div>
        </div>
      </div>

      {/* Featured Bridge Preview */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <GitCompareArrows className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Passerelles méthodologiques : Du raisonnement algorithmique au programme C</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Les deux parcours sont accessibles librement, mais ces passerelles vous guident pas à pas de l&apos;analyse logique à l&apos;implémentation C99.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateScreen('tracks')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            Voir les 6 passerelles détaillées →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {getBridgePairs()
            .slice(0, 3)
            .map((pair) => (
              <div
                key={pair.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                    {pair.title}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                    {pair.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-slate-200/80 dark:border-slate-700/60">
                  <button
                    type="button"
                    onClick={() =>
                      pair.algoExercise
                        ? onOpenExercise(pair.algoChapter.id, pair.algoExercise.id)
                        : onOpenChapterLesson(pair.algoChapter.id)
                    }
                    className="px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold hover:opacity-90 cursor-pointer"
                  >
                    Algo {pair.algoChapter.id}
                  </button>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  <button
                    type="button"
                    onClick={() =>
                      pair.cExercise
                        ? onOpenExercise(pair.cChapter.id, pair.cExercise.id)
                        : onOpenChapterLesson(pair.cChapter.id)
                    }
                    className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-[11px] font-semibold hover:opacity-90 cursor-pointer"
                  >
                    Langage C {pair.cChapter.id}
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// TRACKS OVERVIEW & BRIDGES VIEW
// ============================================================================

interface TracksOverviewViewProps {
  progress: StudentProgressState;
  onSelectTrack: (trackId: TrackId) => void;
  onOpenChapterLesson: (chapterId: string) => void;
  onOpenExercise: (chapterId: string, exerciseId: string) => void;
}

export const TracksOverviewView: React.FC<TracksOverviewViewProps> = ({
  progress,
  onSelectTrack,
  onOpenChapterLesson,
  onOpenExercise,
}) => {
  const bridges = getBridgePairs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Parcours Pédagogiques &amp; Passerelles Algorithmique → C
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Naviguez librement entre le parcours Algorithmique (Parcours A) et le parcours Langage C (Parcours B). Utilisez les 6 passerelles ci-dessous pour relier la conception en pseudo-code à l&apos;implémentation en C99.
        </p>
      </div>

      {/* 7-Step Pedagogical Bridge Methodology */}
      <div className="rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/30 p-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
          <Compass className="w-4 h-4" />
          <span>La méthode d&apos;ingénieur en 7 étapes (Du problème au programme C validé)</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5 text-xs">
          {[
            { step: '1. Comprendre', desc: 'Identifier les entrées, les sorties et les contraintes.' },
            { step: '2. Pseudo-code', desc: 'Écrire la logique sans se soucier des détails syntaxiques C.' },
            { step: '3. Tracer', desc: 'Dérouler à la main sur un exemple avec une table de trace.' },
            { step: '4. Traduire en C', desc: 'Choisir les types C99, pointeurs et prototypes adaptés.' },
            { step: '5. Compiler', desc: 'Corriger les erreurs syntaxiques et avertissements -Wall.' },
            { step: '6. Tester', desc: 'Vérifier les cas normaux, cas limites (0, bornes) et invalides.' },
            { step: '7. Expliquer', desc: 'Justifier la terminaison et l’absence de fuite mémoire.' },
          ].map((item) => (
            <div
              key={item.step}
              className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900/60"
            >
              <div className="font-bold text-blue-700 dark:text-blue-300 mb-1">{item.step}</div>
              <div className="text-slate-600 dark:text-slate-400 leading-snug">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* The 6 Bridges */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <GitCompareArrows className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>Les 6 Passerelles Interactives (Algorithmique ↔ Langage C)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bridges.map((pair) => {
            const algoDone = Boolean(progress.chapters[pair.algoChapter.id]?.validated);
            const cDone = Boolean(progress.chapters[pair.cChapter.id]?.validated);

            return (
              <div
                key={pair.id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
                    {pair.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    {pair.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  {/* Algo Side */}
                  <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/60">
                    <div className="flex items-center justify-between text-[11px] font-bold text-emerald-800 dark:text-emerald-300 mb-1">
                      <span>ÉTAPE ALGO ({pair.algoChapter.id})</span>
                      {algoDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2 truncate">
                      {pair.algoChapter.title}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => onOpenChapterLesson(pair.algoChapter.id)}
                        className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 text-[11px] font-medium text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 cursor-pointer"
                      >
                        Cours {pair.algoChapter.id}
                      </button>
                      {pair.algoExercise && (
                        <button
                          type="button"
                          onClick={() =>
                            onOpenExercise(pair.algoChapter.id, pair.algoExercise!.id)
                          }
                          className="px-2 py-1 rounded bg-emerald-600 text-white text-[11px] font-medium hover:bg-emerald-500 cursor-pointer"
                        >
                          Exercice {pair.algoExercise.id}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* C Side */}
                  <div className="p-3 rounded-lg bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-900/60">
                    <div className="flex items-center justify-between text-[11px] font-bold text-blue-800 dark:text-blue-300 mb-1">
                      <span>ÉTAPE LANGAGE C ({pair.cChapter.id})</span>
                      {cDone && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                    </div>
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2 truncate">
                      {pair.cChapter.title}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => onOpenChapterLesson(pair.cChapter.id)}
                        className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-blue-300 dark:border-blue-800 text-[11px] font-medium text-blue-700 dark:text-blue-300 hover:bg-blue-100 cursor-pointer"
                      >
                        Cours {pair.cChapter.id}
                      </button>
                      {pair.cExercise && (
                        <button
                          type="button"
                          onClick={() => onOpenExercise(pair.cChapter.id, pair.cExercise!.id)}
                          className="px-2 py-1 rounded bg-blue-600 text-white text-[11px] font-medium hover:bg-blue-500 cursor-pointer"
                        >
                          Exercice {pair.cExercise.id}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Complete Syllabus Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-600" />
              <span>Sommaire Parcours A — Algorithmique (16 chapitres)</span>
            </h3>
            <button
              type="button"
              onClick={() => onSelectTrack('algo')}
              className="text-xs font-semibold text-emerald-600 hover:underline cursor-pointer"
            >
              Ouvrir le parcours →
            </button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {ALGO_CHAPTERS.map((ch) => {
              const isVal = Boolean(progress.chapters[ch.id]?.validated);
              return (
                <div
                  key={ch.id}
                  className="py-2 flex items-center justify-between gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 px-2 rounded"
                >
                  <button
                    type="button"
                    onClick={() => onOpenChapterLesson(ch.id)}
                    className="text-left font-medium text-slate-800 dark:text-slate-200 hover:text-emerald-600 cursor-pointer"
                  >
                    <strong className="font-mono text-emerald-600 dark:text-emerald-400 mr-1.5">
                      {ch.id}
                    </strong>
                    {ch.title}
                  </button>
                  {isVal ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold">
                      Validé
                    </span>
                  ) : (
                    <span className="text-slate-400">{ch.exercises.length} ex.</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-blue-600" />
              <span>Sommaire Parcours B — Langage C (16 chapitres)</span>
            </h3>
            <button
              type="button"
              onClick={() => onSelectTrack('c')}
              className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
            >
              Ouvrir le parcours →
            </button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {C_CHAPTERS.map((ch) => {
              const isVal = Boolean(progress.chapters[ch.id]?.validated);
              return (
                <div
                  key={ch.id}
                  className="py-2 flex items-center justify-between gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 px-2 rounded"
                >
                  <button
                    type="button"
                    onClick={() => onOpenChapterLesson(ch.id)}
                    className="text-left font-medium text-slate-800 dark:text-slate-200 hover:text-blue-600 cursor-pointer"
                  >
                    <strong className="font-mono text-blue-600 dark:text-blue-400 mr-1.5">
                      {ch.id}
                    </strong>
                    {ch.title}
                  </button>
                  {isVal ? (
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-semibold">
                      Validé
                    </span>
                  ) : (
                    <span className="text-slate-400">{ch.exercises.length} ex.</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// CHAPTER LIST VIEW (FOR TRACK A OR TRACK B)
// ============================================================================

interface ChapterListViewProps {
  trackId: TrackId;
  progress: StudentProgressState;
  onSwitchTrack: (trackId: TrackId) => void;
  onOpenLesson: (chapterId: string) => void;
  onOpenExercise: (chapterId: string, exerciseId: string) => void;
}

export const ChapterListView: React.FC<ChapterListViewProps> = ({
  trackId,
  progress,
  onSwitchTrack,
  onOpenLesson,
  onOpenExercise,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'validated' | 'in_progress' | 'todo'>(
    'all'
  );
  const [searchQuery, setSearchQuery] = useState('');

  const chapters: Chapter[] = trackId === 'algo' ? ALGO_CHAPTERS : C_CHAPTERS;

  const filteredChapters = chapters.filter((ch) => {
    const chProg = progress.chapters[ch.id];
    const isValidated = Boolean(chProg?.validated);
    const anyExAttempt = ch.exercises.some((e) => (progress.exercises[e.id]?.attemptsCount ?? 0) > 0);
    const isInProgress = !isValidated && (Boolean(chProg?.consulted) || anyExAttempt);

    if (statusFilter === 'validated' && !isValidated) return false;
    if (statusFilter === 'in_progress' && !isInProgress) return false;
    if (statusFilter === 'todo' && (isValidated || isInProgress)) return false;

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const matchTitle = ch.title.toLowerCase().includes(q);
      const matchSub = ch.subtitle.toLowerCase().includes(q);
      const matchId = ch.id.toLowerCase().includes(q);
      const matchConcepts = ch.coreConcepts.some((c) => c.toLowerCase().includes(q));
      return matchTitle || matchSub || matchId || matchConcepts;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Track Switcher Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              type="button"
              onClick={() => onSwitchTrack('algo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                trackId === 'algo'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:opacity-90'
              }`}
            >
              Parcours A — Algorithmique (A01–A16)
            </button>
            <button
              type="button"
              onClick={() => onSwitchTrack('c')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                trackId === 'c'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:opacity-90'
              }`}
            >
              Parcours B — Programmation C (B01–B16)
            </button>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {trackId === 'algo'
              ? 'Parcours A : Fondamentaux de l’Algorithmique & du Pseudo-code'
              : 'Parcours B : Programmation Structurée en Langage C (C99)'}
          </h1>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un chapitre, concept..."
              className="pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-0.5 text-xs">
            {[
              { id: 'all', label: 'Tous (16)' },
              { id: 'validated', label: 'Validés' },
              { id: 'in_progress', label: 'En cours' },
              { id: 'todo', label: 'À étudier' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  setStatusFilter(tab.id as 'all' | 'validated' | 'in_progress' | 'todo')
                }
                className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-slate-900 dark:bg-slate-700 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chapters List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredChapters.map((chapter) => {
          const chProg = progress.chapters[chapter.id];
          const isValidated = Boolean(chProg?.validated);
          const quizDone = Boolean(chProg?.lessonCompleted);
          const passedExCount = chapter.exercises.filter(
            (ex) => progress.exercises[ex.id]?.passed
          ).length;

          return (
            <div
              key={chapter.id}
              className={`rounded-xl border p-5 transition shadow-sm ${
                isValidated
                  ? 'border-emerald-300 dark:border-emerald-800/80 bg-white dark:bg-slate-900'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-md font-mono text-xs font-bold ${
                        trackId === 'algo'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                      }`}
                    >
                      Chapitre {chapter.id}
                    </span>

                    <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      ~{chapter.estimatedMinutes} min
                    </span>

                    {chapter.prerequisites.length > 0 && (
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        • Prérequis :{' '}
                        <strong className="font-mono">
                          {chapter.prerequisites.join(', ')}
                        </strong>
                      </span>
                    )}

                    {isValidated ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Chapitre Validé
                      </span>
                    ) : quizDone ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-medium">
                        Quiz de cours validé
                      </span>
                    ) : null}
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {chapter.title}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {chapter.subtitle}
                  </p>

                  {/* Core concepts pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {chapter.coreConcepts.map((concept) => (
                      <span
                        key={concept}
                        className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions & Exercise Pills */}
                <div className="flex flex-col sm:items-end justify-between gap-3 shrink-0">
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    Exercices réussis :{' '}
                    <strong className="text-slate-900 dark:text-white">
                      {passedExCount} / {chapter.exercises.length}
                    </strong>{' '}
                    (Quiz leçon : {quizDone ? '✓' : 'À faire'})
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenLesson(chapter.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90 text-xs font-semibold transition cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Étudier la leçon</span>
                    </button>

                    {chapter.exercises.map((ex, idx) => {
                      const exPassed = Boolean(progress.exercises[ex.id]?.passed);
                      return (
                        <button
                          key={ex.id}
                          type="button"
                          onClick={() => onOpenExercise(chapter.id, ex.id)}
                          title={`${ex.title} (${ex.category})`}
                          className={`px-2.5 py-2 rounded-lg text-xs font-mono font-semibold border transition cursor-pointer ${
                            exPassed
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                          }`}
                        >
                          Ex {idx + 1} {exPassed ? '✓' : ''}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
