import React, { useState } from 'react';
import { District, Region } from '../types/dictionary';
import { KERALA_DISTRICTS } from '../data/districts';
import { MapPin, BookOpen, PlusCircle } from 'lucide-react';

interface DistrictCardsProps {
  selectedDistrict: string | null;
  onSelectDistrict: (districtId: string | null) => void;
  wordCountsByDistrict: Record<string, number>;
  onAddNewWordForDistrict: (districtId: string) => void;
}

export const DistrictCards: React.FC<DistrictCardsProps> = ({
  selectedDistrict,
  onSelectDistrict,
  wordCountsByDistrict,
  onAddNewWordForDistrict,
}) => {
  const [activeRegionTab, setActiveRegionTab] = useState<Region | 'All'>('All');

  const filteredDistricts = activeRegionTab === 'All'
    ? KERALA_DISTRICTS
    : KERALA_DISTRICTS.filter(d => d.region === activeRegionTab);

  const regionTabs: { id: Region | 'All'; label: string; count: number }[] = [
    { id: 'All', label: 'All 14 Districts (എല്ലാം)', count: 14 },
    { id: 'North Malabar', label: 'North Malabar (വടക്കൻ മലബാർ)', count: 3 },
    { id: 'South Malabar', label: 'South Malabar (തെക്കൻ മലബാർ)', count: 3 },
    { id: 'Central', label: 'Central (മധ്യകേരളം)', count: 3 },
    { id: 'Travancore', label: 'Travancore (തിരുവിതാംകൂർ)', count: 5 },
  ];

  return (
    <div className="space-y-4">
      {/* Region Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-6 bg-emerald-700 rounded-full" />
          <h2 className="text-xl font-bold text-emerald-950 font-serif-kerala">
            14 ജില്ലകൾ (All 14 Districts)
          </h2>
        </div>

        {/* Region pill tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-amber-50 rounded-xl border border-amber-200">
          {regionTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveRegionTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeRegionTab === tab.id
                  ? 'bg-emerald-800 text-amber-100 shadow-sm'
                  : 'text-emerald-900/80 hover:bg-amber-100/70 hover:text-emerald-950'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 14 District Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {filteredDistricts.map((district) => {
          const isSelected = selectedDistrict === district.id;
          const wordCount = wordCountsByDistrict[district.id] || 0;

          return (
            <div
              key={district.id}
              onClick={() => onSelectDistrict(isSelected ? null : district.id)}
              className={`cursor-pointer rounded-xl p-4 transition-all duration-200 border relative overflow-hidden group hover:shadow-md ${
                isSelected
                  ? 'bg-emerald-900 text-white border-amber-400 ring-2 ring-amber-400/50 shadow-lg'
                  : 'bg-white hover:bg-amber-50/40 border-stone-200/80 text-stone-900 shadow-sm'
              }`}
            >
              {/* Top Kasavu line for styling */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${
                  isSelected ? 'kasavu-gold-strip' : 'bg-emerald-700/60'
                }`}
              />

              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                      isSelected
                        ? 'bg-emerald-800 text-amber-200 border border-emerald-700'
                        : district.badgeColor
                    }`}
                  >
                    {district.region}
                  </span>
                  <h3 className="text-base font-bold mt-1 flex items-baseline gap-1.5">
                    <span>{district.nameEn}</span>
                    <span
                      className={`font-malayalam text-sm font-medium ${
                        isSelected ? 'text-amber-200' : 'text-emerald-800'
                      }`}
                    >
                      {district.nameMl}
                    </span>
                  </h3>
                </div>

                {/* Word count badge */}
                <div
                  className={`text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1 ${
                    isSelected
                      ? 'bg-amber-400 text-emerald-950'
                      : wordCount > 0
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                  title={`${wordCount} words recorded in dictionary`}
                >
                  <BookOpen className="w-3 h-3" />
                  <span>{wordCount}</span>
                </div>
              </div>

              <p
                className={`text-xs line-clamp-2 leading-relaxed mb-3 ${
                  isSelected ? 'text-emerald-100/90' : 'text-stone-600'
                }`}
              >
                {district.description}
              </p>

              {/* Dialect flavor note */}
              <div
                className={`text-[11px] p-2 rounded-lg mb-3 ${
                  isSelected
                    ? 'bg-emerald-950/60 text-amber-200 border border-emerald-800'
                    : 'bg-amber-50/70 text-amber-900/90 border border-amber-200/60'
                }`}
              >
                <span className="font-semibold text-[10px] uppercase tracking-wide block text-amber-700 dark:text-amber-300">
                  Dialect Feature:
                </span>
                <span className="line-clamp-1 italic font-malayalam">{district.knownForDialect}</span>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-current/10 text-xs">
                <span
                  className={`font-semibold flex items-center gap-1 ${
                    isSelected ? 'text-amber-300' : 'text-emerald-700 group-hover:text-emerald-800'
                  }`}
                >
                  <MapPin className="w-3 h-3" />
                  {isSelected ? 'Filtering words' : 'View words'}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddNewWordForDistrict(district.id);
                  }}
                  className={`p-1 rounded-md transition-colors flex items-center gap-1 text-[11px] ${
                    isSelected
                      ? 'hover:bg-emerald-800 text-amber-200'
                      : 'hover:bg-emerald-100 text-emerald-800'
                  }`}
                  title={`Add a colloquial word from ${district.nameEn}`}
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add Word</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
