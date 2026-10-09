"use client";

import { useEffect, useRef, useState } from "react";
import { PlayIcon, PauseIcon } from "@/components/icons";
import { Magnetic } from "@/components/motion-primitives";

export function SoundscapePlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const oscillatorRefs = useRef<OscillatorNode[]>([]);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const startAmbientSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Master gain node
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.001, ctx.currentTime);
      master.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 1.2);
      master.connect(ctx.destination);
      masterGainRef.current = master;

      // Gentle pink noise to simulate soft courtyard breeze & distant leaves
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2) * 0.04;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Lowpass filter for smooth warm breeze tone
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(380, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(master);
      whiteNoise.start();
      noiseSourceRef.current = whiteNoise;

      // Subtle warm harmonizing chords (F & C notes, gentle warm Mediterranean evening tones)
      const frequencies = [174.61, 261.63, 349.23];
      oscillatorRefs.current = frequencies.map((freq) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        oscGain.gain.setValueAtTime(0.015, ctx.currentTime);
        osc.connect(oscGain);
        oscGain.connect(master);
        osc.start();
        return osc;
      });
    } catch {
      // Audio autoplay gracefully handled
    }
  };

  const stopAmbientSound = () => {
    try {
      if (masterGainRef.current && audioCtxRef.current) {
        const ctx = audioCtxRef.current;
        masterGainRef.current.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
        setTimeout(() => {
          noiseSourceRef.current?.stop();
          noiseSourceRef.current?.disconnect();
          oscillatorRefs.current.forEach((osc) => {
            try {
              osc.stop();
              osc.disconnect();
            } catch {
              // noop
            }
          });
          oscillatorRefs.current = [];
        }, 650);
      }
    } catch {
      // noop
    }
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      stopAmbientSound();
      setIsPlaying(false);
    } else {
      startAmbientSound();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      try {
        noiseSourceRef.current?.stop();
        oscillatorRefs.current.forEach((osc) => osc.stop());
        audioCtxRef.current?.close();
      } catch {
        // noop
      }
    };
  }, []);

  return (
    <Magnetic strength={0.18}>
      <button
        type="button"
        onClick={toggleSound}
        aria-label={isPlaying ? "Pause Courtyard Soundscape" : "Play Courtyard Ambiance"}
        className="pointer-events-auto flex items-center gap-4 rounded-full border border-white/60 bg-surface/90 px-6 py-3.5 text-primary shadow-2xl backdrop-blur-md transition-all duration-500 ease-editorial hover:scale-105 hover:bg-surface group"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-surface shadow transition-transform duration-500 ease-editorial group-hover:scale-105">
          {isPlaying ? (
            <PauseIcon className="h-5 w-5" />
          ) : (
            <PlayIcon className="h-5 w-5 translate-x-0.5" />
          )}
        </span>

      <div className="pr-2 text-left">
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${
              isPlaying ? "text-secondary" : "text-on-surface-variant"
            }`}
          >
            {isPlaying ? "Courtyard Soundscape Active" : "Live Soundscape"}
          </span>
          <div
            className={`flex h-3.5 items-end gap-[3px] ${
              isPlaying ? "" : "eq-paused"
            }`}
            aria-hidden="true"
          >
            <span className="eq-bar-1 h-1 w-[3px] rounded-full bg-secondary" />
            <span className="eq-bar-2 h-2.5 w-[3px] rounded-full bg-secondary" />
            <span className="eq-bar-3 h-2 w-[3px] rounded-full bg-secondary" />
            <span className="eq-bar-4 h-3.5 w-[3px] rounded-full bg-secondary" />
          </div>
        </div>

        <span className="block font-serif text-base font-semibold text-primary">
          {isPlaying ? (
            <>
              Playing: Olive Breeze &amp; Water Rills{" "}
              <span className="font-sans text-xs font-normal text-on-surface-variant">
                (Live)
              </span>
            </>
          ) : (
            <>
              Play Courtyard Ambiance{" "}
              <span className="font-sans text-xs font-normal text-on-surface-variant">
                (01:45)
              </span>
            </>
          )}
        </span>
      </div>
    </button>
  </Magnetic>
  );
}
