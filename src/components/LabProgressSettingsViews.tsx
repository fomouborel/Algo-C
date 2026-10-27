import React, { useState } from 'react';
import {
  AlertTriangle,
  Award,
  BarChart3,
  CheckCircle2,
  Code2,
  Download,
  FlaskConical,
  HardDrive,
  Moon,
  Play,
  Plus,
  RotateCcw,
  Save,
  Settings,
  Sun,
  Terminal,
  Trash2,
  Upload,
} from 'lucide-react';
import {
  ALGO_CHAPTERS,
  ALL_CHAPTERS,
  C_CHAPTERS,
  LAB_TEMPLATES,
} from '../data/curriculumIndex';
import { executeCInSandbox, executePseudoInSandbox } from '../engines/workerClient';
import {
  exportProgressToJson,
  validateAndImportProgressJson,
} from '../services/storageService';
import {
  CompileAndRunResult,
  LabSnippet,
  StudentProgressState,
  UserPreferences,
} from '../types/curriculum';
import { CodeEditorWithLines } from './CodeEditorWithLines';
import { MemoryAndTraceInspector } from './MemoryAndTraceInspector';

// ============================================================================
// 1. LABORATORY VIEW (C99 & PSEUDO-CODE SANDBOX)
// ============================================================================

interface LabViewProps {
  progress: StudentProgressState;
  initialLabData?: {
    title: string;
    language: 'c' | 'pseudo';
    code: string;
    stdin: string;
  } | null;
  onSaveSnippets: (snippets: LabSnippet[]) => void;
}

