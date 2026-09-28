import React from 'react';
import {
  BookOpen,
  Calendar,
  CheckSquare,
  PenTool,
  Bookmark,
  Compass,
  Repeat,
  Archive,
  Search,
  BarChart3,
  Settings,
  Newspaper,
  ShieldCheck,
  FileDown,
  Sparkles,
  ChevronRight,
  Flame,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'daily'
  | 'editorials'
  | 'prelims'
  | 'mains'
  | 'syllabus'
  | 'revision'
  | 'archive'
  | 'search'
  | 'bookmarks'
  | 'progress'
  | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenExport: () => void;
  isDemoMode: boolean;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  revisionDueCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenExport,
  isDemoMode,
  isOpenMobile,
  setIsOpenMobile,
  revisionDueCount,
}) => {
  const navItems: Array<{
    id: NavTab;
    label: string;
    icon: React.ReactNode;
    badge?: number | string;
    badgeColor?: string;
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: <Compass className="w-4 h-4" /> },
    { id: 'daily', label: 'Current Affairs', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'editorials', label: 'Editorials', icon: <Newspaper className="w-4 h-4" /> },
    { id: 'prelims', label: 'Prelims Practice', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'mains', label: 'Mains Answer Lab', icon: <PenTool className="w-4 h-4" /> },
    { id: 'syllabus', label: 'Syllabus Explorer', icon: <Archive className="w-4 h-4" /> },
    {
      id: 'revision',
      label: 'Spaced Revision',
      icon: <Repeat className="w-4 h-4" />,
      badge: revisionDueCount > 0 ? revisionDueCount : undefined,
      badgeColor: 'bg-amber-500 text-slate-900',
    },
    { id: 'archive', label: 'Date Archive', icon: <Calendar className="w-4 h-4" /> },
    { id: 'search', label: 'Global Search', icon: <Search className="w-4 h-4" /> },
    { id: 'bookmarks', label: 'Saved & Notes', icon: <Bookmark className="w-4 h-4" /> },
    { id: 'progress', label: 'Study Progress', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleSelect = (tab: NavTab) => {
    setActiveTab(tab);
    setIsOpenMobile(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs md:hidden"
          onClick={() => setIsOpenMobile(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-950 text-slate-200 border-r border-slate-800/80 flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-bold shadow-xs">
              <span className="font-serif tracking-tighter text-sm font-black">U</span>
            </div>
            <div>
              <h1 className="font-serif text-sm font-bold tracking-wide text-white leading-tight">
                UPSC Daily Notes
              </h1>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">
                Verified & Syllabus-Mapped
              </p>
            </div>
          </div>

          {isDemoMode && (
            <div className="mt-3 px-2 py-1 bg-amber-500/10 border border-amber-500/30 rounded text-[10px] text-amber-300 font-medium flex items-center justify-between">
              <span>DEMO MODE ACTIVE</span>
              <span className="text-[9px] uppercase tracking-wider text-amber-400">Sample</span>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-0.5 scrollbar-thin scrollbar-thumb-slate-800">
          <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Exam Navigation
          </div>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-colors text-left group ${
                  isActive
                    ? 'bg-slate-800/90 text-amber-400 shadow-xs'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`transition-colors ${
                      isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-1.5 py-0.2 text-[10px] font-bold rounded-sm ${item.badgeColor || 'bg-slate-700 text-slate-200'}`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Export & Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/80 space-y-2">
          <button
            onClick={onOpenExport}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700/80 text-amber-300 text-xs font-medium rounded transition-colors border border-amber-500/20"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export Notes (A4/Word)</span>
          </button>

          <div className="px-2 pt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>UPSC CSE 2026</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3 h-3" />
              <span>Grounded AI</span>
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
