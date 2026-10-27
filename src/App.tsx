import React, { useEffect, useState } from 'react';
import {
  Award,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Code2,
  FlaskConical,
  GitCompareArrows,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Moon,
  Settings,
  Sun,
  Terminal,
  X,
} from 'lucide-react';
import {
  DashboardView,
  TracksOverviewView,
  ChapterListView,
} from './components/DashboardAndTracksViews';
import { LessonView } from './components/LessonView';
import { ExerciseView } from './components/ExerciseView';
import {
  LabView,
  ProgressReportView,
  SettingsView,
} from './components/LabProgressSettingsViews';
import {
  ALGO_CHAPTERS,
  ALL_CHAPTERS,
  C_CHAPTERS,
  getChapterById,
} from './data/curriculumIndex';
import {
  clearAllStoredProgress,
  ExerciseSubmissionUpdate,
  loadFromIndexedDB,
  loadProgressFromLocalStorage,
  markChapterConsulted,
  recordExerciseSubmission,
  recordLessonQuizSubmission,
  saveExerciseDraftCode,
  saveProgressToStorage,
  unlockExerciseHint,
  updateLastLocation,
  updatePreferences,
} from './services/storageService';
import {
  LabSnippet,
  LastLocationState,
  StudentProgressState,
  TrackId,
  UserPreferences,
} from './types/curriculum';

