import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, RotateCcw, Upload, Volume2, UserCheck, AlertCircle } from 'lucide-react';

interface AudioRecorderProps {
  onAudioCaptured: (audioDataUrl: string, durationSeconds: number) => void;
  onClearAudio: () => void;
  existingAudioUrl?: string;
  speakerName?: string;
  speakerLocation?: string;
}

export const AudioRecorderWidget: React.FC<AudioRecorderProps> = ({
  onAudioCaptured,
  onClearAudio,
  existingAudioUrl,
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

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const startRecording = async () => {
    setErrorMsg(null);
    audioChunksRef.current = [];
    setRecordingSeconds(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64DataUrl = reader.result as string;
          setAudioUrl(base64DataUrl);
          onAudioCaptured(base64DataUrl, recordingSeconds || 2);
        };

        // Stop all tracks in stream to release microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(200); // 200ms slice
      setIsRecording(true);

      timerIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 60) {
            // Cap at 60 seconds
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: unknown) {
      console.error('Error accessing microphone:', err);
      setErrorMsg('Microphone access denied or unavailable. You can also upload an audio file below.');
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
      setErrorMsg('Please select an audio file (.mp3, .wav, .m4a, .webm)');
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
    if (!audioElementRef.current && audioUrl) {
      const audio = new Audio(audioUrl);
      audioElementRef.current = audio;
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        setIsPlaying(false);
        setErrorMsg('Error playing captured audio');
      };
    }

    if (audioElementRef.current) {
      if (isPlaying) {
        audioElementRef.current.pause();
        setIsPlaying(false);
      } else {
        audioElementRef.current.currentTime = 0;
        audioElementRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          setIsPlaying(false);
        });
      }
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
    <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
          <Volume2 className="w-4 h-4 text-amber-600" />
          <span>ശബ്ദം (Native Speaker Pronunciation)</span>
        </label>
        <span className="text-[11px] text-stone-500">Optional but recommended</span>
      </div>

      <p className="text-xs text-stone-600 leading-relaxed">
        Capture genuine regional pronunciation from a native speaker of this district. You can record live with your microphone or upload an audio file.
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
              className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow animate-pulse"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop Recording ({recordingSeconds}s)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={startRecording}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-amber-100 rounded-lg text-xs font-bold shadow transition-all border border-emerald-700"
            >
              <Mic className="w-3.5 h-3.5 text-amber-300" />
              <span>Record with Microphone</span>
            </button>
          )}

          <span className="text-xs text-stone-400">or</span>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 rounded-lg text-xs font-medium transition-all"
          >
            <Upload className="w-3.5 h-3.5 text-stone-500" />
            <span>Upload Audio</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      ) : (
        /* Audio Captured State with Preview */
        <div className="flex items-center justify-between gap-3 p-3 bg-white rounded-lg border border-amber-300 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlayback}
              className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-600 text-emerald-950 flex items-center justify-center shadow transition-transform active:scale-95"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>
            <div>
              <div className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <span>Pronunciation Ready</span>
                {isPlaying && (
                  <span className="flex gap-0.5 items-end h-3">
                    <span className="w-1 h-2 bg-amber-500 animate-pulse" />
                    <span className="w-1 h-3 bg-emerald-600 animate-pulse delay-75" />
                    <span className="w-1 h-1.5 bg-amber-500 animate-pulse delay-150" />
                  </span>
                )}
              </div>
              <span className="text-[11px] text-stone-500">
                Click to preview audio pronunciation
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={resetRecording}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-stone-600 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
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
  speakerName?: string;
  speakerLocation?: string;
  compact?: boolean;
}

export const AudioPlayerButton: React.FC<AudioPlayerButtonProps> = ({
  audioUrl,
  speakerName,
  speakerLocation,
  compact = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!audioUrl) return null;

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!audioRef.current) {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => setIsPlaying(false);
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.currentTime = 0;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  if (compact) {
    return (
      <button
        onClick={togglePlay}
        className={`p-1.5 rounded-full transition-all flex items-center justify-center ${
          isPlaying
            ? 'bg-amber-500 text-emerald-950 ring-2 ring-amber-300 shadow'
            : 'bg-emerald-100/90 hover:bg-emerald-200 text-emerald-900 border border-emerald-300/80'
        }`}
        title={speakerName ? `Listen pronunciation by ${speakerName}` : 'Listen pronunciation'}
      >
        {isPlaying ? (
          <Pause className="w-3.5 h-3.5 fill-current" />
        ) : (
          <Volume2 className="w-3.5 h-3.5" />
        )}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-50 border border-amber-200/80 text-stone-800">
      <button
        onClick={togglePlay}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm ${
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
        <div className="font-semibold text-emerald-950 flex items-center gap-1">
          <span>{isPlaying ? 'Playing dialect audio...' : 'Listen Pronunciation'}</span>
          {speakerName && <UserCheck className="w-3 h-3 text-emerald-600" />}
        </div>
        {speakerName && (
          <div className="text-[11px] text-stone-500">
            Voice: {speakerName} {speakerLocation ? `(${speakerLocation})` : ''}
          </div>
        )}
      </div>
    </div>
  );
};
