export type Pillar = "love" | "good" | "needs" | "paid";

export interface Question {
  id: string;
  pillar: Pillar;
  prompt: string;
  helper: string;
  placeholder: string;
}

export const QUESTIONS: Question[] = [
  // ——— What you love (passion) ———
  {
    id: "l1",
    pillar: "love",
    prompt: "When do you most lose track of time?",
    helper: "Describe the activity, setting, or project where hours feel like minutes.",
    placeholder: "e.g. When I'm writing, gardening, sketching strangers on the train…",
  },
  {
    id: "l2",
    pillar: "love",
    prompt: "What topics could you talk about for hours without getting tired?",
    helper: "The ones you keep circling back to, even when no one is asking.",
    placeholder: "e.g. Astronomy, cooking traditions, psychology of habits…",
  },
  {
    id: "l3",
    pillar: "love",
    prompt: "If money were no object, how would you spend a free year?",
    helper: "Dream without filtering for practicality.",
    placeholder: "e.g. Travel slowly and document local craftspeople…",
  },

  // ——— What you're good at (vocation) ———
  {
    id: "g1",
    pillar: "good",
    prompt: "What do people consistently ask you for help with?",
    helper: "The thing that comes easily to you but feels hard to others.",
    placeholder: "e.g. Explaining complicated ideas, fixing computers, giving advice…",
  },
  {
    id: "g2",
    pillar: "good",
    prompt: "Which skills have you spent years quietly sharpening?",
    helper: "These can be technical, creative, or interpersonal.",
    placeholder: "e.g. Listening carefully, coding, teaching kids to read…",
  },
  {
    id: "g3",
    pillar: "good",
    prompt: "When someone compliments your work, what are they usually praising?",
    helper: "Be specific — a quality, an outcome, a feeling you leave people with.",
    placeholder: "e.g. My clarity, my calm, the way I notice small details…",
  },

  // ——— What the world needs (mission) ———
  {
    id: "n1",
    pillar: "needs",
    prompt: "What problem in the world quietly breaks your heart?",
    helper: "Don't pick the loudest cause — pick the one that keeps you up at night.",
    placeholder: "e.g. Loneliness in the elderly, food waste, kids losing curiosity…",
  },
  {
    id: "n2",
    pillar: "needs",
    prompt: "Whom do you most want to help, and why?",
    helper: "A group, an age, a kind of person — or even a place or ecosystem.",
    placeholder: "e.g. First-generation students, anxious new mothers…",
  },
  {
    id: "n3",
    pillar: "needs",
    prompt: "What would you want people to feel or understand because you existed?",
    helper: "The quiet legacy, not the résumé line.",
    placeholder: "e.g. Less alone, more curious, that nature is not separate from us…",
  },

  // ——— What you can be paid for (profession) ———
  {
    id: "p1",
    pillar: "paid",
    prompt: "What have you been paid for in the past, and what parts did you enjoy?",
    helper: "Even jobs you disliked usually had one piece that felt alive.",
    placeholder: "e.g. Taught English abroad — loved the one-on-one tutoring…",
  },
  {
    id: "p2",
    pillar: "paid",
    prompt: "Which of your skills do people already pay for, or would pay for?",
    helper: "Freelance, consulting, a side hustle, a full-time role — anything counts.",
    placeholder: "e.g. Writing newsletters, designing brand systems, coaching…",
  },
  {
    id: "p3",
    pillar: "paid",
    prompt: "If you could build a sustainable life around one offering, what would it be?",
    helper: "A product, service, role, or practice — imagine it already working.",
    placeholder: "e.g. Small-group retreats, a studio practice, software for therapists…",
  },
];

export const PILLAR_META: Record<
  Pillar,
  { label: string; subtitle: string; color: string; ring: string; soft: string; text: string; symbol: string }
> = {
  love: {
    label: "What you love",
    subtitle: "Passion",
    color: "#b5384c", // beni
    ring: "ring-[#b5384c]/30",
    soft: "bg-[#b5384c]/10",
    text: "text-[#b5384c]",
    symbol: "愛",
  },
  good: {
    label: "What you're good at",
    subtitle: "Vocation",
    color: "#2a3a6b", // indigo-jp
    ring: "ring-[#2a3a6b]/30",
    soft: "bg-[#2a3a6b]/10",
    text: "text-[#2a3a6b]",
    symbol: "技",
  },
  needs: {
    label: "What the world needs",
    subtitle: "Mission",
    color: "#6b7a5a", // moss
    ring: "ring-[#6b7a5a]/30",
    soft: "bg-[#6b7a5a]/10",
    text: "text-[#6b7a5a]",
    symbol: "世",
  },
  paid: {
    label: "What you can be paid for",
    subtitle: "Profession",
    color: "#d4a574", // hinoki
    ring: "ring-[#d4a574]/50",
    soft: "bg-[#d4a574]/15",
    text: "text-[#8a6a42]",
    symbol: "生",
  },
};