export const App: React.FC = () => {
  const [progress, setProgress] = useState<StudentProgressState>(() =>
    loadProgressFromLocalStorage()
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [labTransferData, setLabTransferData] = useState<{
    title: string;
    language: 'c' | 'pseudo';
    code: string;
    stdin: string;
  } | null>(null);

  // Hydrate from IndexedDB on mount if newer
  useEffect(() => {
    let mounted = true;
    loadFromIndexedDB().then((idbState) => {
      if (!mounted || !idbState) return;
      setProgress((current) => {
        if (idbState.lastActivityAt > current.lastActivityAt) {
          saveProgressToStorage(idbState);
          return idbState;
        }
        return current;
      });
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Synchronize dark mode class on <html>
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle(
        'dark',
        progress.preferences.theme === 'dark'
      );
    }
  }, [progress.preferences.theme]);

  const commitState = (next: StudentProgressState) => {
    setProgress(next);
    saveProgressToStorage(next);
  };

  const { screen, trackId, chapterId, exerciseId } = progress.lastLocation;
  const activeChapter = getChapterById(chapterId) ?? ALGO_CHAPTERS[0];
  const activeExercise =
    activeChapter.exercises.find((e) => e.id === exerciseId) ??
    activeChapter.exercises[0];

  const handleNavigateScreen = (nextScreen: LastLocationState['screen']) => {
    setMobileMenuOpen(false);
    commitState(updateLastLocation(progress, { screen: nextScreen }));
  };

  const handleSelectTrack = (targetTrack: TrackId) => {
    setMobileMenuOpen(false);
    const defaultChap = targetTrack === 'algo' ? 'A01' : 'B01';
    commitState(
      updateLastLocation(progress, {
        screen: 'chapters',
        trackId: targetTrack,
        chapterId: defaultChap,
      })
    );
  };

  const handleOpenChapterLesson = (targetChapterId: string) => {
    setMobileMenuOpen(false);
    const ch = getChapterById(targetChapterId);
    if (!ch) return;
    let next = markChapterConsulted(progress, ch.id);
    next = updateLastLocation(next, {
      screen: 'lesson',
      trackId: ch.trackId,
      chapterId: ch.id,
      exerciseId: ch.exercises[0]?.id,
    });
    commitState(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenExercise = (targetChapterId: string, targetExerciseId: string) => {
    setMobileMenuOpen(false);
    const ch = getChapterById(targetChapterId);
    if (!ch) return;
    let next = markChapterConsulted(progress, ch.id);
    next = updateLastLocation(next, {
      screen: 'exercise',
      trackId: ch.trackId,
      chapterId: ch.id,
      exerciseId: targetExerciseId,
    });
    commitState(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResumeLearning = () => {
    if (progress.lastLocation.screen === 'exercise' && progress.lastLocation.exerciseId) {
      handleOpenExercise(
        progress.lastLocation.chapterId,
        progress.lastLocation.exerciseId
      );
    } else {
      handleOpenChapterLesson(progress.lastLocation.chapterId || 'A01');
    }
  };

  const handleOpenInLab = (
    title: string,
    language: 'c' | 'pseudo',
    code: string,
    stdin: string
  ) => {
    setLabTransferData({ title, language, code, stdin });
    handleNavigateScreen('lab');
  };

  const handleSubmitLessonQuiz = (answers: Record<string, number>) => {
    const res = recordLessonQuizSubmission(progress, activeChapter, answers);
    commitState(res.nextState);
    return {
      allCorrect: res.allCorrect,
      score: res.score,
      total: res.total,
    };
  };

  const handleRecordExerciseSubmission = (update: ExerciseSubmissionUpdate) => {
    if (!activeExercise) return;
    const next = recordExerciseSubmission(
      progress,
      activeChapter,
      activeExercise,
      update
    );
    commitState(next);
  };

  const handleUnlockHint = () => {
    if (!activeExercise) return;
    const next = unlockExerciseHint(progress, activeExercise.id);
    commitState(next);
  };

  const handleSaveDraftCode = (code: string, secondaryCode?: string) => {
    if (!activeExercise) return;
    const next = saveExerciseDraftCode(
      progress,
      activeExercise.id,
      code,
      secondaryCode
    );
    commitState(next);
  };

  const handleSaveLabSnippets = (snippets: LabSnippet[]) => {
    const next: StudentProgressState = {
      ...progress,
      lastActivityAt: new Date().toISOString(),
      labSnippets: snippets,
    };
    commitState(next);
  };

  const handleUpdatePreferences = (prefs: Partial<UserPreferences>) => {
    const next = updatePreferences(progress, prefs);
    commitState(next);
  };

  const handleResetAll = async () => {
    const fresh = await clearAllStoredProgress();
    setProgress(fresh);
  };

  const totalValidated = ALL_CHAPTERS.filter(
    (c) => progress.chapters[c.id]?.validated
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-4 lg:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Ouvrir le menu de navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={() => handleNavigateScreen('dashboard')}
            className="flex items-center gap-2.5 text-left cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm sm:text-base leading-tight text-slate-900 dark:text-white">
                Algo &amp; Langage C99
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Plateforme d&apos;ingénierie 1re année • Compilateur &amp; Bac à sable C intégré
              </div>
            </div>
          </button>
        </div>

        {/* Quick Chapter Jump & Theme Controls */}
        <div className="flex items-center gap-2.5">
          <select
            aria-label="Accès rapide à un chapitre"
            value={activeChapter.id}
            onChange={(e) => handleOpenChapterLesson(e.target.value)}
            className="hidden md:block px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 max-w-xs cursor-pointer"
          >
            <optgroup label="Parcours A — Algorithmique (A01–A16)">
              {ALGO_CHAPTERS.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.id} — {ch.title} {progress.chapters[ch.id]?.validated ? '✓' : ''}
                </option>
              ))}
            </optgroup>
            <optgroup label="Parcours B — Langage C (B01–B16)">
              {C_CHAPTERS.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.id} — {ch.title} {progress.chapters[ch.id]?.validated ? '✓' : ''}
                </option>
              ))}
            </optgroup>
          </select>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
            <Award className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{totalValidated} / 32 validés</span>
          </div>

          <button
            type="button"
            onClick={() =>
              handleUpdatePreferences({
                theme: progress.preferences.theme === 'dark' ? 'light' : 'dark',
              })
            }
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
            title="Basculer le thème clair / sombre"
          >
            {progress.preferences.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex">
        {/* Sidebar Navigation */}
        <aside
          className={`${
            mobileMenuOpen ? 'fixed inset-y-0 left-0 z-40 w-72 pt-16' : 'hidden'
          } lg:block lg:w-72 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto`}
        >
          <div className="p-4 space-y-6">
            {/* Primary Navigation */}
            <nav className="space-y-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => handleNavigateScreen('dashboard')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition cursor-pointer ${
                  screen === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Tableau de bord</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTrack('algo')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition cursor-pointer ${
                  screen === 'chapters' && trackId === 'algo'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Code2 className="w-4 h-4 text-emerald-500" />
                  <span>Parcours A — Algorithmique</span>
                </span>
                <span className="text-[11px] opacity-80">16 chap.</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTrack('c')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition cursor-pointer ${
                  screen === 'chapters' && trackId === 'c'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Terminal className="w-4 h-4 text-blue-500" />
                  <span>Parcours B — Langage C99</span>
                </span>
                <span className="text-[11px] opacity-80">16 chap.</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavigateScreen('tracks')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition cursor-pointer ${
                  screen === 'tracks'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <GitCompareArrows className="w-4 h-4 text-purple-500" />
                <span>Passerelles Algo → C</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavigateScreen('lab')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition cursor-pointer ${
                  screen === 'lab'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <FlaskConical className="w-4 h-4 text-amber-500" />
                <span>Laboratoire C99 &amp; Pseudo-code</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavigateScreen('report')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition cursor-pointer ${
                  screen === 'report'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-blue-500" />
                <span>Bilan &amp; Acquis</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavigateScreen('settings')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition cursor-pointer ${
                  screen === 'settings'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Settings className="w-4 h-4 text-slate-500" />
                <span>Sauvegarde &amp; Paramètres</span>
              </button>
            </nav>

            {/* Quick Chapter Tree in Sidebar */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 px-2 mb-1.5">
                  A. Algorithmique (A01–A16)
                </div>
                <div className="space-y-0.5 max-h-48 overflow-y-auto pr-1">
                  {ALGO_CHAPTERS.map((ch) => {
                    const isCurrent =
                      (screen === 'lesson' || screen === 'exercise') &&
                      activeChapter.id === ch.id;
                    const isVal = Boolean(progress.chapters[ch.id]?.validated);
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => handleOpenChapterLesson(ch.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left transition cursor-pointer ${
                          isCurrent
                            ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-200 font-bold'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <span className="truncate">
                          <strong className="font-mono mr-1">{ch.id}</strong> {ch.title}
                        </span>
                        {isVal && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 px-2 mb-1.5">
                  B. Langage C99 (B01–B16)
                </div>
                <div className="space-y-0.5 max-h-48 overflow-y-auto pr-1">
                  {C_CHAPTERS.map((ch) => {
                    const isCurrent =
                      (screen === 'lesson' || screen === 'exercise') &&
                      activeChapter.id === ch.id;
                    const isVal = Boolean(progress.chapters[ch.id]?.validated);
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => handleOpenChapterLesson(ch.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left transition cursor-pointer ${
                          isCurrent
                            ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-200 font-bold'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <span className="truncate">
                          <strong className="font-mono mr-1">{ch.id}</strong> {ch.title}
                        </span>
                        {isVal && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
          {screen === 'dashboard' && (
            <DashboardView
              progress={progress}
              onResumeLearning={handleResumeLearning}
              onSelectTrack={handleSelectTrack}
              onOpenChapterLesson={handleOpenChapterLesson}
              onOpenExercise={handleOpenExercise}
              onNavigateScreen={handleNavigateScreen}
            />
          )}

          {screen === 'tracks' && (
            <TracksOverviewView
              progress={progress}
              onSelectTrack={handleSelectTrack}
              onOpenChapterLesson={handleOpenChapterLesson}
              onOpenExercise={handleOpenExercise}
            />
          )}

          {screen === 'chapters' && (
            <ChapterListView
              trackId={trackId}
              progress={progress}
              onSwitchTrack={handleSelectTrack}
              onOpenLesson={handleOpenChapterLesson}
              onOpenExercise={handleOpenExercise}
            />
          )}

          {screen === 'lesson' && (
            <LessonView
              chapter={activeChapter}
              progress={progress}
              onSubmitQuiz={handleSubmitLessonQuiz}
              onOpenExercise={handleOpenExercise}
              onSelectChapter={handleOpenChapterLesson}
              onBackToChapters={() => handleSelectTrack(activeChapter.trackId)}
              onOpenInLab={handleOpenInLab}
            />
          )}

          {screen === 'exercise' && activeExercise && (
            <ExerciseView
              chapter={activeChapter}
              exercise={activeExercise}
              progress={progress}
              onRecordSubmission={handleRecordExerciseSubmission}
              onUnlockHint={handleUnlockHint}
              onSaveDraftCode={handleSaveDraftCode}
              onSelectExercise={handleOpenExercise}
              onBackToLesson={() => handleOpenChapterLesson(activeChapter.id)}
              onOpenChapterLesson={handleOpenChapterLesson}
            />
          )}

          {screen === 'lab' && (
            <LabView
              progress={progress}
              initialLabData={labTransferData}
              onSaveSnippets={handleSaveLabSnippets}
            />
          )}

          {screen === 'report' && (
            <ProgressReportView
              progress={progress}
              onOpenChapterLesson={handleOpenChapterLesson}
              onOpenExercise={handleOpenExercise}
            />
          )}

          {screen === 'settings' && (
            <SettingsView
              progress={progress}
              onUpdatePreferences={handleUpdatePreferences}
              onImportState={commitState}
              onResetAll={handleResetAll}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
