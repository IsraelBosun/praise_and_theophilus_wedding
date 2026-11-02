import type { Metadata } from "next";
import { AdminRsvps } from "@/components/AdminRsvps";

export const metadata: Metadata = {
  title: "RSVPs | Praise & Theophilus",
  robots: { index: false, follow: false },
};

/**
 * Where Theophilus signs in to see the replies. The publishable key is safe in
 * the browser: the rsvps table only lets it insert, and lets a signed-in
 * theophilusoni@gmail.com read (supabase/rsvps.sql).
 */
export default function AdminPage() {
  return <AdminRsvps url={process.env.SUPABASE_URL ?? ""} apiKey={process.env.SUPABASE_PUBLISHABLE_KEY ?? ""} />;
}
