import React, { useState } from 'react';
import { Archive, ChevronRight, BookOpen, Layers, CheckSquare, Search } from 'lucide-react';
import { UPSC_SYLLABUS, SyllabusSection } from '../data/upscSyllabus';
import { DailyReport, NewsArticle } from '../types';

interface SyllabusExplorerPageProps {
  report: DailyReport | null;
  onOpenArticleDetail?: (article: NewsArticle) => void;
}

export const SyllabusExplorerPage: React.FC<SyllabusExplorerPageProps> = ({
  report,
  onOpenArticleDetail,
}) => {
  const [activePaper, setActivePaper] = useState<string>('GS2');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('gs2-constitution');
  const [searchTerm, setSearchTerm] = useState('');

  const currentSection =
    UPSC_SYLLABUS.find((s) => s.paper === activePaper) || UPSC_SYLLABUS[2]; // Default GS2

  const currentTopic = currentSection.topics.find((t) => t.id === selectedTopicId) || currentSection.topics[0];

  // Find articles linked to current paper/topic
  const linkedArticles = (report?.articles || []).filter((art) => {
    if (activePaper === 'Prelims') return art.gsPaper === 'Prelims Only' || art.gsPaper === 'GS1';
    if (activePaper === 'GS1') return art.gsPaper === 'GS1';
    if (activePaper === 'GS2') return art.gsPaper === 'GS2';
    if (activePaper === 'GS3') return art.gsPaper === 'GS3';
    if (activePaper === 'GS4') return art.gsPaper === 'GS4';
    if (activePaper === 'Essay') return Boolean(art.essayRelevance);
    return false;
  });

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-2xs space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-800 uppercase font-semibold">
          <Archive className="w-3.5 h-3.5" />
          <span>Official UPSC CSE Syllabus Taxonomy</span>
        </div>
        <h2 className="font-serif text-base font-bold text-stone-900">
          Syllabus-to-Current-Affairs Interactive Mapping
        </h2>
        <p className="text-xs text-stone-500">
          UPSC questions never test news in isolation; they test static constitutional, statutory, and institutional fundamentals ignited by current events.
        </p>
      </div>

      {/* Paper Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {UPSC_SYLLABUS.map((sec) => (
          <button
            key={sec.id}
            onClick={() => {
              setActivePaper(sec.paper);
              setSelectedTopicId(sec.topics[0]?.id || '');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
              activePaper === sec.paper
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            {sec.paper} ({sec.topics.length} Areas)
          </button>
        ))}
      </div>

      {/* Two Column Layout: Topics Tree + Drilldown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Topics List */}
        <div className="bg-white border border-stone-200 rounded-lg p-3 shadow-2xs space-y-1.5">
          <div className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-400">
            {currentSection.title}
          </div>

          <div className="space-y-1">
            {currentSection.topics.map((top) => (
              <button
                key={top.id}
                onClick={() => setSelectedTopicId(top.id)}
                className={`w-full text-left p-2.5 rounded text-xs transition-colors flex items-center justify-between group ${
                  selectedTopicId === top.id
                    ? 'bg-amber-50 text-amber-950 font-bold border-l-2 border-amber-600'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span className="line-clamp-2 leading-snug">{top.name}</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-stone-400 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Topic Core & Linked Current Affairs (2 cols) */}
        <div className="md:col-span-2 space-y-4">
          {currentTopic && (
            <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-2xs space-y-4">
              {/* Topic Title */}
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded">
                  {activePaper} Core Topic
                </span>
                <h3 className="font-serif text-base font-bold text-stone-900 mt-2">
                  {currentTopic.name}
                </h3>
              </div>

              {/* Static Core Concepts */}
              <div className="p-3.5 bg-stone-50 rounded border border-stone-200 space-y-2">
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                  Fundamental Static Concepts & Constitutional Core:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentTopic.staticCore.map((sc, i) => (
                    <span
                      key={i}
                      className="text-xs font-mono bg-white border border-stone-200 text-stone-800 px-2.5 py-1 rounded"
                    >
                      {sc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Subtopics Checklist */}
              <div className="space-y-1.5 text-xs text-stone-700">
                <span className="font-bold text-stone-900 block">Syllabus Sub-Dimensions:</span>
                <ul className="list-disc pl-5 space-y-1">
                  {currentTopic.subtopics.map((st, i) => (
                    <li key={i}>{st}</li>
                  ))}
                </ul>
              </div>

              {/* Linked Current Affairs for Date */}
              <div className="pt-3 border-t border-stone-200 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-900 font-serif">
                    Relevant Current Affairs in Today's Dossier ({linkedArticles.length})
                  </span>
                  <span className="text-stone-400 text-[11px] font-mono">Date: {report?.reportDate}</span>
                </div>

                {linkedArticles.length === 0 ? (
                  <p className="text-xs text-stone-500 italic p-3 bg-stone-50 rounded">
                    No news articles in today's dossier matched this specific paper. Browse other papers or dates.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {linkedArticles.map((art) => (
                      <div
                        key={art.id}
                        className="p-3 bg-stone-50 border border-stone-200 rounded text-xs space-y-1 hover:border-amber-500/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-stone-900 line-clamp-1">{art.headline}</span>
                          <span className="text-[10px] text-emerald-700 font-medium">{art.verificationStatus}</span>
                        </div>
                        <p className="text-stone-600 line-clamp-2">{art.whyInNews.what}</p>
                        <div className="pt-1 text-[11px] font-mono text-stone-500">
                          Static Link: {art.staticLink}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
