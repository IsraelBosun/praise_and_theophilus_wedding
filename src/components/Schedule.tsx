import { wedding } from "@/lib/wedding";
import { Heart } from "./Ornaments";
import { Reveal } from "./Reveal";
import { Timeline } from "./Timeline";

export function Schedule() {
  const venueName = Object.fromEntries(wedding.venues.map((v) => [v.id, v.name]));

  return (
    <section id="schedule" className="border-t border-gold/15 bg-champagne/35 px-6 py-20">
      <Reveal>
        <h2 className="heading text-center text-[1.35rem] text-gold-deep">Order of the Day</h2>

        <Timeline items={wedding.schedule} venueName={venueName} />

        <p className="mx-auto mt-14 max-w-[26ch] text-center font-serif text-[1.05rem] italic leading-relaxed text-ink-soft">
          Love is patient, love is kind. It always protects, always trusts, always hopes.
        </p>
        <div className="mt-4">
          <Heart className="beat mx-auto block text-gold" />
        </div>
      </Reveal>
    </section>
  );
}
