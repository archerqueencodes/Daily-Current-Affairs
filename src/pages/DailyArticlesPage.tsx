import React, { useState } from 'react';
import {
  Filter,
  Layers,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  ListOrdered,
  Search,
} from 'lucide-react';
import { DailyReport, Category, CATEGORIES, GSPaper, NewsArticle, ReadingStatus } from '../types';
import { ArticleCard } from '../components/articles/ArticleCard';

interface DailyArticlesPageProps {
  report: DailyReport | null;
  selectedCategory: Category | 'All';
  onSelectCategory: (cat: Category | 'All') => void;
  bookmarks: string[];
  onToggleBookmark: (article: NewsArticle) => void;
  onOpenNote: (article: NewsArticle) => void;
  onOpenReadingMode: (article: NewsArticle) => void;
  onOpenFlag: (article: NewsArticle) => void;
  progressMap: Record<string, { readingStatus: ReadingStatus }>;
  onToggleReadingStatus: (articleId: string) => void;
}

export const DailyArticlesPage: React.FC<DailyArticlesPageProps> = ({
  report,
  selectedCategory,
  onSelectCategory,
  bookmarks,
  onToggleBookmark,
  onOpenNote,
  onOpenReadingMode,
  onOpenFlag,
  progressMap,
  onToggleReadingStatus,
}) => {
  const [selectedPaper, setSelectedPaper] = useState<GSPaper | 'All'>('All');
  const [searchFilter, setSearchFilter] = useState('');

  if (!report) {
    return (
      <div className="p-8 text-center text-stone-500">
        No articles available for this date.
      </div>
    );
  }

  // Filter articles
  const filteredArticles = report.articles.filter((art) => {
    if (selectedCategory !== 'All' && art.category !== selectedCategory) return false;
    if (selectedPaper !== 'All' && art.gsPaper !== selectedPaper) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const inHeadline = art.headline.toLowerCase().includes(q);
      const inSyllabus = art.syllabusTopic.toLowerCase().includes(q);
      const inStatic = art.staticLink.toLowerCase().includes(q);
      const inTags = art.tags.some((t) => t.toLowerCase().includes(q));
      if (!inHeadline && !inSyllabus && !inStatic && !inTags) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Category Tabs & Filter Header */}
      <div className="space-y-3">
        {/* Interactive Horizontal Scrollable Category Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => onSelectCategory('All')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
              selectedCategory === 'All'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-stone-600 hover:text-stone-900 bg-white border border-stone-200'
            }`}
          >
            All Categories ({report.articles.length})
          </button>

          {CATEGORIES.filter((c) => c !== 'Editorials').map((cat) => {
            const count = report.articles.filter((a) => a.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-2xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900 bg-white border border-stone-200'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] font-mono px-1 rounded ${
                    isSelected ? 'bg-slate-800 text-amber-300' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Secondary GS Paper Segmented Filter & Search */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-lg border border-stone-200">
          <div className="flex items-center gap-1 text-xs">
            <span className="text-stone-500 font-medium mr-1.5">GS Paper:</span>
            {(['All', 'GS1', 'GS2', 'GS3', 'GS4'] as Array<GSPaper | 'All'>).map((paper) => (
              <button
                key={paper}
                onClick={() => setSelectedPaper(paper)}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  selectedPaper === paper
                    ? 'bg-amber-100 text-amber-900 font-bold'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                {paper}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter topics or Acts..."
              className="w-full text-xs pl-8 pr-3 py-1 bg-stone-50 border border-stone-200 rounded focus:outline-hidden focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Articles + Right-side Table of Contents on wide screens */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Article Feed (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {filteredArticles.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-lg p-8 text-center text-stone-500 text-xs space-y-2">
              <p>No articles matching the selected filters.</p>
              <button
                onClick={() => {
                  onSelectCategory('All');
                  setSelectedPaper('All');
                  setSearchFilter('');
                }}
                className="text-amber-800 font-semibold underline"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredArticles.map((article) => {
              const isBookmarked = bookmarks.includes(article.id);
              const readingStatus = progressMap[article.id]?.readingStatus || 'unread';

              return (
                <div key={article.id} id={article.id}>
                  <ArticleCard
                    article={article}
                    isBookmarked={isBookmarked}
                    onToggleBookmark={onToggleBookmark}
                    onOpenNote={onOpenNote}
                    onOpenReadingMode={onOpenReadingMode}
                    onOpenFlag={onOpenFlag}
                    readingStatus={readingStatus}
                    onToggleReadingStatus={onToggleReadingStatus}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Sticky Table of Contents (1 col) */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-20 bg-white border border-stone-200 rounded-lg p-4 shadow-2xs space-y-3">
            <div className="flex items-center gap-1.5 pb-2 border-b border-stone-100 text-xs font-bold text-stone-900 font-serif">
              <ListOrdered className="w-4 h-4 text-amber-700" />
              <span>Table of Contents</span>
            </div>

            <nav className="space-y-1.5 max-h-[70vh] overflow-y-auto pr-1 scrollbar-thin">
              {report.articles.map((art, idx) => (
                <a
                  key={art.id}
                  href={`#${art.id}`}
                  className="block text-[11px] text-stone-600 hover:text-amber-900 hover:bg-stone-50 p-1.5 rounded transition-colors group leading-snug"
                >
                  <div className="font-semibold text-stone-800 line-clamp-2 group-hover:text-amber-950">
                    {idx + 1}. {art.headline}
                  </div>
                  <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                    {art.category} · {art.gsPaper}
                  </div>
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};
