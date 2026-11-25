/**
 * Sample content for Softground's first milestone.
 *
 * Every screen reads from this module so later milestones can swap these
 * exports for real data (Netlify Database, live chat, AI Gateway) without
 * touching the UI. See PLAN.md.
 */

export type LifeArea =
  | "relationships"
  | "work"
  | "personal"
  | "family"
  | "grief"
  | "money"
  | "growth";

export const lifeAreas: { id: LifeArea; label: string; emoji: string }[] = [
  { id: "relationships", label: "Love & relationships", emoji: "💞" },
  { id: "work", label: "Work & burnout", emoji: "💼" },
  { id: "personal", label: "Self & anxiety", emoji: "🌱" },
  { id: "growth", label: "Inner growth & spirituality", emoji: "✨" },
  { id: "family", label: "Family", emoji: "🏡" },
  { id: "grief", label: "Loss & grief", emoji: "🕊️" },
  { id: "money", label: "Money worries", emoji: "🪙" },
];

/**
 * The default profile for the person this copy of Softground is made for.
 * It is only a starting point: sign-up and Settings store the real profile in
 * localStorage (see src/lib/store.ts) and every screen reads that instead.
 */
export const currentUser = {
  name: "Natalie",
  handle: "radiant-seeker",
  focus: ["personal", "growth"] as LifeArea[],
};

/* ───────────── Check-ins ───────────── */

export const moods = [
  { value: 1, label: "Overwhelmed", color: "var(--plum)" },
  { value: 2, label: "Tense", color: "var(--accent)" },
  { value: 3, label: "Okay-ish", color: "var(--gold)" },
  { value: 4, label: "Steady", color: "var(--sky)" },
  { value: 5, label: "Light", color: "var(--primary)" },
] as const;

export const prompts = [
  "What is one thing weighing on you that you haven’t said out loud yet?",
  "Where in your body are you holding today’s stress?",
  "What would “good enough” look like for the rest of today?",
  "Who made you feel a little safer this week?",
  "What filled you with a little wonder today — even something tiny?",
  "What is one thing you know about yourself now that you didn’t a year ago?",
  "If your kindest self could say one sentence to you right now, what would it be?",
  "What are you growing toward, even slowly?",
];

/* ───────────── Peer circles ───────────── */

export type Circle = {
  id: string;
  name: string;
  area: LifeArea;
  description: string;
  members: number;
  online: number;
  guide: string;
  nextLive?: string;
};

export const circles: Circle[] = [
  {
    id: "after-the-breakup",
    name: "After the breakup",
    area: "relationships",
    description: "For the weeks when everything reminds you of them.",
    members: 2841,
    online: 63,
    guide: "Peer guide Maya",
    nextLive: "Tonight · 8pm",
  },
  {
    id: "same-roof-different-pages",
    name: "Same roof, different pages",
    area: "relationships",
    description:
      "Still together, but it’s hard. Communication, conflict, distance.",
    members: 1920,
    online: 41,
    guide: "Peer guide Sam",
  },
  {
    id: "sunday-scaries",
    name: "Sunday scaries",
    area: "work",
    description:
      "Burnout, toxic bosses, job hunting, and the dread before Monday.",
    members: 4310,
    online: 118,
    guide: "Peer guide Priya",
    nextLive: "Sun · 6pm",
  },
  {
    id: "loud-brain",
    name: "Loud brain club",
    area: "personal",
    description:
      "Anxiety, overthinking, 3am spirals. You’re not the only one awake.",
    members: 5122,
    online: 204,
    guide: "Peer guide Theo",
  },
  {
    id: "family-ties",
    name: "Family ties (and knots)",
    area: "family",
    description: "Parents, siblings, in-laws, caregiving and boundaries.",
    members: 1388,
    online: 22,
    guide: "Peer guide Rosa",
  },
  {
    id: "missing-someone",
    name: "Missing someone",
    area: "grief",
    description: "A gentle space for every kind of loss.",
    members: 967,
    online: 15,
    guide: "Peer guide Ade",
    nextLive: "Thu · 7pm",
  },
  {
    id: "quiet-growth",
    name: "Quiet growth",
    area: "growth",
    description:
      "Inner growth, spirituality and getting to know yourself — slow, gentle conversation.",
    members: 1243,
    online: 19,
    guide: "Peer guide June",
    nextLive: "Wed · 7pm",
  },
  {
    id: "drawing-it-out",
    name: "Drawing it out",
    area: "personal",
    description:
      "For people who process feelings with pens, pencils and paint. No skill needed.",
    members: 986,
    online: 24,
    guide: "Peer guide Wren",
  },
  {
    id: "money-together",
    name: "Money worries, together",
    area: "money",
    description: "Debt, rent and job loss — practical support, no shame.",
    members: 1754,
    online: 37,
    guide: "Peer guide Omar",
  },
  {
    id: "sleepyheads",
    name: "Sleepyheads",
    area: "personal",
    description:
      "For everyone lying awake at 2am. Wind-downs, not doomscrolling.",
    members: 2108,
    online: 56,
    guide: "Peer guide Noor",
    nextLive: "Nightly · 10pm",
  },
];

