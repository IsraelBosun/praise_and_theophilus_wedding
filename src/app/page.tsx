import { Animator } from "@/components/Animator";
import { Monogram } from "@/components/Ornaments";
import { NavBar } from "@/components/NavBar";
import { Hero } from "@/components/Hero";
import { Invitation } from "@/components/Invitation";
import { SaveTheDate } from "@/components/SaveTheDate";
import { Schedule } from "@/components/Schedule";
import { Venues } from "@/components/Venues";
import { Gallery, Story } from "@/components/Story";
import { Countdown } from "@/components/Countdown";
import { DressCode } from "@/components/DressCode";
import { Gifts } from "@/components/Gifts";
import { Rsvp } from "@/components/Rsvp";
import { Closing, Wishes } from "@/components/Closing";

/**
 * One phone-width column on a wine ground, as in the reference mockup. On a
 * phone the column is the whole screen; on a desktop it sits centred like a
 * card on a table.
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-wine-deep">
      {/* Opening curtain. Pure CSS, so it plays before any JavaScript has loaded. */}
      <div aria-hidden className="curtain">
        <Monogram size={72} />
      </div>
      <Animator />
      <NavBar />
      <main className="mx-auto w-full max-w-[480px] overflow-hidden bg-paper shadow-[0_0_60px_rgb(0_0_0/0.35)]">
        <Hero />
        <Invitation />
        <SaveTheDate />
        {/* Who they are before the logistics, as in the reference. */}
        <Story />
        <Gallery />
        <Schedule />
        <Venues />
        <Countdown />
        <DressCode />
        <Gifts />
        <Rsvp />
        <Wishes />
        <Closing />
      </main>
    </div>
  );
}
