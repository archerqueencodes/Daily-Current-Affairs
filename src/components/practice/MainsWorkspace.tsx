import React, { useState, useEffect } from 'react';
import {
  PenTool,
  Save,
  Sparkles,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  FileCheck,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { PracticeMainsQuestion, MainsDraft, MainsEvaluation } from '../../types';
import { StorageService } from '../../services/storage';
import { ApiService } from '../../services/api';

interface MainsWorkspaceProps {
  question: PracticeMainsQuestion;
  onDraftSaved?: () => void;
}

export const MainsWorkspace: React.FC<MainsWorkspaceProps> = ({ question, onDraftSaved }) => {
  const [draftText, setDraftText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<MainsEvaluation | null>(null);
  const [evalError, setEvalError] = useState<string | null>(null);
  const [showModelAnswer, setShowModelAnswer] = useState(false);

  // Load existing draft for this question
  useEffect(() => {
    const loadDraft = async () => {
      const drafts = await StorageService.getMainsDrafts();
      const existing = drafts[question.id];
      if (existing) {
        setDraftText(existing.draftText);
        if (existing.aiEvaluation) {
          setEvaluation(existing.aiEvaluation);
        }
      } else {
        setDraftText('');
        setEvaluation(null);
      }
    };
    loadDraft();
  }, [question.id]);

  const wordCount = draftText.trim() ? draftText.trim().split(/\s+/).length : 0;
  const isOverWordLimit = wordCount > question.wordLimit * 1.15;
  const isUnderWordLimit = wordCount < question.wordLimit * 0.7 && wordCount > 0;

  const handleSaveDraft = async () => {
    setIsSaving(true);
    const draft: MainsDraft = {
      id: `draft-${question.id}`,
      questionId: question.id,
      questionText: question.question,
      gsPaper: question.gsPaper,
      marks: question.marks,
      wordLimit: question.wordLimit,
      draftText,
      wordCount,
      aiEvaluation: evaluation || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await StorageService.saveMainsDraft(draft);
    setIsSaving(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
    if (onDraftSaved) onDraftSaved();
  };

  const handleEvaluate = async () => {
    if (wordCount < 40) {
      alert('Please write at least 40-50 words before requesting AI self-evaluation.');
      return;
    }

    try {
      setIsEvaluating(true);
      setEvalError(null);

      const evalResult = await ApiService.evaluateMainsAnswer({
        question: question.question,
        gsPaper: question.gsPaper,
        marks: question.marks,
        wordLimit: question.wordLimit,
        answerText: draftText,
      });

      setEvaluation(evalResult);

      // Save draft with evaluation
      const draft: MainsDraft = {
        id: `draft-${question.id}`,
        questionId: question.id,
        questionText: question.question,
        gsPaper: question.gsPaper,
        marks: question.marks,
        wordLimit: question.wordLimit,
        draftText,
        wordCount,
        aiEvaluation: evalResult,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await StorageService.saveMainsDraft(draft);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Evaluation service error';
      setEvalError(msg);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs space-y-4">
      {/* Question Header */}
      <div className="space-y-1.5 pb-3 border-b border-stone-100">
        <div className="flex flex-wrap items-center justify-between text-xs text-stone-500 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-800">{question.gsPaper}</span>
            <span aria-hidden="true">·</span>
            <span>{question.syllabusTopic}</span>
          </div>
          <div className="font-mono font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
            {question.marks} Marks | Word Limit: {question.wordLimit} Words
          </div>
        </div>

        <h3 className="font-serif text-base font-bold text-stone-900 leading-snug">
          {question.question}
        </h3>
      </div>

      {/* Model Points Toggle */}
      <div>
        <button
          onClick={() => setShowModelAnswer(!showModelAnswer)}
          className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1 font-medium"
        >
          <span>{showModelAnswer ? 'Hide Structuring Hints' : 'View Model Structuring Dimensions'}</span>
          {showModelAnswer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showModelAnswer && (
          <div className="mt-2 p-3 bg-stone-50 border border-stone-200 rounded text-xs space-y-1 text-stone-700 animate-in fade-in">
            <span className="font-semibold text-stone-900 block">Recommended UPSC Structure:</span>
            <ul className="list-disc pl-5 space-y-1">
              {question.modelPoints.map((pt, i) => (
                <li key={i}>{pt}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Answer Writing Area */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-stone-700">Candidate Answer Script</span>

          {/* Word Counter */}
          <div
            className={`font-mono text-xs px-2 py-0.5 rounded ${
              isOverWordLimit
                ? 'text-rose-700 bg-rose-50 font-bold'
                : isUnderWordLimit
                ? 'text-amber-700 bg-amber-50'
                : 'text-stone-600 bg-stone-100'
            }`}
          >
            Words: {wordCount} / {question.wordLimit}
          </div>
        </div>

        <textarea
          rows={12}
          value={draftText}
          onChange={(e) => setDraftText(e.target.value)}
          placeholder="Start your answer with a crisp introduction, definition or constitutional context. Break body into clear multidimensional headings (Social, Economic, Policy, Administrative). Conclude with a constructive Way Forward..."
          className="w-full text-xs sm:text-sm font-sans border border-stone-300 rounded-md p-3.5 leading-relaxed focus:outline-hidden focus:ring-1 focus:ring-amber-500 resize-y"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100">
        <button
          onClick={handleSaveDraft}
          disabled={isSaving}
          className="px-3.5 py-1.5 text-xs text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded border border-stone-200 flex items-center gap-1.5 font-medium transition-colors"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaved ? 'Draft Saved' : 'Save Draft'}</span>
        </button>

        <button
          onClick={handleEvaluate}
          disabled={isEvaluating}
          className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded flex items-center gap-1.5 transition-colors shadow-xs"
        >
          {isEvaluating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          )}
          <span>{isEvaluating ? 'Evaluating Answer with AI...' : 'Self-Evaluate with AI'}</span>
        </button>
      </div>

      {/* Evaluation Error */}
      {evalError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{evalError}</span>
        </div>
      )}

      {/* Evaluation Results Scorecard */}
      {evaluation && (
        <div className="mt-4 p-4 sm:p-5 bg-stone-50 border border-stone-200 rounded-lg space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between pb-3 border-b border-stone-200 gap-2">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-600" />
              <div>
                <h4 className="font-serif text-sm font-bold text-stone-900">
                  AI Formative Evaluation Scorecard
                </h4>
                <p className="text-[10px] text-stone-500 font-mono">
                  Benchmarked against UPSC Mains standards
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-lg font-bold font-mono text-stone-900">
                {evaluation.overallScore} / {question.marks}
              </div>
              <div className="text-[10px] text-stone-500">{evaluation.wordCountAnalysis}</div>
            </div>
          </div>

          {/* Sub-score grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 bg-white border border-stone-200 rounded text-center">
              <span className="text-[10px] text-stone-500 block">Relevance</span>
              <span className="font-mono font-bold text-stone-800 text-sm">
                {evaluation.relevanceScore}/10
              </span>
            </div>
            <div className="p-2.5 bg-white border border-stone-200 rounded text-center">
              <span className="text-[10px] text-stone-500 block">Structure</span>
              <span className="font-mono font-bold text-stone-800 text-sm">
                {evaluation.structureScore}/10
              </span>
            </div>
            <div className="p-2.5 bg-white border border-stone-200 rounded text-center">
              <span className="text-[10px] text-stone-500 block">Multidimensional</span>
              <span className="font-mono font-bold text-stone-800 text-sm">
                {evaluation.multidimensionalityScore}/10
              </span>
            </div>
            <div className="p-2.5 bg-white border border-stone-200 rounded text-center">
              <span className="text-[10px] text-stone-500 block">Facts & Acts</span>
              <span className="font-mono font-bold text-stone-800 text-sm">
                {evaluation.factsScore}/10
              </span>
            </div>
          </div>

          {/* Constructive Section-by-Section Feedback */}
          <div className="space-y-2.5 text-xs text-stone-700">
            <div className="p-3 bg-white border border-stone-200 rounded space-y-1">
              <strong className="text-stone-900 block">Introduction Feedback:</strong>
              <p className="leading-relaxed">{evaluation.feedback.intro}</p>
            </div>

            <div className="p-3 bg-white border border-stone-200 rounded space-y-1">
              <strong className="text-stone-900 block">Body & Arguments Feedback:</strong>
              <p className="leading-relaxed">{evaluation.feedback.body}</p>
            </div>

            <div className="p-3 bg-white border border-stone-200 rounded space-y-1">
              <strong className="text-stone-900 block">Conclusion & Way Forward:</strong>
              <p className="leading-relaxed">{evaluation.feedback.conclusion}</p>
            </div>

            {/* Critical Missing Dimensions */}
            {evaluation.feedback.criticalMissingDimensions?.length > 0 && (
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded space-y-1">
                <strong className="text-amber-950 block">Missing Dimensions to Include:</strong>
                <ul className="list-disc pl-4 space-y-0.5 text-amber-900">
                  {evaluation.feedback.criticalMissingDimensions.map((dim, i) => (
                    <li key={i}>{dim}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Value Addition Points */}
            {evaluation.feedback.valueAddition?.length > 0 && (
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded space-y-1">
                <strong className="text-emerald-950 block">Value Additions (Articles, Committees & Data):</strong>
                <ul className="list-disc pl-4 space-y-0.5 text-emerald-900">
                  {evaluation.feedback.valueAddition.map((va, i) => (
                    <li key={i}>{va}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="p-3 bg-white border border-stone-200 rounded">
              <strong className="text-stone-900 block mb-0.5">Overall Mentor Recommendation:</strong>
              <p className="leading-relaxed italic">{evaluation.feedback.overallRecommendation}</p>
            </div>
          </div>

          {/* Mandatory Disclaimer */}
          <div className="p-2.5 bg-stone-100 rounded text-[11px] text-stone-500 leading-normal border border-stone-200">
            <strong>Mandatory Notice:</strong> {evaluation.disclaimer}
          </div>
        </div>
      )}
    </div>
  );
};
