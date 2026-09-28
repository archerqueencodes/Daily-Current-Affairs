/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ResearchProgressModal } from './components/common/ResearchProgressModal';
import { FeedbackModal } from './components/common/FeedbackModal';
import { NoteDrawer } from './components/common/NoteDrawer';
import { ReadingModeModal } from './components/common/ReadingModeModal';
import { ExportModal } from './components/export/ExportModal';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { DailyArticlesPage } from './pages/DailyArticlesPage';
import { EditorialsPage } from './pages/EditorialsPage';
import { PrelimsPracticePage } from './pages/PrelimsPracticePage';
import { MainsPracticePage } from './pages/MainsPracticePage';
import { SyllabusExplorerPage } from './pages/SyllabusExplorerPage';
import { RevisionTrackerPage } from './pages/RevisionTrackerPage';
import { ArchivePage } from './pages/ArchivePage';
import { GlobalSearchPage } from './pages/GlobalSearchPage';
import { BookmarksPage } from './pages/BookmarksPage';
import { StudyProgressPage } from './pages/StudyProgressPage';
import { SettingsPage } from './pages/SettingsPage';

// Services & Data
import { StorageService, DEFAULT_SETTINGS } from './services/storage';
import { ApiService, PipelineProgress } from './services/api';
import { SAMPLE_DAILY_REPORT_27_09_2026 } from './services/sampleData';
import { DailyReport, NewsArticle, Category, UserSettings, UserProgress, ReadingStatus } from './types';

