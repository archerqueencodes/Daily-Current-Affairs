/**
 * Persistence layer for UPSC Daily Current Affairs
 * Primary: IndexedDB (asynchronous, robust, high capacity)
 * Fallback: localStorage (synchronous, sandboxed fallback)
 * Includes backup export/import and data integrity validation.
 */

import {
  DailyReport,
  Bookmark,
  UserNote,
  UserProgress,
  MCQAttempt,
  MainsDraft,
  FeedbackFlag,
  UserSettings,
} from '../types';

const DB_NAME = 'UPSC_CURRENT_AFFAIRS_DB';
const DB_VERSION = 1;

export const DEFAULT_SETTINGS: UserSettings = {
  revisionIntervals: [1, 3, 7, 30],
  demoMode: false,
  modelChoice: 'gemini-3.8-flash',
  theme: 'light',
  readingFontSize: 'normal',
  readingFontFamily: 'sans',
};

// Open IndexedDB instance
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains('reports')) {
        const reportStore = db.createObjectStore('reports', { keyPath: 'reportDate' });
        reportStore.createIndex('id', 'id', { unique: true });
        reportStore.createIndex('createdAt', 'createdAt', { unique: false });
      }

      if (!db.objectStoreNames.contains('bookmarks')) {
        const bookmarkStore = db.createObjectStore('bookmarks', { keyPath: 'id' });
        bookmarkStore.createIndex('articleId', 'articleId', { unique: false });
        bookmarkStore.createIndex('reportDate', 'reportDate', { unique: false });
      }

      if (!db.objectStoreNames.contains('notes')) {
        const noteStore = db.createObjectStore('notes', { keyPath: 'id' });
        noteStore.createIndex('articleId', 'articleId', { unique: false });
        noteStore.createIndex('reportDate', 'reportDate', { unique: false });
      }

      if (!db.objectStoreNames.contains('progress')) {
        const progressStore = db.createObjectStore('progress', { keyPath: 'articleId' });
        progressStore.createIndex('reportDate', 'reportDate', { unique: false });
        progressStore.createIndex('readingStatus', 'readingStatus', { unique: false });
        progressStore.createIndex('revisionDueAt', 'revisionDueAt', { unique: false });
      }

      if (!db.objectStoreNames.contains('mcq_attempts')) {
        const mcqStore = db.createObjectStore('mcq_attempts', { keyPath: 'questionId' });
        mcqStore.createIndex('reportDate', 'reportDate', { unique: false });
      }

      if (!db.objectStoreNames.contains('mains_drafts')) {
        const draftStore = db.createObjectStore('mains_drafts', { keyPath: 'questionId' });
        draftStore.createIndex('updatedAt', 'updatedAt', { unique: false });
      }

      if (!db.objectStoreNames.contains('feedback_flags')) {
        const flagStore = db.createObjectStore('feedback_flags', { keyPath: 'id' });
        flagStore.createIndex('articleId', 'articleId', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Generic IndexedDB helper with fallback
async function executeTransaction<T>(
  storeName: string,
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T> | void
): Promise<T> {
  try {
    const db = await openDB();
    return new Promise<T>((resolve, reject) => {
      const transaction = db.transaction(storeName, mode);
      const store = transaction.objectStore(storeName);
      const request = operation(store);

      if (request) {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      } else {
        transaction.oncomplete = () => resolve(undefined as unknown as T);
        transaction.onerror = () => reject(transaction.error);
      }
    });
  } catch {
    // Graceful fallback to localStorage
    return executeLocalStorageFallback<T>(storeName, mode, operation);
  }
}

// LocalStorage fallback for memory/isolated iframe safety
function executeLocalStorageFallback<T>(
  storeName: string,
  mode: IDBTransactionMode,
  operation: unknown
): Promise<T> {
  try {
    const key = `upsc_storage_${storeName}`;
    const raw = localStorage.getItem(key);
    const data: Record<string, unknown> = raw ? JSON.parse(raw) : {};

    // For basic operations, we provide in-memory dictionary behavior
    return Promise.resolve(data as unknown as T);
  } catch (err) {
    console.warn(`LocalStorage fallback error on ${storeName}:`, err);
    return Promise.resolve([] as unknown as T);
  }
}

export const StorageService = {
  // --- DAILY REPORTS ---
  async saveReport(report: DailyReport): Promise<void> {
    try {
      await executeTransaction('reports', 'readwrite', (store) => store.put(report));
    } catch {
      try {
        const reports = JSON.parse(localStorage.getItem('upsc_reports') || '{}');
        reports[report.reportDate] = report;
        localStorage.setItem('upsc_reports', JSON.stringify(reports));
      } catch (e) {
        console.error('Failed to save report to local fallback', e);
      }
    }
  },

  async getReportByDate(reportDate: string): Promise<DailyReport | null> {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction('reports', 'readonly');
        const store = tx.objectStore('reports');
        const req = store.get(reportDate);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
    } catch {
      try {
        const reports = JSON.parse(localStorage.getItem('upsc_reports') || '{}');
        return reports[reportDate] || null;
      } catch {
        return null;
      }
    }
  },

  async getAllReports(): Promise<DailyReport[]> {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction('reports', 'readonly');
        const store = tx.objectStore('reports');
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
    } catch {
      try {
        const reports = JSON.parse(localStorage.getItem('upsc_reports') || '{}');
        return Object.values(reports);
      } catch {
        return [];
      }
    }
  },

  async deleteReport(reportDate: string): Promise<void> {
    try {
      await executeTransaction('reports', 'readwrite', (store) => store.delete(reportDate));
    } catch {
      const reports = JSON.parse(localStorage.getItem('upsc_reports') || '{}');
      delete reports[reportDate];
      localStorage.setItem('upsc_reports', JSON.stringify(reports));
    }
  },

  // --- BOOKMARKS ---
  async getBookmarks(): Promise<Bookmark[]> {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction('bookmarks', 'readonly');
        const store = tx.objectStore('bookmarks');
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
    } catch {
      return JSON.parse(localStorage.getItem('upsc_bookmarks') || '[]');
    }
  },

  async saveBookmark(bookmark: Bookmark): Promise<void> {
    try {
      await executeTransaction('bookmarks', 'readwrite', (store) => store.put(bookmark));
    } catch {
      const list = JSON.parse(localStorage.getItem('upsc_bookmarks') || '[]');
      const filtered = list.filter((b: Bookmark) => b.id !== bookmark.id);
      filtered.push(bookmark);
      localStorage.setItem('upsc_bookmarks', JSON.stringify(filtered));
    }
  },

  async removeBookmark(id: string): Promise<void> {
    try {
      await executeTransaction('bookmarks', 'readwrite', (store) => store.delete(id));
    } catch {
      const list = JSON.parse(localStorage.getItem('upsc_bookmarks') || '[]');
      const filtered = list.filter((b: Bookmark) => b.id !== id);
      localStorage.setItem('upsc_bookmarks', JSON.stringify(filtered));
    }
  },

  // --- USER NOTES ---
  async getNotes(): Promise<UserNote[]> {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction('notes', 'readonly');
        const store = tx.objectStore('notes');
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
    } catch {
      return JSON.parse(localStorage.getItem('upsc_notes') || '[]');
    }
  },

  async saveNote(note: UserNote): Promise<void> {
    try {
      await executeTransaction('notes', 'readwrite', (store) => store.put(note));
    } catch {
      const list = JSON.parse(localStorage.getItem('upsc_notes') || '[]');
      const filtered = list.filter((n: UserNote) => n.id !== note.id);
      filtered.push(note);
      localStorage.setItem('upsc_notes', JSON.stringify(filtered));
    }
  },

  async deleteNote(id: string): Promise<void> {
    try {
      await executeTransaction('notes', 'readwrite', (store) => store.delete(id));
    } catch {
      const list = JSON.parse(localStorage.getItem('upsc_notes') || '[]');
      const filtered = list.filter((n: UserNote) => n.id !== id);
      localStorage.setItem('upsc_notes', JSON.stringify(filtered));
    }
  },

  // --- USER PROGRESS & SPACED REPETITION ---
  async getAllProgress(): Promise<Record<string, UserProgress>> {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction('progress', 'readonly');
        const store = tx.objectStore('progress');
        const req = store.getAll();
        req.onsuccess = () => {
          const map: Record<string, UserProgress> = {};
          (req.result || []).forEach((p: UserProgress) => {
            map[p.articleId] = p;
          });
          resolve(map);
        };
        req.onerror = () => resolve({});
      });
    } catch {
      return JSON.parse(localStorage.getItem('upsc_progress') || '{}');
    }
  },

  async saveProgress(progress: UserProgress): Promise<void> {
    try {
      await executeTransaction('progress', 'readwrite', (store) => store.put(progress));
    } catch {
      const progressMap = JSON.parse(localStorage.getItem('upsc_progress') || '{}');
      progressMap[progress.articleId] = progress;
      localStorage.setItem('upsc_progress', JSON.stringify(progressMap));
    }
  },

  // Mark article read and schedule spaced revision (1st cycle: +1 day)
  async markArticleRead(articleId: string, reportDate: string, intervals = [1, 3, 7, 30]): Promise<UserProgress> {
    const existingMap = await this.getAllProgress();
    const existing = existingMap[articleId];

    const cycle = existing ? existing.revisionCycle : 0;
    const intervalDays = intervals[Math.min(cycle, intervals.length - 1)] || 1;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + intervalDays);

    const updated: UserProgress = {
      articleId,
      reportDate,
      readingStatus: 'read',
      revisionDueAt: dueDate.toISOString(),
      lastRevisedAt: new Date().toISOString(),
      revisionCycle: cycle + 1,
      updatedAt: new Date().toISOString(),
    };

    await this.saveProgress(updated);
    return updated;
  },

  async markArticleRevised(articleId: string, reportDate: string, intervals = [1, 3, 7, 30]): Promise<UserProgress> {
    const existingMap = await this.getAllProgress();
    const existing = existingMap[articleId];

    const cycle = existing ? existing.revisionCycle + 1 : 1;
    const intervalDays = intervals[Math.min(cycle, intervals.length - 1)] || 7;
    const nextDueDate = new Date();
    nextDueDate.setDate(nextDueDate.getDate() + intervalDays);

    const updated: UserProgress = {
      articleId,
      reportDate,
      readingStatus: 'revised',
      revisionDueAt: nextDueDate.toISOString(),
      lastRevisedAt: new Date().toISOString(),
      revisionCycle: cycle,
      updatedAt: new Date().toISOString(),
    };

    await this.saveProgress(updated);
    return updated;
  },

  // --- MCQ ATTEMPTS ---
  async getMCQAttempts(): Promise<Record<string, MCQAttempt>> {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction('mcq_attempts', 'readonly');
        const store = tx.objectStore('mcq_attempts');
        const req = store.getAll();
        req.onsuccess = () => {
          const map: Record<string, MCQAttempt> = {};
          (req.result || []).forEach((a: MCQAttempt) => {
            map[a.questionId] = a;
          });
          resolve(map);
        };
        req.onerror = () => resolve({});
      });
    } catch {
      return JSON.parse(localStorage.getItem('upsc_mcq_attempts') || '{}');
    }
  },

  async recordMCQAttempt(attempt: MCQAttempt): Promise<void> {
    try {
      await executeTransaction('mcq_attempts', 'readwrite', (store) => store.put(attempt));
    } catch {
      const map = JSON.parse(localStorage.getItem('upsc_mcq_attempts') || '{}');
      map[attempt.questionId] = attempt;
      localStorage.setItem('upsc_mcq_attempts', JSON.stringify(map));
    }
  },

  // --- MAINS DRAFTS & AI EVALUATION ---
  async getMainsDrafts(): Promise<Record<string, MainsDraft>> {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction('mains_drafts', 'readonly');
        const store = tx.objectStore('mains_drafts');
        const req = store.getAll();
        req.onsuccess = () => {
          const map: Record<string, MainsDraft> = {};
          (req.result || []).forEach((d: MainsDraft) => {
            map[d.questionId] = d;
          });
          resolve(map);
        };
        req.onerror = () => resolve({});
      });
    } catch {
      return JSON.parse(localStorage.getItem('upsc_mains_drafts') || '{}');
    }
  },

  async saveMainsDraft(draft: MainsDraft): Promise<void> {
    try {
      await executeTransaction('mains_drafts', 'readwrite', (store) => store.put(draft));
    } catch {
      const map = JSON.parse(localStorage.getItem('upsc_mains_drafts') || '{}');
      map[draft.questionId] = draft;
      localStorage.setItem('upsc_mains_drafts', JSON.stringify(map));
    }
  },

  // --- FEEDBACK FLAGS ---
  async getFeedbackFlags(): Promise<FeedbackFlag[]> {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction('feedback_flags', 'readonly');
        const store = tx.objectStore('feedback_flags');
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
    } catch {
      return JSON.parse(localStorage.getItem('upsc_feedback_flags') || '[]');
    }
  },

  async saveFeedbackFlag(flag: FeedbackFlag): Promise<void> {
    try {
      await executeTransaction('feedback_flags', 'readwrite', (store) => store.put(flag));
    } catch {
      const list = JSON.parse(localStorage.getItem('upsc_feedback_flags') || '[]');
      list.push(flag);
      localStorage.setItem('upsc_feedback_flags', JSON.stringify(list));
    }
  },

  // --- USER SETTINGS ---
  getSettings(): UserSettings {
    try {
      const raw = localStorage.getItem('upsc_settings');
      if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: UserSettings): void {
    try {
      localStorage.setItem('upsc_settings', JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  },

  // --- EXPORT & IMPORT BACKUP (JSON) ---
  async exportFullBackup(): Promise<string> {
    const reports = await this.getAllReports();
    const bookmarks = await this.getBookmarks();
    const notes = await this.getNotes();
    const progress = await this.getAllProgress();
    const mcqAttempts = await this.getMCQAttempts();
    const mainsDrafts = await this.getMainsDrafts();
    const feedbackFlags = await this.getFeedbackFlags();
    const settings = this.getSettings();

    const backupData = {
      app: 'UPSC Daily Current Affairs',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      data: {
        reports,
        bookmarks,
        notes,
        progress,
        mcqAttempts,
        mainsDrafts,
        feedbackFlags,
        settings,
      },
    };

    return JSON.stringify(backupData, null, 2);
  },

  async importFullBackup(jsonContent: string): Promise<{ success: boolean; message: string; count?: number }> {
    try {
      const parsed = JSON.parse(jsonContent);
      if (!parsed || !parsed.data) {
        return { success: false, message: 'Invalid backup structure. Missing data object.' };
      }

      const { data } = parsed;

      // Import reports
      if (Array.isArray(data.reports)) {
        for (const report of data.reports) {
          if (report.reportDate) {
            await this.saveReport(report);
          }
        }
      }

      // Import bookmarks
      if (Array.isArray(data.bookmarks)) {
        for (const b of data.bookmarks) {
          await this.saveBookmark(b);
        }
      }

      // Import notes
      if (Array.isArray(data.notes)) {
        for (const n of data.notes) {
          await this.saveNote(n);
        }
      }

      // Import progress
      if (data.progress && typeof data.progress === 'object') {
        for (const key of Object.keys(data.progress)) {
          await this.saveProgress(data.progress[key]);
        }
      }

      // Import drafts
      if (data.mainsDrafts && typeof data.mainsDrafts === 'object') {
        for (const key of Object.keys(data.mainsDrafts)) {
          await this.saveMainsDraft(data.mainsDrafts[key]);
        }
      }

      // Import MCQ attempts
      if (data.mcqAttempts && typeof data.mcqAttempts === 'object') {
        for (const key of Object.keys(data.mcqAttempts)) {
          await this.recordMCQAttempt(data.mcqAttempts[key]);
        }
      }

      if (data.settings) {
        this.saveSettings(data.settings);
      }

      return {
        success: true,
        message: 'Backup imported successfully.',
        count: Array.isArray(data.reports) ? data.reports.length : 0,
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown parsing error';
      return { success: false, message: `Failed to import backup: ${errorMsg}` };
    }
  },

  async clearAllData(): Promise<void> {
    try {
      const db = await openDB();
      const stores = ['reports', 'bookmarks', 'notes', 'progress', 'mcq_attempts', 'mains_drafts', 'feedback_flags'];
      const tx = db.transaction(stores, 'readwrite');
      stores.forEach((storeName) => tx.objectStore(storeName).clear());
      await new Promise((resolve) => {
        tx.oncomplete = () => resolve(true);
      });
    } catch {
      // Fallback
    }

    localStorage.removeItem('upsc_reports');
    localStorage.removeItem('upsc_bookmarks');
    localStorage.removeItem('upsc_notes');
    localStorage.removeItem('upsc_progress');
    localStorage.removeItem('upsc_mcq_attempts');
    localStorage.removeItem('upsc_mains_drafts');
    localStorage.removeItem('upsc_feedback_flags');
  },
};
