"use client";

import { useEffect, useRef, useState } from "react";
import type { ScheduleItem } from "@/lib/wedding";
import { Peony } from "./Ornaments";
import { ScheduleIcon } from "./ScheduleIcons";

/**
 * The order of the day on a centre rail, after t-wedding's: entries alternate
 * sides, icon opposite text. It moves in steps rather than continuously. The
 * peony waits on the first stop and, as each next stop reaches the middle of
 * the screen, glides to it and settles, drawing the gold line behind it.
 */
export function Timeline({
  items,
  venueName,
}: {
  items: ScheduleItem[];
  venueName: Record<string, string>;
}) {
  const root = useRef<HTMLOListElement>(null);
  const nodes = useRef<(HTMLSpanElement | null)[]>([]);
  const [step, setStep] = useState(-1);
  const [stops, setStops] = useState<number[]>([]);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const el = root.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      const centres = nodes.current.map((n) => {
        if (!n) return 0;
        const r = n.getBoundingClientRect();
        return r.top + r.height / 2 - top;
      });
      setStops((prev) => (prev.length === centres.length && prev.every((v, i) => Math.abs(v - centres[i]) < 1) ? prev : centres));

      // A stop is reached once its node passes 55% of the screen. The first is
      // claimed as soon as the rail itself is on screen, so the peony has a home.
      const line = window.innerHeight * 0.55;
      let reached = top < window.innerHeight * 0.85 ? 0 : -1;
      centres.forEach((c, i) => {
        if (top + c <= line) reached = Math.max(reached, i);
      });
      setStep(reached);
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

  const at = step >= 0 && stops[step] !== undefined ? stops[step] : null;

  return (
    <ol ref={root} className="relative mx-auto mt-12 max-w-[400px] py-10">
      {/* The rail: a faint track, and the gold drawn over it up to the current stop. */}
      <span aria-hidden className="absolute top-2 bottom-2 left-1/2 w-px -translate-x-1/2 bg-gold/25" />
      <span
        aria-hidden
        className="absolute top-2 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-gold-light via-gold to-herbal transition-[height] duration-[1100ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
        style={{ height: at === null ? 0 : Math.max(0, at - 8) }}
      />
      {/* Capped at both ends, so the line reads as an ornament rather than a scrollbar. */}
      <span aria-hidden className="absolute top-0 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border border-gold bg-champagne" />
      <span aria-hidden className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border border-gold bg-champagne" />

      {/* The peony, stepping from stop to stop with a quarter turn each time. */}
      <span
        aria-hidden
        className="absolute left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transition-[top,opacity] duration-[1100ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
        style={{ top: at ?? 0, opacity: at === null ? 0 : 1 }}
      >
        <span
          className="block transition-transform duration-[1100ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
          style={{ transform: `rotate(${Math.max(0, step) * 72}deg)` }}
        >
          <Peony className="w-11 drop-shadow-[0_4px_10px_rgb(75_21_38/0.3)]" />
        </span>
      </span>

      {items.map((item, i) => {
        const flip = i % 2 === 1;
        const lit = i <= step;
        const icon = (
          <span
            className={`flex h-16 w-16 items-center justify-center rounded-full border bg-paper/70 transition-all duration-700 ${
              lit ? "border-herbal/50 text-gold-deep shadow-[0_0_0_5px_rgb(226_210_182/0.6)]" : "border-gold/30 text-gold"
            }`}
          >
            <ScheduleIcon name={item.icon} className="h-11 w-11" />
          </span>
        );
        const text = (
          <div className={flip ? "text-right" : "text-left"}>
            <p className="font-serif text-[1.3rem] leading-none font-semibold text-ink">{item.time}</p>
            <p className="heading mt-1.5 text-[0.72rem] leading-snug text-wine">{item.title}</p>
            <p className="mt-1 font-serif text-[0.9rem] leading-snug italic text-ink-soft">{item.note}</p>
            <p className="mt-0.5 font-serif text-[0.85rem] leading-snug text-herbal-deep">{venueName[item.venueId]}</p>
          </div>
        );
        // Each side slides in from its own edge as the peony arrives.
        const enter = (from: "left" | "right") =>
          `transition-all duration-700 ease-out ${
            lit ? "translate-x-0 opacity-100" : `${from === "left" ? "-translate-x-4" : "translate-x-4"} opacity-35`
          }`;

        return (
          <li key={item.title} className="relative grid grid-cols-[1fr_40px_1fr] items-center pb-14 last:pb-0">
            <div className={`flex justify-end pr-2 ${enter("left")}`}>{flip ? text : icon}</div>

            {/* The node on the rail; it fills when reached. */}
            <span className="flex justify-center">
              <span
                ref={(el) => {
                  nodes.current[i] = el;
                }}
                aria-hidden
                className={`flex h-3.5 w-3.5 rotate-45 items-center justify-center border transition-colors duration-500 ${
                  lit ? "border-herbal bg-champagne" : "border-gold/60 bg-paper"
                }`}
              >
                <span className={`h-1.5 w-1.5 transition-colors duration-500 ${lit ? "bg-herbal" : "bg-gold/40"}`} />
              </span>
            </span>

            <div className={`flex justify-start pl-2 ${enter("right")}`}>{flip ? icon : text}</div>
          </li>
        );
      })}
    </ol>
  );
}
