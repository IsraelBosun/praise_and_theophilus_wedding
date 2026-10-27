import Image from "next/image";
import { Shirt } from "lucide-react";
import { wedding } from "@/lib/wedding";
import { Reveal } from "./Reveal";

export function DressCode() {
  const { dressCode } = wedding;

  return (
    <section id="dress-code" className="wash border-t border-gold/15 px-7 py-20 text-center">
      <Reveal>
        <Shirt className="mx-auto text-gold" size={34} strokeWidth={1} />
        <h2 className="heading mt-4 text-[1.35rem] text-gold-deep">{dressCode.heading}</h2>
        <p className="mx-auto mt-3 max-w-[30ch] font-serif text-[1.05rem] italic text-ink-soft">{dressCode.intro}</p>

        <ul className="stagger pop-in mt-8 flex justify-center gap-6">
          {dressCode.colours.map((c) => (
            <li key={c.name} className="flex w-20 flex-col items-center">
              <span className="h-11 w-11 rounded-full border border-gold/40 shadow-inner" style={{ backgroundColor: c.hex }} />
              <span className="eyebrow mt-2 text-[0.55rem] leading-relaxed tracking-[0.14em] text-ink">{c.name}</span>
            </li>
          ))}
        </ul>

        <div className="settle relative mx-auto mt-10 aspect-[1686/1799] w-full overflow-hidden rounded-[28px] shadow-md">
          <Image src={dressCode.image} alt={dressCode.imageAlt} fill sizes="(max-width: 480px) 90vw, 430px" className="object-cover" />
        </div>
      </Reveal>
    </section>
  );
}