export type ChatMessage = {
  id: string;
  author: string;
  avatarHue: number;
  time: string;
  text: string;
  hugs?: number;
  isGuide?: boolean;
  isMe?: boolean;
};

export const circleMessages: Record<string, ChatMessage[]> = {
  "after-the-breakup": [
    {
      id: "m1",
      author: "Maya · guide",
      avatarHue: 150,
      time: "7:42 PM",
      text: "Welcome in, everyone. Tonight’s gentle prompt: what’s one small thing you did for yourself today? Nothing is too small.",
      isGuide: true,
      hugs: 24,
    },
    {
      id: "m2",
      author: "river-stone",
      avatarHue: 20,
      time: "7:45 PM",
      text: "I deleted the photos folder off my lock screen. Didn’t delete them entirely, but I don’t have to see them every morning now.",
      hugs: 31,
    },
    {
      id: "m3",
      author: "late-bloom",
      avatarHue: 330,
      time: "7:46 PM",
      text: "That’s huge honestly. I still check their stories. Day 12 of trying not to.",
      hugs: 12,
    },
    {
      id: "m4",
      author: "north-window",
      avatarHue: 210,
      time: "7:50 PM",
      text: "Went on a walk with my sister instead of sitting in my car crying in the parking lot. Progress 😅",
      hugs: 19,
    },
  ],
  "sunday-scaries": [
    {
      id: "s1",
      author: "Priya · guide",
      avatarHue: 40,
      time: "5:58 PM",
      text: "Live session starts soon! We’re doing a 10-minute “close the laptop” ritual together.",
      isGuide: true,
      hugs: 40,
    },
    {
      id: "s2",
      author: "paper-crane",
      avatarHue: 260,
      time: "6:01 PM",
      text: "My manager messaged me at 11pm on a Saturday. I keep rereading it.",
      hugs: 22,
    },
    {
      id: "s3",
      author: "ember-tea",
      avatarHue: 90,
      time: "6:03 PM",
      text: "Turn off notifications until 9am Monday. Whatever it is will still be there and you’ll be more rested for it.",
      hugs: 35,
    },
  ],
  "quiet-growth": [
    {
      id: "g1",
      author: "June · guide",
      avatarHue: 280,
      time: "7:02 PM",
      text: "Welcome to Quiet growth. Tonight’s prompt: what filled you with a little wonder today — even something tiny?",
      isGuide: true,
      hugs: 18,
    },
    {
      id: "g2",
      author: "morning-pages",
      avatarHue: 45,
      time: "7:05 PM",
      text: "The light through my kitchen window this morning. I stopped rushing for once and just watched it for a minute.",
      hugs: 26,
    },
    {
      id: "g3",
      author: "slow-fern",
      avatarHue: 170,
      time: "7:09 PM",
      text: "I’m learning that growth doesn’t always feel like progress. Sometimes it just feels like noticing.",
      hugs: 31,
    },
  ],
};

export const defaultMessages: ChatMessage[] = [
  {
    id: "d1",
    author: "guide",
    avatarHue: 150,
    time: "Just now",
    text: "Welcome. Read for a while, share when you’re ready. Be kind, keep names private, and use the 🤍 to let someone know they were heard.",
    isGuide: true,
  },
];

