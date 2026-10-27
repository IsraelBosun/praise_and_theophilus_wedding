"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { wedding } from "@/lib/wedding";

const VOLUME = 0.32;

/**
 * The background song, after t-wedding's player. It plays on page load
 * wherever the browser allows it. Most browsers, phones above all, refuse
 * sound until the visitor has interacted, and no site can override that, so
 * when refused it starts on their first touch, click or key press anywhere.
 * Once they pause it by hand, nothing but the button starts it again.
 *
 * If the file fails to load, the button hides itself rather than showing a
 * dead control.
 */
export function Music() {
  const { src, title } = wedding.music;
  const audio = useRef<HTMLAudioElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const pausedByUser = useRef(false);
  // The file is assumed present; a load error hides the button.
  const [available, setAvailable] = useState(true);
  const [playing, setPlaying] = useState(false);

  /** Resolves true once the song is actually playing, false if the browser refused. */
  const play = useCallback(async () => {
    const el = audio.current;
    if (!el) return false;
    if (!el.paused) return true;
    el.volume = VOLUME;
    try {
      await el.play();
      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    const el = audio.current;
    if (!el) return;
    el.volume = VOLUME;

    // The <audio autoPlay> in the server HTML has usually tried already. Try
    // again now in case it was waiting on data, and once more when the song
    // can play. Browsers that allow autoplay will start here.
    play();
    const onReady = () => {
      if (!pausedByUser.current) play();
    };
    el.addEventListener("canplay", onReady, { once: true });

    // A load error before hydration would be missed by onError, so check it here too.
    const frame = requestAnimationFrame(() => {
      if (el.error) setAvailable(false);
    });

    // Browsers that refuse autoplay allow it on the visitor's first touch,
    // click or key press, so the song starts then without hunting for the
    // button. Only these events count as permission; on a touch screen it is
    // the finger lifting (pointerup, touchend), so the landing ones alone
    // would leave phones silent. Listening stops once a play succeeds.
    const events = ["pointerdown", "pointerup", "mousedown", "touchstart", "touchend", "click", "keydown"] as const;
    const onGesture = (e: Event) => {
      // The button handles its own taps, or the first one would play then pause.
      if (button.current?.contains(e.target as Node)) return;
      if (pausedByUser.current) return remove();
      play().then((ok) => ok && remove());
    };
    const remove = () => events.forEach((name) => window.removeEventListener(name, onGesture, true));
    // Capture phase, so a tap on a link or button still counts before anything else handles it.
    events.forEach((name) => window.addEventListener(name, onGesture, { capture: true, passive: true }));

    return () => {
      remove();
      el.removeEventListener("canplay", onReady);
      cancelAnimationFrame(frame);
    };
  }, [play]);

  const toggle = () => {
    const el = audio.current;
    if (!el) return;
    if (el.paused) {
      pausedByUser.current = false;
      play();
    } else {
      pausedByUser.current = true;
      el.pause();
    }
  };

  return (
    <>
      {/* The element reports its own state, so the button never shows "playing" over silence. */}
      <audio
        ref={audio}
        src={src}
        autoPlay
        loop
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setAvailable(false)}
      />
      {available && (
        <button
          ref={button}
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause music" : "Play music"}
          aria-pressed={playing}
          title={`${title} · ${playing ? "Pause" : "Play"}`}
          // Pinned to the column's right edge on wide screens, the screen's on phones.
          className="nav-in fixed right-[max(1rem,calc(50vw-240px+1rem))] bottom-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-gold/60 bg-wine text-gold-light shadow-[0_6px_20px_rgb(46_24_16/0.4)] transition-colors hover:bg-wine-soft"
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
