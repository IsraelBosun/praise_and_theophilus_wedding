import Image from "next/image";
import { wedding } from "@/lib/wedding";
import { Heart } from "./Ornaments";
import { Reveal } from "./Reveal";

/** Our Story, with the photograph cut to a heart. Hidden until `story` is filled in. */
export function Story() {
  const { story } = wedding;
  if (!story) return null;

  return (
    <section id="story" className="wash border-t border-gold/15 px-8 py-20 text-center">
      <Reveal>
        <h2 className="heading text-[1.35rem] text-gold-deep">Our Story</h2>
        {story.photo && (
          <div className="heart-mask relative mx-auto mt-8 h-[270px] w-[300px] scale-[0.85]">
            <Image src={story.photo} alt={`${wedding.bride.name} and ${wedding.groom.name}`} fill sizes="300px" className="object-cover" />
          </div>
        )}
        <div className="mx-auto mt-6 max-w-[32ch] space-y-4 font-serif text-[1.08rem] leading-relaxed text-ink">
          {story.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <Heart className="mx-auto mt-6 text-gold" />
      </Reveal>
    </section>
  );
}

/** Two-up grid with a wide last frame when the count is odd. Hidden while empty. */
export function Gallery() {
  const photos = wedding.gallery;
  if (photos.length === 0) return null;

  return (
    <section id="gallery" className="wash border-t border-gold/15 px-6 py-20 text-center">
      <Reveal>
        <h2 className="heading text-[1.35rem] text-gold-deep">Gallery</h2>
        <div className="mt-8 grid grid-cols-2 gap-2">
          {photos.map((src, i) => {
            const wide = photos.length % 2 === 1 && i === photos.length - 1;
            return (
              <div key={src} className={`relative overflow-hidden ${wide ? "col-span-2 aspect-[2/1]" : "aspect-[4/5]"}`}>
                <Image src={src} alt="" fill sizes="(max-width: 480px) 50vw, 240px" className="object-cover" />
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
