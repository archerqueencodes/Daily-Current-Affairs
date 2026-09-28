import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Check, BookOpen } from 'lucide-react';
import { UserNote } from '../../types';
import { StorageService } from '../../services/storage';

interface NoteDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  articleId: string;
  articleHeadline: string;
  reportDate: string;
}

export const NoteDrawer: React.FC<NoteDrawerProps> = ({
  isOpen,
  onClose,
  articleId,
  articleHeadline,
  reportDate,
}) => {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const loadNote = async () => {
      const allNotes = await StorageService.getNotes();
      const existing = allNotes.find((n) => n.articleId === articleId);
      if (existing) {
        setContent(existing.content);
        setTags(existing.tags.join(', '));
        setCurrentNoteId(existing.id);
      } else {
        setContent('');
        setTags('');
        setCurrentNoteId(null);
      }
    };
    loadNote();
  }, [isOpen, articleId]);

  if (!isOpen) return null;

  const handleSave = async () => {
    const noteId = currentNoteId || `note-${Date.now()}`;
    const tagList = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const note: UserNote = {
      id: noteId,
      articleId,
      articleHeadline,
      reportDate,
      title: articleHeadline,
      content,
      tags: tagList,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await StorageService.saveNote(note);
    setCurrentNoteId(noteId);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 1500);
  };

  const handleDelete = async () => {
    if (!currentNoteId) return;
    if (confirm('Delete this note?')) {
      await StorageService.deleteNote(currentNoteId);
      setContent('');
      setTags('');
      setCurrentNoteId(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-700" />
            <h3 className="font-serif text-sm font-bold text-stone-900">Personal Study Note</h3>
          </div>
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-700 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Article context */}
        <div className="px-4 py-2.5 bg-stone-100/70 border-b border-stone-200 text-xs text-stone-600">
          <span className="font-semibold text-stone-800">Article:</span> {articleHeadline}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 flex flex-col space-y-3">
          <div className="flex-1 flex flex-col">
            <label className="text-xs font-semibold text-stone-700 mb-1">
              Key Insights, Mnemonics & Exam Connections
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your value-addition notes, diagrams, mnemonic keywords, or past-year question connections here..."
              className="flex-1 w-full text-xs font-sans border border-stone-200 rounded-md p-3 focus:outline-hidden focus:ring-1 focus:ring-amber-500 resize-none leading-relaxed"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 mb-1 block">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. GS2, Federalism, Judgments, Revise-Before-Prelims"
              className="w-full text-xs border border-stone-200 rounded px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="p-3 border-t border-stone-200 flex items-center justify-between bg-stone-50">
          {currentNoteId ? (
            <button
              onClick={handleDelete}
              className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded text-xs flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-800"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              className="px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded flex items-center gap-1.5 transition-colors"
            >
              {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
              <span>{isSaved ? 'Saved' : 'Save Note'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
