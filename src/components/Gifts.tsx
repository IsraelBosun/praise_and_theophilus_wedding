"use client";

import { useState } from "react";
import { Gift } from "lucide-react";
import { wedding } from "@/lib/wedding";
import { Heart } from "./Ornaments";
import { Reveal } from "./Reveal";

export function Gifts() {
  const { gifts } = wedding;
  const [copied, setCopied] = useState(false);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the number is on screen to copy by hand.
    }
  };

  return (
    <section id="gifts" className="wash border-t border-gold/15 px-8 py-20 text-center">
      <Reveal>
        <Gift className="mx-auto text-gold" size={34} strokeWidth={1} />
        <h2 className="heading mt-4 text-[1.35rem] text-gold-deep">{gifts.heading}</h2>
        <div className="mx-auto mt-4 max-w-[32ch] space-y-2 font-serif text-[1.08rem] leading-relaxed text-ink">
          {gifts.body.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        {gifts.account && (
          <div className="mx-auto mt-8 max-w-[300px] border border-gold/50 bg-champagne/30 px-5 py-5">
            <p className="eyebrow text-[0.6rem] text-ink-soft">{gifts.account.bank}</p>
            <p className="mt-2 font-serif text-[1.6rem] tracking-[0.12em] text-ink tabular-nums">{gifts.account.number}</p>
            <p className="mt-1 font-serif text-[1rem] text-ink-soft">{gifts.account.name}</p>
            <button
              type="button"
              onClick={() => copy(gifts.account!.number)}
              className="shine eyebrow mt-4 border border-gold/60 px-4 py-2 text-[0.6rem] text-gold-deep transition-colors hover:bg-gold hover:text-paper"
            >
              {copied ? "Copied" : "Copy account number"}
            </button>
          </div>
        )}

        <div className="mt-8">
          <Heart className="beat mx-auto block text-gold" />
        </div>
      </Reveal>
    </section>
  );
}
