import type { CSSProperties } from "react";
import { wedding } from "@/lib/wedding";
import { Floral, Heart, Monogram } from "./Ornaments";

/** A name set the way the card sets it: a flourished script capital, then caps. */
function CardName({ name, base }: { name: string; base: string }) {
  return (
    <span className="flex items-baseline justify-center">
      <span className="shimmer flex items-baseline" style={{ "--base": base } as CSSProperties}>
        <span className="font-script text-[6.3rem] leading-[0.8] sm:text-[7.2rem]">{name[0]}</span>
        <span className="heading track-in -ml-2 text-[2.5rem] tracking-[0.08em] sm:text-[3rem]">
          {name.slice(1).toUpperCase()}
        </span>
      </span>
    </span>
  );
}

export function Hero() {
  const { bride, groom, dateParts } = wedding;

  return (
    <section id="top" className="butter relative overflow-hidden px-6 pt-28 pb-20 text-center text-gold-deep">
      {/* The updated card's autumn spray, kept small in the top-right corner so it clears the monogram. */}
      <Floral name="autumn-corner" className="absolute -top-2 -right-2 w-32" />
      <Floral name="corner-a" onPaper className="absolute -right-8 -bottom-10 w-44" />

      <div className="hero-in relative">
        <Monogram size={56} className="text-gold-deep" />

        <p className="eyebrow mt-8 text-herbal-deep">We are getting married</p>

        <h1 className="mt-6">
          <CardName name={bride.name} base="var(--color-gold-deep)" />
          <span className="block font-script text-[2.2rem] leading-none text-tan">and</span>
          <CardName name={groom.name} base="var(--color-gold-deep)" />
        </h1>

        {/* Wrapped so the beat and the entrance animate different elements. */}
        <div className="mt-6">
          <Heart className="beat mx-auto block text-tan" />
        </div>

        {/* The card's date line: weekday | big day | month and year. */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <span className="heading border-y border-gold/50 px-2 py-1 text-[0.8rem]">{dateParts.weekday}</span>
          <span className="font-serif text-[3rem] leading-none font-medium text-ink">{dateParts.day}</span>
          <span className="heading border-y border-gold/50 px-2 py-1 text-[0.8rem]">
            {dateParts.month}, {dateParts.year}
          </span>
        </div>

        <p className="mt-6 font-serif text-[1.05rem] italic text-ink-soft">Gwagwalada, Abuja</p>
      </div>

      {/* A hairline swoosh across the foot of the hero, as in the reference. */}
      <svg aria-hidden viewBox="0 0 400 40" className="absolute inset-x-0 bottom-3 w-full text-gold/50" fill="none">
        <path d="M0 30 C 80 10 140 38 220 22 C 290 8 340 26 400 12" stroke="currentColor" strokeWidth="0.8" />
      </svg>
    </section>
  );
}
