import React, { useState, useMemo } from 'react';
import { WordEntry, WordCategory } from '../types/dictionary';
import { KERALA_DISTRICTS, CATEGORIES } from '../data/districts';
import { WordCard } from './WordCard';
import { Search, Filter, Heart, Sparkles, PlusCircle, X, Download, SlidersHorizontal, BookOpen } from 'lucide-react';

interface WordListProps {
  words: WordEntry[];
  favorites: string[];
  onToggleFavorite: (wordId: string) => void;
  onLikeWord: (wordId: string) => void;
  selectedDistrict: string | null;
  onSelectDistrict: (districtId: string | null) => void;
  onOpenSubmitModal: () => void;
  onLoadAuthenticStarter: () => void;
  isAdmin?: boolean;
  onDeleteWord?: (wordId: string) => void;
}

export const WordList: React.FC<WordListProps> = ({
  words,
  favorites,
  onToggleFavorite,
  onLikeWord,
  selectedDistrict,
  onSelectDistrict,
  onOpenSubmitModal,
  onLoadAuthenticStarter,
  isAdmin,
  onDeleteWord,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'alpha'>('popular');

  // Filter and search logic across Malayalam, Manglish, English meanings, and tags
  const filteredWords = useMemo(() => {
    return words.filter((word) => {
      // 1. Approval filter (only approved words show in public list)
      if (word.status !== 'approved') return false;

      // 2. Favorites filter
      if (showOnlyFavorites && !favorites.includes(word.id)) {
        return false;
      }

      // 3. District filter
      if (selectedDistrict) {
        const matchesPrimary = word.districtId === selectedDistrict;
        const matchesOther = word.otherDistricts?.includes(selectedDistrict);
        if (!matchesPrimary && !matchesOther) return false;
      }

      // 4. Category filter
      if (selectedCategory !== 'All' && word.category !== selectedCategory) {
        return false;
      }

      // 5. Search query match across Malayalam script, Manglish transliteration, and English/Malayalam meanings
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchMl = word.wordMl.toLowerCase().includes(query);
        const matchManglish = word.wordManglish.toLowerCase().includes(query);
        const matchEnglishMeaning = word.englishMeaning.toLowerCase().includes(query);
        const matchMalayalamMeaning = word.malayalamMeaning.toLowerCase().includes(query);
        const matchExample = word.exampleSentenceMl.toLowerCase().includes(query);
        const matchDistrict = KERALA_DISTRICTS.find(d => d.id === word.districtId)?.nameEn.toLowerCase().includes(query);

        if (!matchMl && !matchManglish && !matchEnglishMeaning && !matchMalayalamMeaning && !matchExample && !matchDistrict) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'popular') return b.likesCount - a.likesCount;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'alpha') return a.wordMl.localeCompare(b.wordMl);
      return 0;
    });
  }, [words, favorites, selectedDistrict, selectedCategory, showOnlyFavorites, searchQuery, sortBy]);

  const activeDistrictObj = selectedDistrict ? KERALA_DISTRICTS.find(d => d.id === selectedDistrict) : null;

  return (
    <div className="space-y-6">
      {/* Search & Filter Container */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-stone-200/90 space-y-4">
        {/* Main Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-800">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search in Malayalam (പോറ്), Manglish (poru, gadi), or English (friend, anxiety)..."
            className="w-full pl-11 pr-10 py-3.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 outline-none text-sm sm:text-base text-stone-900 placeholder:text-stone-400 bg-stone-50/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-stone-100">
          {/* Category Pills Slider */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none max-w-full sm:max-w-[70%]">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-800 text-amber-100 shadow-sm'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Quick Toggle: Favourites & Sorting */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                showOnlyFavorites
                  ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-sm'
                  : 'bg-white border-stone-300 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-current' : ''}`} />
              <span>Favorites ({favorites.length})</span>
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'popular' | 'alpha')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-stone-300 text-stone-700 outline-none"
            >
              <option value="popular">Most Upvoted</option>
              <option value="newest">Recently Added</option>
              <option value="alpha">Alphabetical (അ-ഹ)</option>
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {(selectedDistrict || selectedCategory !== 'All' || showOnlyFavorites || searchQuery) && (
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
            <span className="text-stone-500 font-medium">Filtering by:</span>

            {activeDistrictObj && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold">
                <span>District: {activeDistrictObj.nameEn} ({activeDistrictObj.nameMl})</span>
                <button
                  onClick={() => onSelectDistrict(null)}
                  className="hover:text-emerald-700 font-bold ml-1"
                >
                  ✕
                </button>
              </span>
            )}

            {selectedCategory !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-semibold">
                <span>Category: {selectedCategory}</span>
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="hover:text-amber-700 font-bold ml-1"
                >
                  ✕
                </button>
              </span>
            )}

            {showOnlyFavorites && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-900 border border-rose-300 font-semibold">
                <span>Favorites Only</span>
                <button
                  onClick={() => setShowOnlyFavorites(false)}
                  className="hover:text-rose-700 font-bold ml-1"
                >
                  ✕
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-200 text-stone-800 font-semibold">
                <span>Query: "{searchQuery}"</span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="hover:text-stone-900 font-bold ml-1"
                >
                  ✕
                </button>
              </span>
            )}

            <button
              onClick={() => {
                onSelectDistrict(null);
                setSelectedCategory('All');
                setShowOnlyFavorites(false);
                setSearchQuery('');
              }}
              className="text-stone-500 hover:text-stone-800 underline text-xs ml-1"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Words Grid Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-6 bg-amber-600 rounded-full" />
          <h2 className="text-xl font-bold text-emerald-950 font-serif-kerala">
            {activeDistrictObj
              ? `${activeDistrictObj.nameEn} വാക്കുകൾ (${filteredWords.length})`
              : `നാടൻ പദാവലി (Colloquial Lexicon) (${filteredWords.length})`}
          </h2>
        </div>

        <button
          onClick={onOpenSubmitModal}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-100 text-xs font-bold shadow-sm transition-all border border-emerald-700"
        >
          <PlusCircle className="w-4 h-4 text-amber-300" />
          <span>+ Add New Word</span>
        </button>
      </div>

      {/* Word Cards Grid or Authentic Empty State */}
      {filteredWords.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWords.map((word) => (
            <WordCard
              key={word.id}
              word={word}
              isFavorite={favorites.includes(word.id)}
              onToggleFavorite={onToggleFavorite}
              onLikeWord={onLikeWord}
              onSelectDistrict={onSelectDistrict}
              isAdmin={isAdmin}
              onDeleteWord={onDeleteWord}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border-2 border-dashed border-stone-200/90 space-y-4 max-w-2xl mx-auto shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-100/70 text-amber-700 flex items-center justify-center">
            <BookOpen className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-emerald-950 font-serif-kerala">
              {words.length === 0
                ? 'നിഘണ്ടു ശൂന്യമാണ് (Dictionary is Empty)'
                : 'വാക്കുകൾ കണ്ടെത്താനായില്ല (No Matching Words Found)'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
              {words.length === 0
                ? 'As requested, the dictionary starts completely empty without fabricated slang. We preserve genuine regional words contributed by native Malayalam speakers across Kerala.'
                : 'No words matched your current search filters. Try adjusting your search query or selecting another district.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenSubmitModal}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-100 text-xs font-bold shadow-md transition-all border border-emerald-700"
            >
              <PlusCircle className="w-4 h-4 text-amber-300" />
              <span>Submit the First Word</span>
            </button>

            {words.length === 0 && (
              <button
                onClick={onLoadAuthenticStarter}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-all shadow-sm"
                title="Loads 5 verified, authentic Malayalam regional words (Poru, Bejaar, Gadi, Entharu, Kochu)"
              >
                <Download className="w-4 h-4 text-amber-700" />
                <span>Load Verified Sample (5 Words)</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
