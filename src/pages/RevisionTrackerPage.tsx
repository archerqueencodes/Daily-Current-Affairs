import React, { useState, useEffect } from 'react';
import { Repeat, CheckCircle2, Clock, Calendar, Check, Flame, BookOpen } from 'lucide-react';
import { DailyReport, UserProgress, NewsArticle } from '../types';
import { StorageService } from '../services/storage';

interface RevisionTrackerPageProps {
  report: DailyReport | null;
  onRefreshProgress: () => void;
}

export const RevisionTrackerPage: React.FC<RevisionTrackerPageProps> = ({
  report,
  onRefreshProgress,
}) => {
  const [progressMap, setProgressMap] = useState<Record<string, UserProgress>>({});
  const [allReports, setAllReports] = useState<DailyReport[]>([]);

  const loadData = async () => {
    const prog = await StorageService.getAllProgress();
    const reps = await StorageService.getAllReports();
    setProgressMap(prog);
    setAllReports(reps);
  };

  useEffect(() => {
    loadData();
  }, []);

  const nowIso = new Date().toISOString();

  // Find all articles due for revision
  const allArticlesAcrossReports: Array<{ article: NewsArticle; date: string }> = [];
  allReports.forEach((rep) => {
    rep.articles.forEach((art) => {
      allArticlesAcrossReports.push({ article: art, date: rep.reportDate });
    });
  });

  // If currently viewed report has articles, include them
  if (report) {
    report.articles.forEach((art) => {
      if (!allArticlesAcrossReports.some((item) => item.article.id === art.id)) {
        allArticlesAcrossReports.push({ article: art, date: report.reportDate });
      }
    });
  }

  const dueToday = allArticlesAcrossReports.filter((item) => {
    const p = progressMap[item.article.id];
    if (!p) return false;
    return p.revisionDueAt && p.revisionDueAt <= nowIso && p.readingStatus !== 'revised';
  });

  const revisedList = allArticlesAcrossReports.filter((item) => {
    const p = progressMap[item.article.id];
    return p && p.readingStatus === 'revised';
  });

  const handleMarkRevised = async (articleId: string, date: string) => {
    const settings = StorageService.getSettings();
    await StorageService.markArticleRevised(articleId, date, settings.revisionIntervals);
    await loadData();
    onRefreshProgress();
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-2xs space-y-1">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-800 uppercase font-semibold">
          <Repeat className="w-3.5 h-3.5" />
          <span>Spaced Repetition & Daily Revision Hub</span>
        </div>
        <h2 className="font-serif text-base font-bold text-stone-900">
          Curated Revision Tracker (1 / 3 / 7 / 30 Day Cycles)
        </h2>
        <p className="text-xs text-stone-500">
          Active recall is essential for retaining facts and static linkages. Track due articles and review the daily high-yield revision sheet.
        </p>
      </div>

      {/* Due Today Section */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-rose-600" />
            <h3 className="font-serif text-sm font-bold text-stone-900">
              Articles Due for Revision Today ({dueToday.length})
            </h3>
          </div>
          <span className="text-[11px] font-mono text-stone-400">Target: 100% Retained</span>
        </div>

        {dueToday.length === 0 ? (
          <div className="p-6 text-center text-xs text-stone-500 bg-stone-50 rounded space-y-1">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
            <p className="font-medium text-stone-700">No pending revision dues today!</p>
            <p className="text-[11px] text-stone-400">
              Mark articles as read to queue them into your personalized spaced repetition cycle.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {dueToday.map(({ article, date }) => {
              const p = progressMap[article.id];
              return (
                <div key={article.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5 max-w-xl">
                    <div className="font-semibold text-stone-800 line-clamp-1">{article.headline}</div>
                    <div className="text-[10px] text-stone-400 font-mono">
                      {article.category} · {article.gsPaper} · Report: {date} · Cycle: #{p?.revisionCycle || 1}
                    </div>
                  </div>

                  <button
                    onClick={() => handleMarkRevised(article.id, date)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark Revised</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Date Master Revision Sheet */}
      {report && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-stone-900 font-bold font-serif text-base">
            <Flame className="w-4 h-4 text-amber-600" />
            <span>Daily Master Revision Sheet — {report.reportDate}</span>
          </div>

          {/* Quick Revision Box */}
          <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              10 Sharp One-Liner Takeaways
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {report.quickRevision.map((q, idx) => (
                <div key={q.id || idx} className="p-3 bg-stone-50 rounded border border-stone-200/70 text-xs space-y-1">
                  <div className="flex items-center justify-between font-semibold text-stone-900">
                    <span>{idx + 1}. {q.topic}</span>
                    <span className="font-mono text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">
                      {q.gsPaper}
                    </span>
                  </div>
                  <p className="text-stone-600 leading-relaxed">{q.oneLiner}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Facts in Brief */}
          {report.factsInBrief.length > 0 && (
            <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-2xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Facts in Brief (High-Yield Bits)
              </h4>
              <div className="space-y-2 text-xs">
                {report.factsInBrief.map((f, i) => (
                  <div key={i} className="p-2.5 bg-stone-50 rounded border border-stone-100 flex items-start gap-2">
                    <span className="font-mono text-amber-800 font-bold">•</span>
                    <div>
                      <strong className="text-stone-900 mr-1.5">{f.headline} [{f.gsPaper}]:</strong>
                      <span className="text-stone-700">{f.fact}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Keywords */}
          {report.keywords.length > 0 && (
            <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-2xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                UPSC High-Yield Keywords & Vocabulary
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {report.keywords.map((k, i) => (
                  <div key={i} className="p-3 bg-stone-50 rounded border border-stone-200/70 space-y-1">
                    <div className="font-bold text-stone-900 text-sm">{k.keyword}</div>
                    <p className="text-stone-600">{k.definition}</p>
                    <div className="pt-1 text-[11px] text-amber-900 font-medium">
                      <strong>Mains Usage:</strong> {k.mainsUsage}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
