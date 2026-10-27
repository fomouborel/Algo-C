import React, { useRef } from 'react';
import { Play, RotateCcw, Terminal, Code2 } from 'lucide-react';

interface CodeEditorWithLinesProps {
  code: string;
  onChange: (nextCode: string) => void;
  language: 'c' | 'pseudo';
  fontSize?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
  errorLines?: number[];
  warningLines?: number[];
  onRunShortcut?: () => void;
  onReset?: () => void;
  minHeight?: string;
  title?: string;
}

export const CodeEditorWithLines: React.FC<CodeEditorWithLinesProps> = ({
  code,
  onChange,
  language,
  fontSize = 'md',
  readOnly = false,
  errorLines = [],
  warningLines = [],
  onRunShortcut,
  onReset,
  minHeight = '280px',
  title,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const gutterRef = useRef<HTMLDivElement | null>(null);

  const lines = code.split('\n');
  const lineCount = Math.max(1, lines.length);

  const fontSizeClass =
    fontSize === 'sm'
      ? 'text-xs leading-5'
      : fontSize === 'lg'
      ? 'text-base leading-7'
      : 'text-sm leading-6';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && onRunShortcut) {
      e.preventDefault();
      onRunShortcut();
      return;
    }

    if (e.key === 'Tab' && !readOnly) {
      e.preventDefault();
      const el = e.currentTarget;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const indent = '    ';
      const next = code.substring(0, start) + indent + code.substring(end);
      onChange(next);
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd =
            start + indent.length;
        }
      });
    }
  };

  const handleScroll = () => {
    if (textareaRef.current && gutterRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  return (
    <div className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-950 text-slate-100 overflow-hidden shadow-sm">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          {language === 'c' ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
              <Terminal className="w-3.5 h-3.5" />
              C99 (ISO Standard)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
              <Code2 className="w-3.5 h-3.5" />
              Pseudo-code Algorithmique
            </span>
          )}
          {title && <span className="text-slate-400 font-medium truncate">{title}</span>}
        </div>

        <div className="flex items-center gap-2">
          {!readOnly && onRunShortcut && (
            <button
              type="button"
              onClick={onRunShortcut}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition cursor-pointer"
              title="Compiler et exécuter (Ctrl+Entrée)"
            >
              <Play className="w-3 h-3" />
              <span>Exécuter (Ctrl+Entrée)</span>
            </button>
          )}
          {!readOnly && onReset && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              title="Réinitialiser le code de départ"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Réinitialiser</span>
            </button>
          )}
        </div>
      </div>

      {/* Editor Body */}
      <div className="relative flex" style={{ minHeight }}>
        {/* Line Numbers Gutter */}
        <div
          ref={gutterRef}
          aria-hidden="true"
          className={`select-none py-3 px-2.5 text-right bg-slate-900/90 border-r border-slate-800 font-mono ${fontSizeClass} text-slate-500 overflow-hidden`}
          style={{ minWidth: '3.25rem' }}
        >
          {Array.from({ length: lineCount }, (_, idx) => {
            const lineNum = idx + 1;
            const isErr = errorLines.includes(lineNum);
            const isWarn = !isErr && warningLines.includes(lineNum);
            return (
              <div
                key={lineNum}
                className={`px-1 rounded ${
                  isErr
                    ? 'bg-red-500/30 text-red-300 font-bold'
                    : isWarn
                    ? 'bg-amber-500/30 text-amber-300 font-semibold'
                    : ''
                }`}
              >
                {lineNum}
              </div>
            );
          })}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          readOnly={readOnly}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          className={`w-full py-3 px-3.5 bg-slate-950 text-slate-100 font-mono ${fontSizeClass} focus:outline-none resize-y`}
          style={{ minHeight }}
          aria-label={title ?? 'Éditeur de code'}
        />
      </div>
    </div>
  );
};
