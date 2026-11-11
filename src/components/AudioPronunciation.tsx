import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, RotateCcw, Upload, Volume2, UserCheck, AlertCircle, VolumeX } from 'lucide-react';

// Speech synthesis helper for Malayalam pronunciation fallback
export const speakMalayalamWord = (text: string, transliteration?: string): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis API not supported in this browser.');
      resolve(false);
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any currently playing audio

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85; // slightly slower for clear pronunciation
      utterance.pitch = 1.0;

      // Try finding a Malayalam or Indian English voice
      const voices = window.speechSynthesis.getVoices();
      const malayalamVoice = voices.find(v => v.lang.includes('ml') || v.lang.includes('ML'));
      const indianVoice = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('hi-IN'));

      if (malayalamVoice) {
        utterance.voice = malayalamVoice;
        utterance.lang = 'ml-IN';
      } else if (indianVoice) {
        utterance.voice = indianVoice;
        // If no native Malayalam voice is installed on user's OS, speak the phonetic transliteration
        if (transliteration) {
          utterance.text = `${text}, pronounced as ${transliteration}`;
        }
      }

      utterance.onend = () => resolve(true);
      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis error:', e);
        // Fallback tone / alert
        resolve(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Failed to trigger speech synthesis:', err);
      resolve(false);
    }
  });
};

interface AudioRecorderProps {
  onAudioCaptured: (audioDataUrl: string, durationSeconds: number) => void;
  onClearAudio: () => void;
  existingAudioUrl?: string;
  speakerName?: string;
  speakerLocation?: string;
  wordText?: string;
}

