import React, { useState, useEffect } from 'react';
import { Calendar, Search, Filter, BookOpen, ChevronRight, ShieldCheck } from 'lucide-react';
import { DailyReport, Category, GSPaper, CATEGORIES } from '../types';
import { StorageService } from '../services/storage';

interface ArchivePageProps {
  onSelectDate: (date: string) => void;
}

export const ArchivePage: React.FC<ArchivePageProps> = ({ onSelectDate }) => {
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<Category | 'All'>('All');
  const [selectedPaper, setSelectedPaper] = useState<GSPaper | 'All'>('All');

  useEffect(() => {
    const load = async () => {
      const all = await StorageService.getAllReports();
      setReports(all);
    };
    load();
  }, []);

  const filteredReports = reports.filter((rep) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inDate = rep.reportDate.includes(q);
      const inTrend = rep.trendNote.toLowerCase().includes(q);
      const inArticles = rep.articles.some((a) => a.headline.toLowerCase().includes(q));
      if (!inDate && !inTrend && !inArticles) return false;
    }
    if (selectedCat !== 'All') {
      const hasCat = rep.articles.some((a) => a.category === selectedCat);
      if (!hasCat) return false;
    }
    if (selectedPaper !== 'All') {
      const hasPaper = rep.articles.some((a) => a.gsPaper === selectedPaper);
      if (!hasPaper) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-2xs space-y-1">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-800 uppercase font-semibold">
          <Calendar className="w-3.5 h-3.5" />
          <span>Date-Wise Archive & Calendar Index</span>
        </div>
        <h2 className="font-serif text-base font-bold text-stone-900">
          Historical Daily Dossier Repository
        </h2>
        <p className="text-xs text-stone-500">
          Access all stored reports indexed locally. Filter by date, keywords, GS paper, or category.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-stone-200 rounded-lg p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search archive by keyword, topic, or date (DD-MM-YYYY)..."
              className="w-full text-xs pl-9 pr-3 py-2 border border-stone-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value as any)}
              className="border border-stone-200 rounded px-2.5 py-2 text-xs text-stone-700 bg-white"
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
              className="border border-stone-200 rounded px-2.5 py-2 text-xs text-stone-700 bg-white"
            >
              <option value="All">All GS Papers</option>
              <option value="GS1">GS1</option>
              <option value="GS2">GS2</option>
              <option value="GS3">GS3</option>
              <option value="GS4">GS4</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {filteredReports.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-lg p-10 text-center text-xs text-stone-500 space-y-2">
            <p>No archived reports match your query.</p>
            <p className="text-[11px] text-stone-400">
              Generate notes for today or past dates to build your local offline archive.
            </p>
          </div>
        ) : (
          filteredReports.map((rep) => (
            <div
              key={rep.reportDate}
              onClick={() => onSelectDate(rep.reportDate)}
              className="bg-white border border-stone-200 hover:border-amber-500/60 rounded-lg p-4 sm:p-5 transition-all shadow-2xs hover:shadow-xs cursor-pointer flex items-center justify-between gap-4 group"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
                  <span className="font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                    {rep.reportDate}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{rep.totalArticles} Articles</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </span>
                  {rep.isSample && (
                    <span className="text-amber-700 bg-amber-50 px-1 rounded text-[10px] uppercase font-bold">
                      Sample
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-sm font-bold text-stone-900 group-hover:text-amber-900 transition-colors leading-snug">
                  {rep.trendNote}
                </h3>

                <div className="text-[11px] text-stone-500 line-clamp-1">
                  Topics: {rep.articles.map((a) => a.headline).join(' • ')}
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-semibold text-stone-500 group-hover:text-amber-900 transition-colors shrink-0">
                <span className="hidden sm:inline">Open Dossier</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