export const directMatches = [
  {
    handle: "soft-harbor",
    area: "relationships" as LifeArea,
    note: "Also navigating a long-distance strain",
    hue: 18,
  },
  {
    handle: "blue-hour",
    area: "work" as LifeArea,
    note: "Recovering from burnout, 3 months in",
    hue: 220,
  },
  {
    handle: "wild-thyme",
    area: "personal" as LifeArea,
    note: "Learning to sit with anxiety",
    hue: 120,
  },
  {
    handle: "morning-pages",
    area: "growth" as LifeArea,
    note: "Journaling every morning, learning to listen inward",
    hue: 280,
  },
];

/* ───────────── Activities ───────────── */

export type Activity = {
  id: string;
  title: string;
  kind: "move" | "create" | "calm" | "connect" | "outdoors" | "reflect";
  mode: "solo" | "together" | "both";
  minutes: number;
  cost: "Free" | "Low cost";
  blurb: string;
  steps: string[];
  helpsWith: LifeArea[];
  image?: string;
};

export const activityKinds = [
  { id: "all", label: "Everything" },
  { id: "calm", label: "Calm" },
  { id: "move", label: "Move" },
  { id: "outdoors", label: "Outdoors" },
  { id: "create", label: "Create" },
  { id: "connect", label: "Connect" },
  { id: "reflect", label: "Reflect" },
] as const;

