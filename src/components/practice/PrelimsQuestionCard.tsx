import React, { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle, ChevronRight, Bookmark } from 'lucide-react';
import { PracticeMCQ, MCQAttempt } from '../../types';
import { StorageService } from '../../services/storage';

interface PrelimsQuestionCardProps {
  question: PracticeMCQ;
  index: number;
  total: number;
  reportDate: string;
  onNext?: () => void;
  onPrevious?: () => void;
  onAttempted?: (isCorrect: boolean) => void;
}

export const PrelimsQuestionCard: React.FC<PrelimsQuestionCardProps> = ({
  question,
  index,
  total,
  reportDate,
  onNext,
  onPrevious,
  onAttempted,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isCorrect = selectedOption === question.correctAnswer;

  const handleSubmit = async () => {
    if (selectedOption === null || isSubmitted) return;
    setIsSubmitted(true);

    const attempt: MCQAttempt = {
      questionId: question.id,
      reportDate,
      selectedOption,
      isCorrect,
      attemptedAt: new Date().toISOString(),
    };

    await StorageService.recordMCQAttempt(attempt);
    if (onAttempted) onAttempted(isCorrect);
  };

  const handleReset = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
  };

  return (
    <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between text-xs text-stone-500 pb-2 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-stone-800">Question {index + 1} of {total}</span>
          <span aria-hidden="true">·</span>
          <span>{question.syllabusTopic}</span>
        </div>
        <div className="text-[11px] font-mono text-stone-400">Prelims Paper I Pattern</div>
      </div>

      {/* Question Text */}
      <div className="text-sm font-serif font-medium text-stone-900 leading-relaxed whitespace-pre-line">
        {question.question}
      </div>

      {/* Options List */}
      <div className="space-y-2 pt-1">
        {question.options.map((opt, optIdx) => {
          const letter = String.fromCharCode(65 + optIdx);
          let btnStyle = 'border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-800';

          if (isSubmitted) {
            if (optIdx === question.correctAnswer) {
              btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold';
            } else if (optIdx === selectedOption) {
              btnStyle = 'border-rose-400 bg-rose-50 text-rose-900 line-through';
            } else {
              btnStyle = 'border-stone-200 text-stone-400 opacity-60';
            }
          } else if (selectedOption === optIdx) {
            btnStyle = 'border-amber-600 bg-amber-50/70 text-amber-950 font-semibold ring-1 ring-amber-600';
          }

          return (
            <button
              key={optIdx}
              disabled={isSubmitted}
              onClick={() => setSelectedOption(optIdx)}
              className={`w-full text-left p-3 border rounded-md text-xs sm:text-sm flex items-start gap-2.5 transition-all ${btnStyle}`}
            >
              <span className="font-mono font-bold shrink-0">({letter})</span>
              <span className="leading-snug">{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Submit / Navigation Row */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-stone-100">
        <div className="flex items-center gap-2">
          {onPrevious && (
            <button
              onClick={() => {
                handleReset();
                onPrevious();
              }}
              className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 rounded border border-stone-200 hover:bg-stone-50"
            >
              Previous
            </button>
          )}

          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className={`px-4 py-1.5 text-xs font-semibold rounded transition-colors ${
                selectedOption === null
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-slate-900 hover:bg-slate-800 text-white shadow-2xs'
              }`}
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 rounded border border-stone-200 hover:bg-stone-50"
            >
              Try Again
            </button>
          )}
        </div>

        {onNext && (
          <button
            onClick={() => {
              handleReset();
              onNext();
            }}
            className="px-3.5 py-1.5 text-xs font-medium text-stone-800 hover:text-stone-950 rounded border border-stone-200 hover:bg-stone-50 flex items-center gap-1"
          >
            <span>Next Question</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Explanation Box (Revealed on submit) */}
      {isSubmitted && (
        <div
          className={`p-4 rounded-md border text-xs sm:text-sm space-y-2.5 animate-in fade-in duration-200 ${
            isCorrect
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
              : 'bg-amber-50/80 border-amber-200 text-amber-950'
          }`}
        >
          <div className="flex items-center gap-2 font-semibold">
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Correct! Option {String.fromCharCode(65 + question.correctAnswer)} is the right answer.</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Incorrect. The correct answer is Option {String.fromCharCode(65 + question.correctAnswer)}.</span>
              </>
            )}
          </div>

          <div className="leading-relaxed text-stone-800">
            <strong>Explanation:</strong> {question.explanation}
          </div>

          <div className="pt-2 border-t border-stone-200/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700 font-mono">
            <div>
              <strong>Static Concept:</strong> {question.staticConcept}
            </div>
            <div>
              <strong>Grounded Source:</strong> {question.sourceRef}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
