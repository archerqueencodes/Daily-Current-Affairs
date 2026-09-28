import React, { useState } from 'react';
import { X, Type, ZoomIn, ZoomOut, Bookmark, Printer } from 'lucide-react';
import { NewsArticle } from '../../types';

interface ReadingModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: NewsArticle | null;
  onBookmark?: (article: NewsArticle) => void;
  isBookmarked?: boolean;
}

export const ReadingModeModal: React.FC<ReadingModeModalProps> = ({
  isOpen,
  onClose,
  article,
  onBookmark,
  isBookmarked,
}) => {
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans'>('serif');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'compact'>('normal');

  if (!isOpen || !article) return null;

  const fontClass = fontFamily === 'serif' ? 'font-serif' : 'font-sans';
  const sizeClass =
    fontSize === 'large'
      ? 'text-lg leading-relaxed'
      : fontSize === 'compact'
      ? 'text-sm leading-normal'
      : 'text-base leading-relaxed';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-100 flex justify-center p-2 sm:p-6 animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-lg border border-stone-200 flex flex-col my-auto max-h-[95vh] overflow-hidden">
        {/* Controls Toolbar */}
        <div className="p-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs text-stone-600">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-stone-800">Reading Focus</span>
            <div className="flex items-center gap-1 border-l border-stone-300 pl-3">
              <button
                onClick={() => setFontFamily('serif')}
                className={`px-2 py-0.5 rounded font-serif ${
                  fontFamily === 'serif' ? 'bg-amber-100 text-amber-900 font-bold' : 'hover:bg-stone-200'
                }`}
              >
                Serif
              </button>
              <button
                onClick={() => setFontFamily('sans')}
                className={`px-2 py-0.5 rounded font-sans ${
                  fontFamily === 'sans' ? 'bg-amber-100 text-amber-900 font-bold' : 'hover:bg-stone-200'
                }`}
              >
                Sans
              </button>
            </div>

            <div className="flex items-center gap-1 border-l border-stone-300 pl-3">
              <button
                onClick={() => setFontSize('compact')}
                className={`px-1.5 py-0.5 rounded text-[11px] ${
                  fontSize === 'compact' ? 'bg-amber-100 text-amber-900 font-bold' : 'hover:bg-stone-200'
                }`}
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('normal')}
                className={`px-1.5 py-0.5 rounded text-xs ${
                  fontSize === 'normal' ? 'bg-amber-100 text-amber-900 font-bold' : 'hover:bg-stone-200'
                }`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-1.5 py-0.5 rounded text-sm ${
                  fontSize === 'large' ? 'bg-amber-100 text-amber-900 font-bold' : 'hover:bg-stone-200'
                }`}
              >
                A+
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onBookmark && (
              <button
                onClick={() => onBookmark(article)}
                className={`p-1.5 rounded hover:bg-stone-200 ${
                  isBookmarked ? 'text-amber-600' : 'text-stone-500'
                }`}
                title="Bookmark article"
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>
            )}
            <button
              onClick={() => window.print()}
              className="p-1.5 rounded hover:bg-stone-200 text-stone-500"
              title="Print"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-stone-200 text-stone-600"
              title="Close reader (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Reader Body */}
        <div className={`flex-1 overflow-y-auto p-6 sm:p-10 ${fontClass} ${sizeClass} text-stone-900 space-y-6`}>
          {/* Metadata bar - Zero pill discipline */}
          <div className="text-xs text-stone-500 font-sans tracking-wide space-x-2 border-b border-stone-200 pb-3">
            <span className="font-semibold text-stone-700">{article.category}</span>
            <span aria-hidden="true">·</span>
            <span>{article.gsPaper}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-medium">{article.verificationStatus}</span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-950 font-serif leading-tight">
            {article.headline}
          </h1>

          {/* Syllabus Box */}
          <div className="p-3.5 bg-stone-50 border-l-2 border-amber-600 font-sans text-xs space-y-1 text-stone-700">
            <div>
              <strong>Syllabus Topic:</strong> {article.syllabusTopic}
            </div>
            <div>
              <strong>Static Link:</strong> {article.staticLink}
            </div>
          </div>

          {/* 5W Breakdown */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-stone-900 border-b border-stone-200 pb-1 font-sans">
              Why in News?
            </h2>
            <p className="leading-relaxed">{article.whyInNews.what}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans bg-stone-50/80 p-3 rounded">
              <div>
                <strong>Who / Where:</strong> {article.whyInNews.who}, {article.whyInNews.where}
              </div>
              <div>
                <strong>When:</strong> {article.whyInNews.when}
              </div>
              <div className="sm:col-span-2">
                <strong>Why it matters:</strong> {article.whyInNews.why}
              </div>
            </div>
          </div>

          {/* Background */}
          <div className="space-y-2">
            <h2 className="text-base font-bold text-stone-900 border-b border-stone-200 pb-1 font-sans">
              Background & Constitutional Context
            </h2>
            <p className="leading-relaxed">{article.background}</p>
          </div>

          {/* Prelims Facts */}
          <div className="space-y-2">
            <h2 className="text-base font-bold text-stone-900 border-b border-stone-200 pb-1 font-sans">
              Key Facts for Prelims
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 leading-relaxed">
              {article.prelimsFacts.map((fact, idx) => (
                <li key={idx}>{fact}</li>
              ))}
            </ul>
          </div>

          {/* Mains Dimensions */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-stone-900 border-b border-stone-200 pb-1 font-sans">
              Mains Dimensions & Analysis
            </h2>
            <div className="space-y-3 font-sans text-xs sm:text-sm">
              <div>
                <strong className="text-stone-900 block mb-1">Issues & Challenges:</strong>
                <ul className="list-disc pl-5 space-y-1 text-stone-700">
                  {article.mainsAnalysis.issues.map((issue, idx) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
              </div>

              <div>
                <strong className="text-stone-900 block mb-1">Government Measures:</strong>
                <ul className="list-disc pl-5 space-y-1 text-stone-700">
                  {article.mainsAnalysis.measures.map((m, idx) => (
                    <li key={idx}>{m}</li>
                  ))}
                </ul>
              </div>

              <div>
                <strong className="text-stone-900 block mb-1">Way Forward:</strong>
                <ul className="list-disc pl-5 space-y-1 text-stone-700">
                  {article.mainsAnalysis.wayForward.map((wf, idx) => (
                    <li key={idx}>{wf}</li>
                  ))}
                </ul>
              </div>

              {article.mainsAnalysis.example && (
                <div className="p-2.5 bg-amber-50/60 border border-amber-200 rounded text-amber-950">
                  <strong>Verified Example:</strong> {article.mainsAnalysis.example}
                </div>
              )}
            </div>
          </div>

          {/* Sources */}
          <div className="pt-4 border-t border-stone-200 text-xs font-sans text-stone-500 space-y-1.5">
            <div className="font-semibold text-stone-700">Verified Grounding Sources:</div>
            {article.sources.map((s, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span>•</span>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline break-all"
                >
                  {s.title} ({s.name})
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
