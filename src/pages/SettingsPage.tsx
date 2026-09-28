import React, { useState, useEffect } from 'react';
import {
  Settings,
  Shield,
  Download,
  Upload,
  Trash2,
  Check,
  AlertTriangle,
  RotateCw,
  Sparkles,
  Flag,
} from 'lucide-react';
import { UserSettings, FeedbackFlag } from '../types';
import { StorageService } from '../services/storage';
import { ApiService } from '../services/api';

interface SettingsPageProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onDataReset: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onUpdateSettings,
  onDataReset,
}) => {
  const [apiKeyConfigured, setApiKeyConfigured] = useState<boolean | null>(null);
  const [backupStatus, setBackupStatus] = useState<string | null>(null);
  const [feedbackFlags, setFeedbackFlags] = useState<FeedbackFlag[]>([]);

  useEffect(() => {
    const check = async () => {
      const status = await ApiService.checkStatus();
      setApiKeyConfigured(status.hasApiKey);
      const flags = await StorageService.getFeedbackFlags();
      setFeedbackFlags(flags);
    };
    check();
  }, []);

  const handleExportBackup = async () => {
    try {
      const json = await StorageService.exportFullBackup();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `upsc-notes-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setBackupStatus('Backup exported successfully.');
      setTimeout(() => setBackupStatus(null), 3000);
    } catch {
      setBackupStatus('Failed to generate backup.');
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      const res = await StorageService.importFullBackup(content);
      if (res.success) {
        setBackupStatus(`Backup imported successfully (${res.count || 0} reports).`);
        onDataReset();
      } else {
        setBackupStatus(res.message);
      }
      setTimeout(() => setBackupStatus(null), 4000);
    };
    reader.readAsText(file);
  };

  const handleClearAll = async () => {
    if (confirm('Are you sure you want to clear all locally stored reports, notes, and bookmarks? This cannot be undone.')) {
      await StorageService.clearAllData();
      onDataReset();
      alert('Local storage has been reset.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-2xs space-y-1">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-800 uppercase font-semibold">
          <Settings className="w-3.5 h-3.5" />
          <span>System Configuration & Data Integrity</span>
        </div>
        <h2 className="font-serif text-base font-bold text-stone-900">
          Application Preferences & Backups
        </h2>
        <p className="text-xs text-stone-500">
          Configure AI research parameters, demo testing, spaced repetition intervals, and full offline backups.
        </p>
      </div>

      {/* Demo Mode Section */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-2xs space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-stone-900">Demo Data Mode</span>
              {settings.demoMode && (
                <span className="text-[10px] uppercase font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                  SAMPLE - NOT REAL NEWS
                </span>
              )}
            </div>
            <p className="text-xs text-stone-600 leading-relaxed max-w-xl">
              When enabled, loads complete verified sample notes for immediate UI testing without calling the live Gemini Google Search grounded pipeline. Off by default.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={settings.demoMode}
              onChange={(e) => {
                const updated = { ...settings, demoMode: e.target.checked };
                StorageService.saveSettings(updated);
                onUpdateSettings(updated);
              }}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-stone-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600" />
          </label>
        </div>
      </div>

      {/* AI Model Architecture & Status */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-2xs space-y-3">
        <h3 className="font-serif text-sm font-bold text-stone-900 pb-2 border-b border-stone-100 flex items-center justify-between">
          <span>Gemini AI Pipeline Architecture</span>
          <span className="text-[11px] font-mono text-stone-400">@google/genai SDK</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-stone-50 rounded border border-stone-200 space-y-1">
            <span className="font-semibold text-stone-800 block">Research & Search Grounding</span>
            <span className="font-mono text-amber-800 font-bold">gemini-3.8-flash</span>
            <p className="text-[11px] text-stone-500">
              Pass 1: Live web search grounding over PIB, Supreme Court, Ministries & RBI.
            </p>
          </div>

          <div className="p-3 bg-stone-50 rounded border border-stone-200 space-y-1">
            <span className="font-semibold text-stone-800 block">Structuring & Mains Evaluation</span>
            <span className="font-mono text-amber-800 font-bold">gemini-3.8-flash (JSON Mode)</span>
            <p className="text-[11px] text-stone-500">
              Pass 2 & 3: Response schema structuring & 8-dimensional Mains answer scoring.
            </p>
          </div>
        </div>

        <div className="p-3 bg-stone-50 rounded text-xs flex items-center justify-between">
          <span className="text-stone-600">Environment API Key Status:</span>
          {apiKeyConfigured === true ? (
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>Configured & Active</span>
            </span>
          ) : apiKeyConfigured === false ? (
            <span className="text-amber-800 font-semibold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Not Configured (Demo Mode Available)</span>
            </span>
          ) : (
            <span className="text-stone-400">Checking...</span>
          )}
        </div>
      </div>

      {/* Spaced Repetition Intervals */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-2xs space-y-3">
        <h3 className="font-serif text-sm font-bold text-stone-900 pb-2 border-b border-stone-100">
          Spaced Repetition Intervals (Days)
        </h3>
        <p className="text-xs text-stone-600">
          Configured review cycle intervals: Articles marked read are queued for Day +1, Day +3, Day +7, and Day +30.
        </p>
        <div className="flex gap-2">
          {settings.revisionIntervals.map((interval, idx) => (
            <div
              key={idx}
              className="px-3 py-1.5 bg-stone-100 rounded text-xs font-mono font-bold text-stone-800"
            >
              Cycle {idx + 1}: +{interval}d
            </div>
          ))}
        </div>
      </div>

      {/* Export / Import Backup (JSON) */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-2xs space-y-4">
        <div className="pb-2 border-b border-stone-100">
          <h3 className="font-serif text-sm font-bold text-stone-900">
            Offline Backup & Restore (JSON)
          </h3>
          <p className="text-xs text-stone-500">
            Download your full local repository (reports, bookmarks, notes, and drafts) or import a backup file.
          </p>
        </div>

        {backupStatus && (
          <div className="p-3 bg-stone-100 text-stone-800 rounded text-xs font-medium">
            {backupStatus}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportBackup}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded flex items-center gap-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Backup (JSON)</span>
          </button>

          <label className="px-3.5 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded border border-stone-200 flex items-center gap-2 transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-stone-600" />
            <span>Import Backup (JSON)</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Flagged Feedback History */}
      {feedbackFlags.length > 0 && (
        <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
            <Flag className="w-4 h-4 text-amber-600" />
            <h3 className="font-serif text-sm font-bold text-stone-900">
              Submitted Quality Feedback Flags ({feedbackFlags.length})
            </h3>
          </div>

          <div className="divide-y divide-stone-100 text-xs">
            {feedbackFlags.map((fl) => (
              <div key={fl.id} className="py-2.5 space-y-1">
                <div className="flex items-center justify-between font-semibold text-stone-800">
                  <span>{fl.headline}</span>
                  <span className="font-mono text-[10px] text-amber-800 uppercase bg-amber-50 px-1.5 py-0.5 rounded">
                    {fl.flagType.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-stone-600">{fl.comment}</p>
                <div className="text-[10px] text-stone-400 font-mono">
                  Report Date: {fl.reportDate} · Logged: {new Date(fl.createdAt).toLocaleDateString('en-GB')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Danger Zone: Reset */}
      <div className="bg-white border border-rose-200 rounded-lg p-5 shadow-2xs space-y-3">
        <h3 className="font-serif text-sm font-bold text-rose-900">Danger Zone</h3>
        <p className="text-xs text-stone-600">
          Clear all locally saved daily reports, notes, bookmarks, and test attempts from your browser.
        </p>
        <button
          onClick={handleClearAll}
          className="px-3.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded flex items-center gap-1.5 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All Stored Data</span>
        </button>
      </div>
    </div>
  );
};
