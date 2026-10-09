"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function AtmospherePlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(28); // 28s as shown in reference: 0:00 / 0:28
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Web Audio Context for authentic relaxing kitchen & ambient acoustic warmth
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{
    gainNode: GainNode | null;
    oscillators: OscillatorNode[];
    noiseNode: AudioBufferSourceNode | null;
  }>({
    gainNode: null,
    oscillators: [],
    noiseNode: null,
  });

  const startAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Master Gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(isMuted ? 0 : 0.08, ctx.currentTime);
      masterGain.connect(ctx.destination);
      nodesRef.current.gainNode = masterGain;

      // Warm acoustic ambient chord (F# - C# - A# - F for serene culinary elegance)
      const frequencies = [185.0, 277.18, 369.99, 466.16];
      const oscs: OscillatorNode[] = [];

      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = idx === 0 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        oscGain.gain.setValueAtTime(0.02 / (idx + 1), ctx.currentTime);
        osc.connect(oscGain);
        oscGain.connect(masterGain);
        osc.start();
        oscs.push(osc);
      });

      // Subtle gentle fireplace / sizzling warmth texture
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.006;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter noise for warm woodfire crackle
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
      filter.Q.setValueAtTime(2.5, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(masterGain);
      whiteNoise.start();

      nodesRef.current.oscillators = oscs;
      nodesRef.current.noiseNode = whiteNoise;
    } catch {
      // Audio autoplay gracefully handled
    }
  };

  const stopAudio = () => {
    try {
      nodesRef.current.oscillators.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {}
      });
      nodesRef.current.oscillators = [];
      if (nodesRef.current.noiseNode) {
        try {
          nodesRef.current.noiseNode.stop();
          nodesRef.current.noiseNode.disconnect();
        } catch {}
        nodesRef.current.noiseNode = null;
      }
    } catch {}
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopAudio();
      setIsPlaying(false);
    } else {
      startAudio();
      setIsPlaying(true);
    }
  };

  // Timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  useEffect(() => {
    if (nodesRef.current.gainNode && audioCtxRef.current) {
      nodesRef.current.gainNode.gain.setValueAtTime(
        isMuted ? 0 : 0.08,
        audioCtxRef.current.currentTime
      );
    }
  }, [isMuted]);

  useEffect(() => {
    return () => {
      stopAudio();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const progressPercent = (currentTime / duration) * 100;

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const clamped = Math.max(0, Math.min(1, pos));
    setCurrentTime(Math.floor(clamped * duration));
  };

  return (
    <>
      <div className="w-full pt-4 pb-2">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 rounded-full bg-[#181F17] px-4 py-2.5 text-white shadow-xl border border-white/10 sm:gap-4 sm:px-6 sm:py-3">
          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause audio atmosphere" : "Play audio atmosphere"}
            className="group flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#181F17] transition-all hover:scale-105 hover:bg-[#F2ECE0] sm:h-9 sm:w-9"
          >
            {isPlaying ? (
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg className="h-3.5 w-3.5 fill-current translate-x-0.5" viewBox="0 0 24 24">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </button>

          {/* Title & Time */}
          <div className="flex flex-col min-w-0 sm:flex-row sm:items-center sm:gap-3">
            <span className="truncate text-xs font-semibold tracking-wide text-[#FAF8F5]">
              Atmosphere: The Kitchen Artistry
            </span>
            <span className="text-[10px] tabular-nums text-white/50 tracking-wider">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Progress Scrubber */}
          <div
            onClick={handleSeek}
            role="slider"
            aria-valuemin={0}
            aria-valuemax={duration}
            aria-valuenow={currentTime}
            tabIndex={0}
            className="group relative flex-1 h-3 flex items-center cursor-pointer min-w-[70px] sm:min-w-[120px]"
          >
            <div className="h-1 w-full rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full bg-[#C5A880] transition-all duration-200"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {/* Scrubber Knob */}
            <div
              className="absolute h-2.5 w-2.5 rounded-full bg-[#C5A880] shadow -translate-x-1/2 transition-all opacity-90 group-hover:scale-125"
              style={{ left: `${progressPercent}%` }}
            />
          </div>

          {/* Volume Button */}
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            className="p-1 text-white/70 hover:text-white transition-colors"
          >
            {isMuted ? (
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6.75L3.75 9H2.25A1.5 1.5 0 00.75 10.5v3A1.5 1.5 0 002.25 15h1.5l5.25 3.75V5.25z" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.757 3.63 8.25 4.51 8.25H6.75z" />
              </svg>
            )}
          </button>

          {/* Expand / Visualizer Mode Button */}
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            aria-label="View Atmosphere Artistry modal"
            className="p-1 text-white/70 hover:text-white transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Ambient Soundscape Overlay */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#161D15] p-8 text-center text-white shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="absolute right-5 top-5 rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#C5A880]">
                Atmospheric Soundscape
              </span>
              <h3 className="font-serif text-3xl font-normal text-white mt-2">
                The Kitchen Artistry
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-white/70">
                Immerse yourself in the ambient harmony of our kitchen: the quiet sizzle of olive wood embers, copper rakwehs, and gentle courtyard melodies designed for an unhurried dining experience.
              </p>

              <div className="my-8 flex items-center justify-center gap-1.5 h-12">
                {[...Array(24)].map((_, i) => (
                  <motion.span
                    key={i}
                    animate={
                      isPlaying
                        ? {
                            height: [8, 16 + (i % 6) * 5, 10, 24 + ((i * 3) % 12), 8],
                          }
                        : { height: 6 }
                    }
                    transition={{
                      repeat: Infinity,
                      duration: 1.2 + (i % 5) * 0.2,
                      ease: "easeInOut",
                    }}
                    className="w-1 rounded-full bg-[#C5A880]"
                  />
                ))}
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="inline-flex items-center gap-2 rounded-full bg-[#FAF8F5] px-7 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#181F17] hover:bg-[#C5A880] hover:text-white transition-all"
                >
                  {isPlaying ? "Pause Soundscape" : "Play Soundscape"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
