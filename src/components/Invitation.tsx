import { wedding } from "@/lib/wedding";
import { Divider, Floral } from "./Ornaments";
import { Reveal } from "./Reveal";

export function Invitation() {
  const { families, bride, groom } = wedding;

  return (
    <section id="invitation" className="wash relative overflow-hidden px-8 py-20 text-center">
      <Floral name="spray-wide" onPaper flipY className="absolute -top-6 -right-16 w-60" />
      <Reveal>
        <p className="font-serif text-[1.05rem] italic text-ink-soft">{families.lead}</p>
        <ul className="mt-4 space-y-2">
          {families.names.map((name) => (
            <li key={name} className="font-serif text-[1.3rem] leading-snug font-semibold text-wine">
              {name}
            </li>
          ))}
        </ul>

        <div className="mt-6 space-y-1 font-serif text-[1.1rem] text-ink">
          {families.invite.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        <p className="mt-6 font-script text-[2.6rem] leading-tight text-gold-deep">
          {bride.name} &amp; {groom.name}
        </p>

        <Divider className="mt-8 text-gold" />

        <a
          href={families.card}
          target="_blank"
          rel="noopener"
          className="shine shine-auto eyebrow mt-8 inline-block border border-gold/60 px-5 py-2.5 text-gold-deep transition-colors hover:bg-gold hover:text-paper"
        >
          View the invitation card
        </a>
      </Reveal>
    </section>
  );
}
