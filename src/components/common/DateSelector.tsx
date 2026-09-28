import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, RotateCw } from 'lucide-react';

interface DateSelectorProps {
  selectedDate: string; // DD-MM-YYYY
  onChangeDate: (newDate: string) => void;
  onRegenerate: () => void;
  isGenerating?: boolean;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onChangeDate,
  onRegenerate,
  isGenerating = false,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Convert DD-MM-YYYY to YYYY-MM-DD for native input
  const toIsoDate = (dmy: string): string => {
    const parts = dmy.split('-');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return new Date().toISOString().split('T')[0];
  };

  // Convert YYYY-MM-DD to DD-MM-YYYY
  const toDmyDate = (iso: string): string => {
    const parts = iso.split('-');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return selectedDate;
  };

  const todayIso = new Date().toISOString().split('T')[0];
  const todayDmy = toDmyDate(todayIso);

  const isToday = selectedDate === todayDmy;

  // Check if date is in the future
  const isFutureDate = (dmy: string): boolean => {
    const iso = toIsoDate(dmy);
    return iso > todayIso;
  };

  const handlePrevDay = () => {
    const currIso = toIsoDate(selectedDate);
    const d = new Date(currIso);
    d.setDate(d.getDate() - 1);
    const prevIso = d.toISOString().split('T')[0];
    onChangeDate(toDmyDate(prevIso));
  };

  const handleNextDay = () => {
    if (isToday) return;
    const currIso = toIsoDate(selectedDate);
    const d = new Date(currIso);
    d.setDate(d.getDate() + 1);
    const nextIso = d.toISOString().split('T')[0];
    if (nextIso <= todayIso) {
      onChangeDate(toDmyDate(nextIso));
    }
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) return;
    if (val > todayIso) {
      alert('Future dates cannot be selected for daily current affairs analysis.');
      return;
    }
    onChangeDate(toDmyDate(val));
    setShowPicker(false);
  };

  // Close calendar popover on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <div className="relative inline-flex items-center" ref={containerRef}>
      <div className="flex items-center bg-white border border-stone-200 rounded-md shadow-xs divide-x divide-stone-200">
        {/* Previous Day */}
        <button
          onClick={handlePrevDay}
          title="Previous Day"
          className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors rounded-l-md"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Date Display & Picker trigger */}
        <div className="flex items-center px-2.5 py-1 gap-2 cursor-pointer hover:bg-stone-50 transition-colors" onClick={() => setShowPicker(!showPicker)}>
          <CalendarIcon className="w-3.5 h-3.5 text-amber-600" />
          <span className="font-mono text-xs font-semibold text-stone-800 tracking-tight">
            {selectedDate}
          </span>
          {isToday && (
            <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1 rounded">
              Today
            </span>
          )}
        </div>

        {/* Next Day (disabled if today) */}
        <button
          onClick={handleNextDay}
          disabled={isToday}
          title={isToday ? 'Future dates are locked' : 'Next Day'}
          className={`p-1.5 transition-colors ${
            isToday
              ? 'text-stone-300 cursor-not-allowed bg-stone-50'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
          }`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Regenerate Button */}
        <button
          onClick={onRegenerate}
          disabled={isGenerating}
          title="Regenerate notes for this date"
          className="px-2 py-1.5 text-stone-600 hover:text-amber-800 hover:bg-stone-50 transition-colors flex items-center gap-1 rounded-r-md text-xs font-medium"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin text-amber-600' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Popover Calendar Picker */}
      {showPicker && (
        <div className="absolute top-full left-0 mt-1.5 z-30 bg-white border border-stone-200 rounded-md shadow-lg p-3 w-64">
          <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-2">
            Select Archive Date
          </div>
          <input
            type="date"
            max={todayIso}
            value={toIsoDate(selectedDate)}
            onChange={handleDateInputChange}
            className="w-full text-xs font-mono border border-stone-300 rounded px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
          />
          <div className="mt-2.5 flex items-center justify-between text-xs pt-2 border-t border-stone-100">
            <button
              onClick={() => {
                onChangeDate(todayDmy);
                setShowPicker(false);
              }}
              className="text-amber-700 hover:text-amber-800 font-medium"
            >
              Jump to Today
            </button>
            <button
              onClick={() => setShowPicker(false)}
              className="text-stone-500 hover:text-stone-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
