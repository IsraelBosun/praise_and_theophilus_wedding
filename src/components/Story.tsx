import Image from "next/image";
import { wedding } from "@/lib/wedding";
import { Heart, Peony } from "./Ornaments";
import { Reveal } from "./Reveal";

// The heart, in a 300x270 box. Used for both the clip and the gold outline.
const HEART =
  "M150 270 C 60 205 0 150 0 85 C 0 35 40 0 85 0 C 115 0 138 18 150 42 C 162 18 185 0 215 0 C 260 0 300 35 300 85 C 300 150 240 205 150 270 Z";

/** Our Story, with the photograph cut to a heart. Hidden while `story` is null. */
export function Story() {
  const { story } = wedding;
  if (!story) return null;

  return (
    <section id="story" className="wash border-t border-gold/15 px-8 py-20 text-center">
      <Reveal>
        <h2 className="heading text-[1.35rem] text-gold-deep">Our Story</h2>

        {story.photo && (
          // A gold outline traces itself around the heart as the photo settles in.
          // The outline's viewBox is the heart plus a 12-unit margin, and the
          // photo box is placed at exactly that margin, so the two line up at any width.
          <div className="settle relative mx-auto mt-8 aspect-[324/294] w-full max-w-[300px]">
            <svg width="0" height="0" aria-hidden className="absolute">
              <clipPath id="heart-clip" clipPathUnits="objectBoundingBox">
                <path d={HEART} transform="scale(0.0033333 0.0037037)" />
              </clipPath>
            </svg>
            <div
              className="absolute overflow-hidden"
              style={{ left: "3.7%", top: "4.08%", width: "92.6%", height: "91.84%", clipPath: "url(#heart-clip)" }}
            >
              <Image src={story.photo} alt={story.photoAlt} fill sizes="300px" className="object-cover" />
            </div>
            <svg
              data-inview
              viewBox="-12 -12 324 294"
              aria-hidden
              className="draw absolute inset-0 h-full w-full text-gold"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path pathLength={1} d={HEART} />
            </svg>
            {/* Two peonies tucked against the heart, as a corsage. */}
            <span data-inview className="bloom absolute -bottom-2 left-[8%] w-16">
              <Peony className="w-full drop-shadow-[0_3px_8px_rgb(138_106_63/0.4)]" />
            </span>
            <span data-inview className="bloom absolute bottom-[14%] left-[1%] w-9">
              <Peony className="w-full rotate-45 drop-shadow-[0_2px_6px_rgb(138_106_63/0.4)]" />
            </span>
          </div>
        )}

        <div className="mx-auto mt-6 max-w-[32ch] space-y-2 font-serif text-[1.1rem] leading-relaxed text-ink">
          {story.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <div className="mt-6">
          <Heart className="beat mx-auto block text-gold" />
        </div>
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
        <div className="stagger mt-8 grid grid-cols-2 gap-2.5">
          {photos.map((photo, i) => {
            const wide = photos.length % 2 === 1 && i === photos.length - 1;
            return (
              <div
                key={photo.src}
                className={`group relative overflow-hidden rounded-sm shadow-sm ${wide ? "col-span-2 aspect-[2/1]" : "aspect-[4/5]"}`}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 480px) 50vw, 240px"
                  className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                />
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
