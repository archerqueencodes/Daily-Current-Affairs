import React from 'react';
import { Newspaper, ExternalLink, Quote, ShieldCheck, ArrowRight } from 'lucide-react';
import { DailyReport, EditorialPick } from '../types';

interface EditorialsPageProps {
  report: DailyReport | null;
}

export const EditorialsPage: React.FC<EditorialsPageProps> = ({ report }) => {
  if (!report || report.editorials.length === 0) {
    return (
      <div className="bg-white border border-stone-200 rounded-lg p-10 text-center space-y-3">
        <Newspaper className="w-8 h-8 text-stone-400 mx-auto" />
        <h3 className="font-serif text-base font-bold text-stone-800">
          No Curated Editorial Picks for this Date
        </h3>
        <p className="text-xs text-stone-500 max-w-md mx-auto">
          Editorial analyses are synthesized from landmark opinion pages in The Hindu and The Indian
          Express covering national policy and constitutional questions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Intro banner */}
      <div className="bg-stone-900 text-stone-100 p-5 rounded-lg border border-stone-800 space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider font-semibold">
          <Newspaper className="w-3.5 h-3.5" />
          <span>Analytical Editorial Picks ({report.editorials.length})</span>
        </div>
        <h2 className="font-serif text-lg font-bold">
          High-Yield Opinion Synthesis & Mains Arguments
        </h2>
        <p className="text-xs text-stone-300 leading-relaxed max-w-2xl">
          Paraphrased analysis isolating author thesis, opposing perspectives, and original model
          answer synthesis suitable for Mains GS papers and Essay.
        </p>
      </div>

      {/* Editorials List */}
      <div className="space-y-6">
        {report.editorials.map((ed) => (
          <article
            key={ed.id}
            className="bg-white border border-stone-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4"
          >
            {/* Header Metadata - Zero Pill */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-stone-500 font-medium">
              <span className="font-semibold text-stone-800">{ed.publication}</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>By {ed.author}</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>Published {ed.date}</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span className="font-mono text-amber-800 font-semibold">{ed.gsPaper}</span>
            </div>

            {/* Title */}
            <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 leading-snug">
              {ed.title}
            </h3>

            {/* Editorial Stance */}
            <div className="p-3 bg-amber-50/70 border-l-3 border-amber-600 rounded text-xs text-amber-950 leading-relaxed">
              <strong className="block mb-0.5 text-amber-900">Author Stance / Core Thesis:</strong>
              {ed.stance}
            </div>

            {/* Two-column arguments vs counter-arguments */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 text-xs sm:text-sm">
              <div className="md:col-span-2 space-y-2">
                <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
                  Three Key Structural Arguments
                </h4>
                <ul className="space-y-2 text-stone-700">
                  {ed.keyArguments.map((arg, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-stone-50 p-2.5 rounded border border-stone-100">
                      <span className="font-mono font-bold text-amber-800">{idx + 1}.</span>
                      <span className="leading-relaxed">{arg}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
                  Counter-Argument & Limitation
                </h4>
                <div className="p-3 bg-stone-50 rounded border border-stone-100 text-stone-700 text-xs leading-relaxed">
                  {ed.counterArgument}
                </div>

                <div className="p-3 bg-stone-50 rounded border border-stone-100 text-xs space-y-1">
                  <strong className="text-stone-900 block">UPSC Exam Relevance:</strong>
                  <span className="text-stone-600">{ed.upscRelevance}</span>
                </div>
              </div>
            </div>

            {/* Original UPSC Model Mains Answer Paragraph */}
            <div className="p-4 bg-stone-900 text-stone-100 rounded-lg space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-amber-400 font-semibold font-mono">
                <span>Model UPSC Answer Synthesis Paragraph</span>
                <span>Ready for Mains Answer Body</span>
              </div>
              <p className="font-serif text-xs sm:text-sm leading-relaxed text-stone-200 italic">
                "{ed.mainsModelParagraph}"
              </p>
            </div>

            {/* Source Link */}
            <div className="pt-2 flex items-center justify-between text-xs border-t border-stone-100">
              <span className="text-stone-400 text-[11px]">
                Original article verified from publisher archives
              </span>
              <a
                href={ed.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:text-blue-900 font-medium flex items-center gap-1"
              >
                <span>Read Original Lead Article</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
