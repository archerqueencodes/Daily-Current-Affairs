import React from 'react';
import { Menu, Search, FileDown, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { DateSelector } from '../common/DateSelector';
import { DailyReport, ResearchStatus } from '../../types';

interface HeaderProps {
  report: DailyReport | null;
  selectedDate: string;
  onChangeDate: (date: string) => void;
  onRegenerate: () => void;
  isGenerating: boolean;
  onOpenMobileMenu: () => void;
  onOpenSearch: () => void;
  onOpenExport: () => void;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  report,
  selectedDate,
  onChangeDate,
  onRegenerate,
  isGenerating,
  onOpenMobileMenu,
  onOpenSearch,
  onOpenExport,
  isDemoMode,
  onToggleDemoMode,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-stone-50/95 backdrop-blur-xs border-b border-stone-200/80 px-4 py-2.5 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Mobile Menu & Date Navigator */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-1.5 text-stone-600 hover:text-stone-900 rounded hover:bg-stone-200/60"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <DateSelector
            selectedDate={selectedDate}
            onChangeDate={onChangeDate}
            onRegenerate={onRegenerate}
            isGenerating={isGenerating}
          />
        </div>

        {/* Center: Demo Mode Watermark or Status Indicator */}
        <div className="flex items-center gap-2">
          {isDemoMode || report?.isSample ? (
            <div className="px-2.5 py-0.5 bg-amber-100 border border-amber-300 text-amber-900 text-[11px] font-bold tracking-wider uppercase rounded flex items-center gap-1.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
              <span>SAMPLE - NOT REAL NEWS</span>
            </div>
          ) : report ? (
            <div className="hidden lg:flex items-center gap-2 text-xs text-stone-500 font-medium">
              <span className="inline-flex items-center gap-1 text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{report.totalArticles} Verified Topics</span>
              </span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>~{report.estimatedReadingTimeMinutes} min read</span>
            </div>
          ) : null}
        </div>

        {/* Right: Actions (Search, Export, Demo Mode quick toggle) */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 rounded border border-stone-200 transition-colors"
            title="Global Search (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden lg:inline text-[9px] font-mono text-stone-400 bg-stone-100 px-1 py-0.5 rounded border border-stone-200">
              /
            </kbd>
          </button>

          <button
            onClick={onOpenExport}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-100/80 rounded border border-stone-200 transition-colors shadow-2xs"
            title="Export to Print/PDF, Markdown, or Word"
          >
            <FileDown className="w-3.5 h-3.5 text-stone-600" />
            <span>Export</span>
          </button>

          {/* Quick Demo toggle button */}
          <button
            onClick={onToggleDemoMode}
            className={`text-xs px-2 py-1 rounded border transition-colors ${
              isDemoMode
                ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                : 'text-stone-500 hover:text-stone-800 border-stone-200 hover:bg-stone-100'
            }`}
            title="Toggle between Live Gemini Grounded Pipeline and Demo Mode"
          >
            {isDemoMode ? 'Demo: ON' : 'Demo'}
          </button>
        </div>
      </div>
    </header>
  );
};
