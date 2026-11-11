import React, { useState } from 'react';
import { WordEntry, WordCategory } from '../types/dictionary';
import { KERALA_DISTRICTS, CATEGORIES } from '../data/districts';
import { AudioRecorderWidget } from './AudioPronunciation';
import { X, Send, Eye, Sparkles, CheckCircle2 } from 'lucide-react';

interface WordSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (word: Omit<WordEntry, 'id' | 'createdAt' | 'likesCount'>) => void;
  initialDistrictId?: string | null;
  isAdminMode?: boolean;
}

export const WordSubmissionModal: React.FC<WordSubmissionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialDistrictId,
  isAdminMode = false,
}) => {
  const [wordMl, setWordMl] = useState('');
  const [wordManglish, setWordManglish] = useState('');
  const [englishMeaning, setEnglishMeaning] = useState('');
  const [malayalamMeaning, setMalayalamMeaning] = useState('');
  const [districtId, setDistrictId] = useState(initialDistrictId || 'kannur');
  const [otherDistricts, setOtherDistricts] = useState<string[]>([]);
  const [category, setCategory] = useState<WordCategory>('Slang');
  const [exampleSentenceMl, setExampleSentenceMl] = useState('');
  const [exampleSentenceEn, setExampleSentenceEn] = useState('');
  const [explanationMl, setExplanationMl] = useState('');
  
  // Audio state
  const [audioDataUrl, setAudioDataUrl] = useState<string | undefined>(undefined);
  const [audioDurationSeconds, setAudioDurationSeconds] = useState<number | undefined>(undefined);
  const [audioSpeakerName, setAudioSpeakerName] = useState('');
  const [audioSpeakerLocation, setAudioSpeakerLocation] = useState('');
  
  // Submitter state
  const [submitterName, setSubmitterName] = useState('');
  const [submitterHometown, setSubmitterHometown] = useState('');
  const [isNativeSpeaker, setIsNativeSpeaker] = useState(true);

  const [showPreview, setShowPreview] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!wordMl.trim()) {
      setValidationError('Please enter the colloquial word in Malayalam script (നാടൻ വാക്ക്).');
      return;
    }
    if (!wordManglish.trim()) {
      setValidationError('Please enter the Manglish transliteration (e.g. Poru, Gadee, Entharu).');
      return;
    }
    if (!englishMeaning.trim()) {
      setValidationError('Please enter the English meaning.');
      return;
    }
    if (!malayalamMeaning.trim()) {
      setValidationError('Please enter the standard Malayalam meaning (മലയാള അർത്ഥം).');
      return;
    }
    if (!exampleSentenceMl.trim()) {
      setValidationError('Please provide an example sentence showing how it is used in conversation.');
      return;
    }

    const newWordData: Omit<WordEntry, 'id' | 'createdAt' | 'likesCount'> = {
      wordMl: wordMl.trim(),
      wordManglish: wordManglish.trim(),
      englishMeaning: englishMeaning.trim(),
      malayalamMeaning: malayalamMeaning.trim(),
      districtId,
      otherDistricts: otherDistricts.length > 0 ? otherDistricts : undefined,
      category,
      exampleSentenceMl: exampleSentenceMl.trim(),
      exampleSentenceEn: exampleSentenceEn.trim() || undefined,
      explanationMl: explanationMl.trim() || undefined,
      audioDataUrl,
      audioDurationSeconds,
      audioSpeakerName: audioSpeakerName.trim() || submitterName.trim() || undefined,
      audioSpeakerLocation: audioSpeakerLocation.trim() || submitterHometown.trim() || undefined,
      status: isAdminMode ? 'approved' : 'approved', // Auto-publish in demo mode or approve
      submittedBy: {
        name: submitterName.trim() || 'Anonymous Native Contributor',
        district: submitterHometown.trim() || KERALA_DISTRICTS.find(d => d.id === districtId)?.nameEn,
        isVerifiedSpeaker: isNativeSpeaker,
      }
    };

    onSubmit(newWordData);
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      onClose();
    }, 1400);
  };

  const selectedDistrictObj = KERALA_DISTRICTS.find(d => d.id === districtId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-emerald-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-amber-300 relative overflow-hidden">
        {/* Kerala Gold Kasavu Top Accent */}
        <div className="h-1.5 kasavu-gold-strip shrink-0" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-6 bg-emerald-700 rounded-full" />
              <h3 className="text-lg sm:text-xl font-bold text-emerald-950 font-serif-kerala">
                പുതിയ നാടൻ വാക്ക് ചേർക്കുക
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Contribute a genuine Malayalam colloquial word with meaning, district & pronunciation
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body / Scrollable Form */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {submittedSuccess ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-emerald-950 font-malayalam">
                നന്ദി! വാക്ക് നിഘണ്ടുവിൽ ചേർത്തു.
              </h4>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                Thank you for contributing to the Kerala Malayalam colloquial preservation project.
              </p>
            </div>
          ) : (
            <form id="submit-word-form" onSubmit={handleSubmit} className="space-y-4">
              {validationError && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-800 text-xs border border-rose-200">
                  {validationError}
                </div>
              )}

              {/* Word inputs grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    നാടൻ വാക്ക് (Malayalam Script) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. പോറ്, ഗഡീ, എന്തര്, ബേജാറ്"
                    value={wordMl}
                    onChange={(e) => setWordMl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none text-base font-malayalam font-bold text-emerald-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Manglish / Transliteration <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Poru, Gadee, Entharu, Bejaar"
                    value={wordManglish}
                    onChange={(e) => setWordManglish(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm text-stone-900"
                  />
                </div>
              </div>

              {/* Meanings grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    English Meaning <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Friend, buddy, close companion"
                    value={englishMeaning}
                    onChange={(e) => setEnglishMeaning(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    മലയാള അർത്ഥം (Standard Malayalam) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. കൂട്ടുകാരൻ, ചങ്ങാതി"
                    value={malayalamMeaning}
                    onChange={(e) => setMalayalamMeaning(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm font-malayalam text-stone-900"
                  />
                </div>
              </div>

              {/* District & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    പ്രധാന ജില്ല (Primary District) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={districtId}
                    onChange={(e) => setDistrictId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm text-stone-900 bg-white"
                  >
                    {KERALA_DISTRICTS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.nameEn} ({d.nameMl}) - {d.region}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    വിഭാഗം (Category)
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as WordCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm text-stone-900 bg-white"
                  >
                    {CATEGORIES.filter(c => c.id !== 'All').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon} {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Example sentence */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  ഉദാഹരണ വാക്യം (Colloquial Example Sentence) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ഏയ് പോറേ, നീ ഇന്നലെ എങ്ങോട്ടാ പോയത്?"
                  value={exampleSentenceMl}
                  onChange={(e) => setExampleSentenceMl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm font-malayalam text-stone-900"
                />
                <input
                  type="text"
                  placeholder="English translation of example sentence (optional)"
                  value={exampleSentenceEn}
                  onChange={(e) => setExampleSentenceEn(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-700 outline-none focus:border-emerald-500"
                />
              </div>

              {/* Context / Nuance */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  വിവരണം / സന്ദർഭം (Context & Cultural Nuance - Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Explain when this word is typically spoken, social setting, or age group..."
                  value={explanationMl}
                  onChange={(e) => setExplanationMl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none text-xs text-stone-800"
                />
              </div>

              {/* Audio Pronunciation Recording Widget */}
              <AudioRecorderWidget
                onAudioCaptured={(dataUrl, duration) => {
                  setAudioDataUrl(dataUrl);
                  setAudioDurationSeconds(duration);
                }}
                onClearAudio={() => {
                  setAudioDataUrl(undefined);
                  setAudioDurationSeconds(undefined);
                }}
                existingAudioUrl={audioDataUrl}
                wordText={wordMl || wordManglish}
              />

              {/* Speaker & Contributor Info */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  സംഭാവകൻ വിവരങ്ങൾ (Speaker & Contributor Credit)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-stone-600 block mb-0.5">
                      Your Name / Speaker Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Praveen / Sumathi Chechi"
                      value={submitterName}
                      onChange={(e) => {
                        setSubmitterName(e.target.value);
                        setAudioSpeakerName(e.target.value);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs text-stone-800"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-stone-600 block mb-0.5">
                      Native Town / Panchayat / Taluk
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Thalassery / Chavakkad / Nedumangad"
                      value={submitterHometown}
                      onChange={(e) => {
                        setSubmitterHometown(e.target.value);
                        setAudioSpeakerLocation(e.target.value);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs text-stone-800"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={isNativeSpeaker}
                    onChange={(e) => setIsNativeSpeaker(e.target.checked)}
                    className="w-4 h-4 text-emerald-700 rounded border-stone-300 focus:ring-emerald-500"
                  />
                  <span>I confirm this is a genuine native regional usage spoken by locals in Kerala.</span>
                </label>
              </div>

              {/* Toggle Live Preview */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-xs text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1.5 underline decoration-emerald-500 underline-offset-4"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showPreview ? 'Hide Word Card Preview' : 'Preview Word Card'}</span>
                </button>
              </div>

              {/* Live Preview Card */}
              {showPreview && (
                <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                      Card Preview
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                      {selectedDistrictObj?.nameEn} ({selectedDistrictObj?.nameMl})
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold font-malayalam text-emerald-950">
                      {wordMl || 'നാടൻ വാക്ക്'}
                    </span>
                    <span className="text-sm font-semibold text-amber-700">
                      ({wordManglish || 'Manglish'})
                    </span>
                  </div>
                  <p className="text-xs text-stone-700 font-medium">
                    {englishMeaning || 'English meaning will appear here'} •{' '}
                    <span className="font-malayalam text-emerald-900">
                      {malayalamMeaning || 'മലയാള അർത്ഥം'}
                    </span>
                  </p>
                  {exampleSentenceMl && (
                    <p className="text-xs italic bg-white/80 p-2 rounded border border-amber-200/60 font-malayalam text-stone-800">
                      "{exampleSentenceMl}"
                    </p>
                  )}
                </div>
              )}
            </form>
          )}
        </div>

        {/* Modal Footer */}
        {!submittedSuccess && (
          <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-200 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              form="submit-word-form"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-100 text-xs font-bold shadow-md transition-all border border-emerald-700 active:scale-95"
            >
              <Send className="w-3.5 h-3.5 text-amber-300" />
              <span>സമർപ്പിക്കുക (Submit Word)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
