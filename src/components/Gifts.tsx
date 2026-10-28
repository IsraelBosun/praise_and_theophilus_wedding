"use client";

import { useState } from "react";
import { Gift } from "lucide-react";
import { wedding } from "@/lib/wedding";
import { Heart } from "./Ornaments";
import { Reveal } from "./Reveal";

export function Gifts() {
  const { gifts } = wedding;
  // The number last copied, so only its button says "Copied".
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied((c) => (c === text ? null : c)), 2000);
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

        <div className="mt-8 space-y-5">
          {gifts.accounts.map((account) => (
            <div key={account.number} className="mx-auto max-w-[300px] border border-tan/50 bg-champagne/30 px-5 py-5">
              <p className="heading text-[0.8rem] text-gold-deep">{account.label}</p>
              {account.bank && <p className="eyebrow mt-2 text-[0.6rem] text-ink-soft">{account.bank}</p>}
              <p className="mt-2 font-serif text-[1.6rem] tracking-[0.12em] text-ink tabular-nums">{account.number}</p>
              <p className="mt-1 font-serif text-[1rem] text-ink-soft">{account.name}</p>
              <button
                type="button"
                onClick={() => copy(account.number)}
                className="shine eyebrow mt-4 border border-gold/60 px-4 py-2 text-[0.6rem] text-gold-deep transition-colors hover:bg-gold hover:text-paper"
              >
                {copied === account.number ? "Copied" : "Copy account number"}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Heart className="beat mx-auto block text-gold" />
        </div>
      </Reveal>
    </section>
  );
}