export const activities: Activity[] = [
  {
    id: "box-breathing",
    title: "Box breathing",
    kind: "calm",
    mode: "solo",
    minutes: 4,
    cost: "Free",
    blurb:
      "Four counts in, hold, out, hold. Used by nurses and first responders to slow a racing heart.",
    steps: [
      "Sit or stand with both feet down",
      "Inhale for 4",
      "Hold for 4",
      "Exhale for 4",
      "Hold for 4 — repeat 6 times",
    ],
    helpsWith: ["work", "personal"],
  },
  {
    id: "noticing-walk",
    title: "The noticing walk",
    kind: "outdoors",
    mode: "both",
    minutes: 20,
    cost: "Free",
    blurb:
      "A slow walk where you find 5 things you see, 4 you hear, 3 you can touch. No podcast, no phone.",
    steps: [
      "Leave your phone in your pocket",
      "Walk slower than usual",
      "Name 5 things you see",
      "4 things you hear",
      "3 textures you can touch",
    ],
    helpsWith: ["personal", "relationships", "grief"],
    image: "together",
  },
  {
    id: "scribble-it-out",
    title: "Scribble it out",
    kind: "create",
    mode: "solo",
    minutes: 10,
    cost: "Free",
    blurb:
      "Draw your stress as shapes and colors — no skill needed. Then draw what “calm” would look like next to it.",
    steps: [
      "Grab any paper and pen",
      "Draw the feeling, not a thing",
      "Fill the page for 5 minutes",
      "On a new page, draw calm",
    ],
    helpsWith: ["personal", "relationships"],
    image: "art",
  },
  {
    id: "shake-it-off",
    title: "Shake it off",
    kind: "move",
    mode: "solo",
    minutes: 3,
    cost: "Free",
    blurb:
      "Shake out your hands, arms, legs for 60 seconds each. Animals do this to release stress after danger.",
    steps: [
      "Stand up",
      "Shake hands & arms for 60s",
      "Shake each leg for 30s",
      "Stand still and breathe for 30s",
    ],
    helpsWith: ["work", "personal"],
  },
  {
    id: "sketch-club",
    title: "Sunday sketch club",
    kind: "create",
    mode: "together",
    minutes: 45,
    cost: "Free",
    blurb:
      "A live video room where everyone draws the same prompt. Cameras optional. Bad art strongly encouraged.",
    steps: [
      "Join the room at the start time",
      "Get the prompt",
      "Draw for 30 minutes",
      "Share if you like",
    ],
    helpsWith: ["personal", "grief"],
  },
  {
    id: "repair-conversation",
    title: "The 15-minute repair talk",
    kind: "connect",
    mode: "together",
    minutes: 15,
    cost: "Free",
    blurb:
      "A structured, timed check-in for couples: each person speaks for 5 minutes uninterrupted, then reflects back.",
    steps: [
      "Set a timer for 5 minutes",
      "Partner A shares, B only listens",
      "B reflects back what they heard",
      "Switch",
      "End with one appreciation each",
    ],
    helpsWith: ["relationships", "family"],
  },
  {
    id: "park-yoga",
    title: "Free park yoga near you",
    kind: "move",
    mode: "together",
    minutes: 60,
    cost: "Free",
    blurb:
      "Community-run classes in local parks and libraries. We’ll show the ones closest to you.",
    steps: [
      "Pick a class from the map",
      "Bring a towel or mat",
      "Arrive 10 minutes early",
    ],
    helpsWith: ["work", "personal"],
  },
  {
    id: "worry-window",
    title: "Worry window",
    kind: "reflect",
    mode: "solo",
    minutes: 15,
    cost: "Free",
    blurb:
      "Give your worries a 15-minute appointment. Outside that window, you gently tell them “not now.”",
    steps: [
      "Pick a time each day",
      "Write every worry down",
      "Circle the ones you can act on",
      "Close the notebook",
    ],
    helpsWith: ["money", "work", "personal"],
  },
  {
    id: "cook-together",
    title: "Cheap & cosy cook-along",
    kind: "connect",
    mode: "together",
    minutes: 40,
    cost: "Low cost",
    blurb:
      "A circle member hosts; everyone cooks the same under-$5 recipe in their own kitchen.",
    steps: [
      "Check the ingredient list",
      "Join the live room",
      "Cook, chat, eat",
    ],
    helpsWith: ["personal", "grief", "money"],
  },
  {
    id: "unsent-letter",
    title: "The unsent letter",
    kind: "reflect",
    mode: "solo",
    minutes: 20,
    cost: "Free",
    blurb:
      "Write everything you wish you could say to someone. You never send it. It’s for you.",
    steps: [
      "Start with “Dear…”",
      "Write without editing",
      "Read it once, out loud if you can",
      "Keep, burn or delete it",
    ],
    helpsWith: ["relationships", "grief", "family"],
  },
  {
    id: "grounding-54321",
    title: "5-4-3-2-1 grounding",
    kind: "calm",
    mode: "solo",
    minutes: 5,
    cost: "Free",
    blurb:
      "Name 5 things you see, 4 you can touch, 3 you hear, 2 you can smell, 1 you can taste. It pulls you back into the room.",
    steps: [
      "Name 5 things you can see",
      "4 things you can touch",
      "3 things you can hear",
      "2 things you can smell",
      "1 thing you can taste",
    ],
    helpsWith: ["personal", "work"],
  },
  {
    id: "muscle-relaxation",
    title: "Progressive muscle relaxation",
    kind: "calm",
    mode: "solo",
    minutes: 10,
    cost: "Free",
    blurb:
      "Tense each muscle group for 5 seconds, then let go. Your body learns what “relaxed” actually feels like.",
    steps: [
      "Start with your hands — clench for 5 seconds",
      "Release and notice the difference",
      "Move up: arms, shoulders, face",
      "Then stomach, legs, feet",
      "End with three slow breaths",
    ],
    helpsWith: ["personal", "work"],
  },
  {
    id: "sleep-wind-down",
    title: "Sleep wind-down",
    kind: "calm",
    mode: "solo",
    minutes: 15,
    cost: "Free",
    blurb:
      "A slow landing for your evening: dim lights, stretch, and put the day down before bed.",
    steps: [
      "Dim the lights and put the phone away",
      "Stretch gently for 5 minutes",
      "Write tomorrow’s top worry on paper",
      "Read or listen to something soft",
      "Lights out at the same time each night",
    ],
    helpsWith: ["personal"],
  },
  {
    id: "three-good-things",
    title: "Three good things",
    kind: "reflect",
    mode: "solo",
    minutes: 5,
    cost: "Free",
    blurb:
      "Write down three good things from today — and why they happened. Small counts.",
    steps: [
      "List three good things from today",
      "For each one, write why it happened",
      "Notice which ones you helped make happen",
    ],
    helpsWith: ["personal", "grief"],
  },
  {
    id: "morning-pages",
    title: "Morning pages",
    kind: "reflect",
    mode: "solo",
    minutes: 10,
    cost: "Free",
    blurb:
      "Three pages of whatever is in your head, first thing. No editing, no audience.",
    steps: [
      "Write before you check your phone",
      "Keep the pen moving, even if it’s “I don’t know what to write”",
      "Stop after three pages — or ten minutes",
      "Don’t reread them today",
    ],
    helpsWith: ["personal", "growth"],
  },
  {
    id: "cold-water-reset",
    title: "Cold water reset",
    kind: "calm",
    mode: "solo",
    minutes: 2,
    cost: "Free",
    blurb:
      "Splash cold water on your face or hold ice for a minute. A DBT TIPP skill for when feelings spike.",
    steps: [
      "Run the tap cold",
      "Splash your face or hold a cold pack to your cheeks",
      "Breathe out slowly for 30 seconds",
      "Notice your heart rate settle",
    ],
    helpsWith: ["personal"],
  },
  {
    id: "draw-inner-weather",
    title: "Draw your inner weather",
    kind: "create",
    mode: "solo",
    minutes: 10,
    cost: "Free",
    blurb:
      "Sketch today as weather — stormy, cloudy, clearing? Drawing what you feel makes it easier to hold.",
    steps: [
      "Grab any paper and pen",
      "Draw today’s weather inside you",
      "Add one small thing that would clear the sky",
      "No skill needed — scribbles count",
    ],
    helpsWith: ["personal", "growth"],
    image: "art",
  },
  {
    id: "wonder-walk",
    title: "The wonder walk",
    kind: "outdoors",
    mode: "both",
    minutes: 20,
    cost: "Free",
    blurb:
      "Walk slowly and look for one thing that fills you with wonder. Awe is a real stress reliever.",
    steps: [
      "Leave the headphones at home",
      "Walk slower than usual",
      "Look for something that makes you pause",
      "Stay with it for a full minute",
      "Tell someone — or your journal — what you saw",
    ],
    helpsWith: ["personal", "growth", "grief"],
  },
  {
    id: "loving-kindness",
    title: "Loving-kindness, quietly",
    kind: "calm",
    mode: "solo",
    minutes: 10,
    cost: "Free",
    blurb:
      "Repeat a few kind wishes — for yourself first, then someone else. “May I be safe. May I be well.”",
    steps: [
      "Sit comfortably and close your eyes",
      "Repeat: “May I be safe. May I be well. May I be at ease.”",
      "Picture someone you care about and wish the same for them",
      "End with a slow breath",
    ],
    helpsWith: ["personal", "relationships"],
  },
  {
    id: "radiant-reflection",
    title: "Radiant reflection",
    kind: "reflect",
    mode: "solo",
    minutes: 7,
    cost: "Free",
    blurb:
      "One prompt, a few honest lines: what filled you with wonder today, and what are you growing toward?",
    steps: [
      "Ask: what filled me with wonder today?",
      "Write two or three honest lines",
      "Ask: what am I growing toward, even slowly?",
      "Write one small step for tomorrow",
    ],
    helpsWith: ["growth", "personal"],
  },
];

