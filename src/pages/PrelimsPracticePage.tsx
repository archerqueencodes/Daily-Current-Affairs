import React, { useState } from 'react';
import { CheckSquare, Award, RotateCcw, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { DailyReport } from '../types';
import { PrelimsQuestionCard } from '../components/practice/PrelimsQuestionCard';

interface PrelimsPracticePageProps {
  report: DailyReport | null;
}

export const PrelimsPracticePage: React.FC<PrelimsPracticePageProps> = ({ report }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [attemptedCount, setAttemptedCount] = useState(0);

  if (!report || report.practiceSet.mcqs.length === 0) {
    return (
      <div className="bg-white border border-stone-200 rounded-lg p-10 text-center space-y-3">
        <CheckSquare className="w-8 h-8 text-stone-400 mx-auto" />
        <h3 className="font-serif text-base font-bold text-stone-800">
          No Prelims MCQs for this Date
        </h3>
        <p className="text-xs text-stone-500">
          Please select another date or generate fresh notes.
        </p>
      </div>
    );
  }

  const mcqs = report.practiceSet.mcqs;
  const currentMcq = mcqs[currentIndex];

  const handleAttempted = (isCorrect: boolean) => {
    setAttemptedCount((prev) => prev + 1);
    if (isCorrect) setCorrectCount((prev) => prev + 1);
  };

  const accuracy =
    attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header & Running Score */}
      <div className="bg-white border border-stone-200 rounded-lg p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
        <div>
          <h2 className="font-serif text-base font-bold text-stone-900">
            Daily Prelims GS1 Practice Lab
          </h2>
          <p className="text-xs text-stone-500 font-mono">
            Date: {report.reportDate} · Statement-Style Questions
          </p>
        </div>

        {/* Running Scorecard */}
        <div className="flex items-center gap-3 text-xs bg-stone-50 border border-stone-200 px-3.5 py-2 rounded-md">
          <div>
            <span className="text-stone-500 block text-[10px]">Attempted</span>
            <span className="font-mono font-bold text-stone-900">
              {attemptedCount} / {mcqs.length}
            </span>
          </div>

          <div className="border-l border-stone-200 pl-3">
            <span className="text-stone-500 block text-[10px]">Correct</span>
            <span className="font-mono font-bold text-emerald-700">{correctCount}</span>
          </div>

          <div className="border-l border-stone-200 pl-3">
            <span className="text-stone-500 block text-[10px]">Accuracy</span>
            <span className="font-mono font-bold text-amber-800">{accuracy}%</span>
          </div>
        </div>
      </div>

      {/* Main Single-Question Carousel */}
      <div className="max-w-3xl mx-auto">
        <PrelimsQuestionCard
          question={currentMcq}
          index={currentIndex}
          total={mcqs.length}
          reportDate={report.reportDate}
          onNext={currentIndex < mcqs.length - 1 ? () => setCurrentIndex(currentIndex + 1) : undefined}
          onPrevious={currentIndex > 0 ? () => setCurrentIndex(currentIndex - 1) : undefined}
          onAttempted={handleAttempted}
        />

        {/* Question Selector Dots / Numbers */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {mcqs.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-7 h-7 rounded-full text-xs font-mono font-semibold transition-colors ${
                currentIndex === i
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
