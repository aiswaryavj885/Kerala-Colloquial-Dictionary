import React, { useState, useEffect } from 'react';
import { WordEntry, UserProfile } from './types/dictionary';
import { KERALA_DISTRICTS, AUTHENTIC_LINGUISTIC_SAMPLE } from './data/districts';
import { Navbar } from './components/Navbar';
import { WordOfTheDay } from './components/WordOfTheDay';
import { KeralaMap } from './components/KeralaMap';
import { DistrictCards } from './components/DistrictCards';
import { WordList } from './components/WordList';
import { DialectComparisonView } from './components/DialectComparisonView';
import { AdminPanel } from './components/AdminPanel';
import { WordSubmissionModal } from './components/WordSubmissionModal';
import { MapPin, BookOpen, Layers, ShieldCheck, Heart, Sparkles, RefreshCw, Volume2 } from 'lucide-react';

const STORAGE_KEY_WORDS = 'naadan_vakkukal_words_v1';
const STORAGE_KEY_FAVS = 'naadan_vakkukal_favs_v1';
const STORAGE_KEY_USER = 'naadan_vakkukal_user_v1';

export default function App() {
  // Empty dictionary by default as instructed ("Start with an empty dictionary rather than fabricated data")
  const [words, setWords] = useState<WordEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WORDS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading saved words:', e);
    }
    return [];
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FAVS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading favorites:', e);
    }
    return [];
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading user profile:', e);
    }
    return {
      id: 'user_1',
      name: 'Kerala Dialect Enthusiast',
      email: 'contributor@naadanvakkukal.org',
      role: 'admin', // Admin by default so the user can easily test approval panel and word moderation
      favorites: []
    };
  });

  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dictionary' | 'map' | 'districts' | 'comparison' | 'admin'>('dictionary');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [initialSubmitDistrict, setInitialSubmitDistrict] = useState<string | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WORDS, JSON.stringify(words));
    } catch (e) {
      console.error('Error saving words:', e);
    }
  }, [words]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FAVS, JSON.stringify(favorites));
    } catch (e) {
      console.error('Error saving favorites:', e);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
    } catch (e) {
      console.error('Error saving user:', e);
    }
  }, [currentUser]);

  // Word count mapping by district
  const wordCountsByDistrict = React.useMemo(() => {
    const counts: Record<string, number> = {};
    KERALA_DISTRICTS.forEach(d => { counts[d.id] = 0; });
    words.forEach(word => {
      if (word.status === 'approved') {
        counts[word.districtId] = (counts[word.districtId] || 0) + 1;
        if (word.otherDistricts) {
          word.otherDistricts.forEach(od => {
            counts[od] = (counts[od] || 0) + 1;
          });
        }
      }
    });
    return counts;
  }, [words]);

  // Favorite toggle
  const handleToggleFavorite = (wordId: string) => {
    setFavorites(prev => {
      const next = prev.includes(wordId)
        ? prev.filter(id => id !== wordId)
        : [...prev, wordId];
      return next;
    });
  };

  // Like / Upvote word
  const handleLikeWord = (wordId: string) => {
    setWords(prev =>
      prev.map(w => w.id === wordId ? { ...w, likesCount: w.likesCount + 1 } : w)
    );
  };

  // Submit new word
  const handleWordSubmit = (newWordData: Omit<WordEntry, 'id' | 'createdAt' | 'likesCount'>) => {
    const newEntry: WordEntry = {
      ...newWordData,
      id: `word_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      likesCount: 1,
    };
    setWords(prev => [newEntry, ...prev]);
  };

  // Admin Actions
  const handleApproveWord = (wordId: string) => {
    setWords(prev =>
      prev.map(w => w.id === wordId ? { ...w, status: 'approved' } : w)
    );
  };

  const handleRejectWord = (wordId: string, reason?: string) => {
    setWords(prev =>
      prev.map(w => w.id === wordId ? { ...w, status: 'rejected', rejectionReason: reason } : w)
    );
  };

  const handleDeleteWord = (wordId: string) => {
    setWords(prev => prev.filter(w => w.id !== wordId));
    setFavorites(prev => prev.filter(id => id !== wordId));
  };

  const handleUpdateWord = (updatedWord: WordEntry) => {
    setWords(prev =>
      prev.map(w => w.id === updatedWord.id ? updatedWord : w)
    );
  };

  // Load verified authentic starter words strictly for testing convenience
  const handleLoadAuthenticStarter = () => {
    const starterWords: WordEntry[] = AUTHENTIC_LINGUISTIC_SAMPLE.map((sample, idx) => ({
      ...sample,
      id: `starter_${idx + 1}`,
      createdAt: new Date(Date.now() - idx * 86400000).toISOString(),
    }));
    setWords(starterWords);
  };

  // Clear all words to return to pristine empty state
  const handleClearAllWords = () => {
    if (confirm('Clear all words and reset to empty dictionary?')) {
      setWords([]);
      setFavorites([]);
      localStorage.removeItem(STORAGE_KEY_WORDS);
      localStorage.removeItem(STORAGE_KEY_FAVS);
    }
  };

  const pendingCount = words.filter(w => w.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col selection:bg-amber-300 selection:text-emerald-950">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenSubmitModal={() => {
          setInitialSubmitDistrict(selectedDistrict);
          setIsSubmitModalOpen(true);
        }}
        favoritesCount={favorites.length}
        pendingSubmissionsCount={pendingCount}
        currentUser={currentUser}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Top Announcement: Empty State Integrity & Cultural Mission */}
        {words.length === 0 && (
          <div className="bg-amber-50 border border-amber-300/80 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-amber-200/80 text-amber-900 shrink-0">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-emerald-950 font-serif-kerala">
                  Zero Fabricated Data Notice (സത്യസന്ധമായ ഭാഷാ സംഭാവന)
                </h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  Dictionary is initialized completely empty without invented slang. Click "+ Add Word" to contribute authentic regional colloquialisms, or click to load 5 verified linguistic samples for preview testing.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleLoadAuthenticStarter}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-100 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>Load Verified Sample (5 Words)</span>
              </button>
            </div>
          </div>
        )}

        {/* Word of the Day Banner */}
        <WordOfTheDay
          words={words}
          onSelectDistrict={(districtId) => {
            setSelectedDistrict(districtId);
            setActiveTab('dictionary');
          }}
          onOpenSubmitModal={() => {
            setInitialSubmitDistrict(selectedDistrict);
            setIsSubmitModalOpen(true);
          }}
        />

        {/* Quick Tab Content Views */}
        {activeTab === 'dictionary' && (
          <div className="space-y-8">
            {/* Kerala Map preview bar */}
            <div className="space-y-3">
              <KeralaMap
                selectedDistrict={selectedDistrict}
                onSelectDistrict={setSelectedDistrict}
                wordCountsByDistrict={wordCountsByDistrict}
              />
            </div>

            {/* Word List and Search Engine */}
            <WordList
              words={words}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onLikeWord={handleLikeWord}
              selectedDistrict={selectedDistrict}
              onSelectDistrict={setSelectedDistrict}
              onOpenSubmitModal={() => {
                setInitialSubmitDistrict(selectedDistrict);
                setIsSubmitModalOpen(true);
              }}
              onLoadAuthenticStarter={handleLoadAuthenticStarter}
              isAdmin={currentUser.role === 'admin'}
              onDeleteWord={handleDeleteWord}
            />

            {/* 14 District Grid at the bottom of the dictionary */}
            <div className="pt-6 border-t border-stone-200/80">
              <DistrictCards
                selectedDistrict={selectedDistrict}
                onSelectDistrict={setSelectedDistrict}
                wordCountsByDistrict={wordCountsByDistrict}
                onAddNewWordForDistrict={(districtId) => {
                  setInitialSubmitDistrict(districtId);
                  setIsSubmitModalOpen(true);
                }}
              />
            </div>
          </div>
        )}

        {activeTab === 'map' && (
          <div className="space-y-6">
            <KeralaMap
              selectedDistrict={selectedDistrict}
              onSelectDistrict={setSelectedDistrict}
              wordCountsByDistrict={wordCountsByDistrict}
            />

            {/* Quick Word List filtered by chosen map district */}
            <WordList
              words={words}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onLikeWord={handleLikeWord}
              selectedDistrict={selectedDistrict}
              onSelectDistrict={setSelectedDistrict}
              onOpenSubmitModal={() => {
                setInitialSubmitDistrict(selectedDistrict);
                setIsSubmitModalOpen(true);
              }}
              onLoadAuthenticStarter={handleLoadAuthenticStarter}
              isAdmin={currentUser.role === 'admin'}
              onDeleteWord={handleDeleteWord}
            />
          </div>
        )}

        {activeTab === 'districts' && (
          <div className="space-y-6">
            <DistrictCards
              selectedDistrict={selectedDistrict}
              onSelectDistrict={(id) => {
                setSelectedDistrict(id);
                if (id) setActiveTab('dictionary');
              }}
              wordCountsByDistrict={wordCountsByDistrict}
              onAddNewWordForDistrict={(districtId) => {
                setInitialSubmitDistrict(districtId);
                setIsSubmitModalOpen(true);
              }}
            />
          </div>
        )}

        {activeTab === 'comparison' && (
          <div className="space-y-6">
            <DialectComparisonView
              onSelectDistrict={(districtId) => {
                setSelectedDistrict(districtId);
                setActiveTab('dictionary');
              }}
              onOpenSubmitModal={(districtId) => {
                setInitialSubmitDistrict(districtId || null);
                setIsSubmitModalOpen(true);
              }}
            />
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="space-y-6">
            <AdminPanel
              words={words}
              currentUser={currentUser}
              onApproveWord={handleApproveWord}
              onRejectWord={handleRejectWord}
              onDeleteWord={handleDeleteWord}
              onUpdateWord={handleUpdateWord}
              onSwitchUserRole={(role) => setCurrentUser(prev => ({ ...prev, role }))}
            />
          </div>
        )}
      </main>

      {/* Word Submission Modal */}
      <WordSubmissionModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmit={handleWordSubmit}
        initialDistrictId={initialSubmitDistrict}
        isAdminMode={currentUser.role === 'admin'}
      />

      {/* Kerala Kasavu Style Footer */}
      <footer className="mt-16 bg-emerald-950 text-white border-t border-emerald-900 relative">
        <div className="h-1.5 kasavu-gold-strip" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Branding */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold font-malayalam text-amber-300">
                  നാടൻ വാക്കുകൾ
                </span>
                <span className="text-stone-400">•</span>
                <span className="text-sm font-semibold text-emerald-200">
                  Naadan Vakkukal
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 leading-relaxed">
                A community-driven digital archive documenting colloquial Malayalam slang, idioms, and accents across all 14 districts of Kerala.
              </p>
            </div>

            {/* Cultural Motto */}
            <div className="text-center font-malayalam space-y-1">
              <p className="text-base font-bold text-amber-200">
                "മലയാള ഭാഷയുടെ മാധുര്യം, ഓരോ നാടിന്റെയും തനിമയിൽ"
              </p>
              <p className="text-[11px] text-emerald-300/80 italic">
                From Kasaragod to Thiruvananthapuram — Every dialect has a story.
              </p>
            </div>

            {/* Quick Actions & Reset */}
            <div className="flex flex-col sm:items-end justify-center gap-2 text-xs">
              <div className="flex items-center gap-3">
                {words.length > 0 && (
                  <button
                    onClick={handleClearAllWords}
                    className="text-emerald-400 hover:text-amber-300 transition-colors underline"
                  >
                    Reset to Empty Dictionary
                  </button>
                )}
                {words.length === 0 && (
                  <button
                    onClick={handleLoadAuthenticStarter}
                    className="text-amber-300 hover:text-amber-100 transition-colors font-semibold"
                  >
                    Load 5 Verified Words
                  </button>
                )}
              </div>
              <p className="text-[11px] text-emerald-400/60">
                Offline-capable • Browser LocalStorage & Audio Recording
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-emerald-900/80 text-center text-xs text-emerald-400/60">
            © {new Date().getFullYear()} Naadan Vakkukal • Dedicated to Malayalam language lovers and native dialect speakers everywhere.
          </div>
        </div>
      </footer>
    </div>
  );
}
