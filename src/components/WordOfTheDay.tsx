import React, { useState, useEffect } from 'react';
import { WordEntry } from '../types/dictionary';
import { KERALA_DISTRICTS, DAILY_PROVERBS } from '../data/districts';
import { AudioPlayerButton } from './AudioPronunciation';
import { Sparkles, MapPin, Quote, RefreshCw, Volume2 } from 'lucide-react';

interface WordOfTheDayProps {
  words: WordEntry[];
  onSelectDistrict?: (districtId: string) => void;
  onOpenSubmitModal?: () => void;
}

export const WordOfTheDay: React.FC<WordOfTheDayProps> = ({
  words,
  onSelectDistrict,
  onOpenSubmitModal,
}) => {
  const [proverbIndex, setProverbIndex] = useState(0);
  const [customWordIndex, setCustomWordIndex] = useState<number | null>(null);

  // Rotate proverbs
  const currentProverb = DAILY_PROVERBS[proverbIndex % DAILY_PROVERBS.length];

  // Pick Word of the Day: prefer word marked isWordOfTheDay or top liked word or first word
  const approvedWords = words.filter(w => w.status === 'approved');
  const featuredWord = customWordIndex !== null && approvedWords[customWordIndex]
    ? approvedWords[customWordIndex]
    : approvedWords.find(w => w.isWordOfTheDay) || approvedWords[0] || null;

  const district = featuredWord ? KERALA_DISTRICTS.find(d => d.id === featuredWord.districtId) : null;

  const handleShuffleWord = () => {
    if (approvedWords.length > 1) {
      const nextIndex = Math.floor(Math.random() * approvedWords.length);
      setCustomWordIndex(nextIndex);
    }
    setProverbIndex(prev => (prev + 1) % DAILY_PROVERBS.length);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-950 to-teal-950 text-white shadow-xl border border-amber-400/40">
      {/* Kasavu Gold Decorative Ribbon */}
      <div className="absolute top-0 left-0 right-0 h-1.5 kasavu-gold-strip" />

      {/* Background Kerala Backwater & Temple Silhouette Ambience */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-amber-500/10 to-transparent pointer-events-none" />

      <div className="p-6 sm:p-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Word of the Day */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>ദിവസത്തെ വാക്ക് • Word of the Day</span>
            </div>

            {approvedWords.length > 1 && (
              <button
                onClick={handleShuffleWord}
                className="text-xs text-amber-200/80 hover:text-amber-100 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-800/60 hover:bg-emerald-800 transition-colors"
                title="Discover another word"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Shuffle</span>
              </button>
            )}
          </div>

          {featuredWord ? (
            <div className="space-y-3">
              <div className="flex flex-wrap items-baseline gap-3">
                <h2 className="text-3xl sm:text-4xl font-extrabold font-malayalam text-amber-100 tracking-tight">
                  {featuredWord.wordMl}
                </h2>
                <span className="text-xl sm:text-2xl font-semibold text-amber-400 font-serif-kerala">
                  "{featuredWord.wordManglish}"
                </span>
                <AudioPlayerButton
                  audioUrl={featuredWord.audioDataUrl}
                  wordMl={featuredWord.wordMl}
                  wordManglish={featuredWord.wordManglish}
                  speakerName={featuredWord.audioSpeakerName}
                  speakerLocation={featuredWord.audioSpeakerLocation}
                  compact
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {district && (
                  <button
                    onClick={() => onSelectDistrict && onSelectDistrict(district.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-amber-500 text-emerald-950 hover:bg-amber-400 transition-colors shadow-sm"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{district.nameEn} ({district.nameMl})</span>
                  </button>
                )}
                <span className="text-xs font-medium text-emerald-200">
                  {district?.region}
                </span>
              </div>

              <div className="text-sm sm:text-base text-amber-50 leading-relaxed font-medium">
                <span className="text-amber-300 font-semibold">{featuredWord.englishMeaning}</span>
                <span className="mx-2 text-emerald-400">•</span>
                <span className="font-malayalam text-emerald-100">
                  {featuredWord.malayalamMeaning}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-800/40 border border-emerald-700/60 backdrop-blur-sm">
                <span className="text-[11px] uppercase tracking-wider text-amber-300/80 font-bold block mb-1">
                  Example in Dialogue (ഉദാഹരണം):
                </span>
                <p className="text-xs sm:text-sm italic font-malayalam text-emerald-100">
                  "{featuredWord.exampleSentenceMl}"
                </p>
                {featuredWord.exampleSentenceEn && (
                  <p className="text-xs text-emerald-300/80 mt-1">
                    "{featuredWord.exampleSentenceEn}"
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="py-4 space-y-2">
              <h3 className="text-2xl font-bold font-serif-kerala text-amber-100">
                നാടൻ പദസമ്പത്ത് കാത്തുസൂക്ഷിക്കാം
              </h3>
              <p className="text-xs text-emerald-200/90 leading-relaxed max-w-lg">
                Dictionary starts clean without simulated slang. Add the first authentic colloquial word from your native village or district to unlock the Word of the Day spotlight!
              </p>
              {onOpenSubmitModal && (
                <button
                  onClick={onOpenSubmitModal}
                  className="mt-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-emerald-950 text-xs font-bold rounded-xl shadow transition-all inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Submit Today's Featured Word</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Kerala Traditional Proverb (പഴഞ്ചൊല്ല്) */}
        <div className="lg:col-span-5 bg-emerald-950/80 border border-amber-400/30 rounded-2xl p-5 backdrop-blur-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Quote className="w-3.5 h-3.5" />
              <span>മലയാള പഴഞ്ചൊല്ല് • Kerala Proverb</span>
            </span>
            <button
              onClick={() => setProverbIndex(prev => (prev + 1) % DAILY_PROVERBS.length)}
              className="text-[11px] text-emerald-300 hover:text-white underline decoration-emerald-400"
            >
              Next Proverb
            </button>
          </div>

          <div className="space-y-1.5 py-1">
            <p className="text-base sm:text-lg font-bold font-malayalam text-amber-100 leading-snug">
              "{currentProverb.ml}"
            </p>
            <p className="text-xs text-emerald-200/90 italic">
              Meaning: {currentProverb.en}
            </p>
          </div>

          <div className="pt-2 border-t border-emerald-800/80 flex items-center justify-between text-[11px] text-amber-200/70">
            <span>Heritage: {currentProverb.district}</span>
            <span className="text-amber-400 font-semibold font-malayalam">കേരള സംസ്കാരം</span>
          </div>
        </div>
      </div>
    </div>
  );
};
