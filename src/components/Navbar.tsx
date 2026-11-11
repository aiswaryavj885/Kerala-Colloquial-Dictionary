import React from 'react';
import { UserProfile } from '../types/dictionary';
import { BookOpen, Map, Layers, ShieldCheck, Plus, Heart, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: 'dictionary' | 'map' | 'districts' | 'comparison' | 'admin';
  onSelectTab: (tab: 'dictionary' | 'map' | 'districts' | 'comparison' | 'admin') => void;
  onOpenSubmitModal: () => void;
  favoritesCount: number;
  pendingSubmissionsCount: number;
  currentUser: UserProfile;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenSubmitModal,
  favoritesCount,
  pendingSubmissionsCount,
  currentUser,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      {/* Top Gold Kasavu Thread */}
      <div className="h-1 kasavu-gold-strip" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          {/* Logo & Branding */}
          <div
            onClick={() => onSelectTab('dictionary')}
            className="cursor-pointer flex items-center gap-3 group shrink-0"
          >
            {/* Traditional Kerala Kathakali / Lamp motif inspired avatar */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-emerald-800 to-teal-950 text-amber-300 flex items-center justify-center shadow-md border border-amber-400/40 relative overflow-hidden group-hover:scale-105 transition-transform">
              <span className="text-xl sm:text-2xl font-bold font-malayalam select-none">
                നാ
              </span>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-400/10 to-transparent pointer-events-none" />
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <h1 className="text-lg sm:text-2xl font-extrabold text-emerald-950 font-serif-kerala tracking-tight flex items-baseline gap-1.5">
                  <span>Naadan Vakkukal</span>
                </h1>
                <span className="font-malayalam font-bold text-sm sm:text-base text-amber-700 hidden sm:inline">
                  (നാടൻ വാക്കുകൾ)
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-stone-500 font-medium tracking-wide">
                14 Districts • Authentic Colloquial Dialects
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onSelectTab('dictionary')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'dictionary'
                  ? 'bg-emerald-900 text-amber-200 shadow-sm'
                  : 'text-stone-600 hover:text-emerald-900 hover:bg-stone-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Dictionary</span>
            </button>

            <button
              onClick={() => onSelectTab('map')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'map'
                  ? 'bg-emerald-900 text-amber-200 shadow-sm'
                  : 'text-stone-600 hover:text-emerald-900 hover:bg-stone-100'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Kerala Map</span>
            </button>

            <button
              onClick={() => onSelectTab('districts')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'districts'
                  ? 'bg-emerald-900 text-amber-200 shadow-sm'
                  : 'text-stone-600 hover:text-emerald-900 hover:bg-stone-100'
              }`}
            >
              <span>14 Districts</span>
            </button>

            <button
              onClick={() => onSelectTab('comparison')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'comparison'
                  ? 'bg-emerald-900 text-amber-200 shadow-sm'
                  : 'text-stone-600 hover:text-emerald-900 hover:bg-stone-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Comparisons</span>
            </button>

            <button
              onClick={() => onSelectTab('admin')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 relative ${
                activeTab === 'admin'
                  ? 'bg-emerald-900 text-amber-200 shadow-sm'
                  : 'text-stone-600 hover:text-emerald-900 hover:bg-stone-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
              {pendingSubmissionsCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-emerald-950 text-[10px] font-bold flex items-center justify-center">
                  {pendingSubmissionsCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSubmitModal}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-700 hover:to-teal-700 text-amber-100 text-xs font-bold shadow-md hover:shadow-lg transition-all border border-emerald-600 active:scale-95"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">Add Word</span>
              <span className="sm:hidden">+ Word</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="md:hidden flex items-center justify-between border-t border-stone-100 py-2 overflow-x-auto scrollbar-none gap-1">
          <button
            onClick={() => onSelectTab('dictionary')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
              activeTab === 'dictionary' ? 'bg-emerald-800 text-amber-200' : 'text-stone-600'
            }`}
          >
            Dictionary
          </button>
          <button
            onClick={() => onSelectTab('map')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
              activeTab === 'map' ? 'bg-emerald-800 text-amber-200' : 'text-stone-600'
            }`}
          >
            Map
          </button>
          <button
            onClick={() => onSelectTab('districts')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
              activeTab === 'districts' ? 'bg-emerald-800 text-amber-200' : 'text-stone-600'
            }`}
          >
            Districts
          </button>
          <button
            onClick={() => onSelectTab('comparison')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
              activeTab === 'comparison' ? 'bg-emerald-800 text-amber-200' : 'text-stone-600'
            }`}
          >
            Compare
          </button>
          <button
            onClick={() => onSelectTab('admin')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'admin' ? 'bg-emerald-800 text-amber-200' : 'text-stone-600'
            }`}
          >
            <span>Admin</span>
            {pendingSubmissionsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-emerald-950 text-[10px] font-bold">
                {pendingSubmissionsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
