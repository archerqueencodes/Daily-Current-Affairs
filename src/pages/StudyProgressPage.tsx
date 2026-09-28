import React, { useState, useEffect } from 'react';
import { BarChart3, CheckCircle2, Award, Clock, BookOpen, PenTool, Repeat } from 'lucide-react';
import { StorageService } from '../services/storage';
import { DailyReport, UserProgress, MCQAttempt, MainsDraft } from '../types';

export const StudyProgressPage: React.FC = () => {
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, UserProgress>>({});
  const [mcqAttempts, setMcqAttempts] = useState<Record<string, MCQAttempt>>({});
  const [mainsDrafts, setMainsDrafts] = useState<Record<string, MainsDraft>>({});

  useEffect(() => {
    const load = async () => {
      const r = await StorageService.getAllReports();
      const p = await StorageService.getAllProgress();
      const m = await StorageService.getMCQAttempts();
      const d = await StorageService.getMainsDrafts();
      setReports(r);
      setProgressMap(p);
      setMcqAttempts(m);
      setMainsDrafts(d);
    };
    load();
  }, []);

  const totalArticlesAcrossArchive = reports.reduce((acc, r) => acc + r.articles.length, 0);
  const readArticlesCount = Object.values(progressMap).filter(
    (p) => p.readingStatus === 'read' || p.readingStatus === 'revised'
  ).length;

  const revisedArticlesCount = Object.values(progressMap).filter(
    (p) => p.readingStatus === 'revised'
  ).length;

  const totalMCQsAttempted = Object.values(mcqAttempts).length;
  const correctMCQs = Object.values(mcqAttempts).filter((a) => a.isCorrect).length;
  const mcqAccuracy =
    totalMCQsAttempted > 0 ? Math.round((correctMCQs / totalMCQsAttempted) * 100) : 0;

  const mainsAnswersCount = Object.values(mainsDrafts).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-2xs space-y-1">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-800 uppercase font-semibold">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>UPSC CSE Study Progress & Analytics</span>
        </div>
        <h2 className="font-serif text-base font-bold text-stone-900">
          Preparation Metrics Dashboard
        </h2>
        <p className="text-xs text-stone-500">
          Consistent daily tracking of reading coverage, revision retention, Prelims accuracy, and Mains answer writing frequency.
        </p>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-2xs space-y-1">
          <span className="text-xs text-stone-500 block">Articles Read</span>
          <div className="text-2xl font-bold font-mono text-stone-900">
            {readArticlesCount}
          </div>
          <span className="text-[11px] text-stone-400">
            of {totalArticlesAcrossArchive || 9} available topics
          </span>
        </div>

        <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-2xs space-y-1">
          <span className="text-xs text-stone-500 block">Spaced Revisions</span>
          <div className="text-2xl font-bold font-mono text-emerald-700">
            {revisedArticlesCount}
          </div>
          <span className="text-[11px] text-stone-400">Cycles completed</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-2xs space-y-1">
          <span className="text-xs text-stone-500 block">Prelims Accuracy</span>
          <div className="text-2xl font-bold font-mono text-amber-800">
            {mcqAccuracy}%
          </div>
          <span className="text-[11px] text-stone-400">
            {correctMCQs} correct / {totalMCQsAttempted} attempts
          </span>
        </div>

        <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-2xs space-y-1">
          <span className="text-xs text-stone-500 block">Mains Answers Drafted</span>
          <div className="text-2xl font-bold font-mono text-blue-700">
            {mainsAnswersCount}
          </div>
          <span className="text-[11px] text-stone-400">Self-evaluated answers</span>
        </div>
      </div>

      {/* Detailed Analysis Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-2xs space-y-3">
          <h3 className="font-serif text-sm font-bold text-stone-900 pb-2 border-b border-stone-100">
            Reading & Revision Retention
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-stone-600 mb-1">
                <span>Reading Coverage</span>
                <span className="font-mono font-bold">
                  {totalArticlesAcrossArchive > 0
                    ? Math.round((readArticlesCount / totalArticlesAcrossArchive) * 100)
                    : 0}
                  %
                </span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-slate-900 h-full rounded-full"
                  style={{
                    width: `${
                      totalArticlesAcrossArchive > 0
                        ? Math.min(100, Math.round((readArticlesCount / totalArticlesAcrossArchive) * 100))
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-stone-600 mb-1">
                <span>Revision Cycle Compliance</span>
                <span className="font-mono font-bold">
                  {readArticlesCount > 0
                    ? Math.round((revisedArticlesCount / readArticlesCount) * 100)
                    : 0}
                  %
                </span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full"
                  style={{
                    width: `${
                      readArticlesCount > 0
                        ? Math.min(100, Math.round((revisedArticlesCount / readArticlesCount) * 100))
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-2xs space-y-3">
          <h3 className="font-serif text-sm font-bold text-stone-900 pb-2 border-b border-stone-100">
            MCQ Practice Performance
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2.5 bg-stone-50 rounded">
              <span className="text-stone-600">Total MCQs Attempted:</span>
              <span className="font-mono font-bold text-stone-900">{totalMCQsAttempted}</span>
            </div>
            <div className="flex justify-between p-2.5 bg-stone-50 rounded">
              <span className="text-stone-600">Correctly Answered:</span>
              <span className="font-mono font-bold text-emerald-700">{correctMCQs}</span>
            </div>
            <div className="flex justify-between p-2.5 bg-stone-50 rounded">
              <span className="text-stone-600">Net Negative Marking (1/3rd penalty):</span>
              <span className="font-mono font-bold text-stone-800">
                {(correctMCQs * 2 - (totalMCQsAttempted - correctMCQs) * 0.66).toFixed(2)} Marks
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