export const LabView: React.FC<LabViewProps> = ({
  progress,
  initialLabData,
  onSaveSnippets,
}) => {
  const defaultSnippet = progress.labSnippets[0];
  const [title, setTitle] = useState<string>(
    initialLabData?.title ?? defaultSnippet?.title ?? 'Expérimentation C99'
  );
  const [language, setLanguage] = useState<'c' | 'pseudo'>(
    initialLabData?.language ?? defaultSnippet?.language ?? 'c'
  );
  const [code, setCode] = useState<string>(
    initialLabData?.code ?? defaultSnippet?.code ?? LAB_TEMPLATES[0].code
  );
  const [stdin, setStdin] = useState<string>(
    initialLabData?.stdin ?? defaultSnippet?.stdin ?? ''
  );
  const [result, setResult] = useState<CompileAndRunResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [saveBanner, setSaveBanner] = useState<string | null>(null);

  const handleRun = async () => {
    setIsRunning(true);
    try {
      const res =
        language === 'c'
          ? await executeCInSandbox(code, stdin)
          : await executePseudoInSandbox(code, stdin);
      setResult(res);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSaveSnippet = () => {
    const newSnippet: LabSnippet = {
      id: `snippet-${Date.now()}`,
      title: title.trim() || 'Programme sans titre',
      language,
      code,
      stdin,
      updatedAt: new Date().toISOString(),
    };
    const nextSnippets = [newSnippet, ...progress.labSnippets];
    onSaveSnippets(nextSnippets);
    setSaveBanner(`Programme « ${newSnippet.title} » sauvegardé localement.`);
    setTimeout(() => setSaveBanner(null), 3500);
  };

  const handleDeleteSnippet = (id: string) => {
    const next = progress.labSnippets.filter((s) => s.id !== id);
    onSaveSnippets(next);
  };

  const errorLines = (result?.diagnostics ?? [])
    .filter((d) => d.severity === 'error')
    .map((d) => d.line);
  const warningLines = (result?.diagnostics ?? [])
    .filter((d) => d.severity === 'warning')
    .map((d) => d.line);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-amber-500" />
            <span>Laboratoire Libre C99 &amp; Pseudo-code Algorithmique</span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Écrivez, compilez et exécutez librement vos programmes C99 ou vos algorithmes en pseudo-code avec inspection complète de la Pile, du Tas (<code>malloc</code>/<code>free</code>) et de la Table de Trace.
          </p>
        </div>

        {/* Language Toggle */}
        <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1">
          <button
            type="button"
            onClick={() => {
              setLanguage('c');
              setResult(null);
            }}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              language === 'c'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Mode Langage C (C99)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setLanguage('pseudo');
              setResult(null);
            }}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              language === 'pseudo'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Mode Pseudo-code</span>
          </button>
        </div>
      </div>

      {/* Templates & Saved Snippets Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Modèles pédagogiques prêts à exécuter :
          </div>
          <div className="flex flex-wrap gap-2">
            {LAB_TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => {
                  setTitle(tpl.label);
                  setLanguage(tpl.language === 'c' ? 'c' : 'pseudo');
                  setCode(tpl.code);
                  setStdin(tpl.stdin);
                  setResult(null);
                }}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-blue-400 text-xs font-medium text-slate-800 dark:text-slate-200 transition cursor-pointer"
              >
                {tpl.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Mes programmes sauvegardés ({progress.labSnippets.length}) :
          </div>
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
            {progress.labSnippets.map((snip) => (
              <div
                key={snip.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
              >
                <button
                  type="button"
                  onClick={() => {
                    setTitle(snip.title);
                    setLanguage(snip.language);
                    setCode(snip.code);
                    setStdin(snip.stdin);
                    setResult(null);
                  }}
                  className="font-medium text-slate-800 dark:text-slate-200 hover:text-blue-600 cursor-pointer"
                >
                  [{snip.language === 'c' ? 'C' : 'Algo'}] {snip.title}
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteSnippet(snip.id)}
                  className="text-slate-400 hover:text-red-500 cursor-pointer"
                  title="Supprimer ce programme"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Title & Save Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre du programme..."
            className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-900 dark:text-white w-full max-w-md"
          />
          <button
            type="button"
            onClick={handleSaveSnippet}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition cursor-pointer shrink-0"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Sauvegarder</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setTitle('Nouveau programme');
              setCode(
                language === 'c'
                  ? '#include <stdio.h>\n\nint main(void) {\n    printf("Bonjour !\\n");\n    return 0;\n}'
                  : 'ALGORITHME Nouveau\nVARIABLES\n    x : ENTIER\nDEBUT\n    x <- 42\n    AFFICHER(x)\nFIN'
              );
              setStdin('');
              setResult(null);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nouveau</span>
          </button>
        </div>

        {saveBanner && (
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            ✓ {saveBanner}
          </span>
        )}
      </div>

      {/* Editor */}
      <CodeEditorWithLines
        code={code}
        onChange={setCode}
        language={language}
        fontSize={progress.preferences.editorFontSize}
        errorLines={errorLines}
        warningLines={warningLines}
        onRunShortcut={handleRun}
        minHeight="320px"
        title={title}
      />

      {/* Stdin & Run Button */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex flex-col sm:flex-row items-stretch sm:items-end justify-between gap-4">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
            Flux d&apos;entrée standard (stdin pour <code>scanf</code> / <code>LIRE</code>) :
          </label>
          <textarea
            rows={2}
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            placeholder="Valeurs séparées par des sauts de ligne ou des espaces..."
            className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-900 dark:text-slate-100"
          />
        </div>

        <button
          type="button"
          disabled={isRunning}
          onClick={handleRun}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow transition cursor-pointer shrink-0"
        >
          <Play className="w-4 h-4" />
          <span>Compiler &amp; Exécuter (Ctrl+Entrée)</span>
        </button>
      </div>

      {/* Inspector */}
      <MemoryAndTraceInspector
        result={result}
        language={language}
        showWarnings={progress.preferences.showCompilerWarnings}
        defaultTab={language === 'c' ? 'memory' : 'trace'}
      />
    </div>
  );
};

// ============================================================================
// 2. PROGRESS REPORT VIEW
// ============================================================================

interface ProgressReportViewProps {
  progress: StudentProgressState;
  onOpenChapterLesson: (chapterId: string) => void;
  onOpenExercise: (chapterId: string, exerciseId: string) => void;
}