export default function App() {
  // Navigation & Date
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedDate, setSelectedDate] = useState<string>('27-09-2026');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);

  // Core Data
  const [currentReport, setCurrentReport] = useState<DailyReport | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, UserProgress>>({});
  const [revisionDueCount, setRevisionDueCount] = useState<number>(0);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

  // Pipeline State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [pipelineProgress, setPipelineProgress] = useState<PipelineProgress | null>(null);
  const [pipelineError, setPipelineError] = useState<string | null>(null);
  const [showProgressModal, setShowProgressModal] = useState<boolean>(false);

  // Modals & Drawers
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [feedbackArticle, setFeedbackArticle] = useState<NewsArticle | null>(null);
  const [showNoteDrawer, setShowNoteDrawer] = useState<boolean>(false);
  const [noteArticle, setNoteArticle] = useState<NewsArticle | null>(null);
  const [showReadingMode, setShowReadingMode] = useState<boolean>(false);
  const [readingArticle, setReadingArticle] = useState<NewsArticle | null>(null);

  // Load User Data & Progress
  const refreshUserData = useCallback(async () => {
    const userSettings = StorageService.getSettings();
    setSettings(userSettings);

    const bList = await StorageService.getBookmarks();
    setBookmarks(bList.map((b) => b.articleId));

    const pMap = await StorageService.getAllProgress();
    setProgressMap(pMap);

    const nowIso = new Date().toISOString();
    const dues = Object.values(pMap).filter(
      (p) => p.revisionDueAt && p.revisionDueAt <= nowIso && p.readingStatus !== 'revised'
    ).length;
    setRevisionDueCount(dues);
  }, []);

  // Load or Generate Report for selectedDate
  const loadOrGenerateReport = useCallback(
    async (date: string, forceRegenerate = false) => {
      // 1. Check existing storage cache first
      if (!forceRegenerate) {
        const cached = await StorageService.getReportByDate(date);
        if (cached) {
          setCurrentReport(cached);
          return;
        }
      }

      // If demoMode is enabled, seed with sample report
      const currentSettings = StorageService.getSettings();
      if (currentSettings.demoMode) {
        const demoReport: DailyReport = {
          ...SAMPLE_DAILY_REPORT_27_09_2026,
          reportDate: date,
          id: `report-${date}-sample`,
          isSample: true,
        };
        await StorageService.saveReport(demoReport);
        setCurrentReport(demoReport);
        return;
      }

      // 2. Execute Grounded Gemini Research Pipeline
      setIsGenerating(true);
      setPipelineError(null);
      setShowProgressModal(true);

      try {
        const report = await ApiService.generateDailyReport(
          date,
          (progress) => setPipelineProgress(progress),
          false
        );
        await StorageService.saveReport(report);
        setCurrentReport(report);
        setTimeout(() => setShowProgressModal(false), 800);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown generation failure.';
        setPipelineError(message);
        setPipelineProgress({ stage: 'error', message, percent: 100 });
        // Ensure user is never left without content
        if (!currentReport) {
          const cached = await StorageService.getReportByDate(date);
          if (cached) {
            setCurrentReport(cached);
          } else {
            setCurrentReport({
              ...SAMPLE_DAILY_REPORT_27_09_2026,
              reportDate: date,
              id: `report-${date}-sample`,
              isSample: true,
            });
          }
        }
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  // Initial Boot
  useEffect(() => {
    const init = async () => {
      await refreshUserData();
      // On first launch, check if 27-09-2026 is saved; if not, seed with verified sample dataset
      const existing = await StorageService.getReportByDate('27-09-2026');
      if (existing) {
        setCurrentReport(existing);
      } else {
        // Seed default initial sample report
        await StorageService.saveReport(SAMPLE_DAILY_REPORT_27_09_2026);
        setCurrentReport(SAMPLE_DAILY_REPORT_27_09_2026);
      }
    };
    init();
  }, [refreshUserData]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setActiveTab('search');
      }
      if (e.key === 'Escape') {
        setShowReadingMode(false);
        setShowNoteDrawer(false);
        setShowFeedbackModal(false);
        setShowExportModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers
  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    loadOrGenerateReport(newDate, false);
  };

  const handleRegenerate = () => {
    loadOrGenerateReport(selectedDate, true);
  };

  const handleToggleBookmark = async (article: NewsArticle) => {
    const isSaved = bookmarks.includes(article.id);
    if (isSaved) {
      await StorageService.removeBookmark(`bm-${article.id}`);
    } else {
      await StorageService.saveBookmark({
        id: `bm-${article.id}`,
        articleId: article.id,
        reportDate: selectedDate,
        headline: article.headline,
        category: article.category,
        gsPaper: article.gsPaper,
        savedAt: new Date().toISOString(),
      });
    }
    await refreshUserData();
  };

  const handleToggleReadingStatus = async (articleId: string) => {
    const current = progressMap[articleId]?.readingStatus || 'unread';
    if (current === 'unread') {
      await StorageService.markArticleRead(articleId, selectedDate, settings.revisionIntervals);
    } else if (current === 'read') {
      await StorageService.markArticleRevised(articleId, selectedDate, settings.revisionIntervals);
    } else {
      await StorageService.markArticleRead(articleId, selectedDate, settings.revisionIntervals);
    }
    await refreshUserData();
  };

  const handleSwitchToDemoFromModal = async () => {
    const updated = { ...settings, demoMode: true };
    StorageService.saveSettings(updated);
    setSettings(updated);
    const demoReport: DailyReport = {
      ...SAMPLE_DAILY_REPORT_27_09_2026,
      reportDate: selectedDate,
      id: `report-${selectedDate}-sample`,
      isSample: true,
    };
    await StorageService.saveReport(demoReport);
    setCurrentReport(demoReport);
    setPipelineError(null);
    setShowProgressModal(false);
  };

  const handleToggleDemoMode = async () => {
    const nextDemoMode = !settings.demoMode;
    const updated = { ...settings, demoMode: nextDemoMode };
    StorageService.saveSettings(updated);
    setSettings(updated);
    if (nextDemoMode) {
      const demoReport: DailyReport = {
        ...SAMPLE_DAILY_REPORT_27_09_2026,
        reportDate: selectedDate,
        id: `report-${selectedDate}-sample`,
        isSample: true,
      };
      await StorageService.saveReport(demoReport);
      setCurrentReport(demoReport);
    } else {
      await loadOrGenerateReport(selectedDate, true);
    }
  };

  const handleOpenCategory = (cat: Category) => {
    setSelectedCategory(cat);
    setActiveTab('daily');
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-slate-800 font-sans flex flex-col antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenExport={() => setShowExportModal(true)}
        isDemoMode={settings.demoMode}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
        revisionDueCount={revisionDueCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          report={currentReport}
          selectedDate={selectedDate}
          onChangeDate={handleDateChange}
          onRegenerate={handleRegenerate}
          isGenerating={isGenerating}
          onOpenMobileMenu={() => setIsOpenMobile(true)}
          onOpenSearch={() => setActiveTab('search')}
          onOpenExport={() => setShowExportModal(true)}
          isDemoMode={settings.demoMode}
          onToggleDemoMode={handleToggleDemoMode}
        />

        {/* Page Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' && (
            <DashboardPage
              report={currentReport}
              onNavigateToCategory={handleOpenCategory}
              onNavigateToTab={setActiveTab}
              revisionDueCount={revisionDueCount}
            />
          )}

          {activeTab === 'daily' && (
            <DailyArticlesPage
              report={currentReport}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              onOpenNote={(art) => {
                setNoteArticle(art);
                setShowNoteDrawer(true);
              }}
              onOpenReadingMode={(art) => {
                setReadingArticle(art);
                setShowReadingMode(true);
              }}
              onOpenFlag={(art) => {
                setFeedbackArticle(art);
                setShowFeedbackModal(true);
              }}
              progressMap={progressMap}
              onToggleReadingStatus={handleToggleReadingStatus}
            />
          )}

          {activeTab === 'editorials' && <EditorialsPage report={currentReport} />}

          {activeTab === 'prelims' && <PrelimsPracticePage report={currentReport} />}

          {activeTab === 'mains' && <MainsPracticePage report={currentReport} />}

          {activeTab === 'syllabus' && (
            <SyllabusExplorerPage
              report={currentReport}
              onOpenArticleDetail={(art) => {
                setReadingArticle(art);
                setShowReadingMode(true);
              }}
            />
          )}

          {activeTab === 'revision' && (
            <RevisionTrackerPage
              report={currentReport}
              onRefreshProgress={refreshUserData}
            />
          )}

          {activeTab === 'archive' && (
            <ArchivePage
              onSelectDate={(date) => {
                setSelectedDate(date);
                loadOrGenerateReport(date, false);
                setActiveTab('daily');
              }}
            />
          )}

          {activeTab === 'search' && (
            <GlobalSearchPage
              currentReport={currentReport}
              onOpenArticleDetail={(art) => {
                setReadingArticle(art);
                setShowReadingMode(true);
              }}
            />
          )}

          {activeTab === 'bookmarks' && (
            <BookmarksPage
              onSelectDate={(date) => {
                setSelectedDate(date);
                loadOrGenerateReport(date, false);
                setActiveTab('daily');
              }}
            />
          )}

          {activeTab === 'progress' && <StudyProgressPage />}

          {activeTab === 'settings' && (
            <SettingsPage
              settings={settings}
              onUpdateSettings={setSettings}
              onDataReset={() => {
                refreshUserData();
                loadOrGenerateReport(selectedDate, true);
              }}
            />
          )}
        </main>
      </div>

      {/* Modals & Drawers */}
      <ResearchProgressModal
        isOpen={showProgressModal}
        progress={pipelineProgress}
        error={pipelineError}
        onRetry={handleRegenerate}
        onCancel={() => {
          setShowProgressModal(false);
          setPipelineError(null);
          if (!currentReport) {
            setCurrentReport(SAMPLE_DAILY_REPORT_27_09_2026);
          }
        }}
        selectedDate={selectedDate}
        onSwitchToDemo={handleSwitchToDemoFromModal}
      />

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        report={currentReport}
      />

      {feedbackArticle && (
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          articleId={feedbackArticle.id}
          headline={feedbackArticle.headline}
          reportDate={selectedDate}
        />
      )}

      {noteArticle && (
        <NoteDrawer
          isOpen={showNoteDrawer}
          onClose={() => setShowNoteDrawer(false)}
          articleId={noteArticle.id}
          articleHeadline={noteArticle.headline}
          reportDate={selectedDate}
        />
      )}

      {readingArticle && (
        <ReadingModeModal
          isOpen={showReadingMode}
          onClose={() => setShowReadingMode(false)}
          article={readingArticle}
          onBookmark={handleToggleBookmark}
          isBookmarked={bookmarks.includes(readingArticle.id)}
        />
      )}
    </div>
  );
}
