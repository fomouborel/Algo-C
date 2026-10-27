import React from 'react';

/**
 * Renders the lightweight inline markup used in the course texts:
 * **gras** and `code`. Line breaks and indentation are kept by the parent
 * container (whitespace-pre-line / whitespace-pre-wrap).
 */
export const RichText: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`\n]+`)/g);
  return (
    <>
      {parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
          return (
            <strong key={idx} className="font-semibold text-slate-900 dark:text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
          return (
            <code
              key={idx}
              className="px-1 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700/70 font-mono text-[0.85em]"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return <React.Fragment key={idx}>{part}</React.Fragment>;
      })}
    </>
  );
};
