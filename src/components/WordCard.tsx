import React, { useState } from 'react';
import { WordEntry } from '../types/dictionary';
import { KERALA_DISTRICTS } from '../data/districts';
import { AudioPlayerButton } from './AudioPronunciation';
import { Heart, ThumbsUp, MapPin, Share2, Check, Sparkles, User, Tag, Volume2 } from 'lucide-react';

interface WordCardProps {
  word: WordEntry;
  isFavorite: boolean;
  onToggleFavorite: (wordId: string) => void;
  onLikeWord: (wordId: string) => void;
  onSelectDistrict?: (districtId: string) => void;
  isAdmin?: boolean;
  onDeleteWord?: (wordId: string) => void;
}

export const WordCard: React.FC<WordCardProps> = ({
  word,
  isFavorite,
  onToggleFavorite,
  onLikeWord,
  onSelectDistrict,
  isAdmin,
  onDeleteWord,
}) => {
  const [copied, setCopied] = useState(false);
  const district = KERALA_DISTRICTS.find(d => d.id === word.districtId);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `"${word.wordMl}" (${word.wordManglish}) - ${district?.nameEn || 'Kerala'} Colloquial Dialect: ${word.englishMeaning}. Example: "${word.exampleSentenceMl}"`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="kasavu-card rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-stone-200/90 flex flex-col justify-between group p-5 bg-white relative">
      {/* Top Bar: District Badge + Favorite & Share Actions */}
      <div className="flex items-start justify-between gap-2 mb-3">
        {/* District & Region */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => onSelectDistrict && onSelectDistrict(word.districtId)}
            className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 transition-colors"
          >
            <MapPin className="w-3 h-3 text-emerald-700" />
            <span>{district?.nameEn || word.districtId}</span>
            <span className="font-malayalam text-emerald-800">
              ({district?.nameMl})
            </span>
          </button>

          <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200/80">
            {word.category}
          </span>
        </div>

        {/* Favorite & Share Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(word.id);
            }}
            className={`p-1.5 rounded-full transition-colors ${
              isFavorite
                ? 'text-rose-600 bg-rose-50 hover:bg-rose-100'
                : 'text-stone-400 hover:text-rose-500 hover:bg-stone-100'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleShare}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            title="Copy word to share"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Word Header */}
      <div className="space-y-1 mb-3">
        <div className="flex items-baseline gap-2 flex-wrap">
          <h3 className="text-2xl sm:text-3xl font-extrabold font-malayalam text-emerald-950 tracking-tight">
            {word.wordMl}
          </h3>
          <span className="text-sm sm:text-base font-semibold text-amber-700 font-serif-kerala">
            ({word.wordManglish})
          </span>

          <AudioPlayerButton
            audioUrl={word.audioDataUrl}
            wordMl={word.wordMl}
            wordManglish={word.wordManglish}
            speakerName={word.audioSpeakerName}
            speakerLocation={word.audioSpeakerLocation}
            compact
          />
        </div>

        {/* Meaning in English and Malayalam */}
        <div className="text-sm text-stone-800 font-medium pt-1">
          <span className="text-emerald-900 font-semibold">{word.englishMeaning}</span>
          <span className="mx-2 text-stone-400">•</span>
          <span className="font-malayalam text-stone-700 font-normal">
            {word.malayalamMeaning}
          </span>
        </div>
      </div>

      {/* Cultural Nuance / Context if available */}
      {word.explanationMl && (
        <div className="mb-3 text-xs text-stone-600 leading-relaxed font-malayalam bg-stone-50 p-2.5 rounded-xl border border-stone-100">
          <span className="font-bold text-emerald-900 mr-1">സന്ദർഭം:</span>
          {word.explanationMl}
        </div>
      )}

      {/* Example Sentence with regional flavor */}
      <div className="mb-4 bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 space-y-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-600" />
          <span>നാട്ടുപ്രയോഗം (Example In Dialogue)</span>
        </div>
        <p className="text-xs sm:text-sm font-malayalam text-stone-900 italic font-medium">
          "{word.exampleSentenceMl}"
        </p>
        {word.exampleSentenceEn && (
          <p className="text-[11px] text-stone-600">
            "{word.exampleSentenceEn}"
          </p>
        )}
      </div>

      {/* Footer: Speaker / Contributor & Upvote button */}
      <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold">
            {word.submittedBy.name ? word.submittedBy.name.charAt(0).toUpperCase() : 'N'}
          </div>
          <span className="truncate max-w-[120px] sm:max-w-[160px] text-[11px]">
            {word.submittedBy.name || 'Native Speaker'}
          </span>
          {word.submittedBy.isVerifiedSpeaker && (
            <span
              className="text-[10px] px-1 rounded bg-emerald-100 text-emerald-800 font-medium"
              title="Verified local native speaker"
            >
              ✓ Local
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && onDeleteWord && (
            <button
              onClick={() => onDeleteWord(word.id)}
              className="text-[11px] text-rose-600 hover:text-rose-800 hover:underline"
            >
              Delete
            </button>
          )}

          <button
            onClick={() => onLikeWord(word.id)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-50 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 border border-stone-200 hover:border-emerald-300 transition-colors font-semibold text-[11px]"
          >
            <ThumbsUp className="w-3 h-3" />
            <span>{word.likesCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
