import React, { useState } from 'react';
import { District } from '../types/dictionary';
import { KERALA_DISTRICTS } from '../data/districts';
import { MapPin, Sparkles } from 'lucide-react';

interface KeralaMapProps {
  selectedDistrict: string | null;
  onSelectDistrict: (districtId: string | null) => void;
  wordCountsByDistrict: Record<string, number>;
}

// Clean SVG paths representing the 14 districts of Kerala in geographic North-to-South alignment
const DISTRICT_PATHS: { id: string; d: string; labelX: number; labelY: number }[] = [
  {
    id: 'kasaragod',
    d: 'M 92,20 C 82,24 74,38 78,54 C 84,62 104,64 114,54 C 122,46 118,28 106,20 Z',
    labelX: 96,
    labelY: 38
  },
  {
    id: 'kannur',
    d: 'M 78,54 C 84,62 104,64 114,54 C 124,68 136,80 130,96 C 114,106 96,94 88,86 C 82,78 74,66 78,54 Z',
    labelX: 104,
    labelY: 76
  },
  {
    id: 'wayanad',
    d: 'M 130,76 C 146,72 170,82 176,98 C 172,114 154,122 138,114 C 130,104 126,88 130,76 Z',
    labelX: 152,
    labelY: 96
  },
  {
    id: 'kozhikode',
    d: 'M 88,86 C 96,94 114,106 130,96 C 138,114 134,130 122,144 C 108,142 98,126 92,112 C 86,100 86,92 88,86 Z',
    labelX: 108,
    labelY: 120
  },
  {
    id: 'malappuram',
    d: 'M 122,144 C 134,130 138,114 154,122 C 170,132 172,154 162,172 C 146,182 130,174 120,162 Z',
    labelX: 142,
    labelY: 154
  },
  {
    id: 'palakkad',
    d: 'M 162,172 C 172,154 184,152 206,164 C 220,182 216,212 194,222 C 176,220 168,200 162,172 Z',
    labelX: 188,
    labelY: 190
  },
  {
    id: 'thrissur',
    d: 'M 120,162 C 130,174 146,182 162,172 C 168,200 160,224 142,234 C 128,230 122,204 120,184 Z',
    labelX: 140,
    labelY: 202
  },
  {
    id: 'ernakulam',
    d: 'M 142,234 C 160,224 168,230 178,252 C 172,274 154,282 138,272 C 134,254 136,242 142,234 Z',
    labelX: 154,
    labelY: 254
  },
  {
    id: 'idukki',
    d: 'M 178,252 C 194,222 216,212 232,234 C 246,262 238,296 216,312 C 196,306 182,284 178,252 Z',
    labelX: 212,
    labelY: 272
  },
  {
    id: 'kottayam',
    d: 'M 138,272 C 154,282 172,274 178,290 C 182,312 166,326 150,324 C 140,312 134,292 138,272 Z',
    labelX: 156,
    labelY: 300
  },
  {
    id: 'alappuzha',
    d: 'M 134,292 C 140,312 150,324 146,346 C 136,354 126,334 124,314 C 124,302 128,296 134,292 Z',
    labelX: 134,
    labelY: 326
  },
  {
    id: 'pathanamthitta',
    d: 'M 178,290 C 196,306 216,312 212,334 C 200,358 178,358 166,346 C 166,326 172,310 178,290 Z',
    labelX: 188,
    labelY: 334
  },
  {
    id: 'kollam',
    d: 'M 146,346 C 166,346 178,358 174,382 C 162,398 144,394 138,376 C 136,360 140,350 146,346 Z',
    labelX: 154,
    labelY: 372
  },
  {
    id: 'thiruvananthapuram',
    d: 'M 174,382 C 186,396 196,416 192,442 C 180,458 158,452 150,428 C 144,406 154,390 174,382 Z',
    labelX: 172,
    labelY: 420
  }
];

