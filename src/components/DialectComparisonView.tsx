import React, { useState } from 'react';
import { DialectComparison } from '../types/dictionary';
import { SAMPLE_COMPARISONS, KERALA_DISTRICTS } from '../data/districts';
import { Layers, ArrowRight, Sparkles, MapPin, Plus, Check } from 'lucide-react';

interface DialectComparisonViewProps {
  onSelectDistrict?: (districtId: string) => void;
  onOpenSubmitModal?: (districtId?: string) => void;
}

export const DialectComparisonView: React.FC<DialectComparisonViewProps> = ({
  onSelectDistrict,
  onOpenSubmitModal,
}) => {
  const [comparisons, setComparisons] = useState<DialectComparison[]>(SAMPLE_COMPARISONS);
  const [activeComparisonId, setActiveComparisonId] = useState<string>(SAMPLE_COMPARISONS[0]?.id || '');
  const [newConceptOpen, setNewConceptOpen] = useState(false);
  const [newConceptEn, setNewConceptEn] = useState('');
  const [newConceptMl, setNewConceptMl] = useState('');
  const [newConceptDesc, setNewConceptDesc] = useState('');

  const activeComparison = comparisons.find(c => c.id === activeComparisonId) || comparisons[0];

  const handleCreateConcept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConceptEn.trim() || !newConceptMl.trim()) return;

    const newComp: DialectComparison = {
      id: `cmp-${Date.now()}`,
      conceptEn: newConceptEn.trim(),
      conceptMl: newConceptMl.trim(),
      description: newConceptDesc.trim() || `Comparison of expressions for ${newConceptEn.trim()}`,
      entries: []
    };

    setComparisons([newComp, ...comparisons]);
    setActiveComparisonId(newComp.id);
    setNewConceptEn('');
    setNewConceptMl('');
    setNewConceptDesc('');
    setNewConceptOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200/90 overflow-hidden">
      {/* Kasavu Top Bar */}
      <div className="h-1.5 kasavu-gold-strip" />

      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-stone-100 bg-stone-50/50 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
              <Layers className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-emerald-950 font-serif-kerala">
              ഒരു അർത്ഥം, പല നാടുകൾ (Same Meaning, Different Naadu)
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1 max-w-xl">
            See how the same everyday concept changes dramatically as you travel 580 kilometers along Kerala’s coast and hills.
          </p>
        </div>

        <button
          onClick={() => setNewConceptOpen(!newConceptOpen)}
          className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-amber-200 flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Comparison Topic</span>
        </button>
      </div>

      {/* New Concept Form if opened */}
      {newConceptOpen && (
        <form onSubmit={handleCreateConcept} className="p-4 bg-amber-50/60 border-b border-amber-200 space-y-3">
          <div className="text-xs font-bold text-amber-900 uppercase tracking-wide">
            Create a New Comparison Topic
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="English Concept (e.g. Rice Gruel, Uncle, Rain)"
              value={newConceptEn}
              onChange={(e) => setNewConceptEn(e.target.value)}
              className="px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white text-stone-900"
            />
            <input
              type="text"
              required
              placeholder="Malayalam Concept (e.g. കഞ്ഞി, അമ്മാവൻ, മഴ)"
              value={newConceptMl}
              onChange={(e) => setNewConceptMl(e.target.value)}
              className="px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white text-stone-900 font-malayalam"
            />
          </div>
          <input
            type="text"
            placeholder="Description of the nuances across regions (optional)"
            value={newConceptDesc}
            onChange={(e) => setNewConceptDesc(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white text-stone-900"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setNewConceptOpen(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-stone-600 hover:bg-stone-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-800 text-amber-200"
            >
              Save Topic
            </button>
          </div>
        </form>
      )}

      {/* Comparison Selector Tabs */}
      <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider shrink-0 mr-1">
          Topics:
        </span>
        {comparisons.map((comp) => {
          const isActive = comp.id === activeComparisonId;
          return (
            <button
              key={comp.id}
              onClick={() => setActiveComparisonId(comp.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                isActive
                  ? 'bg-emerald-900 text-amber-300 shadow-sm border border-amber-400/40 ring-1 ring-amber-400/30'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              <span>{comp.conceptEn}</span>
              <span className="font-malayalam text-stone-400 group-hover:text-stone-300">
                ({comp.conceptMl})
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Comparison Matrix */}
      {activeComparison && (
        <div className="p-5 sm:p-6 space-y-6">
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold font-malayalam text-emerald-950">
                {activeComparison.conceptMl}
              </h3>
              <span className="text-base text-amber-800 font-semibold font-serif-kerala">
                ({activeComparison.conceptEn})
              </span>
            </div>
            <p className="text-xs text-stone-600">
              {activeComparison.description}
            </p>
          </div>

          {/* Regional Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeComparison.entries.map((entry, idx) => {
              const district = KERALA_DISTRICTS.find(d => d.id === entry.districtId);
              return (
                <div
                  key={idx}
                  className="bg-amber-50/40 rounded-xl p-4 border border-amber-200/80 hover:shadow-sm transition-all space-y-2 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                      {district?.nameEn || entry.districtId} ({district?.nameMl})
                    </span>
                    <span className="text-[10px] text-stone-500 font-semibold">
                      {district?.region}
                    </span>
                  </div>

                  <div className="pt-1">
                    <div className="text-xl font-bold font-malayalam text-emerald-950">
                      {entry.termMl}
                    </div>
                    <div className="text-xs font-semibold text-amber-700">
                      "{entry.termManglish}"
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 italic leading-relaxed pt-1 border-t border-amber-200/60 font-malayalam">
                    {entry.nuance}
                  </p>

                  {onSelectDistrict && district && (
                    <button
                      onClick={() => onSelectDistrict(district.id)}
                      className="text-[11px] text-emerald-800 hover:text-emerald-950 font-semibold flex items-center gap-1 pt-1"
                    >
                      <span>Explore {district.nameEn}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {activeComparison.entries.length === 0 && (
            <div className="text-center py-8 text-stone-500 text-xs">
              No entries added yet for this topic. Use the word submission modal to add words for this concept!
            </div>
          )}
        </div>
      )}
    </div>
  );
};
