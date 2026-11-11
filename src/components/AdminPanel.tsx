import React, { useState } from 'react';
import { WordEntry, UserProfile } from '../types/dictionary';
import { KERALA_DISTRICTS } from '../data/districts';
import { AudioPlayerButton } from './AudioPronunciation';
import { ShieldCheck, Check, X, Edit3, Trash2, Clock, Volume2, Database, AlertCircle, KeyRound, Sparkles } from 'lucide-react';

interface AdminPanelProps {
  words: WordEntry[];
  currentUser: UserProfile;
  onApproveWord: (wordId: string) => void;
  onRejectWord: (wordId: string, reason?: string) => void;
  onDeleteWord: (wordId: string) => void;
  onUpdateWord: (updatedWord: WordEntry) => void;
  onSwitchUserRole: (role: UserProfile['role']) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  words,
  currentUser,
  onApproveWord,
  onRejectWord,
  onDeleteWord,
  onUpdateWord,
  onSwitchUserRole,
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'setup'>('pending');
  const [editingWord, setEditingWord] = useState<WordEntry | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [rejectingWordId, setRejectingWordId] = useState<string | null>(null);

  const pendingWords = words.filter(w => w.status === 'pending');
  const approvedWords = words.filter(w => w.status === 'approved');
  const wordsWithAudio = words.filter(w => !!w.audioDataUrl);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWord) return;
    onUpdateWord(editingWord);
    setEditingWord(null);
  };

  const handleConfirmReject = (wordId: string) => {
    onRejectWord(wordId, rejectReason);
    setRejectingWordId(null);
    setRejectReason('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200/90 overflow-hidden space-y-6">
      {/* Top Kasavu Strip */}
      <div className="h-1.5 kasavu-gold-strip" />

      {/* Admin Panel Header & Role Switcher */}
      <div className="p-5 sm:p-6 border-b border-stone-100 bg-stone-50/60 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-emerald-950 font-serif-kerala">
              ലക്സിക്കൺ അഡ്മിൻ പാനൽ (Curator & Admin Panel)
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Review community dialect submissions, moderate regional authenticity & manage dictionary data
          </p>
        </div>

        {/* Role Switcher for easy testing & demo */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-stone-300 shadow-sm text-xs">
          <span className="text-stone-500 font-medium">Current Role:</span>
          <select
            value={currentUser.role}
            onChange={(e) => onSwitchUserRole(e.target.value as UserProfile['role'])}
            className="font-bold text-emerald-900 bg-transparent outline-none cursor-pointer"
          >
            <option value="admin">Admin / Curator (അഡ്മിൻ)</option>
            <option value="verified_speaker">Verified Speaker (ഭാഷാ സഹായി)</option>
            <option value="contributor">Guest Contributor (ഉപയോക്താവ്)</option>
          </select>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-5 sm:px-6">
        <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
          <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">
            Pending Approval
          </span>
          <span className="text-2xl font-bold text-amber-600">{pendingWords.length}</span>
        </div>
        <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
          <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">
            Approved Words
          </span>
          <span className="text-2xl font-bold text-emerald-700">{approvedWords.length}</span>
        </div>
        <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
          <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">
            Audio Recordings
          </span>
          <span className="text-2xl font-bold text-teal-700">{wordsWithAudio.length}</span>
        </div>
        <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
          <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">
            Active Districts
          </span>
          <span className="text-2xl font-bold text-stone-800">
            {new Set(words.map(w => w.districtId)).size} / 14
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 sm:px-6 border-b border-stone-100 flex items-center gap-2">
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'pending'
              ? 'border-amber-500 text-emerald-950'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Pending Submissions ({pendingWords.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('approved')}
          className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'approved'
              ? 'border-amber-500 text-emerald-950'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Check className="w-4 h-4" />
          <span>Published Words ({approvedWords.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('setup')}
          className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'setup'
              ? 'border-amber-500 text-emerald-950'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Setup & Cloud Sync Guide</span>
        </button>
      </div>

      {/* Tab 1: Pending Submissions */}
      {activeTab === 'pending' && (
        <div className="p-5 sm:p-6 space-y-4">
          {pendingWords.length > 0 ? (
            <div className="space-y-4">
              {pendingWords.map((word) => {
                const district = KERALA_DISTRICTS.find(d => d.id === word.districtId);
                return (
                  <div
                    key={word.id}
                    className="p-4 rounded-xl border border-amber-300 bg-amber-50/40 space-y-3"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold font-malayalam text-emerald-950">
                            {word.wordMl}
                          </span>
                          <span className="text-sm font-semibold text-amber-800">
                            ({word.wordManglish})
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                            {district?.nameEn} ({district?.nameMl})
                          </span>
                        </div>
                        <p className="text-xs text-stone-700 mt-1">
                          <span className="font-bold">Meaning:</span> {word.englishMeaning} •{' '}
                          <span className="font-malayalam">{word.malayalamMeaning}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingWord(word)}
                          className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => setRejectingWordId(word.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-medium flex items-center gap-1 border border-rose-200"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>

                        <button
                          onClick={() => onApproveWord(word.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve & Publish</span>
                        </button>
                      </div>
                    </div>

                    {/* Example & Audio */}
                    <div className="bg-white/80 p-3 rounded-lg border border-stone-200 text-xs space-y-1.5">
                      <div className="text-stone-700">
                        <span className="font-semibold text-emerald-950">Example:</span>{' '}
                        <span className="font-malayalam italic">"{word.exampleSentenceMl}"</span>
                      </div>
                      {word.audioDataUrl && (
                        <div className="pt-1">
                          <AudioPlayerButton
                            audioUrl={word.audioDataUrl}
                            speakerName={word.audioSpeakerName}
                            speakerLocation={word.audioSpeakerLocation}
                          />
                        </div>
                      )}
                      <div className="text-[11px] text-stone-400 pt-1">
                        Submitted by: {word.submittedBy.name} ({word.submittedBy.district || 'Kerala'})
                      </div>
                    </div>

                    {/* Reject Reason input dialog */}
                    {rejectingWordId === word.id && (
                      <div className="p-3 bg-rose-50 rounded-lg border border-rose-200 space-y-2">
                        <label className="text-xs font-bold text-rose-900 block">
                          Reason for Rejection:
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Inaccurate regional spelling, non-colloquial usage..."
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          className="w-full px-3 py-1.5 rounded border border-rose-300 text-xs bg-white text-stone-900"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setRejectingWordId(null)}
                            className="px-3 py-1 rounded text-xs text-stone-600"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleConfirmReject(word.id)}
                            className="px-3 py-1 rounded text-xs bg-rose-600 text-white font-bold"
                          >
                            Confirm Reject
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-stone-500 text-xs space-y-2">
              <p>No pending submissions awaiting review right now.</p>
              <p className="text-[11px] text-stone-400">
                New words submitted by users will appear here for administrative moderation before going live.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Published Words */}
      {activeTab === 'approved' && (
        <div className="p-5 sm:p-6 space-y-3">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Word</th>
                  <th className="py-2.5 px-3">District</th>
                  <th className="py-2.5 px-3">English Meaning</th>
                  <th className="py-2.5 px-3">Audio</th>
                  <th className="py-2.5 px-3">Likes</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {approvedWords.map((word) => {
                  const district = KERALA_DISTRICTS.find(d => d.id === word.districtId);
                  return (
                    <tr key={word.id} className="hover:bg-stone-50">
                      <td className="py-2.5 px-3 font-bold text-emerald-950 font-malayalam text-sm">
                        {word.wordMl}{' '}
                        <span className="text-xs font-normal text-stone-500 font-sans">
                          ({word.wordManglish})
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-stone-700">
                        {district?.nameEn}
                      </td>
                      <td className="py-2.5 px-3 text-stone-600 max-w-[200px] truncate">
                        {word.englishMeaning}
                      </td>
                      <td className="py-2.5 px-3">
                        {word.audioDataUrl ? (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <Volume2 className="w-3.5 h-3.5" /> Yes
                          </span>
                        ) : (
                          <span className="text-stone-400">—</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-stone-700">
                        {word.likesCount}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => onDeleteWord(word.id)}
                          className="p-1 rounded text-rose-600 hover:bg-rose-50"
                          title="Delete word"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Simple Setup & Cloud Sync Guide */}
      {activeTab === 'setup' && (
        <div className="p-5 sm:p-6 space-y-4 text-xs text-stone-700">
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-300 space-y-2">
            <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Current Data Storage Mode: LocalStorage + IndexedDB (Free & Offline)</span>
            </h4>
            <p className="leading-relaxed">
              All words, user audio recordings (base64 Data URLs), approval queues, and favourites are currently stored locally in your browser with zero latency and 100% free usage.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-bold text-emerald-950">
              Firebase Integration & Setup Guide (Explained Simply)
            </h4>
            <ol className="list-decimal pl-4 space-y-2 text-stone-600 leading-relaxed">
              <li>
                <strong>Free Quota Safe:</strong> Firestore’s free tier provides 50,000 document reads, 20,000 writes, and 1 GB storage every single day without any credit card or billing.
              </li>
              <li>
                <strong>To connect to a live Firebase project:</strong> Simply ask the AI assistant in the chat:
                <em className="block p-2 mt-1 rounded bg-stone-100 font-mono text-[11px] text-stone-800">
                  "Set up Firebase for this applet to sync words to Firestore."
                </em>
              </li>
              <li>
                <strong>One-click Approval UI:</strong> The setup dialogue will appear for terms acceptance, provision the Firestore database, and sync seamlessly without breaking existing offline words.
              </li>
            </ol>
          </div>
        </div>
      )}

      {/* Edit Word Modal if active */}
      {editingWord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 space-y-3 shadow-xl">
            <h3 className="text-base font-bold text-emerald-950">Edit Word Details</h3>
            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold block mb-1">Malayalam Script</label>
                <input
                  type="text"
                  value={editingWord.wordMl}
                  onChange={(e) => setEditingWord({ ...editingWord, wordMl: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded-lg text-sm font-malayalam"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold block mb-1">Manglish</label>
                <input
                  type="text"
                  value={editingWord.wordManglish}
                  onChange={(e) => setEditingWord({ ...editingWord, wordManglish: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold block mb-1">English Meaning</label>
                <input
                  type="text"
                  value={editingWord.englishMeaning}
                  onChange={(e) => setEditingWord({ ...editingWord, englishMeaning: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold block mb-1">Standard Malayalam Meaning</label>
                <input
                  type="text"
                  value={editingWord.malayalamMeaning}
                  onChange={(e) => setEditingWord({ ...editingWord, malayalamMeaning: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded-lg text-xs font-malayalam"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingWord(null)}
                  className="px-3 py-1.5 rounded-lg text-xs text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-800 text-white"
                >
                  Save & Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
