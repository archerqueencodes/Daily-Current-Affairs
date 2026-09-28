import React, { useState, useEffect } from 'react';
import { PenTool, BookOpen, Clock, FileCheck, Award, Sparkles } from 'lucide-react';
import { DailyReport, PracticeMainsQuestion, MainsDraft } from '../types';
import { MainsWorkspace } from '../components/practice/MainsWorkspace';
import { StorageService } from '../services/storage';

interface MainsPracticePageProps {
  report: DailyReport | null;
}

export const MainsPracticePage: React.FC<MainsPracticePageProps> = ({ report }) => {
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [draftsList, setDraftsList] = useState<MainsDraft[]>([]);

  const loadDrafts = async () => {
    const drafts = await StorageService.getMainsDrafts();
    setDraftsList(Object.values(drafts));
  };

  useEffect(() => {
    loadDrafts();
  }, []);

  if (!report || report.practiceSet.mains.length === 0) {
    return (
      <div className="bg-white border border-stone-200 rounded-lg p-10 text-center space-y-3">
        <PenTool className="w-8 h-8 text-stone-400 mx-auto" />
        <h3 className="font-serif text-base font-bold text-stone-800">
          No Mains Questions for this Date
        </h3>
        <p className="text-xs text-stone-500">
          Please select another date or generate fresh notes.
        </p>
      </div>
    );
  }

  const mainsQuestions = report.practiceSet.mains;
  const currentQuestion = mainsQuestions[selectedQuestionIndex] || mainsQuestions[0];

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white border border-stone-200 rounded-lg p-4 sm:p-5 shadow-2xs space-y-1">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-800 uppercase font-semibold">
          <PenTool className="w-3.5 h-3.5" />
          <span>Mains Answer Writing & AI Mentor Lab</span>
        </div>
        <h2 className="font-serif text-base font-bold text-stone-900">
          Daily Question Simulator & Evaluation
        </h2>
        <p className="text-xs text-stone-500">
          Draft within official time & word limits. Use "Self-Evaluate with AI" for formative feedback on structure, multidimensionality, and value additions.
        </p>
      </div>

      {/* Question Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {mainsQuestions.map((q, idx) => (
          <button
            key={q.id || idx}
            onClick={() => setSelectedQuestionIndex(idx)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-2 shrink-0 ${
              selectedQuestionIndex === idx
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            <span>Question {idx + 1}</span>
            <span className="text-[10px] font-mono text-amber-400">
              {q.gsPaper} · {q.marks}M
            </span>
          </button>
        ))}
      </div>

      {/* Main Workspace Component */}
      <div className="max-w-4xl mx-auto">
        <MainsWorkspace
          key={currentQuestion.id}
          question={currentQuestion}
          onDraftSaved={loadDrafts}
        />
      </div>

      {/* Written Drafts History */}
      {draftsList.length > 0 && (
        <div className="mt-8 bg-white border border-stone-200 rounded-lg p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div className="flex items-center gap-2 text-xs font-bold font-serif text-stone-900">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>Saved Answer Drafts ({draftsList.length})</span>
            </div>
          </div>

          <div className="divide-y divide-stone-100">
            {draftsList.map((d) => (
              <div key={d.id} className="py-2.5 flex items-center justify-between text-xs gap-3">
                <div className="space-y-0.5 max-w-xl">
                  <div className="font-semibold text-stone-800 line-clamp-1">{d.questionText}</div>
                  <div className="text-[10px] text-stone-400 font-mono">
                    {d.gsPaper} · Words: {d.wordCount} · Updated: {new Date(d.updatedAt).toLocaleDateString('en-GB')}
                  </div>
                </div>

                {d.aiEvaluation && (
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs">
                      Score: {d.aiEvaluation.overallScore} / {d.marks}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
