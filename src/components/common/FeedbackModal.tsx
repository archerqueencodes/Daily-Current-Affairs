import React, { useState } from 'react';
import { AlertCircle, X, Check } from 'lucide-react';
import { FeedbackFlag } from '../../types';
import { StorageService } from '../../services/storage';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  articleId: string;
  headline: string;
  reportDate: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  articleId,
  headline,
  reportDate,
}) => {
  const [flagType, setFlagType] = useState<FeedbackFlag['flagType']>('incorrect_fact');
  const [comment, setComment] = useState('');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const flag: FeedbackFlag = {
      id: `flag-${Date.now()}`,
      articleId,
      headline,
      reportDate,
      flagType,
      comment,
      createdAt: new Date().toISOString(),
    };

    await StorageService.saveFeedbackFlag(flag);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setComment('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-lg border border-stone-200 shadow-xl max-w-md w-full p-5 text-stone-800 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Flag Issue for Quality Review</span>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-stone-600 line-clamp-2">
          <strong>Article:</strong> {headline}
        </p>

        {saved ? (
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded flex items-center justify-center gap-2 text-xs font-medium">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Feedback recorded. Thank you for safeguarding notes accuracy.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Issue Category
              </label>
              <select
                value={flagType}
                onChange={(e) => setFlagType(e.target.value as any)}
                className="w-full text-xs border border-stone-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-amber-500"
              >
                <option value="incorrect_fact">Factual Discrepancy / Incorrect Figure</option>
                <option value="broken_source">Broken or Mismatched Source URL</option>
                <option value="irrelevant">Weak UPSC Syllabus Relevance</option>
                <option value="duplicate">Duplicate of Another Article</option>
                <option value="missing_info">Missing Critical Constitutional / Statutory Provision</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Details & Verification Note
              </label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Explain the specific error and provide the official source reference if known..."
                className="w-full text-xs border border-stone-300 rounded p-2 focus:ring-1 focus:ring-amber-500 resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded"
              >
                Submit Feedback
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
