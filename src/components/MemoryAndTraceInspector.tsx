import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Cpu,
  HardDrive,
  Layers,
  ListOrdered,
  Terminal,
  XCircle,
} from 'lucide-react';
import { CompileAndRunResult, CompilerDiagnostic } from '../types/curriculum';

interface MemoryAndTraceInspectorProps {
  result: CompileAndRunResult | null;
  showWarnings?: boolean;
  defaultTab?: 'console' | 'diagnostics' | 'memory' | 'trace';
  language: 'c' | 'pseudo';
}

export const MemoryAndTraceInspector: React.FC<MemoryAndTraceInspectorProps> = ({
  result,
  showWarnings = true,
  defaultTab = 'console',
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'console' | 'diagnostics' | 'memory' | 'trace'>(
    defaultTab
  );

  if (!result) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 text-sm text-slate-500 dark:text-slate-400 flex items-center gap-3">
        <Terminal className="w-5 h-5 text-slate-400 shrink-0" />
        <span>
          Cliquez sur <strong>Exécuter</strong> (ou <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono">Ctrl+Entrée</kbd>) pour compiler le programme, afficher la sortie console, les diagnostics pédagogiques, l&apos;état de la mémoire (Pile/Tas) et la table de trace.
        </span>
      </div>
    );
  }

  const visibleDiagnostics: CompilerDiagnostic[] = result.diagnostics.filter(
    (d) => showWarnings || d.severity === 'error'
  );
  const errorCount = visibleDiagnostics.filter((d) => d.severity === 'error').length;
  const warningCount = visibleDiagnostics.filter((d) => d.severity === 'warning').length;
  const hasMemory = Boolean(result.memorySnapshot);
  const traceSteps = result.traceSteps ?? [];

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
      {/* Status Banner */}
      <div
        className={`px-4 py-2.5 border-b flex flex-wrap items-center justify-between gap-2 text-xs font-medium ${
          !result.compileSuccess
            ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900 text-red-800 dark:text-red-200'
            : !result.executionSuccess
            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200'
            : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200'
        }`}
      >
        <div className="flex items-center gap-2">
          {!result.compileSuccess ? (
            <>
              <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
              <span>Échec de compilation ({errorCount} erreur{errorCount > 1 ? 's' : ''})</span>
            </>
          ) : !result.executionSuccess ? (
            <>
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>
                Erreur d&apos;exécution (Code de sortie : {result.exitCode ?? 'Signal'})
              </span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                Compilation &amp; exécution réussies (Code retour : {result.exitCode ?? 0})
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
          <span>{result.instructionsExecuted} instructions</span>
          <span>•</span>
          <span>{result.executionTimeMs.toFixed(1)} ms</span>
          {result.memorySnapshot && result.memorySnapshot.leakedBytes > 0 && (
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold">
              Fuite mémoire : {result.memorySnapshot.leakedBytes} octets non libérés (free manquant)
            </span>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 px-2 pt-1.5 gap-1 text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab('console')}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-t-lg border-b-2 transition cursor-pointer ${
            activeTab === 'console'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Sortie Console (stdout / stderr)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('diagnostics')}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-t-lg border-b-2 transition cursor-pointer ${
            activeTab === 'diagnostics'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Diagnostics Pédagogiques</span>
          {visibleDiagnostics.length > 0 && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[11px] font-bold ${
                errorCount > 0
                  ? 'bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-200'
                  : 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-200'
              }`}
            >
              {visibleDiagnostics.length}
            </span>
          )}
        </button>

        {language === 'c' && hasMemory && (
          <button
            type="button"
            onClick={() => setActiveTab('memory')}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-t-lg border-b-2 transition cursor-pointer ${
              activeTab === 'memory'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Inspecteur Mémoire (Pile &amp; Tas)</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setActiveTab('trace')}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-t-lg border-b-2 transition cursor-pointer ${
            activeTab === 'trace'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <ListOrdered className="w-3.5 h-3.5" />
          <span>Table de Trace ({traceSteps.length} étapes)</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'console' && (
          <div className="space-y-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Sortie Standard (stdout)
              </div>
              <pre className="p-3.5 rounded-lg bg-slate-950 text-emerald-300 font-mono text-xs sm:text-sm overflow-x-auto min-h-[72px] whitespace-pre-wrap">
                {result.stdout.length > 0 ? result.stdout : '(Aucune sortie standard affichée)'}
              </pre>
            </div>

            {result.stderr.length > 0 && (
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-red-500 mb-1.5">
                  Sortie d&apos;Erreur (stderr / Sanitizers)
                </div>
                <pre className="p-3.5 rounded-lg bg-red-950/90 text-red-200 border border-red-800 font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                  {result.stderr}
                </pre>
              </div>
            )}

            {visibleDiagnostics.length > 0 && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
                  Explications pédagogiques ({errorCount} erreur{errorCount > 1 ? 's' : ''},{' '}
                  {warningCount} avertissement{warningCount > 1 ? 's' : ''}) :
                </div>
                <div className="space-y-2">
                  {visibleDiagnostics.map((diag, idx) => (
                    <div
                      key={`${diag.code}-${idx}`}
                      className={`p-3 rounded-lg border text-xs ${
                        diag.severity === 'error'
                          ? 'bg-red-50/70 dark:bg-red-950/30 border-red-200 dark:border-red-900'
                          : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          Ligne {diag.line} : {diag.pedagogicalTitle}
                        </span>
                        <span className="px-2 py-0.5 rounded uppercase text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {diag.category} • {diag.code}
                        </span>
                      </div>
                      <p className="font-mono text-[11px] text-slate-600 dark:text-slate-400 mb-1.5">
                        gcc: {diag.gccMessage}
                      </p>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {diag.pedagogicalExplanation}
                      </p>
                      {diag.suggestion && (
                        <p className="mt-1.5 font-medium text-blue-700 dark:text-blue-300">
                          💡 Conseil : {diag.suggestion}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'diagnostics' && (
          <div>
            {visibleDiagnostics.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  Aucune erreur ni avertissement détecté !
                </p>
                <p className="text-xs mt-1">
                  Votre code respecte les règles syntaxiques et sémantiques vérifiées par le compilateur.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {visibleDiagnostics.map((diag, idx) => (
                  <div
                    key={`${diag.code}-${idx}`}
                    className={`p-3.5 rounded-lg border text-xs ${
                      diag.severity === 'error'
                        ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900'
                        : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        [Ligne {diag.line}, Col {diag.column}] {diag.pedagogicalTitle}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-semibold uppercase text-[10px]">
                        Erreur de {diag.category}
                      </span>
                    </div>
                    <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                      Message compilateur : {diag.gccMessage}
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {diag.pedagogicalExplanation}
                    </p>
                    {diag.suggestion && (
                      <div className="mt-2 p-2 rounded bg-white/70 dark:bg-slate-900/70 text-blue-700 dark:text-blue-300 font-medium">
                        💡 Correction suggérée : {diag.suggestion}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'memory' && result.memorySnapshot && (
          <div className="space-y-5 text-xs">
            {/* Call Stack Frames */}
            <div>
              <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200 mb-2">
                <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Pile d&apos;exécution (Call Stack — Adresses décroissantes)</span>
              </div>
              {result.memorySnapshot.callStack.length === 0 ? (
                <p className="text-slate-500 italic">Aucune frame active.</p>
              ) : (
                <div className="space-y-3">
                  {result.memorySnapshot.callStack.map((frame, fIdx) => (
                    <div
                      key={`${frame.functionName}-${fIdx}`}
                      className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden"
                    >
                      <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800/80 font-mono font-semibold flex items-center justify-between">
                        <span>
                          Fonction : <strong className="text-blue-600 dark:text-blue-400">{frame.functionName}()</strong>
                        </span>
                        <span className="text-slate-500">
                          Base : {frame.baseAddressHex}
                        </span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 bg-slate-50 dark:bg-slate-900/40">
                              <th className="py-1.5 px-3">Adresse</th>
                              <th className="py-1.5 px-3">Nom</th>
                              <th className="py-1.5 px-3">Type</th>
                              <th className="py-1.5 px-3">Taille</th>
                              <th className="py-1.5 px-3">Valeur en mémoire</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                            {frame.variables.map((v) => (
                              <tr key={`${frame.functionName}-${v.name}-${v.addressHex}`}>
                                <td className="py-1.5 px-3 text-purple-600 dark:text-purple-400 font-semibold">
                                  {v.addressHex}
                                </td>
                                <td className="py-1.5 px-3 font-bold text-slate-900 dark:text-slate-100">
                                  {v.name}
                                </td>
                                <td className="py-1.5 px-3 text-slate-600 dark:text-slate-400">
                                  {v.type}
                                </td>
                                <td className="py-1.5 px-3 text-slate-500">
                                  {v.sizeBytes} o
                                </td>
                                <td className="py-1.5 px-3 text-emerald-700 dark:text-emerald-300">
                                  {v.valueFormatted}
                                  {v.pointsToAddressHex && (
                                    <span className="ml-2 px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-[10px]">
                                      → pointe vers {v.pointsToAddressHex}
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Heap Blocks */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                  <HardDrive className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Tas (Heap — Allocations dynamiques malloc / calloc / free)</span>
                </div>
                <span className="text-slate-500">
                  Octets non libérés :{' '}
                  <strong
                    className={
                      result.memorySnapshot.leakedBytes > 0
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }
                  >
                    {result.memorySnapshot.leakedBytes} octets
                  </strong>
                </span>
              </div>

              {result.memorySnapshot.heapBlocks.length === 0 ? (
                <p className="text-slate-500 italic">
                  Aucun bloc alloué dynamiquement sur le Tas lors de cette exécution.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 bg-slate-50 dark:bg-slate-900/40">
                        <th className="py-1.5 px-3">Adresse Tas</th>
                        <th className="py-1.5 px-3">Taille</th>
                        <th className="py-1.5 px-3">Alloué ligne</th>
                        <th className="py-1.5 px-3">État</th>
                        <th className="py-1.5 px-3">Contenu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                      {result.memorySnapshot.heapBlocks.map((hb) => (
                        <tr key={hb.addressHex}>
                          <td className="py-1.5 px-3 text-purple-600 dark:text-purple-400 font-semibold">
                            {hb.addressHex}
                          </td>
                          <td className="py-1.5 px-3">{hb.sizeBytes} octets</td>
                          <td className="py-1.5 px-3">Ligne {hb.allocatedAtLine}</td>
                          <td className="py-1.5 px-3">
                            {hb.freed ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-sans font-semibold">
                                Libéré (free ligne {hb.freedAtLine})
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-sans font-semibold">
                                Actif / Non libéré
                              </span>
                            )}
                          </td>
                          <td className="py-1.5 px-3 text-slate-700 dark:text-slate-300">
                            {hb.valuesPreview}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'trace' && (
          <div>
            {traceSteps.length === 0 ? (
              <p className="text-xs text-slate-500 italic">
                Aucune étape de trace enregistrée pour cette exécution.
              </p>
            ) : (
              <div className="overflow-x-auto max-h-80 rounded-lg border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-2 px-3">Étape</th>
                      <th className="py-2 px-3">Ligne</th>
                      <th className="py-2 px-3">Opération exécutée</th>
                      <th className="py-2 px-3">État des variables</th>
                      <th className="py-2 px-3">Affichage produit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                    {traceSteps.map((step) => (
                      <tr
                        key={step.stepNumber}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <td className="py-1.5 px-3 font-bold text-slate-500">
                          #{step.stepNumber}
                        </td>
                        <td className="py-1.5 px-3 text-blue-600 dark:text-blue-400">
                          L.{step.line}
                        </td>
                        <td className="py-1.5 px-3 font-sans text-slate-800 dark:text-slate-200">
                          {step.instructionSummary}
                        </td>
                        <td className="py-1.5 px-3 text-emerald-700 dark:text-emerald-300">
                          {Object.entries(step.variables)
                            .map(([k, v]) => `${k}=${v}`)
                            .join(', ') || '—'}
                        </td>
                        <td className="py-1.5 px-3 text-amber-700 dark:text-amber-300">
                          {step.outputDelta ? JSON.stringify(step.outputDelta) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
