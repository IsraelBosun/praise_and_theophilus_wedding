# Praise & Theophilus

The wedding website for Praise and Theophilus, Saturday 5 December 2026, Gwagwalada, Abuja.

A single-page invitation in the couple's colours of the day: warm tan, herbal green and champagne gold, on the cream of the printed card with chocolate brown as the dark ground. It is laid out as one phone-width column, and on a desktop it sits centred on a chocolate background like a card on a table.

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

Some blocks are optional and hidden when emptied:

| Block | Shows when |
| --- | --- |
| `story` | not `null`. The photo is cut to a heart. |
| `gallery` | given a list of `{ src, alt }` under `public/` |
| `gifts.account` | given `{ bank, name, number }`. Adds a copy button. |

Images live in `public/invitation/images/`:

- `invitation-card.jpg` is the printed card, opened by "View the invitation card".
- `invitation-card.jpg` and `attire-full.jpg` come from the updated card, `You Are Invited2.pdf`: page 1, and the colours-of-the-day photograph cropped from page 2.
- `story-heart.jpg` is cropped so both faces sit inside the heart. `gallery-*.jpg` are the gallery photos.

The florals in `public/invitation/ornaments/` are WebP: the ivory `floral-*` set is the t-wedding artwork, and `autumn-corner`, `autumn-spray` and `daisy` are watercolours cut out of the updated card.

## Sections

In page order ([`src/app/page.tsx`](src/app/page.tsx)):

1. **Hero**: the TPRAYS’26 mark, names set the way the card sets them, and the date line.
2. **Invitation**: the families and the formal wording.
3. **Save the date**: the December 2026 calendar with the day marked.
4. **Our story**: the heart photograph, then the **Gallery**.
5. **Order of the day**: traditional, church and reception on a centre rail.
6. **Venues**: each with a Google Maps directions link.
7. **Countdown** to 8:30 AM WAT.
8. **Colours of the day**: swatches and the attire photograph.
9. **Gifts**.
10. **RSVP**: saved to Supabase (see below). If saving fails, the guest is offered the same reply as a WhatsApp message to Jude or Esther. Both numbers are also listed to call.
11. **Wishes**, then the closing and footer.

## RSVP storage (Supabase)

The form posts to [`src/app/api/rsvp/route.ts`](src/app/api/rsvp/route.ts), which inserts a row into the `rsvps` table. Each row holds the name, phone, whether they are attending, number of guests (up to 4), the names of those coming with them, whose guest they are and an optional message.

1. Create a Supabase project and run [`supabase/rsvps.sql`](supabase/rsvps.sql) in its SQL editor.
2. Set two environment variables, in `.env.local` for local runs and in the Vercel project settings for the live site:

   ```
   SUPABASE_URL=https://<project-ref>.supabase.co
   SUPABASE_PUBLISHABLE_KEY=<publishable key, from Project Settings > API Keys>
   ```

   The table's policy lets this key add rows and nothing else, so it cannot be used to read guests' details.
3. Read the replies in the Supabase Table Editor, which can also export them to CSV.

Until those variables are set, the route answers 503 and guests are offered WhatsApp instead.

## How it is built

- Next.js 16 (App Router, Cache Components) with React 19 and TypeScript.
- Tailwind CSS v4. The palette and fonts are theme tokens in [`src/app/globals.css`](src/app/globals.css).
- Fonts: Cormorant Garamond for text and headings, Pinyon Script for the names.
- Florals: the t-wedding ivory artwork and the updated card's autumn watercolours, placed with `Floral` in [`src/components/Ornaments.tsx`](src/components/Ornaments.tsx).
- Icons: hand-drawn SVG line art for the schedule in [`src/components/ScheduleIcons.tsx`](src/components/ScheduleIcons.tsx), plus a few from `lucide-react`.
- Vercel Analytics in the root layout.

### Colour roles

- **Vintage wine** carries the page: dark sections, names, primary buttons.
- **Champagne gold** is for soft bands and light accents.
- **Herbal green** is for small accents only: timeline nodes, map pins, small labels. Text uses the deepened `herbal-deep` so it stays readable.

### Motion

The animations are plain CSS. One observer ([`src/components/Animator.tsx`](src/components/Animator.tsx)) adds `is-visible` to any element marked `data-inview` as it scrolls into view, and the stylesheet does the rest. That keeps nearly every section a server component.

- The opening curtain and the hero entrance play on load. `--intro` sets their timing.
- Florals bloom in and then sway. Schedule icons and the heart outline draw themselves stroke by stroke.
- Section content rises in one element at a time.
- The order of the day moves in steps ([`src/components/Timeline.tsx`](src/components/Timeline.tsx)): a daisy waits on the first event and glides to each next one as it reaches the middle of the screen.

Hidden starting states only apply under the `js` class, which an inline script sets before first paint, so nothing stays hidden without JavaScript. Everything is switched off for visitors who ask for reduced motion.

## Deploying

The site is built for Vercel. Import the repository, deploy, then enable Analytics in the project's Analytics tab so visits are recorded.