/* ───────────── Resources ───────────── */

export const books = [
  {
    title: "Burnout",
    author: "Emily & Amelia Nagoski",
    why: "Explains the stress cycle and how to actually complete it — not just “self-care”.",
    area: "work" as LifeArea,
    free: "Often at your library via Libby",
    hue: 30,
  },
  {
    title: "Attached",
    author: "Amir Levine & Rachel Heller",
    why: "Makes sense of why some relationships feel calm and others feel like a rollercoaster.",
    area: "relationships" as LifeArea,
    free: "Library & audiobook loan",
    hue: 340,
  },
  {
    title: "Hold Me Tight",
    author: "Dr. Sue Johnson",
    why: "Seven conversations for couples, from the founder of Emotionally Focused Therapy.",
    area: "relationships" as LifeArea,
    free: "Library",
    hue: 10,
  },
  {
    title: "Self-Compassion",
    author: "Dr. Kristin Neff",
    why: "Research-backed ways to stop being your own harshest critic.",
    area: "personal" as LifeArea,
    free: "Free exercises at self-compassion.org",
    hue: 150,
  },
  {
    title: "The Body Keeps the Score",
    author: "Bessel van der Kolk",
    why: "How stress and trauma live in the body — and what helps release them.",
    area: "personal" as LifeArea,
    free: "Library",
    hue: 260,
  },
  {
    title: "It’s OK That You’re Not OK",
    author: "Megan Devine",
    why: "A grief book that doesn’t try to rush or fix you.",
    area: "grief" as LifeArea,
    free: "Library",
    hue: 200,
  },
  {
    title: "Set Boundaries, Find Peace",
    author: "Nedra Glover Tawwab",
    why: "Practical scripts for family, partners and work.",
    area: "family" as LifeArea,
    free: "Library & audiobook loan",
    hue: 80,
  },
  {
    title: "Feeling Good",
    author: "Dr. David Burns",
    why: "The classic CBT self-help book — proven in studies to help as a standalone tool.",
    area: "personal" as LifeArea,
    free: "Library",
    hue: 50,
  },
  {
    title: "The Anxiety and Phobia Workbook",
    author: "Edmund J. Bourne",
    why: "The classic step-by-step CBT workbook for worry, panic and phobias — do a little at a time.",
    area: "personal" as LifeArea,
    free: "Library & workbook edition",
    hue: 210,
  },
  {
    title: "Dare",
    author: "Barry McDonagh",
    why: "A practical, no-nonsense method for ending anxiety and panic attacks.",
    area: "personal" as LifeArea,
    free: "Library",
    hue: 160,
  },
  {
    title: "When Things Fall Apart",
    author: "Pema Chödrön",
    why: "Short, gentle chapters of heart advice for hard times. Made for 3am.",
    area: "growth" as LifeArea,
    free: "Library & audiobook loan",
    hue: 280,
  },
  {
    title: "The Gifts of Imperfection",
    author: "Brené Brown",
    why: "Letting go of who you think you should be, and embracing who you are.",
    area: "personal" as LifeArea,
    free: "Library",
    hue: 350,
  },
  {
    title: "How to Do the Work",
    author: "Dr. Nicole LePera",
    why: "How old patterns form — and how to change them, body and mind together.",
    area: "personal" as LifeArea,
    free: "Library",
    hue: 90,
  },
  {
    title: "Can’t Even",
    author: "Anne Helen Petersen",
    why: "Why burnout isn’t a personal failure, and what actually helps.",
    area: "work" as LifeArea,
    free: "Library",
    hue: 20,
  },
  {
    title: "The Seven Principles for Making Marriage Work",
    author: "John Gottman",
    why: "Four decades of research, distilled into seven habits that keep couples close.",
    area: "relationships" as LifeArea,
    free: "Library",
    hue: 320,
  },
  {
    title: "The Year of Magical Thinking",
    author: "Joan Didion",
    why: "A clear-eyed, devastating and strangely comforting account of sudden loss.",
    area: "grief" as LifeArea,
    free: "Library",
    hue: 230,
  },
  {
    title: "The Psychology of Money",
    author: "Morgan Housel",
    why: "Calm, short chapters on wealth, greed and the happiness money can’t buy.",
    area: "money" as LifeArea,
    free: "Library & audiobook loan",
    hue: 45,
  },
  {
    title: "Why We Sleep",
    author: "Matthew Walker",
    why: "What sleep does for your mood, memory and health — and how to get more of it.",
    area: "personal" as LifeArea,
    free: "Library",
    hue: 240,
  },
];

