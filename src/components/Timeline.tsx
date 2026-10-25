"use client";

import { useEffect, useRef, useState } from "react";
import type { ScheduleItem } from "@/lib/wedding";
import { ScheduleIcon } from "./ScheduleIcons";

/**
 * The order of the day, tied to the scroll. A gold line fills down the axis
 * as the reader moves through it, with a glowing bead at its tip, and each
 * stop lights up as the bead reaches its dot.
 */
export function Timeline({
  items,
  venueName,
}: {
  items: ScheduleItem[];
  venueName: Record<string, string>;
}) {
  const root = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const bead = useRef<HTMLSpanElement>(null);
  const dots = useRef<(HTMLSpanElement | null)[]>([]);
  const [reached, setReached] = useState(-1);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const el = root.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // The line is full once the section's foot passes 60% of the screen.
      const line = window.innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, (line - rect.top) / rect.height));

      // Written straight to the elements so scrolling never re-renders for them.
      if (fill.current) fill.current.style.transform = `scaleY(${p})`;
      if (bead.current) {
        bead.current.style.top = `${p * 100}%`;
        bead.current.style.opacity = p > 0 && p < 1 ? "1" : "0";
      }

      // Measured against the whole timeline, since each dot sits inside its own row.
      const tip = rect.top + p * rect.height;
      let count = -1;
      dots.current.forEach((dot, i) => {
        if (!dot) return;
        const d = dot.getBoundingClientRect();
        if (d.top + d.height / 2 <= tip + 1) count = i;
      });
      setReached(count);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={root} className="relative mx-auto mt-12 max-w-[330px]">
      {/* The axis: a faint track, the gold fill over it and the bead at its tip. */}
      <span aria-hidden className="absolute top-0 bottom-0 left-[76px] w-px bg-gold/25" />
      <span
        ref={fill}
        aria-hidden
        className="absolute top-0 bottom-0 left-[76px] w-px origin-top scale-y-0 bg-gradient-to-b from-gold-light via-gold to-herbal"
      />
      <span
        ref={bead}
        aria-hidden
        className="absolute left-[76px] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-light opacity-0 shadow-[0_0_10px_3px_rgb(217_191_148/0.8)] transition-opacity duration-300"
        style={{ top: 0 }}
      />

      <ol className="stagger">
        {items.map((item, i) => {
          const lit = i <= reached;
          return (
            <li key={item.title} className="relative flex items-start pb-12 last:pb-0">
              <span
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border bg-paper/70 transition-all duration-700 ${
                  lit ? "scale-105 border-herbal/60 text-gold-deep shadow-[0_0_0_4px_rgb(226_210_182/0.6)]" : "border-gold/30 text-gold"
                }`}
              >
                <ScheduleIcon name={item.icon} className="h-10 w-10" />
              </span>

              <span
                ref={(el) => {
                  dots.current[i] = el;
                }}
                aria-hidden
                className={`absolute top-[22px] left-[76px] h-3 w-3 -translate-x-1/2 rounded-full border transition-all duration-500 ${
                  lit
                    ? "scale-110 border-herbal bg-herbal shadow-[0_0_0_4px_rgb(226_210_182/0.7)]"
                    : "border-gold/60 bg-paper"
                }`}
              />

              <div className={`pl-11 pt-2 transition-all duration-700 ${lit ? "opacity-100" : "translate-x-1 opacity-45"}`}>
                <p className="font-serif text-[1.35rem] leading-none font-semibold text-ink">{item.time}</p>
                <p className="heading mt-1.5 text-[0.8rem] text-wine">{item.title}</p>
                <p className="mt-1 font-serif text-[0.95rem] italic text-ink-soft">{item.note}</p>
                <p className="mt-0.5 font-serif text-[0.9rem] text-herbal-deep">{venueName[item.venueId]}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
