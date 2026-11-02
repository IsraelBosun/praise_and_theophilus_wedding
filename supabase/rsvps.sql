-- RSVPs from the website. Run once in the Supabase SQL editor.
-- The site's server route adds rows with the publishable key. Row level
-- security lets that key insert and nothing else, so guests' details cannot
-- be read back with it; the couple read them in the Table Editor.

create table if not exists public.rsvps (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  name        text not null,
  phone       text not null,
  attending   boolean not null,
  guests      smallint not null default 0 check (guests between 0 and 4),
  guest_names text,
  side        text,
  message     text
);

alter table public.rsvps enable row level security;

drop policy if exists "Guests can send an RSVP" on public.rsvps;
create policy "Guests can send an RSVP" on public.rsvps
  for insert to anon
  with check (true);
