import React from 'react';
import {
  Compass,
  ShieldCheck,
  BookOpen,
  CheckSquare,
  PenTool,
  Repeat,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Quote,
  Flame,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { DailyReport, Category, CATEGORIES, GSPaper } from '../types';

interface DashboardPageProps {
  report: DailyReport | null;
  onNavigateToCategory: (category: Category) => void;
  onNavigateToTab: (tab: any) => void;
  revisionDueCount: number;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  report,
  onNavigateToCategory,
  onNavigateToTab,
  revisionDueCount,
}) => {
  if (!report) {
    return (
      <div className="p-8 text-center space-y-3">
        <p className="text-sm text-stone-600">No report available for this date.</p>
      </div>
    );
  }

  // Count articles per category
  const categoryCounts = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = report.articles.filter((a) => a.category === cat).length;
    return acc;
  }, {} as Record<Category, number>);

  const primarySourceCount = report.articles.reduce(
    (acc, a) => acc + a.sources.filter((s) => s.type.includes('Primary')).length,
    0
  );

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Hero Exam Trend Banner */}
      <section className="bg-gradient-to-r from-stone-900 to-slate-900 text-stone-100 rounded-xl p-5 sm:p-6 shadow-xs border border-stone-800">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 tracking-wider uppercase font-mono">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Daily Exam Trend & Strategic Angle</span>
          </div>

          <h2 className="font-serif text-lg sm:text-xl font-bold leading-snug text-white">
            {report.trendNote}
          </h2>

          <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-300">
            <span>Date: <strong className="text-white">{report.reportDate}</strong></span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span>Est. Reading Time: <strong className="text-white">{report.estimatedReadingTimeMinutes} mins</strong></span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span className="text-emerald-400">100% Grounded in Official Records</span>
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span>Verified Articles</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900">
            {report.totalArticles}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Syllabus-mapped topics</div>
        </div>

        <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span>Primary Sources</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900">
            {primarySourceCount}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">PIB, Ministries, SC, RBI</div>
        </div>

        <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span>Practice MCQs</span>
            <CheckSquare className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900">
            {report.practiceSet.mcqs.length}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Prelims statement-style</div>
        </div>

        <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span>Revision Due</span>
            <Repeat className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900">
            {revisionDueCount}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Spaced-tracker cycles</div>
        </div>
      </section>

      {/* 9 Category Cards Grid */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-base font-bold text-stone-900">
            Browse by Syllabus Category
          </h3>
          <button
            onClick={() => onNavigateToTab('daily')}
            className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1"
          >
            <span>View All Current Affairs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CATEGORIES.map((cat) => {
            const count = categoryCounts[cat] || (cat === 'Editorials' ? report.editorials.length : 0);
            return (
              <button
                key={cat}
                onClick={() => {
                  if (cat === 'Editorials') {
                    onNavigateToTab('editorials');
                  } else {
                    onNavigateToCategory(cat);
                  }
                }}
                className="bg-white border border-stone-200 hover:border-amber-500/60 rounded-lg p-4 text-left transition-all duration-150 hover:shadow-xs group flex items-start justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-stone-900 group-hover:text-amber-900 transition-colors">
                    {cat}
                  </div>
                  <div className="text-[11px] text-stone-500 mt-1">
                    {count === 0 ? 'No developments for date' : `${count} topic${count > 1 ? 's' : ''} covered`}
                  </div>
                </div>

                <span
                  className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${
                    count > 0 ? 'bg-stone-100 text-stone-800 group-hover:bg-amber-100 group-hover:text-amber-900' : 'text-stone-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Quick Revision Box (10 One-Liners) */}
      {report.quickRevision.length > 0 && (
        <section className="bg-white border border-stone-200 rounded-lg p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-600" />
              <h3 className="font-serif text-base font-bold text-stone-900">
                Quick Revision Box (10 High-Yield Takeaways)
              </h3>
            </div>
            <button
              onClick={() => onNavigateToTab('revision')}
              className="text-xs text-stone-600 hover:text-stone-900 font-medium"
            >
              Full Revision Sheet →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {report.quickRevision.slice(0, 10).map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-3 bg-stone-50/80 rounded border border-stone-200/70 text-xs space-y-1 hover:bg-stone-100/60 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-900">{item.topic}</span>
                  <span className="font-mono text-[10px] text-amber-800 font-semibold bg-amber-50 px-1.5 py-0.2 rounded">
                    {item.gsPaper}
                  </span>
                </div>
                <p className="text-stone-600 leading-relaxed">{item.oneLiner}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Connect the Dots & Empirical Quotes/Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Connect the dots */}
        <section className="bg-white border border-stone-200 rounded-lg p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
            <Layers className="w-4 h-4 text-blue-600" />
            <h3 className="font-serif text-sm font-bold text-stone-900">
              Connect the Dots (Inter-Topic Synthesis)
            </h3>
          </div>

          <div className="space-y-2.5">
            {report.connectTheDots.map((ctd, i) => (
              <div key={i} className="p-3 bg-stone-50 rounded border border-stone-200/70 text-xs space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-stone-900">
                  <span className="text-amber-800">{ctd.currentTopic}</span>
                  <span className="text-stone-400">↔</span>
                  <span className="text-stone-700">{ctd.linkedPastTopic}</span>
                </div>
                <p className="text-stone-600 leading-relaxed">{ctd.interlinkExplanation}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quotes & Empirical Data */}
        <section className="bg-white border border-stone-200 rounded-lg p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
            <Quote className="w-4 h-4 text-amber-600" />
            <h3 className="font-serif text-sm font-bold text-stone-900">
              Exam Quotes & Empirical Data
            </h3>
          </div>

          <div className="space-y-2.5">
            {report.quotesAndData.map((item, idx) => (
              <div key={idx} className="p-3 bg-stone-50 rounded border border-stone-200/70 text-xs space-y-2">
                <p className="font-serif italic text-stone-800 leading-relaxed">
                  "{item.content}"
                </p>
                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-200/60">
                  <span>— <strong>{item.attribution}</strong></span>
                  <span className="font-mono text-amber-800 font-semibold">{item.type}</span>
                </div>
                <div className="text-[11px] text-stone-600">
                  <strong>Mains Usage:</strong> {item.mainsContext}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
