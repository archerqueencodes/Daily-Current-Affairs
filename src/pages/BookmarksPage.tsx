import React, { useState, useEffect } from 'react';
import { Bookmark, FileText, Trash2, ExternalLink, Calendar } from 'lucide-react';
import { Bookmark as BookmarkType, UserNote } from '../types';
import { StorageService } from '../services/storage';

interface BookmarksPageProps {
  onSelectDate: (date: string) => void;
}

export const BookmarksPage: React.FC<BookmarksPageProps> = ({ onSelectDate }) => {
  const [activeSubTab, setActiveSubTab] = useState<'bookmarks' | 'notes'>('bookmarks');
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [notes, setNotes] = useState<UserNote[]>([]);

  const loadData = async () => {
    const bList = await StorageService.getBookmarks();
    const nList = await StorageService.getNotes();
    setBookmarks(bList);
    setNotes(nList);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRemoveBookmark = async (id: string) => {
    await StorageService.removeBookmark(id);
    await loadData();
  };

  const handleDeleteNote = async (id: string) => {
    if (confirm('Delete this note?')) {
      await StorageService.deleteNote(id);
      await loadData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-2xs space-y-1">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-800 uppercase font-semibold">
          <Bookmark className="w-3.5 h-3.5" />
          <span>Saved Articles & Personal Study Notes</span>
        </div>
        <h2 className="font-serif text-base font-bold text-stone-900">
          Personal Repository
        </h2>
        <p className="text-xs text-stone-500">
          Quickly access bookmarked high-yield articles and your self-written value-addition notes.
        </p>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveSubTab('bookmarks')}
          className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'bookmarks'
              ? 'bg-slate-900 text-white'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Bookmarks ({bookmarks.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('notes')}
          className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'notes'
              ? 'bg-slate-900 text-white'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Study Notes ({notes.length})</span>
        </button>
      </div>

      {/* Bookmarks Tab Content */}
      {activeSubTab === 'bookmarks' && (
        <div className="space-y-3">
          {bookmarks.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-lg p-10 text-center text-xs text-stone-500">
              No bookmarked articles yet. Click the bookmark icon on any article card to save it here.
            </div>
          ) : (
            bookmarks.map((b) => (
              <div
                key={b.id}
                className="bg-white border border-stone-200 rounded-lg p-4 flex items-center justify-between gap-4 shadow-2xs hover:border-amber-500/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[11px] text-stone-400 font-mono">
                    <span className="font-semibold text-amber-800">{b.category}</span>
                    <span>·</span>
                    <span>{b.gsPaper}</span>
                    <span>·</span>
                    <span>Report: {b.reportDate}</span>
                  </div>
                  <h3
                    onClick={() => onSelectDate(b.reportDate)}
                    className="font-serif text-sm font-bold text-stone-900 hover:text-amber-900 cursor-pointer"
                  >
                    {b.headline}
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onSelectDate(b.reportDate)}
                    className="px-2.5 py-1 text-xs text-stone-700 bg-stone-100 hover:bg-stone-200 rounded"
                  >
                    Jump to Day
                  </button>
                  <button
                    onClick={() => handleRemoveBookmark(b.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded hover:bg-rose-50"
                    title="Remove Bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Notes Tab Content */}
      {activeSubTab === 'notes' && (
        <div className="space-y-3">
          {notes.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-lg p-10 text-center text-xs text-stone-500">
              No study notes written yet. Click the note icon on any article to record insights.
            </div>
          ) : (
            notes.map((n) => (
              <div
                key={n.id}
                className="bg-white border border-stone-200 rounded-lg p-4 space-y-2 shadow-2xs"
              >
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <div className="font-semibold text-stone-800 truncate max-w-md">
                    {n.articleHeadline || n.title}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono">
                      {new Date(n.updatedAt).toLocaleDateString('en-GB')}
                    </span>
                    <button
                      onClick={() => handleDeleteNote(n.id)}
                      className="text-stone-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-700 whitespace-pre-wrap leading-relaxed bg-stone-50 p-3 rounded">
                  {n.content}
                </p>

                {n.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 text-[10px] text-stone-500">
                    {n.tags.map((t, idx) => (
                      <span key={idx} className="bg-stone-100 px-1.5 py-0.5 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