export const therapyOptions = [
  {
    title: "Sliding-scale therapists",
    detail:
      "In-person and video sessions from $30–$80 through non-profit collectives like Open Path.",
    tag: "Low cost",
  },
  {
    title: "University training clinics",
    detail:
      "Supervised graduate therapists, often free or under $20 a session.",
    tag: "Free / low cost",
  },
  {
    title: "Community health centers",
    detail: "Federally funded clinics that charge based on income.",
    tag: "Income-based",
  },
  {
    title: "Employee assistance (EAP)",
    detail:
      "Many employers include 3–8 free confidential sessions. Ask HR — it stays private.",
    tag: "Free",
  },
  {
    title: "Free support groups",
    detail:
      "NAMI, Al-Anon, GriefShare and more meet in person and online every week.",
    tag: "Free",
  },
  {
    title: "Couples workshops",
    detail:
      "Library and community-center relationship workshops, often run by local therapists.",
    tag: "Free / low cost",
  },
  {
    title: "Open Path Collective",
    detail:
      "A one-time $65 membership, then sessions at $40–$70 with licensed therapists, online or in person.",
    tag: "Low cost",
  },
  {
    title: "7 Cups",
    detail:
      "Free, trained volunteer listeners 24/7, plus affordable online therapy plans.",
    tag: "Free",
  },
  {
    title: "NAMI HelpLine",
    detail:
      "Call 1-800-950-6264 (Mon–Fri, 10am–6pm ET) for free guidance, referrals and support.",
    tag: "Free",
  },
  {
    title: "Psychology Today directory",
    detail:
      "Filter thousands of therapists by sliding scale, insurance and specialty.",
    tag: "Free to search",
  },
  {
    title: "Inclusive Therapists",
    detail:
      "A directory centering BIPOC, LGBTQ+ and disabled clients, with sliding-scale filters.",
    tag: "Free to search",
  },
  {
    title: "Loveland Foundation Therapy Fund",
    detail:
      "Free therapy sessions for Black women and girls, with a national directory.",
    tag: "Free",
  },
];

