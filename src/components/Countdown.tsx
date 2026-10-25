"use client";

import { useSyncExternalStore } from "react";
import { wedding } from "@/lib/wedding";
import { Floral } from "./Ornaments";

// The wall clock is read only in the browser. The server snapshot is null, so
// prerendering never calls Date.now() and hydration starts from dashes.
function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 1000);
  return () => clearInterval(id);
}
const getSecond = () => Math.floor(Date.now() / 1000);
const getServerSecond = () => null;

const TARGET = Math.floor(new Date(wedding.date).getTime() / 1000);

function Unit({ value, label }: { value: number | null; label: string }) {
  return (
    <div className="flex flex-1 flex-col items-center">
      {/* Re-keyed on every change, so the new digit plays its slide-in. */}
      <span className="h-[2.6rem] overflow-hidden font-serif text-[2.6rem] leading-none font-medium tabular-nums">
        <span key={value ?? "x"} className={value === null ? "" : "tick"}>
          {value === null ? "--" : value.toString().padStart(2, "0")}
        </span>
      </span>
      <span className="eyebrow mt-2 text-[0.55rem] text-champagne">{label}</span>
    </div>
  );
}

export function Countdown() {
  const now = useSyncExternalStore(subscribe, getSecond, getServerSecond);
  const left = now === null ? null : Math.max(0, TARGET - now);

  const part = (size: number, mod?: number) =>
    left === null ? null : mod ? Math.floor(left / size) % mod : Math.floor(left / size);

  return (
    <section className="dust relative overflow-hidden px-6 py-20 text-center text-gold-light">
      <Floral name="corner-a" flipY className="absolute -top-14 -right-16 w-56" />
      <p className="eyebrow text-sage">Counting down</p>
      <h2 className="mt-3 font-script text-[2.8rem] leading-tight">to forever</h2>

      <div className="mx-auto mt-10 flex max-w-[340px] divide-x divide-gold/30">
        <Unit value={part(86400)} label="Days" />
        <Unit value={part(3600, 24)} label="Hours" />
        <Unit value={part(60, 60)} label="Minutes" />
        <Unit value={part(1, 60)} label="Seconds" />
      </div>
    </section>
  );
}
