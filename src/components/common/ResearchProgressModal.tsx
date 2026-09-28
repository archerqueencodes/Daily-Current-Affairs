import React from 'react';
import {
  Loader2,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  X,
  Search,
  FileCheck,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { PipelineProgress } from '../../services/api';

interface ResearchProgressModalProps {
  isOpen: boolean;
  progress: PipelineProgress | null;
  error: string | null;
  onRetry: () => void;
  onCancel: () => void;
  selectedDate: string;
  onSwitchToDemo?: () => void;
}

export const ResearchProgressModal: React.FC<ResearchProgressModalProps> = ({
  isOpen,
  progress,
  error,
  onRetry,
  onCancel,
  selectedDate,
  onSwitchToDemo,
}) => {
  if (!isOpen) return null;

  const isError = Boolean(error);
  const isDone = progress?.stage === 'completed';
  const isInsufficientCoverage = Boolean(
    error && (error.includes('INSUFFICIENT_COVERAGE') || error.includes('Insufficient reliable coverage'))
  );
  const isQuotaError = Boolean(
    error && (error.includes('429') || error.includes('RESOURCE_EXHAUSTED') || error.includes('Quota Exceeded') || error.includes('rate limit'))
  );

  const stages = [
    { id: 'checking_api', label: '1. Gemini API & Scope Check' },
    { id: 'researching', label: '2. Google Search Grounded Research' },
    { id: 'sources_collected', label: '3. Grounding Sources Collected' },
    { id: 'structuring', label: '4. UPSC Syllabus Structuring' },
    { id: 'validating', label: '5. Dual-Source Cross-Verification' },
    { id: 'synthesizing', label: '6. Revision Pack & Practice Generation' },
  ];

  const getStageStatus = (stageId: string) => {
    if (!progress) return 'pending';
    const stageOrder = [
      'checking_api',
      'researching',
      'sources_collected',
      'structuring',
      'validating',
      'synthesizing',
      'completed',
    ];
    const currentIndex = stageOrder.indexOf(progress.stage);
    const thisIndex = stageOrder.indexOf(stageId);

    if (isError && currentIndex === thisIndex) return 'error';
    if (currentIndex > thisIndex || isDone) return 'done';
    if (currentIndex === thisIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-lg border border-stone-200 shadow-xl max-w-lg w-full p-6 text-stone-800 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h3 className="font-serif text-base font-bold text-stone-900">
              {isError
                ? 'Research Verification Notice'
                : isDone
                ? 'Research & Verification Completed'
                : 'Live UPSC Grounded Research Pipeline'}
            </h3>
            <p className="text-xs text-stone-500 font-mono mt-0.5">
              Selected Date: {selectedDate}
            </p>
          </div>

          {!isDone && !isError && (
            <button
              onClick={onCancel}
              className="text-stone-400 hover:text-stone-700 p-1 rounded"
              title="Close modal (pipeline runs in background)"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Progress Bar */}
        {!isError && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-stone-500 font-mono">
              <span>{progress?.message || 'Initializing pipeline...'}</span>
              <span>{progress?.percent || 0}%</span>
            </div>
            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-600 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress?.percent || 5}%` }}
              />
            </div>
          </div>
        )}

        {/* Error or Insufficient Coverage State */}
        {isError && (
          <div
            className={`p-4 rounded-md space-y-3 border ${
              isInsufficientCoverage || isQuotaError
                ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {isInsufficientCoverage ? (
                <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              ) : isQuotaError ? (
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wide">
                  {isInsufficientCoverage
                    ? 'Insufficient Reliable Coverage'
                    : isQuotaError
                    ? 'Gemini API Rate Limit Reached (HTTP 429)'
                    : 'Verification Pipeline Error'}
                </p>
                <p className="text-xs leading-relaxed">
                  {isInsufficientCoverage
                    ? `Official primary government and statutory repositories (PIB Delhi, Supreme Court, Ministries, RBI) have published limited or no verifiable gazetted notices for ${selectedDate}. In strict adherence to our core UPSC exam ethics, unverified or fabricated claims are never generated.`
                    : isQuotaError
                    ? 'Your Gemini API key has exceeded the free-tier requests-per-minute (RPM) quota. You can immediately click "Load Sample Dossier (Demo Mode)" to explore all UPSC exam features, or wait a minute before retrying.'
                    : error}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-amber-200/60 flex flex-wrap gap-2 justify-end">
              {onSwitchToDemo && (
                <button
                  onClick={onSwitchToDemo}
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Load Sample Dossier (Demo Mode)</span>
                </button>
              )}
              <button
                onClick={onRetry}
                className="px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-50 border border-stone-300 rounded transition-colors flex items-center gap-1.5"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Retry Search</span>
              </button>
            </div>
          </div>
        )}

        {/* Pipeline Stage Checklist */}
        <div className="space-y-2 py-1">
          {stages.map((st) => {
            const status = getStageStatus(st.id);
            return (
              <div
                key={st.id}
                className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded transition-colors ${
                  status === 'active'
                    ? 'bg-amber-50 text-amber-900 font-medium'
                    : status === 'done'
                    ? 'text-stone-700'
                    : 'text-stone-400'
                }`}
              >
                <span>{st.label}</span>
                <span>
                  {status === 'done' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                  {status === 'active' && (
                    <Loader2 className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                  )}
                  {status === 'pending' && <span className="text-[10px]">·</span>}
                </span>
              </div>
            );
          })}
        </div>

        {/* Quality Principle Notice */}
        <div className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded border border-stone-200/80 leading-relaxed">
          <strong className="text-stone-700">Strict Quality Benchmark:</strong> Grounding links are
          extracted only from official primary records (PIB, Supreme Court, Ministries, RBI) and
          reputed national dailies. No fake or speculative claims are ever generated.
        </div>

        {/* Footer */}
        {isDone && (
          <div className="flex justify-end pt-2 border-t border-stone-100">
            <button
              onClick={onCancel}
              className="px-4 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors"
            >
              View Daily Notes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
