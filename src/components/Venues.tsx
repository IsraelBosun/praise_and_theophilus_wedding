import { MapPin } from "lucide-react";
import { wedding } from "@/lib/wedding";
import { Reveal } from "./Reveal";

const directions = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

export function Venues() {
  return (
    <section id="venues" className="wash border-t border-gold/15 px-8 py-20 text-center">
      <Reveal>
        <h2 className="heading text-[1.35rem] leading-snug text-gold-deep">
          Where we
          <br />
          celebrate
        </h2>

        <div className="mt-10 space-y-12">
          {wedding.venues.map((venue) => (
            <div key={venue.id}>
              <MapPin className="mx-auto text-herbal-deep" size={26} strokeWidth={1.2} />
              <p className="eyebrow mt-3 text-[0.62rem] text-herbal-deep">{venue.label}</p>
              <p className="mt-2 font-serif text-[1.35rem] font-semibold text-ink">{venue.name}</p>
              <p className="mt-1 font-serif text-[1rem] leading-relaxed text-ink-soft">
                {venue.address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
              <a
                href={directions(venue.mapsQuery)}
                target="_blank"
                rel="noopener"
                className="shine eyebrow mt-5 inline-block rounded-sm bg-gold px-5 py-2.5 text-[0.62rem] text-paper transition-colors hover:bg-gold-deep"
              >
                Get directions
              </a>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
