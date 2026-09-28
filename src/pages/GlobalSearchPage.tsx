import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, ExternalLink, ShieldCheck, Tag, X } from 'lucide-react';
import { DailyReport, NewsArticle, Category, GSPaper, CATEGORIES } from '../types';
import { StorageService } from '../services/storage';

interface GlobalSearchPageProps {
  currentReport: DailyReport | null;
  onOpenArticleDetail: (article: NewsArticle) => void;
}

export const GlobalSearchPage: React.FC<GlobalSearchPageProps> = ({
  currentReport,
  onOpenArticleDetail,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<Category | 'All'>('All');
  const [selectedPaper, setSelectedPaper] = useState<GSPaper | 'All'>('All');
  const [allArticles, setAllArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    const loadAllArticles = async () => {
      const reports = await StorageService.getAllReports();
      const list: NewsArticle[] = [];
      reports.forEach((r) => list.push(...r.articles));

      if (currentReport) {
        currentReport.articles.forEach((a) => {
          if (!list.some((existing) => existing.id === a.id)) {
            list.push(a);
          }
        });
      }
      setAllArticles(list);
    };
    loadAllArticles();
  }, [currentReport]);

  const searchResults = allArticles.filter((art) => {
    if (selectedCat !== 'All' && art.category !== selectedCat) return false;
    if (selectedPaper !== 'All' && art.gsPaper !== selectedPaper) return false;

    if (!query.trim()) return true;

    const q = query.toLowerCase();
    const inHeadline = art.headline.toLowerCase().includes(q);
    const inSyllabus = art.syllabusTopic.toLowerCase().includes(q);
    const inStatic = art.staticLink.toLowerCase().includes(q);
    const inWhat = art.whyInNews.what.toLowerCase().includes(q);
    const inFacts = art.prelimsFacts.some((f) => f.toLowerCase().includes(q));
    const inTags = art.tags.some((t) => t.toLowerCase().includes(q));
    const inSources = art.sources.some((s) => s.name.toLowerCase().includes(q));

    return inHeadline || inSyllabus || inStatic || inWhat || inFacts || inTags || inSources;
  });

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-2xs space-y-3">
        <div>
          <h2 className="font-serif text-base font-bold text-stone-900">
            Global UPSC Knowledge Search
          </h2>
          <p className="text-xs text-stone-500">
            Search across headlines, keywords, static concepts, syllabus topics, and verified sources.
          </p>
        </div>

        {/* Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search e.g. 'Article 246', 'Chabahar', 'MMDR Act', 'TCFD', 'Groundwater'..."
            className="w-full text-xs sm:text-sm pl-9 pr-8 py-2.5 bg-stone-50 border border-stone-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-amber-500"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-stone-500 font-medium">Filters:</span>

          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value as any)}
            className="border border-stone-200 rounded px-2 py-1 text-xs bg-white text-stone-700"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={selectedPaper}
            onChange={(e) => setSelectedPaper(e.target.value as any)}
            className="border border-stone-200 rounded px-2 py-1 text-xs bg-white text-stone-700"
          >
            <option value="All">All GS Papers</option>
            <option value="GS1">GS1</option>
            <option value="GS2">GS2</option>
            <option value="GS3">GS3</option>
            <option value="GS4">GS4</option>
          </select>

          <span className="text-stone-400 font-mono text-[11px] ml-auto">
            {searchResults.length} matching articles
          </span>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {searchResults.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-lg p-10 text-center text-xs text-stone-500 space-y-1">
            <p className="font-semibold text-stone-700">No results found for "{query}"</p>
            <p className="text-[11px] text-stone-400">
              Try broader keywords like "Supreme Court", "Monetary Policy", or "Environment".
            </p>
          </div>
        ) : (
          searchResults.map((art) => (
            <div
              key={art.id}
              onClick={() => onOpenArticleDetail(art)}
              className="bg-white border border-stone-200 hover:border-amber-500/60 rounded-lg p-4 sm:p-5 transition-all shadow-2xs hover:shadow-xs cursor-pointer space-y-2 group"
            >
              {/* Unboxed Metadata */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-stone-500 font-medium">
                <span className="text-amber-800 font-semibold">{art.category}</span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span className="font-mono text-stone-700 font-semibold">{art.gsPaper}</span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span className="text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{art.verificationStatus}</span>
                </span>
              </div>

              {/* Headline */}
              <h3 className="font-serif text-sm sm:text-base font-bold text-stone-900 group-hover:text-amber-900 transition-colors leading-snug">
                {art.headline}
              </h3>

              {/* Excerpt */}
              <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                {art.whyInNews.what}
              </p>

              {/* Static concept & tags */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-stone-100 text-[11px]">
                <div className="text-stone-700 font-mono">
                  <strong className="text-stone-900 font-sans">Static Link:</strong> {art.staticLink}
                </div>
                <div className="flex items-center gap-1 text-stone-400">
                  {art.tags.slice(0, 3).map((t, idx) => (
                    <span key={idx} className="bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
