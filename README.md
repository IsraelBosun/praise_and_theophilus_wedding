# Praise & Theophilus

The wedding website for Praise and Theophilus, Saturday 5 December 2026, Gwagwalada, Abuja.

A single-page invitation in the couple's colours of the day: vintage wine, champagne gold and herbal green. It is laid out as one phone-width column, and on a desktop it sits centred on a wine background like a card on a table.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000. If that port is taken, run `npx next dev -p 3002` and open that port instead.

```bash
npm run build   # production build
npm run lint
```

## Changing the content

Every piece of wording, every time, venue and phone number lives in one file: [`src/lib/wedding.ts`](src/lib/wedding.ts). Edit it there and every section picks it up.

Some blocks are optional and hidden while empty:

| Block | Shows when |
| --- | --- |
| `story` | set to `{ photo, paragraphs }`. The photo is cut to a heart. |
| `gallery` | given a list of image paths under `public/` |
| `gifts.account` | given `{ bank, name, number }`. Adds a copy button. |

Images live in `public/invitation/images/`:

- `invitation-card.jpg` is the printed card, opened by "View the invitation card" and used as the link preview image.
- `attire.jpg` is the colours-of-the-day photograph, cropped from page 2 of the card.

## Sections

In page order ([`src/app/page.tsx`](src/app/page.tsx)):

1. **Hero**: monogram, names set the way the card sets them, and the date line.
2. **Invitation**: the families and the formal wording.
3. **Save the date**: the December 2026 calendar with the day marked.
4. **Order of the day**: traditional, church and reception. The timeline fills as you scroll.
5. **Venues**: each with a Google Maps directions link.
6. **Our story** and **Gallery**: hidden until content is added.
7. **Countdown** to 8:30 AM WAT.
8. **Colours of the day**: swatches and the attire photograph.
9. **Gifts**.
10. **RSVP**: there is no backend. The form composes a WhatsApp message to Jude or Esther, and both numbers are also listed to call.
11. **Wishes**, then the closing and footer.

## How it is built

- Next.js 16 (App Router, Cache Components) with React 19 and TypeScript.
- Tailwind CSS v4. The palette and fonts are theme tokens in [`src/app/globals.css`](src/app/globals.css).
- Fonts: Cormorant Garamond for text and headings, Pinyon Script for the names.
- Icons: hand-drawn SVG line art in [`src/components/Ornaments.tsx`](src/components/Ornaments.tsx) and [`src/components/ScheduleIcons.tsx`](src/components/ScheduleIcons.tsx), plus a few from `lucide-react`.
- Vercel Analytics in the root layout.

### Colour roles

- **Vintage wine** carries the page: dark sections, names, primary buttons.
- **Champagne gold** is for soft bands and light accents.
- **Herbal green** is for small accents only: leaves, timeline dots, map pins, small labels. Text uses the deepened `herbal-deep` so it stays readable.

### Motion

The animations are plain CSS. One observer ([`src/components/Animator.tsx`](src/components/Animator.tsx)) adds `is-visible` to any element marked `data-inview` as it scrolls into view, and the stylesheet does the rest. That keeps nearly every section a server component.

- The opening curtain and the hero entrance play on load. `--intro` sets their timing.
- Florals and schedule icons draw themselves stroke by stroke.
- Section content rises in one element at a time.
- The order-of-the-day line follows the scroll position ([`src/components/Timeline.tsx`](src/components/Timeline.tsx)).

Hidden starting states only apply under the `js` class, which an inline script sets before first paint, so nothing stays hidden without JavaScript. Everything is switched off for visitors who ask for reduced motion.

## Deploying

The site is built for Vercel. Import the repository, deploy, then enable Analytics in the project's Analytics tab so visits are recorded.
