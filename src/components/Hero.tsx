import type { CSSProperties } from "react";
import { wedding } from "@/lib/wedding";
import { FloralSpray, Heart, Monogram } from "./Ornaments";

/** A name set the way the card sets it: a flourished script capital, then caps. */
function CardName({ name, base }: { name: string; base: string }) {
  return (
    <span className="flex items-baseline justify-center">
      <span className="shimmer flex items-baseline" style={{ "--base": base } as CSSProperties}>
        <span className="font-script text-[5.2rem] leading-[0.8] sm:text-[6rem]">{name[0]}</span>
        <span className="heading track-in -ml-2 text-[2.1rem] tracking-[0.08em] sm:text-[2.5rem]">
          {name.slice(1).toUpperCase()}
        </span>
      </span>
    </span>
  );
}

export function Hero() {
  const { bride, groom, dateParts } = wedding;

  return (
    <section id="top" className="dust relative overflow-hidden px-6 pt-28 pb-20 text-center text-gold-light">
      <FloralSpray className="absolute -top-6 -left-10 w-56 text-gold/50" flip />
      <FloralSpray className="absolute -right-12 -bottom-10 w-60 rotate-180 text-gold/40" flip />

      <div className="hero-in relative">
        <Monogram size={56} className="mx-auto block text-gold-light" />

        <p className="eyebrow mt-8 text-gold-light/80">We are getting married</p>

        <h1 className="mt-6">
          <CardName name={bride.name} base="var(--color-rose)" />
          <span className="block font-script text-[2.2rem] leading-none text-champagne">and</span>
          <CardName name={groom.name} base="var(--color-gold-light)" />
        </h1>

        {/* Wrapped so the beat and the entrance animate different elements. */}
        <div className="mt-6">
          <Heart className="beat mx-auto block text-gold" />
        </div>

        {/* The card's date line: weekday | big day | month and year. */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <span className="heading border-y border-champagne/50 px-2 py-1 text-[0.8rem]">{dateParts.weekday}</span>
          <span className="font-serif text-[3rem] leading-none font-medium">{dateParts.day}</span>
          <span className="heading border-y border-champagne/50 px-2 py-1 text-[0.8rem]">
            {dateParts.month}, {dateParts.year}
          </span>
        </div>

        <p className="mt-6 font-serif text-[1.05rem] italic text-gold-light/80">Gwagwalada, Abuja</p>
      </div>

      {/* A hairline swoosh across the foot of the hero, as in the reference. */}
      <svg aria-hidden viewBox="0 0 400 40" className="absolute inset-x-0 bottom-3 w-full text-gold/50" fill="none">
        <path d="M0 30 C 80 10 140 38 220 22 C 290 8 340 26 400 12" stroke="currentColor" strokeWidth="0.8" />
      </svg>
    </section>
  );
}