export const AudioRecorderWidget: React.FC<AudioRecorderProps> = ({
  onAudioCaptured,
  onClearAudio,
  existingAudioUrl,
  wordText,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(existingAudioUrl || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (existingAudioUrl) {
      setAudioUrl(existingAudioUrl);
    }
  }, [existingAudioUrl]);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current = null;
      }
    };
  }, []);

  const getSupportedMimeType = (): string => {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4',
      'audio/aac',
      ''
    ];
    for (const t of types) {
      if (!t || MediaRecorder.isTypeSupported(t)) {
        return t;
      }
    }
    return '';
  };

  const startRecording = async () => {
    setErrorMsg(null);
    audioChunksRef.current = [];
    setRecordingSeconds(0);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setErrorMsg('Microphone recording is not supported in this browser. Please upload an audio file instead.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });

      const mimeType = getSupportedMimeType();
      const options: MediaRecorderOptions = mimeType ? { mimeType } : {};
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const finalMime = mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: finalMime });
        
        if (audioBlob.size === 0) {
          setErrorMsg('No audio data captured. Please check your microphone.');
          return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64DataUrl = reader.result as string;
          setAudioUrl(base64DataUrl);
          onAudioCaptured(base64DataUrl, recordingSeconds || 2);
        };

        // Stop all tracks to turn off recording light on mic
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(250); // Slice every 250ms
      setIsRecording(true);

      timerIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 60) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: unknown) {
      console.error('Error accessing microphone:', err);
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes('Permission') || message.includes('denied')) {
        setErrorMsg('Microphone permission was denied. Please allow microphone access in your browser settings or upload an audio file.');
      } else {
        setErrorMsg('Could not start microphone. You can upload an audio file (.mp3, .wav, .m4a) below.');
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setIsRecording(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      setErrorMsg('Please select a valid audio file (.mp3, .wav, .m4a, .webm, .ogg)');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg('Audio file is too large. Please upload under 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAudioUrl(result);
      onAudioCaptured(result, 3);
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const togglePlayback = () => {
    if (!audioUrl) return;

    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current = null;
    }

    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    try {
      const audio = new Audio(audioUrl);
      audioElementRef.current = audio;
      audio.onended = () => setIsPlaying(false);
      audio.onerror = (e) => {
        console.error('Audio playback error:', e);
        setIsPlaying(false);
        setErrorMsg('Browser could not play this audio format. You can try re-recording.');
      };

      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.error('Playback failed:', err);
        setIsPlaying(false);
        setErrorMsg('Audio playback was blocked by browser. Click play again.');
      });
    } catch (err) {
      console.error('Audio initialization failed:', err);
      setIsPlaying(false);
    }
  };

  const resetRecording = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current = null;
    }
    setAudioUrl(null);
    setIsPlaying(false);
    setRecordingSeconds(0);
    onClearAudio();
  };

  return (
    <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
          <Volume2 className="w-4 h-4 text-amber-600" />
          <span>ശബ്ദം (Audio Pronunciation Recording)</span>
        </label>
        <span className="text-[11px] text-stone-500">Microphone or Upload</span>
      </div>

      <p className="text-xs text-stone-600 leading-relaxed">
        Record native regional pronunciation with your microphone or upload an audio file so anyone can hear how the word is spoken locally.
      </p>

      {errorMsg && (
        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-rose-50 text-rose-800 text-xs border border-rose-200">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Recording & Player Controls */}
      {!audioUrl ? (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {isRecording ? (
            <button
              type="button"
              onClick={stopRecording}
              className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow animate-pulse cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop Recording ({recordingSeconds}s)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={startRecording}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-amber-100 rounded-xl text-xs font-bold shadow transition-all border border-emerald-700 cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5 text-amber-300" />
              <span>Record with Microphone</span>
            </button>
          )}

          <span className="text-xs text-stone-400">or</span>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 rounded-xl text-xs font-medium transition-all cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-stone-500" />
            <span>Upload Audio File</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {wordText && (
            <button
              type="button"
              onClick={() => speakMalayalamWord(wordText)}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-100/70 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-xl text-xs font-medium ml-auto"
              title="Test pronunciation using speech engine"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-700" />
              <span>Test Pronounce</span>
            </button>
          )}
        </div>
      ) : (
        /* Audio Captured State with Preview */
        <div className="flex items-center justify-between gap-3 p-3 bg-white rounded-xl border border-amber-300 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlayback}
              className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-600 text-emerald-950 flex items-center justify-center shadow transition-transform active:scale-95 cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>
            <div>
              <div className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <span>{isPlaying ? 'Playing Audio Recording...' : 'Audio Ready to Play'}</span>
                {isPlaying && (
                  <span className="flex gap-0.5 items-end h-3">
                    <span className="w-1 h-2 bg-amber-500 animate-pulse" />
                    <span className="w-1 h-3 bg-emerald-600 animate-pulse delay-75" />
                    <span className="w-1 h-1.5 bg-amber-500 animate-pulse delay-150" />
                  </span>
                )}
              </div>
              <span className="text-[11px] text-stone-500">
                Click play button to hear your recorded pronunciation
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={resetRecording}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-stone-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Re-record</span>
          </button>
        </div>
      )}
    </div>
  );
};

interface AudioPlayerButtonProps {
  audioUrl?: string;
  wordMl: string;
  wordManglish?: string;
  speakerName?: string;
  speakerLocation?: string;
  compact?: boolean;
}

export const AudioPlayerButton: React.FC<AudioPlayerButtonProps> = ({
  audioUrl,
  wordMl,
  wordManglish,
  speakerName,
  speakerLocation,
  compact = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();

    // If audioDataUrl exists, play the recorded audio
    if (audioUrl) {
      if (isPlaying) {
        if (audioRef.current) audioRef.current.pause();
        setIsPlaying(false);
        return;
      }

      try {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }

        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => {
          // If audio file playback failed, fall back to speech synthesis!
          setIsPlaying(true);
          speakMalayalamWord(wordMl, wordManglish).finally(() => setIsPlaying(false));
        };

        audio.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // If browser blocked audio play, fall back to speech synthesis
          setIsPlaying(true);
          speakMalayalamWord(wordMl, wordManglish).finally(() => setIsPlaying(false));
        });
      } catch (err) {
        setIsPlaying(true);
        speakMalayalamWord(wordMl, wordManglish).finally(() => setIsPlaying(false));
      }
    } else {
      // Fallback: No recording uploaded yet -> Speak word using Malayalam speech synthesizer!
      if (isPlaying) {
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        setIsPlaying(false);
        return;
      }

      setIsPlaying(true);
      speakMalayalamWord(wordMl, wordManglish).finally(() => {
        setIsPlaying(false);
      });
    }
  };

  const tooltipText = audioUrl
    ? `Listen native speaker recording (${speakerName || 'Local speaker'})`
    : `Pronounce "${wordMl}" (${wordManglish || 'Malayalam'})`;

  if (compact) {
    return (
      <button
        onClick={togglePlay}
        className={`p-1.5 sm:p-2 rounded-full transition-all flex items-center justify-center cursor-pointer shadow-xs ${
          isPlaying
            ? 'bg-amber-500 text-emerald-950 ring-2 ring-amber-300 scale-105'
            : audioUrl
            ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
            : 'bg-amber-100/80 hover:bg-amber-200 text-amber-900 border border-amber-300/80'
        }`}
        title={tooltipText}
        aria-label={tooltipText}
      >
        {isPlaying ? (
          <Pause className="w-3.5 h-3.5 fill-current animate-pulse" />
        ) : (
          <Volume2 className="w-3.5 h-3.5 text-current" />
        )}
      </button>
    );
  }

  return (
    <div
      onClick={togglePlay}
      className={`cursor-pointer flex items-center gap-2.5 p-2 px-3 rounded-xl border transition-all shadow-xs ${
        isPlaying
          ? 'bg-amber-100 border-amber-400 text-emerald-950 ring-1 ring-amber-400'
          : audioUrl
          ? 'bg-emerald-50 hover:bg-emerald-100/70 border-emerald-200 text-emerald-950'
          : 'bg-amber-50 hover:bg-amber-100/60 border-amber-200/80 text-stone-800'
      }`}
      title={tooltipText}
    >
      <button
        type="button"
        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-sm ${
          isPlaying
            ? 'bg-amber-500 text-emerald-950 animate-pulse'
            : 'bg-emerald-800 hover:bg-emerald-700 text-amber-200'
        }`}
      >
        {isPlaying ? (
          <Pause className="w-3.5 h-3.5 fill-current" />
        ) : (
          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
        )}
      </button>

      <div className="text-xs">
        <div className="font-bold flex items-center gap-1.5">
          <span>{isPlaying ? 'Speaking Pronunciation...' : 'Listen Pronunciation (ശബ്ദം)'}</span>
          {audioUrl && <UserCheck className="w-3 h-3 text-emerald-600" />}
        </div>
        <div className="text-[11px] text-stone-500">
          {audioUrl
            ? `Voice: ${speakerName || 'Native Speaker'} ${speakerLocation ? `(${speakerLocation})` : ''}`
            : 'Pronounce via Malayalam Speech Engine'}
        </div>
      </div>
    </div>
  );
};