export const KeralaMap: React.FC<KeralaMapProps> = ({
  selectedDistrict,
  onSelectDistrict,
  wordCountsByDistrict,
}) => {
  const [hoveredDistrict, setHoveredDistrict] = useState<District | null>(null);

  const getDistrictById = (id: string) => KERALA_DISTRICTS.find(d => d.id === id);
  const activeDistrictObj = selectedDistrict ? getDistrictById(selectedDistrict) : null;
  const currentHoveredOrActive = hoveredDistrict || activeDistrictObj;

  return (
    <div className="bg-gradient-to-b from-emerald-950 via-teal-950 to-emerald-950 text-white rounded-2xl p-4 sm:p-6 shadow-xl border border-emerald-800/60 relative overflow-hidden">
      {/* Decorative Traditional Kerala Border / Gold Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 kasavu-gold-strip" />

      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-400/30">
              <MapPin className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-amber-100 flex items-center gap-2">
              ഭൂപടം (Kerala Dialect Map)
            </h3>
          </div>
          <p className="text-xs text-emerald-300/80 mt-1">
            Click on any district to explore its regional words & dialect features
          </p>
        </div>

        {selectedDistrict && (
          <button
            onClick={() => onSelectDistrict(null)}
            className="text-xs bg-emerald-800/80 hover:bg-emerald-700 text-amber-200 px-3 py-1.5 rounded-full border border-amber-400/30 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span>All Kerala (എല്ലാം)</span>
            <span className="text-emerald-300 font-bold">✕</span>
          </button>
        )}
      </div>

      {/* Map Layout: SVG on Left/Center + District Profile on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Interactive SVG Map */}
        <div className="md:col-span-6 flex justify-center items-center py-2 relative">
          <div className="w-full max-w-[280px] sm:max-w-[320px] aspect-[2/3.4] relative flex items-center justify-center">
            {/* Background Map glow */}
            <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <svg
              viewBox="60 10 200 460"
              className="w-full h-full filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] select-none"
            >
              {/* Coastline and backwaters subtle decorative line */}
              <path
                d="M 68,25 Q 75,180 120,330 T 150,455"
                fill="none"
                stroke="#0284c7"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.3"
              />

              {DISTRICT_PATHS.map((item) => {
                const district = getDistrictById(item.id);
                if (!district) return null;
                const isSelected = selectedDistrict === district.id;
                const isHovered = hoveredDistrict?.id === district.id;
                const count = wordCountsByDistrict[district.id] || 0;

                return (
                  <g
                    key={district.id}
                    onClick={() => onSelectDistrict(isSelected ? null : district.id)}
                    onMouseEnter={() => setHoveredDistrict(district)}
                    onMouseLeave={() => setHoveredDistrict(null)}
                    className="cursor-pointer transition-all duration-300 group"
                  >
                    {/* District Area Path */}
                    <path
                      d={item.d}
                      fill={
                        isSelected
                          ? '#F59E0B' // Gold highlight for active
                          : isHovered
                          ? '#10B981' // Bright emerald on hover
                          : '#064E3B' // Deep Kerala Green normal
                      }
                      stroke={isSelected ? '#FDE68A' : isHovered ? '#34D399' : '#047857'}
                      strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 1.2}
                      className="transition-all duration-200"
                    />

                    {/* Pin circle center */}
                    <circle
                      cx={item.labelX}
                      cy={item.labelY}
                      r={isSelected ? 6 : isHovered ? 5 : 3.5}
                      fill={isSelected ? '#78350F' : '#FDE68A'}
                      stroke={isSelected ? '#F59E0B' : '#064E3B'}
                      strokeWidth="1.5"
                      className="transition-all duration-200"
                    />

                    {/* Word count badge if any */}
                    {count > 0 && (
                      <g>
                        <rect
                          x={item.labelX + 5}
                          y={item.labelY - 10}
                          width="16"
                          height="12"
                          rx="4"
                          fill="#D97706"
                        />
                        <text
                          x={item.labelX + 13}
                          y={item.labelY - 1}
                          textAnchor="middle"
                          fill="#FFFFFF"
                          fontSize="8"
                          fontWeight="bold"
                        >
                          {count}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* District Detail Sidebar Card */}
        <div className="md:col-span-6 flex flex-col justify-center">
          {currentHoveredOrActive ? (
            <div className="bg-emerald-900/60 border border-amber-400/40 rounded-xl p-5 backdrop-blur-sm shadow-lg space-y-3 relative">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 inline-block mb-1">
                    {currentHoveredOrActive.region}
                  </span>
                  <h4 className="text-xl font-bold text-amber-100 flex items-center gap-2">
                    <span>{currentHoveredOrActive.nameEn}</span>
                    <span className="font-malayalam text-lg text-emerald-200 font-medium">
                      ({currentHoveredOrActive.nameMl})
                    </span>
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-emerald-800 text-amber-300 px-2.5 py-1 rounded-full font-bold border border-emerald-700">
                    {wordCountsByDistrict[currentHoveredOrActive.id] || 0} words
                  </span>
                </div>
              </div>

              <p className="text-xs text-emerald-100/90 leading-relaxed">
                {currentHoveredOrActive.description}
              </p>

              <div className="pt-2 border-t border-emerald-800/80">
                <div className="text-[11px] uppercase tracking-wider text-amber-300/90 font-semibold mb-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Dialect Highlights
                </div>
                <p className="text-xs text-amber-100/80 italic font-malayalam">
                  {currentHoveredOrActive.knownForDialect}
                </p>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => onSelectDistrict(currentHoveredOrActive.id)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all text-center ${
                    selectedDistrict === currentHoveredOrActive.id
                      ? 'bg-amber-500 text-emerald-950 hover:bg-amber-400'
                      : 'bg-emerald-800/90 hover:bg-emerald-700 text-white border border-emerald-600'
                  }`}
                >
                  {selectedDistrict === currentHoveredOrActive.id
                    ? '✓ Currently Filtering'
                    : `Show ${currentHoveredOrActive.nameEn} Words`}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-900/30 border border-emerald-800/60 rounded-xl p-6 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-800/60 flex items-center justify-center text-amber-400">
                <MapPin className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-amber-100">
                Select a District on the Map
              </h4>
              <p className="text-xs text-emerald-200/70 max-w-sm mx-auto leading-relaxed">
                Hover or click on any of Kerala’s 14 districts from Kasaragod in the north to Thiruvananthapuram in the south to view regional dialects and vocabulary.
              </p>
              <div className="flex flex-wrap gap-1.5 justify-center pt-2">
                {KERALA_DISTRICTS.slice(0, 6).map((d) => (
                  <button
                    key={d.id}
                    onClick={() => onSelectDistrict(d.id)}
                    className="text-[11px] bg-emerald-800/60 hover:bg-emerald-700 text-emerald-200 px-2 py-1 rounded transition-colors"
                  >
                    {d.nameEn}
                  </button>
                ))}
                <span className="text-emerald-400/60 text-xs self-center">+ 8 more</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
