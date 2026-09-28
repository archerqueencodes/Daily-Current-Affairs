import React, { useState } from 'react';
import {
  Bookmark,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Flag,
  Share2,
  Copy,
  Check,
  Eye,
  FileText,
  Clock,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { NewsArticle, ReadingStatus } from '../../types';

interface ArticleCardProps {
  article: NewsArticle;
  isBookmarked: boolean;
  onToggleBookmark: (article: NewsArticle) => void;
  onOpenNote: (article: NewsArticle) => void;
  onOpenReadingMode: (article: NewsArticle) => void;
  onOpenFlag: (article: NewsArticle) => void;
  readingStatus?: ReadingStatus;
  onToggleReadingStatus?: (articleId: string) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  isBookmarked,
  onToggleBookmark,
  onOpenNote,
  onOpenReadingMode,
  onOpenFlag,
  readingStatus = 'unread',
  onToggleReadingStatus,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'prelims' | 'mains' | 'sources'>('prelims');

  const handleCopyLink = async () => {
    const textToCopy = `${article.headline}\nCategory: ${article.category} | ${article.gsPaper}\nSyllabus: ${article.syllabusTopic}\nStatic Link: ${article.staticLink}\n\nWhy in news: ${article.whyInNews.what}\n\nFacts:\n${article.prelimsFacts.map((f) => `• ${f}`).join('\n')}`;
    await navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getStatusColor = () => {
    if (article.verificationStatus === 'Verified') return 'text-emerald-700 bg-emerald-50';
    if (article.verificationStatus === 'Partial') return 'text-amber-700 bg-amber-50';
    return 'text-rose-700 bg-rose-50';
  };

  return (
    <article className="bg-white border border-stone-200/90 rounded-lg shadow-2xs hover:shadow-xs transition-shadow duration-150 overflow-hidden">
      {/* Card Header Area */}
      <div className="p-4 sm:p-5">
        {/* Unboxed Metadata Line - Zero Pill Discipline */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-stone-500 mb-2 font-medium">
          <span className="text-amber-800 font-semibold">{article.category}</span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span className="font-mono text-stone-700 font-semibold">{article.gsPaper}</span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span className="text-stone-600 truncate max-w-xs">{article.syllabusTopic}</span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium ${getStatusColor()}`}>
            <ShieldCheck className="w-3 h-3" />
            <span>{article.verificationStatus}</span>
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-base sm:text-lg font-bold text-stone-900 font-serif leading-snug tracking-tight hover:text-amber-900 transition-colors cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          {article.headline}
        </h2>

        {/* Why in news summary excerpt */}
        <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
          {article.whyInNews.what}
        </p>

        {/* Static link banner */}
        <div className="mt-2.5 p-2 bg-stone-50 rounded border border-stone-200/70 text-xs text-stone-700 flex items-start gap-1.5">
          <span className="font-semibold text-stone-900 shrink-0">Static Anchor:</span>
          <span className="font-mono text-stone-800">{article.staticLink}</span>
        </div>

        {/* Action Bar */}
        <div className="mt-3.5 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Reading Mode Button */}
            <button
              onClick={() => onOpenReadingMode(article)}
              className="px-2.5 py-1 text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/70 rounded flex items-center gap-1.5 font-medium transition-colors"
              title="Open distraction-free reading mode"
            >
              <Eye className="w-3.5 h-3.5 text-stone-600" />
              <span>Read</span>
            </button>

            {/* Read/Revised Status Toggle */}
            {onToggleReadingStatus && (
              <button
                onClick={() => onToggleReadingStatus(article.id)}
                className={`px-2 py-1 rounded flex items-center gap-1 transition-colors ${
                  readingStatus === 'revised'
                    ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                    : readingStatus === 'read'
                    ? 'text-blue-700 bg-blue-50 hover:bg-blue-100'
                    : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100'
                }`}
                title="Toggle Reading / Revision Status"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="capitalize">{readingStatus}</span>
              </button>
            )}

            {/* Personal Note */}
            <button
              onClick={() => onOpenNote(article)}
              className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded"
              title="Add / Edit Personal Study Note"
            >
              <FileText className="w-4 h-4" />
            </button>

            {/* Bookmark */}
            <button
              onClick={() => onToggleBookmark(article)}
              className={`p-1.5 rounded transition-colors ${
                isBookmarked
                  ? 'text-amber-600 hover:bg-amber-50'
                  : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'
              }`}
              title={isBookmarked ? 'Remove Bookmark' : 'Save Bookmark'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            {/* Copy summary */}
            <button
              onClick={handleCopyLink}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded"
              title="Copy notes summary"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* Flag issue */}
            <button
              onClick={() => onOpenFlag(article)}
              className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded"
              title="Flag factual or source error"
            >
              <Flag className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Expand / Collapse Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-stone-600 hover:text-stone-900 font-medium px-2 py-1 rounded hover:bg-stone-100"
          >
            <span>{isExpanded ? 'Collapse' : 'Detailed Notes'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expandable Deep Content */}
      {isExpanded && (
        <div className="bg-stone-50/70 border-t border-stone-200 p-4 sm:p-5 space-y-4">
          {/* Tab buttons for quick navigation */}
          <div className="flex items-center gap-1 border-b border-stone-200 pb-2">
            <button
              onClick={() => setActiveTab('prelims')}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                activeTab === 'prelims'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200'
              }`}
            >
              Prelims High-Yield Facts
            </button>
            <button
              onClick={() => setActiveTab('mains')}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                activeTab === 'mains'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200'
              }`}
            >
              Mains Analysis & Practice
            </button>
            <button
              onClick={() => setActiveTab('sources')}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                activeTab === 'sources'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200'
              }`}
            >
              Verified Sources ({article.sources.length})
            </button>
          </div>

          {/* Tab 1: Prelims Facts */}
          {activeTab === 'prelims' && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Key Facts & Pointers
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {article.prelimsFacts.map((fact, idx) => (
                    <li key={idx}>{fact}</li>
                  ))}
                </ul>
              </div>

              {/* Background Context */}
              <div className="p-3 bg-white border border-stone-200 rounded text-xs text-stone-700 space-y-1">
                <span className="font-bold text-stone-900 block">Constitutional & Historical Background:</span>
                <p className="leading-relaxed">{article.background}</p>
              </div>

              {/* Prelims MCQ if question type is prelims */}
              {article.question.type === 'prelims_mcq' && (
                <div className="p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-md space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-900 flex items-center justify-between">
                    <span>Possible Prelims MCQ</span>
                    <span className="text-[10px] font-mono text-amber-700">Exam-Standard</span>
                  </div>
                  <p className="text-xs font-medium text-stone-900 whitespace-pre-line leading-relaxed">
                    {article.question.text}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-xs">
                    {(article.question.options || []).map((opt, optIdx) => (
                      <div
                        key={optIdx}
                        className="px-2.5 py-1.5 bg-white border border-amber-200/60 rounded text-stone-800"
                      >
                        <span className="font-semibold mr-1.5">
                          ({String.fromCharCode(65 + optIdx)})
                        </span>
                        {opt}
                      </div>
                    ))}
                  </div>
                  <div className="text-[11px] text-amber-900 pt-1">
                    <strong>Answer:</strong> Option {String.fromCharCode(65 + (article.question.correctAnswer || 0))} — {article.question.explanation}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Mains Analysis */}
          {activeTab === 'mains' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white border border-stone-200 rounded">
                  <strong className="text-stone-900 block mb-1">Key Issues & Challenges</strong>
                  <ul className="list-disc pl-4 space-y-1 text-stone-600">
                    {article.mainsAnalysis.issues.map((issue, idx) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-white border border-stone-200 rounded">
                  <strong className="text-stone-900 block mb-1">Government Measures</strong>
                  <ul className="list-disc pl-4 space-y-1 text-stone-600">
                    {article.mainsAnalysis.measures.map((measure, idx) => (
                      <li key={idx}>{measure}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-white border border-stone-200 rounded">
                  <strong className="text-stone-900 block mb-1">Way Forward</strong>
                  <ul className="list-disc pl-4 space-y-1 text-stone-600">
                    {article.mainsAnalysis.wayForward.map((wf, idx) => (
                      <li key={idx}>{wf}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {article.mainsAnalysis.example && (
                <div className="p-2.5 bg-stone-100 rounded text-xs text-stone-800">
                  <strong>Verified Case Study / Empirical Example:</strong> {article.mainsAnalysis.example}
                </div>
              )}

              {/* Mains Question */}
              {article.question.type === 'mains_question' && (
                <div className="p-3.5 bg-stone-900 text-stone-100 rounded space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-amber-400 font-semibold">
                    <span>Mains Analytical Question</span>
                    <span>{article.question.marks || 15} Marks ({article.question.wordLimit || 250} Words)</span>
                  </div>
                  <p className="text-xs sm:text-sm font-serif leading-relaxed text-stone-200">
                    {article.question.text}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Sources */}
          {activeTab === 'sources' && (
            <div className="space-y-2">
              <div className="text-xs text-stone-500 font-medium">
                Every link below was collected directly through Google Search grounding metadata from primary portals:
              </div>
              <div className="divide-y divide-stone-200 bg-white border border-stone-200 rounded">
                {article.sources.map((src) => (
                  <div key={src.id} className="p-2.5 flex items-center justify-between text-xs gap-3">
                    <div className="space-y-0.5">
                      <div className="font-semibold text-stone-800">{src.name}</div>
                      <div className="text-[11px] text-stone-500">{src.title}</div>
                      <div className="text-[10px] text-stone-400 font-mono">
                        Published: {src.publicationDate} · {src.type}
                      </div>
                    </div>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded flex items-center gap-1 font-medium shrink-0"
                    >
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
};
