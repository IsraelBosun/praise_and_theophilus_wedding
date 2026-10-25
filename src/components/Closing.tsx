import { ChevronUp } from "lucide-react";
import { wedding } from "@/lib/wedding";
import { Floral, Heart, Monogram } from "./Ornaments";

export function Wishes() {
  const { wishes, rsvp } = wedding;
  const href = `https://wa.me/${rsvp.phones[0].whatsapp}?text=${encodeURIComponent(wishes.message)}`;

  return (
    <section className="dust relative overflow-hidden px-8 py-20 text-center text-gold-light">
      <Floral name="corner-tall" flipY className="absolute -top-12 -left-16 w-52" />
      <h2 className="heading text-[1.3rem]">{wishes.heading}</h2>
      <p className="mx-auto mt-3 max-w-[28ch] font-serif text-[1.05rem] text-gold-light/85">{wishes.body}</p>
      <a
        href={href}
        target="_blank"
        rel="noopener"
        className="shine eyebrow mt-7 inline-block border border-gold/60 px-6 py-3 text-[0.62rem] transition-colors hover:bg-gold hover:text-wine"
      >
        Leave a wish
      </a>
      <div className="mt-12">
        <Monogram size={44} className="text-gold-light" />
      </div>
    </section>
  );
}

export function Closing() {
  const { closing, bride, groom, dateStamp } = wedding;

  return (
    <>
      <section className="wash relative overflow-hidden px-8 pt-20 pb-44 text-center">
        <h2 className="heading text-[1.35rem] text-gold-deep">{closing.heading}</h2>
        <p className="mx-auto mt-3 max-w-[26ch] font-serif text-[1.08rem] text-ink">{closing.body}</p>
        <Heart className="beat mx-auto mt-5 block text-gold" />
        <Floral name="corner-tall" onPaper className="absolute -bottom-6 -left-10 w-52" />
        <Floral name="bouquet" onPaper className="absolute -right-6 -bottom-10 w-40" />
      </section>

      <footer className="dust px-8 py-14 text-center text-gold-light">
        <p className="eyebrow text-[0.6rem] text-gold-light/80">{closing.signoff}</p>
        <p className="mt-2 font-script text-[2.4rem] leading-tight">
          {bride.name} &amp; {groom.name}
        </p>
        <Heart className="beat mx-auto mt-3 block text-gold" />
        <p className="mt-3 font-serif text-[1.1rem] tracking-[0.14em]">{dateStamp}</p>
        <a
          href="#top"
          aria-label="Back to top"
          className="mx-auto mt-6 flex h-10 w-10 items-center justify-center rounded-full border border-gold/60 transition-colors hover:bg-gold hover:text-wine"
        >
          <ChevronUp size={18} strokeWidth={1.3} />
        </a>
      </footer>
    </>
  );
}