export const ProgressReportView: React.FC<ProgressReportViewProps> = ({
  progress,
  onOpenChapterLesson,
  onOpenExercise,
}) => {
  const allExercises = ALL_CHAPTERS.flatMap((c) => c.exercises);
  const totalPassedEx = allExercises.filter(
    (ex) => progress.exercises[ex.id]?.passed
  ).length;
  const totalAttempts = Object.values(progress.exercises).reduce(
    (acc, e) => acc + e.attemptsCount,
    0
  );

  const algoValCount = ALGO_CHAPTERS.filter(
    (c) => progress.chapters[c.id]?.validated
  ).length;
  const cValCount = C_CHAPTERS.filter((c) => progress.chapters[c.id]?.validated).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <span>Bilan de Progression &amp; Validation des Acquis</span>
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Suivi détaillé de vos compétences validées par chapitre, quiz de leçon et catégories d&apos;exercices.
        </p>
      </div>

      {/* Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="text-xs text-slate-500 mb-1">Chapitres validés au total</div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">
            {algoValCount + cValCount} / 32
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Algo : {algoValCount}/16 • Langage C : {cValCount}/16
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="text-xs text-slate-500 mb-1">Exercices réussis</div>
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {totalPassedEx} / {allExercises.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Soit {Math.round((totalPassedEx / Math.max(1, allExercises.length)) * 100)}% du programme pratique
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="text-xs text-slate-500 mb-1">Tentatives totales soumises</div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {totalAttempts}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Sauvegardées localement (IndexedDB &amp; localStorage)
          </div>
        </div>
      </div>

      {/* Detailed Matrix for Both Tracks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          {
            title: 'Parcours A — Algorithmique (A01 à A16)',
            chapters: ALGO_CHAPTERS,
            accent: 'emerald',
          },
          {
            title: 'Parcours B — Programmation C (B01 à B16)',
            chapters: C_CHAPTERS,
            accent: 'blue',
          },
        ].map((group) => (
          <div
            key={group.title}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3"
          >
            <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              <span>{group.title}</span>
            </h2>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {group.chapters.map((ch) => {
                const cState = progress.chapters[ch.id];
                const isVal = Boolean(cState?.validated);
                const quizOk = Boolean(cState?.lessonCompleted);
                const passedCount = ch.exercises.filter(
                  (e) => progress.exercises[e.id]?.passed
                ).length;

                return (
                  <div key={ch.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <button
                        type="button"
                        onClick={() => onOpenChapterLesson(ch.id)}
                        className="font-bold text-slate-900 dark:text-white hover:text-blue-600 text-left cursor-pointer"
                      >
                        <span className="font-mono mr-1.5">{ch.id}</span>
                        {ch.title}
                      </button>
                      <div className="text-[11px] text-slate-500">
                        Quiz leçon : {quizOk ? '✓ Validé' : 'Non validé'} • Exercices :{' '}
                        {passedCount}/{ch.exercises.length}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {ch.exercises.map((ex, idx) => {
                        const ok = Boolean(progress.exercises[ex.id]?.passed);
                        return (
                          <button
                            key={ex.id}
                            type="button"
                            onClick={() => onOpenExercise(ch.id, ex.id)}
                            title={ex.title}
                            className={`w-6 h-6 rounded text-[11px] font-mono font-bold cursor-pointer ${
                              ok
                                ? 'bg-emerald-500 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {idx + 1}
                          </button>
                        );
                      })}
                      {isVal && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 ml-1 shrink-0" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// 3. SETTINGS & BACKUP / RESTORE VIEW
// ============================================================================

interface SettingsViewProps {
  progress: StudentProgressState;
  onUpdatePreferences: (prefs: Partial<UserPreferences>) => void;
  onImportState: (restored: StudentProgressState) => void;
  onResetAll: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  progress,
  onUpdatePreferences,
  onImportState,
  onResetAll,
}) => {
  const [importText, setImportText] = useState('');
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleDownloadBackup = () => {
    const json = exportProgressToJson(progress);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sauvegarde-algo-c-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMessage({
      type: 'success',
      text: 'Fichier de sauvegarde JSON généré et téléchargé avec succès.',
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const content = String(reader.result ?? '');
      const check = validateAndImportProgressJson(content);
      if (check.valid && check.state) {
        onImportState(check.state);
        setStatusMessage({
          type: 'success',
          text: 'Sauvegarde importée et restaurée avec succès !',
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: check.error ?? 'Fichier de sauvegarde invalide.',
        });
      }
    };
    reader.readAsText(file);
  };

  const handleImportFromTextarea = () => {
    const check = validateAndImportProgressJson(importText);
    if (check.valid && check.state) {
      onImportState(check.state);
      setImportText('');
      setStatusMessage({
        type: 'success',
        text: 'Sauvegarde JSON restaurée avec succès !',
      });
    } else {
      setStatusMessage({
        type: 'error',
        text: check.error ?? 'Le contenu JSON collé est invalide.',
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-slate-700 dark:text-slate-300" />
          <span>Paramètres, Préférences &amp; Sauvegarde Locale</span>
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Personnalisez votre confort de lecture et gérez la sauvegarde locale de votre progression sans compte utilisateur.
        </p>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl border text-sm font-medium ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
              : 'bg-red-50 dark:bg-red-950/50 border-red-300 dark:border-red-800 text-red-800 dark:text-red-200'
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Interface Preferences */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-5">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          1. Préférences d&apos;affichage et du compilateur
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {/* Theme */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">Thème visuel</div>
              <div className="text-xs text-slate-500">Mode clair ou sombre</div>
            </div>
            <button
              type="button"
              onClick={() =>
                onUpdatePreferences({
                  theme: progress.preferences.theme === 'dark' ? 'light' : 'dark',
                })
              }
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              {progress.preferences.theme === 'dark' ? (
                <>
                  <Moon className="w-4 h-4 text-blue-400" />
                  <span>Sombre</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Clair</span>
                </>
              )}
            </button>
          </div>

          {/* Font Size */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">
                Taille de police de l&apos;éditeur
              </div>
              <div className="text-xs text-slate-500">Confort de lecture du code</div>
            </div>
            <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 text-xs">
              {(['sm', 'md', 'lg'] as const).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => onUpdatePreferences({ editorFontSize: sz })}
                  className={`px-2.5 py-1 rounded font-bold cursor-pointer ${
                    progress.preferences.editorFontSize === sz
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {sz.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Compiler Warnings */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between sm:col-span-2">
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">
                Afficher les avertissements pédagogiques du compilateur (<code>-Wall</code>)
              </div>
              <div className="text-xs text-slate-500">
                Signale les oublis de <code>&amp;</code> dans <code>scanf</code>, les affectations <code>if (a = b)</code> et les divisions entières implicites.
              </div>
            </div>
            <input
              type="checkbox"
              checked={progress.preferences.showCompilerWarnings}
              onChange={(e) =>
                onUpdatePreferences({ showCompilerWarnings: e.target.checked })
              }
              className="w-5 h-5 accent-blue-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Export / Import Backup */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-blue-600" />
              <span>2. Sauvegarde Locale, Exportation &amp; Restauration JSON</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Votre progression est automatiquement enregistrée dans <strong>IndexedDB</strong> et <strong>localStorage</strong> sur ce navigateur. Exportez régulièrement un fichier JSON pour conserver une copie ou changer d&apos;ordinateur.
            </p>
          </div>
        </div>

        {/* Limitations Warning Box */}
        <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/25 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Limites techniques du stockage local sans compte :</span>
          </div>
          <p>
            Les données stockées dans le navigateur ne sont pas synchronisées automatiquement entre plusieurs appareils ou navigateurs différents, et sont effacées à la fermeture d&apos;une fenêtre de <strong>navigation privée</strong> ou lors d&apos;un nettoyage complet des données de site. Utilisez le bouton d&apos;export ci-dessous pour archiver votre progression sur votre disque ou clé USB.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadBackup}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold shadow cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Exporter ma sauvegarde (.json)</span>
          </button>

          <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold cursor-pointer">
            <Upload className="w-4 h-4 text-emerald-600" />
            <span>Importer un fichier de sauvegarde (.json)</span>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Manual JSON Paste Fallback */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
            Ou coller directement le contenu JSON d&apos;une sauvegarde :
          </label>
          <textarea
            rows={3}
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder='{"platform": "algo-c-ingenieur-plateforme", "schemaVersion": 1, ...}'
            className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-900 dark:text-white"
          />
          {importText.trim().length > 0 && (
            <button
              type="button"
              onClick={handleImportFromTextarea}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
            >
              Valider et restaurer ce JSON
            </button>
          )}
        </div>
      </div>

      {/* Danger Zone: Reset */}
      <div className="rounded-2xl border border-red-200 dark:border-red-900/60 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-3">
        <h2 className="text-base font-bold text-red-600 dark:text-red-400">
          3. Réinitialisation complète des données locales
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Efface toute la progression, les codes sauvegardés et les quiz validés dans ce navigateur. Pensez à exporter votre sauvegarde au préalable.
        </p>

        {!confirmReset ? (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Réinitialiser toute ma progression...</span>
          </button>
        ) : (
          <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900">
            <span className="text-xs font-bold text-red-800 dark:text-red-200">
              Confirmez-vous la suppression définitive de votre progression locale ?
            </span>
            <button
              type="button"
              onClick={() => {
                onResetAll();
                setConfirmReset(false);
                setStatusMessage({
                  type: 'success',
                  text: 'Progression locale entièrement réinitialisée.',
                });
              }}
              className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold cursor-pointer"
            >
              Oui, tout effacer
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium cursor-pointer"
            >
              Annuler
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
