import React, { useState } from 'react';
import { X, Printer, FileText, Download, Check, Sparkles, Loader2 } from 'lucide-react';
import { DailyReport } from '../../types';
import { ExportService, ExportScope } from '../../services/export';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: DailyReport | null;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, report }) => {
  const [scope, setScope] = useState<ExportScope>('complete');
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);

  if (!isOpen) return null;

  if (!report) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
        <div className="bg-white rounded-lg border border-stone-200 shadow-xl max-w-sm w-full p-5 text-center space-y-3">
          <p className="text-xs text-stone-600">
            No report loaded for the selected date. Please generate notes first.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs bg-slate-900 text-white rounded font-medium"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    ExportService.printDocument(report, scope);
    onClose();
  };

  const handleDownloadMarkdown = () => {
    ExportService.downloadMarkdown(report, scope);
    onClose();
  };

  const handleCopyMarkdown = async () => {
    const md = ExportService.generateMarkdown(report, scope);
    await navigator.clipboard.writeText(md);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleDownloadDocx = async () => {
    try {
      setIsExportingDocx(true);
      await ExportService.downloadDOCX(report, scope);
      setIsExportingDocx(false);
      onClose();
    } catch (err) {
      console.error('Docx export error:', err);
      setIsExportingDocx(false);
      alert('Failed to generate DOCX. You can export as Print/PDF or Markdown instead.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-lg border border-stone-200 shadow-xl max-w-md w-full p-5 text-stone-800 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div>
            <h3 className="font-serif text-sm font-bold text-stone-900">
              Export UPSC Exam Dossier
            </h3>
            <p className="text-[11px] text-stone-500 font-mono">Date: {report.reportDate}</p>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scope Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-stone-700 block">Export Scope</label>
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value as ExportScope)}
            className="w-full text-xs border border-stone-300 rounded px-2.5 py-2 focus:ring-1 focus:ring-amber-500"
          >
            <option value="complete">Complete Notes (All Sections + Revision + MCQs)</option>
            <option value="prelims_only">Prelims-Only Package (Facts, Tables & MCQs)</option>
            <option value="mains_only">Mains-Only Package (Dimensions, Schemes & Questions)</option>
            <option value="editorials">Editorial Analysis & Model Paragraphs</option>
            <option value="revision_sheet">Quick Revision Sheet & High-Yield Keywords</option>
            <option value="practice_questions">Practice Set Only (Prelims MCQs + Mains)</option>
          </select>
        </div>

        {/* Format Options */}
        <div className="space-y-2 pt-1">
          <label className="text-xs font-semibold text-stone-700 block">Select Format</label>

          {/* Option 1: Browser Print / PDF */}
          <button
            onClick={handlePrint}
            className="w-full flex items-center justify-between p-3 border border-stone-200 hover:border-amber-500/50 hover:bg-stone-50 rounded-md transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-stone-100 rounded text-stone-700 group-hover:bg-amber-100 group-hover:text-amber-800 transition-colors">
                <Printer className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-stone-900">
                  Print-Optimized View / Save as PDF
                </div>
                <div className="text-[10px] text-stone-500">
                  A4 layout with formal typography, clean page breaks, and no UI clutter.
                </div>
              </div>
            </div>
            <span className="text-[10px] font-mono text-stone-400">A4 PDF</span>
          </button>

          {/* Option 2: Microsoft Word (.docx) */}
          <button
            onClick={handleDownloadDocx}
            disabled={isExportingDocx}
            className="w-full flex items-center justify-between p-3 border border-stone-200 hover:border-amber-500/50 hover:bg-stone-50 rounded-md transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-stone-100 rounded text-stone-700 group-hover:bg-amber-100 group-hover:text-amber-800 transition-colors">
                {isExportingDocx ? (
                  <Loader2 className="w-4 h-4 animate-spin text-amber-700" />
                ) : (
                  <FileText className="w-4 h-4" />
                )}
              </div>
              <div>
                <div className="text-xs font-semibold text-stone-900">Microsoft Word (.docx)</div>
                <div className="text-[10px] text-stone-500">
                  Preserves headings, bullet numbering, source link tables, and styling.
                </div>
              </div>
            </div>
            <span className="text-[10px] font-mono text-stone-400">DOCX</span>
          </button>

          {/* Option 3: Markdown */}
          <div className="flex gap-2">
            <button
              onClick={handleDownloadMarkdown}
              className="flex-1 flex items-center justify-center gap-2 p-2.5 border border-stone-200 hover:bg-stone-50 rounded-md text-xs font-medium text-stone-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .md</span>
            </button>
            <button
              onClick={handleCopyMarkdown}
              className="flex-1 flex items-center justify-center gap-2 p-2.5 border border-stone-200 hover:bg-stone-50 rounded-md text-xs font-medium text-stone-700"
            >
              {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <FileText className="w-3.5 h-3.5" />}
              <span>{copiedMd ? 'Copied' : 'Copy Markdown'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-stone-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-stone-500 hover:text-stone-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
