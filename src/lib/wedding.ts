/**
 * Single source of truth for the invitation. Every section renders from this
 * object, so wording, times and numbers are changed here and nowhere else.
 *
 * Optional blocks (story, gallery, gift account) may be null. Their sections
 * then do not render at all, rather than showing an empty frame.
 */

export type Phone = { name: string; display: string; whatsapp: string };

export type ScheduleItem = {
  time: string;
  title: string;
  note: string;
  venueId: string;
  icon: "traditional" | "church" | "reception";
};

export type Venue = {
  id: string;
  label: string;
  name: string;
  address: string[];
  mapsQuery: string;
};

export const wedding = {
  /** The couple's mark, TPRAYS'26. Shown in the nav, the opening curtain, the hero and the wishes. */
  monogram: { text: "TPRAYS", year: "26" },

  bride: { name: "Praise" },
  groom: { name: "Theophilus" },

  /** WAT is UTC+1. The offset is explicit so a guest abroad counts down to the right moment. */
  date: "2026-12-05T08:30:00+01:00",
  calendar: { year: 2026, month: 12, day: 5 },
  dateParts: { weekday: "Saturday", day: "05", month: "Dec", year: "2026" },
  dateStamp: "05 · 12 · 2026",

  families: {
    lead: "The families of",
    names: [
      "Elder and Deaconess A.T Odeseye",
      "Pastor Oyetola & Late Mrs. Antonia Oni",
    ],
    invite: ["cordially invite you to", "the Wedding Solemnization of", "their beloved children"],
    card: "/invitation/images/invitation-card.jpg",
  },

  schedule: [
    {
      time: "8:30 AM",
      title: "Traditional Wedding",
      note: "Introduction and engagement rites",
      venueId: "garden",
      icon: "traditional",
    },
    {
      time: "11:00 AM",
      title: "Church Wedding",
      note: "Solemnization of holy matrimony",
      venueId: "church",
      icon: "church",
    },
    {
      time: "2:00 PM",
      title: "Reception",
      note: "Same address as the traditional",
      venueId: "garden",
      icon: "reception",
    },
  ] satisfies ScheduleItem[],

  venues: [
    {
      id: "garden",
      label: "Traditional & Reception",
      name: "Phils Garden",
      address: ["Behind Resuscitate Hospital,", "along Passo road, Gwagwalada, Abuja."],
      mapsQuery: "Phils Garden, Passo road, Gwagwalada, Abuja",
    },
    {
      id: "church",
      label: "Church Wedding",
      name: "CAC, Mount of Joy",
      address: [
        "Gwagwalada DCC Headquarters,",
        "Beside AEDC Substation, Gwagwalada, Abuja.",
      ],
      mapsQuery: "CAC Mount of Joy, Gwagwalada DCC Headquarters, Gwagwalada, Abuja",
    },
  ] satisfies Venue[],

  dressCode: {
    heading: "Colours of the Day",
    intro: "We would love to see you dressed in the colours of our day.",
    colours: [
      { name: "Vintage Wine", hex: "#4B1526" },
      { name: "Herbal Green", hex: "#6E6E3A" },
      { name: "Champagne Gold", hex: "#E2D2B6" },
    ],
    image: "/invitation/images/attire-full.jpg",
    imageAlt:
      "Three guests in Yoruba attire: a man in a vintage wine agbada with a champagne fila, a woman in herbal green lace with a champagne gele and sash, and a woman in vintage wine lace with a champagne gele.",
  },

  /**
   * Set to null to hide the section. `photo` is cut to a heart, as in the
   * design, so it is cropped with both faces in the heart's upper middle.
   */
  story: {
    photo: "/invitation/images/story-heart.jpg",
    photoAlt: "Theophilus kissing Praise on the forehead as she smiles",
    paragraphs: [
      "From a yes on bended knee to forever.",
      "We cannot wait to begin it surrounded by the people we love.",
    ],
  } as null | { photo: string | null; photoAlt: string; paragraphs: string[] },

  /** An empty list hides the gallery. */
  gallery: [
    {
      src: "/invitation/images/gallery-proposal.jpg",
      alt: "Theophilus on one knee proposing to Praise beneath a Will You Marry Me sign",
    },
    {
      src: "/invitation/images/gallery-traditional.jpg",
      alt: "Praise and Theophilus in red and white traditional attire",
    },
  ] as { src: string; alt: string }[],

  gifts: {
    heading: "Gifts",
    body: [
      "Your presence and prayers are the greatest gift to us.",
      "If you would like to bless us further, we will be truly grateful.",
    ],
    /** Bank details shown under the message, one card each. */
    accounts: [
      { label: "Groom", bank: "First Bank", name: "Theophilus Oni", number: "0505715220" },
      { label: "Bride", bank: "First Bank",name: "Odeseye Toluwase", number: "3228991712" },
    ] as { label: string; bank: string; name: string; number: string }[],
  },

  rsvp: {
    heading: "RSVP",
    body: "Kindly let us know if you will be celebrating with us.",
    phones: [
      { name: "Jude", display: "0814 344 2367", whatsapp: "2348143442367" },
      { name: "Esther", display: "0708 056 8748", whatsapp: "2347080568748" },
    ] satisfies Phone[],
  },

  /**
   * Background song. Drop the MP3 at public/invitation/audio/orente.mp3 and
   * the play button appears; until then the page has no music control.
   */
  music: {
    src: "/invitation/audio/orente.mp3",
    title: "Orente by Adekunle Gold",
  },

  wishes: {
    heading: "Your Wishes",
    body: "Share a few warm words and prayers for the couple.",
    message: "Hello! A wish for Praise & Theophilus: ",
  },

  closing: {
    heading: "See you there!",
    body: "We cannot wait to celebrate this special day with you.",
    signoff: "With love,",
  },
};

export type Wedding = typeof wedding;