export const nearbyTherapists = [
  {
    name: "Dr. Lena Ortiz",
    creds: "PsyD",
    focus: "Couples · EFT",
    distance: "1.2 mi",
    fee: "$45–90 sliding",
    virtual: true,
  },
  {
    name: "Marcus Bell",
    creds: "LCSW",
    focus: "Work stress · CBT",
    distance: "2.4 mi",
    fee: "$30–70 sliding",
    virtual: true,
  },
  {
    name: "Ama Owusu",
    creds: "LMFT",
    focus: "Family · Grief",
    distance: "3.1 mi",
    fee: "Accepts Medicaid",
    virtual: false,
  },
];

export const crisisLines = [
  {
    name: "988 Suicide & Crisis Lifeline",
    how: "Call or text 988",
    region: "US",
    href: "tel:988",
  },
  {
    name: "Crisis Text Line",
    how: "Text HOME to 741741",
    region: "US / CA / UK / IE",
    href: "sms:741741?body=HOME",
  },
  {
    name: "National Domestic Violence Hotline",
    how: "Call 1-800-799-7233 or text START to 88788",
    region: "US",
    href: "tel:18007997233",
  },
  {
    name: "Samaritans",
    how: "Call 116 123",
    region: "UK & Ireland",
    href: "tel:116123",
  },
  {
    name: "The Trevor Project",
    how: "Call 1-866-488-7386 or text START to 678-678",
    region: "US · LGBTQ+ youth under 25",
    href: "tel:18664887386",
  },
  {
    name: "Trans Lifeline",
    how: "Call 1-877-565-8860",
    region: "US · trans peer support",
    href: "tel:18775658860",
  },
  {
    name: "Veterans Crisis Line",
    how: "Call 988 then press 1, or text 838255",
    region: "US · veterans",
    href: "sms:838255",
  },
  {
    name: "SAMHSA National Helpline",
    how: "Call 1-800-662-4357",
    region: "US · 24/7",
    href: "tel:18006624357",
  },
  {
    name: "NEDA Helpline",
    how: "Call or text 1-800-931-2237",
    region: "US · eating disorders",
    href: "tel:18009312237",
  },
  {
    name: "Find a helpline worldwide",
    how: "findahelpline.com",
    region: "Global",
    href: "https://findahelpline.com",
  },
];

/* ───────────── AI companion ───────────── */

export const approaches = [
  {
    id: "auto",
    name: "Let Softground choose",
    short: "Auto",
    description:
      "Picks the best-fit approach from what you share, and explains why.",
  },
  {
    id: "cbt",
    name: "Cognitive Behavioral (CBT)",
    short: "CBT",
    description:
      "Untangle anxious thoughts and test them against the facts. Great for spirals and worry.",
  },
  {
    id: "dbt",
    name: "Dialectical Behavior (DBT)",
    short: "DBT",
    description:
      "Skills for big emotions in the moment: distress tolerance, regulation, and asking for what you need.",
  },
  {
    id: "act",
    name: "Acceptance & Commitment (ACT)",
    short: "ACT",
    description:
      "Make room for hard feelings and move toward what matters to you anyway.",
  },
  {
    id: "eft",
    name: "Emotionally Focused (EFT)",
    short: "EFT",
    description:
      "For relationships — understand the cycle you and your partner get stuck in.",
  },
  {
    id: "compassion",
    name: "Compassion-Focused",
    short: "CFT",
    description:
      "Soften a harsh inner critic and build self-worth. Pairs well with Mirror mode.",
  },
  {
    id: "solution",
    name: "Solution-Focused",
    short: "SFBT",
    description:
      "Short, practical, future-focused. What’s already working, and the next small step.",
  },
] as const;

export type ApproachId = (typeof approaches)[number]["id"];

export const companionTones = [
  "Warm & gentle",
  "Direct & practical",
  "Playful",
  "Calm & minimal",
] as const;

