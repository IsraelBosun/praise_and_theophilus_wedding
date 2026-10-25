"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { wedding } from "@/lib/wedding";

const VOLUME = 0.32;

/**
 * The background song, after t-wedding's player. Browsers refuse to play audio
 * before the visitor has interacted, so it starts on their first tap or key
 * press anywhere on the page. Once they pause it by hand, nothing but the
 * button starts it again.
 *
 * The button stays hidden until the file is confirmed to exist, so the page
 * shows no dead control before the MP3 has been added.
 */
export function Music() {
  const { src, title } = wedding.music;
  const audio = useRef<HTMLAudioElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const pausedByUser = useRef(false);
  const [available, setAvailable] = useState(false);
  const [playing, setPlaying] = useState(false);

  const play = useCallback(() => {
    const el = audio.current;
    if (!el || !el.paused) return;
    el.volume = VOLUME;
    el.play().then(
      () => setPlaying(true),
      () => setPlaying(false),
    );
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(src, { method: "HEAD" })
      .then((res) => !cancelled && setAvailable(res.ok))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [src]);

  useEffect(() => {
    if (!available) return;
    const onFirstGesture = (e: Event) => {
      // The button handles its own taps, or the first one would play then pause.
      if (button.current?.contains(e.target as Node)) return;
      if (!pausedByUser.current) play();
      remove();
    };
    const remove = () => {
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("keydown", onFirstGesture);
    };
    window.addEventListener("pointerdown", onFirstGesture);
    window.addEventListener("keydown", onFirstGesture);
    return remove;
  }, [available, play]);

  const toggle = () => {
    const el = audio.current;
    if (!el) return;
    if (el.paused) {
      pausedByUser.current = false;
      play();
    } else {
      pausedByUser.current = true;
      el.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      <audio ref={audio} src={available ? src : undefined} loop preload="none" />
      {available && (
        <button
          ref={button}
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause music" : "Play music"}
          aria-pressed={playing}
          title={`${title} · ${playing ? "Pause" : "Play"}`}
          // Pinned to the column's right edge on wide screens, the screen's on phones.
          className="nav-in fixed right-[max(1rem,calc(50vw-240px+1rem))] bottom-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-gold/60 bg-wine text-gold-light shadow-[0_6px_20px_rgb(58_15_29/0.4)] transition-colors hover:bg-wine-soft"
        >
          {/* Soft rings ripple out while the song plays. */}
          {playing && (
            <>
              <span aria-hidden className="music-ring absolute inset-0 rounded-full border border-gold/50" />
              <span aria-hidden className="music-ring absolute inset-0 rounded-full border border-gold/50 [animation-delay:1.2s]" />
            </>
          )}
          {playing ? (
            <svg viewBox="0 0 24 24" aria-hidden className="h-[18px] w-[18px]" fill="currentColor">
              <rect x="7" y="4.5" width="3.4" height="15" rx="1.2" />
              <rect x="13.6" y="4.5" width="3.4" height="15" rx="1.2" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden className="h-[18px] w-[18px] translate-x-px" fill="currentColor">
              <path d="M8 4.8a1 1 0 0 1 1.52-.85l10 7.2a1 1 0 0 1 0 1.7l-10 7.2A1 1 0 0 1 8 19.2Z" />
            </svg>
          )}
        </button>
      )}
    </>
  );
}