export const companionLooks = [
  {
    id: "orb",
    label: "Softground orb",
    description: "An abstract, calming presence",
  },
  {
    id: "mirror",
    label: "Mirror mode",
    description:
      "Your companion takes on your face — a kinder version of you, talking to you",
  },
  {
    id: "custom",
    label: "Choose a guide",
    description: "Pick a style, age and voice that feels safe",
  },
] as const;

/** The companion's first message, addressed to the person using the app. */
export function companionOpeningFor(name: string): ChatMessage[] {
  return [
    {
      id: "c0",
      author: "Companion",
      avatarHue: 150,
      time: "Now",
      text: `Hi ${name}. I’m here whenever you need me — free, private, and always on. What’s sitting heaviest right now: love, work, or something else?`,
    },
  ];
}

export const companionOpening = companionOpeningFor(currentUser.name);

/**
 * Canned replies until the AI Gateway companion ships (see PLAN.md, milestone 5).
 * `{name}` is replaced with the user's first name when a reply is sent.
 */
export const companionReplies: Record<ApproachId, string[]> = {
  auto: [
    "Thank you for telling me. It sounds like there’s a lot of “what if” in this — so I’m going to lean on CBT for a moment. What’s the thought that keeps replaying?",
    "That makes so much sense given everything you’re carrying. Let’s slow down: on a scale of 1–10, how intense is the feeling right now?",
    "{name}, I’m hearing two things at once: the worry, and the wish underneath it. Let’s start with the wish — what would “a little better” look like today?",
    "I’m going to borrow from ACT here: we don’t have to fix the feeling to move with it. What’s one small thing that matters to you today, even with the stress along for the ride?",
  ],
  cbt: [
    "Let’s look at that thought like a scientist would. What evidence supports it — and what evidence doesn’t?",
    "If a close friend had this exact thought, what would you tell them?",
    "Thoughts feel like facts when they’re loud. Try writing this one down as “I’m having the thought that…” — does it loosen its grip at all?",
    "What’s the most likely outcome here, not the worst one? And if the worst did happen, what would you do next?",
  ],
  dbt: [
    "This feels big right now. Let’s try TIPP: cold water on your face for 30 seconds, then a slow exhale longer than your inhale. I’ll wait.",
    "Both things can be true: you’re hurting, and you’re handling it. What do you need in the next ten minutes?",
    "Let’s ride the wave instead of fighting it. Feelings peak and pass — usually in about 90 seconds if we don’t feed them. Can you stay with this one for 90 seconds?",
    "What would help your body feel 10% safer right now — a blanket, a walk, a glass of water, stepping outside?",
  ],
  act: [
    "Can we notice the feeling without fighting it? Try saying: “I’m having the thought that…” before it. What changes?",
    "If this stress weren’t in the way, what small thing would you do today that matters to you?",
    "Feelings are weather, {name} — they move through. What’s one value you want to steer toward today, even while it’s raining?",
    "Let’s make room for the hard feeling instead of pushing it away. Where do you feel it in your body, and can you breathe around it?",
  ],
  eft: [
    "It sounds like when they pull away, you reach harder — and they pull further. That’s a really common cycle, not a flaw in you. What do you feel just underneath the frustration?",
    "What would you want your partner to understand about what happens inside you in those moments?",
    "Under the anger or the silence, there’s usually a softer need — to be chosen, to be safe, to matter. Which one is closest for you right now?",
    "If you could tell them one thing about what this fight is really about for you, with no fear of how they’d react, what would it be?",
  ],
  compassion: [
    "I want you to hear this in your own voice: you are doing the best you can with what you have right now. That’s enough for today.",
    "Your inner critic is loud because it’s trying to protect you. What would a kinder protector say instead?",
    "{name}, try placing a hand on your chest and saying: “This is a moment of suffering. Suffering is part of being human. May I be kind to myself right now.” How does that land?",
    "You wouldn’t talk to a friend the way you’re talking to yourself right now. What would you say to her instead — and can you say that to you?",
  ],
  solution: [
    "Imagine you wake up tomorrow and this stress is 20% lighter. What’s the first thing you’d notice?",
    "When was a time this felt even a little better? What were you doing differently then?",
    "What’s already working, even a little? Let’s build on that instead of starting from zero.",
    "What’s the smallest next step — so small it feels almost too easy? That’s usually the right one.",
  ],
};
