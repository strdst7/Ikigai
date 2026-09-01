import { useEffect, useMemo, useState } from "react";
import {
  COLOURS,
  COLOUR_ORDER,
  ColourKey,
  STATEMENTS,
  WORDS,
} from "../data/brainColour";
import { scoreBrain, LIKERT, type Ratings, type BrainResult } from "../utils/brainColour";
import { Footer } from "../components/ui";
import type { Answers } from "../utils/analyze";

const PAGE_SIZE = 5;
const PAGES = Math.ceil(STATEMENTS.length / PAGE_SIZE);

/* ─────────────────────────────────────────────
   Brain quadrant diagram — sized by score
   ───────────────────────────────────────────── */
function BrainQuadrant({
  byColour,
  dominant,
  size = 380,
}: {
  byColour: Record<ColourKey, { percent: number }>;
  dominant: ColourKey;
  size?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const base = size * 0.42;

  // Quadrant positions (Herrmann model)
  const layout: { key: ColourKey; a0: number; a1: number }[] = [
    { key: "blue", a0: 180, a1: 270 }, // upper-left  (cerebral left)
    { key: "yellow", a0: 270, a1: 360 }, // upper-right (cerebral right)
    { key: "red", a0: 0, a1: 90 }, // lower-right (limbic right)
    { key: "green", a0: 90, a1: 180 }, // lower-left  (limbic left)
  ];

  const pt = (ang: number, rad: number) => [
    cx + rad * Math.cos((ang * Math.PI) / 180),
    cy + rad * Math.sin((ang * Math.PI) / 180),
  ];

  const GAP = 2.5;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto max-w-[420px]">
      <circle cx={cx} cy={cy} r={base} fill="none" stroke="#1f1a14" strokeOpacity="0.14" strokeWidth="1" />
      <line x1={cx} y1={cy - base} x2={cx} y2={cy + base} stroke="#1f1a14" strokeOpacity="0.14" strokeWidth="1" />
      <line x1={cx - base} y1={cy} x2={cx + base} y2={cy} stroke="#1f1a14" strokeOpacity="0.14" strokeWidth="1" />

      {layout.map(({ key, a0, a1 }) => {
        const meta = COLOURS[key];
        const pct = byColour[key].percent;
        const maxPct = Math.max(...COLOUR_ORDER.map((k) => byColour[k].percent), 1);
        const rad = base * (0.52 + 0.48 * (pct / maxPct));
        const [x0, y0] = pt(a0 + GAP, rad);
        const [x1, y1] = pt(a1 - GAP, rad);
        const mid = (a0 + a1) / 2;
        const [lx, ly] = pt(mid, rad * 0.6);

        return (
          <g key={key}>
            <path
              d={`M ${cx} ${cy} L ${x0} ${y0} A ${rad} ${rad} 0 0 1 ${x1} ${y1} Z`}
              fill={meta.hex}
              fillOpacity={0.18 + 0.5 * (pct / maxPct)}
              stroke={meta.hex}
              strokeWidth={key === dominant ? 2.2 : 1.2}
              strokeOpacity={key === dominant ? 0.9 : 0.45}
            />
            <text
              x={lx}
              y={ly + 4}
              textAnchor="middle"
              fontFamily="Fraunces, serif"
              fontSize="15"
              fill={meta.hex}
              opacity="0.95"
            >
              {pct}%
            </text>
            <text
              x={lx}
              y={ly + 20}
              textAnchor="middle"
              fontFamily="Inter, sans-serif"
              fontSize="8.5"
              letterSpacing="1.6"
              fill={meta.hex}
              opacity="0.8"
            >
              {meta.name.toUpperCase()}
            </text>
          </g>
        );
      })}

      {/* axis labels */}
      <text x={cx} y={cy - base - 6} textAnchor="middle" fontSize="8" letterSpacing="2" fill="#1f1a14" opacity="0.35">
        CEREBRAL · THINK
      </text>
      <text x={cx} y={cy + base + 15} textAnchor="middle" fontSize="8" letterSpacing="2" fill="#1f1a14" opacity="0.35">
        LIMBIC · FEEL
      </text>
      <text
        x={cx - base - 6}
        y={cy + 3}
        textAnchor="middle"
        fontSize="8"
        letterSpacing="2"
        fill="#1f1a14"
        opacity="0.35"
        transform={`rotate(-90 ${cx - base - 6} ${cy + 3})`}
      >
        LEFT
      </text>
      <text
        x={cx + base + 6}
        y={cy + 3}
        textAnchor="middle"
        fontSize="8"
        letterSpacing="2"
        fill="#1f1a14"
        opacity="0.35"
        transform={`rotate(90 ${cx + base + 6} ${cy + 3})`}
      >
        RIGHT
      </text>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Main component
   ───────────────────────────────────────────── */
type Phase = "intro" | "part1" | "part2" | "scanning" | "result";

export interface BigFiveSummary {
  archetype: string;
  lead: string;
  leadPct: number;
  lowest: string;
  lowestPct: number;
}

export default function BrainColour({
  ikigaiAnswers,
  bigFiveSummary,
  onHome,
  onFinish,
}: {
  ikigaiAnswers: Answers | null;
  bigFiveSummary: BigFiveSummary | null;
  onHome: () => void;
  onFinish: (result: BrainResult | null) => void;
}) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [page, setPage] = useState(0);
  const [ratings, setRatings] = useState<Ratings>({});
  const [words, setWords] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const result = useMemo(
    () => (phase === "result" ? scoreBrain(ratings, words) : null),
    [phase, ratings, words]
  );

  useEffect(() => {
    if (phase === "scanning") {
      let p = 0;
      const id = setInterval(() => {
        p += 4;
        setProgress(Math.min(p, 100));
      }, 70);
      const t = setTimeout(() => setPhase("result"), 2100);
      return () => {
        clearInterval(id);
        clearTimeout(t);
      };
    }
  }, [phase]);

  /* ── INTRO ── */
  if (phase === "intro") {
    return (
      <div className="min-h-screen flex flex-col relative ambient grain">
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-14">
          <div className="max-w-2xl text-center animate-fade-up">
            <button
              onClick={onHome}
              className="text-xs tracking-[0.2em] uppercase text-[#1f1a14]/40 hover:text-[#1f1a14] transition mb-10"
            >
              ← All assessments
            </button>
            <p className="font-serif italic text-[#d4a02c] tracking-widest text-sm mb-6">
              — assessment two —
            </p>
            <div className="flex justify-center gap-2 mb-6 text-2xl">
              <span>🔹</span>
              <span>🟢</span>
              <span>🔴</span>
              <span>🟡</span>
            </div>
            <h1 className="font-serif text-5xl md:text-6xl text-[#1f1a14] leading-[0.95] mb-6">
              Brain Colour <span className="italic">Personality</span>
            </h1>
            <p className="text-[#1f1a14]/70 text-lg leading-relaxed font-light mb-8">
              Your brain has four natural modes — analytical <em className="font-serif">Blue</em>,
              organised <em className="font-serif">Green</em>, relational{" "}
              <em className="font-serif">Red</em>, and imaginative{" "}
              <em className="font-serif">Yellow</em>. One of them leads.
            </p>
            <p className="text-[#1f1a14]/55 font-light mb-10 max-w-lg mx-auto">
              Based on the four-quadrant whole-brain model. 20 statements, then a handful of words —
              about four minutes.
            </p>

            <div className="grid sm:grid-cols-2 gap-3 mb-12 text-left">
              {COLOUR_ORDER.map((k) => {
                const c = COLOURS[k];
                return (
                  <div
                    key={k}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border"
                    style={{ borderColor: c.hex + "30", background: c.hex + "0a" }}
                  >
                    <span
                      className="w-9 h-9 rounded-full flex items-center justify-center font-serif shrink-0"
                      style={{ background: c.hex + "22", color: c.hex }}
                    >
                      {c.kanji}
                    </span>
                    <div className="min-w-0">
                      <p className="font-serif text-[#1f1a14] leading-tight">
                        {c.name} · <span className="italic">{c.tagline}</span>
                      </p>
                      <p className="text-[11px] text-[#1f1a14]/50 truncate">{c.mode}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setPhase("part1")}
              className="group inline-flex items-center gap-3 px-10 py-4 bg-[#1f1a14] text-[#f6f1e8] font-medium tracking-wide rounded-full hover:bg-[#2b2621] transition-all hover:shadow-xl hover:shadow-[#1f1a14]/20"
            >
              <span>Start the assessment</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /* ── PART 1: statements ── */
  if (phase === "part1") {
    const start = page * PAGE_SIZE;
    const slice = STATEMENTS.slice(start, start + PAGE_SIZE);
    const pageDone = slice.every((s) => ratings[s.id]);
    const overall = ((start + slice.filter((s) => ratings[s.id]).length) / STATEMENTS.length) * 100;

    return (
      <div className="min-h-screen flex flex-col grain">
        <div className="px-6 md:px-12 pt-8 pb-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => (page === 0 ? setPhase("intro") : setPage(page - 1))}
                className="text-sm text-[#1f1a14]/60 hover:text-[#1f1a14] transition"
              >
                ← Back
              </button>
              <span className="text-xs tracking-[0.2em] text-[#1f1a14]/50 uppercase tabular-nums">
                Part 1 · Statements {start + 1}–{Math.min(start + PAGE_SIZE, STATEMENTS.length)} of{" "}
                {STATEMENTS.length}
              </span>
            </div>
            <div className="h-[2px] bg-[#1f1a14]/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#d4a02c] transition-all duration-500"
                style={{ width: `${overall}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 px-6 py-6">
          <div className="max-w-3xl mx-auto animate-fade-up">
            <p className="text-center text-[#1f1a14]/50 text-sm font-serif italic mb-1">
              How true is each statement of you?
            </p>
            <p className="text-center text-[11px] tracking-[0.2em] uppercase text-[#1f1a14]/35 mb-8">
              Answer with your gut — don't overthink
            </p>

            <div className="space-y-4">
              {slice.map((s, i) => (
                <div
                  key={s.id}
                  className="p-5 rounded-2xl bg-white/40 border border-[#1f1a14]/10 animate-fade-up"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <p className="font-serif text-lg text-[#1f1a14] mb-4 leading-snug">{s.text}</p>
                  <div className="flex flex-wrap gap-2">
                    {LIKERT.map((l) => {
                      const on = ratings[s.id] === l.value;
                      return (
                        <button
                          key={l.value}
                          onClick={() => setRatings({ ...ratings, [s.id]: l.value })}
                          className={`flex-1 min-w-[68px] px-3 py-2.5 rounded-lg text-xs transition-all border ${
                            on
                              ? "text-[#f6f1e8] border-transparent shadow-md scale-[1.03]"
                              : "bg-white/50 text-[#1f1a14]/60 border-[#1f1a14]/10 hover:border-[#1f1a14]/30 hover:text-[#1f1a14]"
                          }`}
                          style={on ? { backgroundColor: "#d4a02c" } : undefined}
                        >
                          <span className="block font-medium">{l.value}</span>
                          <span className="block text-[10px] opacity-80">{l.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between">
              <p className="text-xs text-[#1f1a14]/40 font-serif italic">
                {pageDone ? "✓ Ready" : "Rate all five to continue"}
              </p>
              <button
                disabled={!pageDone}
                onClick={() => (page < PAGES - 1 ? setPage(page + 1) : setPhase("part2"))}
                className="px-7 py-3 rounded-full text-sm font-medium tracking-wide bg-[#d4a02c] text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#d4a02c]/30"
              >
                {page < PAGES - 1 ? "Continue →" : "Next: pick your words →"}
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /* ── PART 2: word picks ── */
  if (phase === "part2") {
    const canGo = words.length >= 2;
    return (
      <div className="min-h-screen flex flex-col grain">
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="max-w-2xl w-full animate-fade-up">
            <p className="text-center text-xs tracking-[0.25em] uppercase text-[#d4a02c] mb-3">
              Part 2 · Self-image
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-center text-[#1f1a14] mb-4">
              Pick the words that feel most like <span className="italic">you</span>
            </h2>
            <p className="text-center text-[#1f1a14]/60 font-light mb-3">
              Choose two to four. Don't pick what you admire — pick what is true.
            </p>
            <p className="text-center text-xs text-[#1f1a14]/40 mb-8 tabular-nums">
              {words.length} / 4 selected
            </p>

            <div className="flex flex-wrap justify-center gap-2.5 mb-10">
              {WORDS.map((w) => {
                const on = words.includes(w.word);
                const c = COLOURS[w.colour];
                return (
                  <button
                    key={w.word}
                    onClick={() =>
                      setWords(
                        on ? words.filter((x) => x !== w.word) : words.length < 4 ? [...words, w.word] : words
                      )
                    }
                    className={`px-4 py-2.5 rounded-full text-sm border transition-all font-light ${
                      on ? "text-white shadow-md scale-105" : "text-[#1f1a14]/70 bg-white/50 hover:bg-white"
                    }`}
                    style={
                      on
                        ? { backgroundColor: c.hex, borderColor: c.hex }
                        : { borderColor: "#1f1a1422" }
                    }
                  >
                    {w.word}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between gap-4">
              <button
                onClick={() => setPhase("part1")}
                className="text-sm text-[#1f1a14]/60 hover:text-[#1f1a14] transition"
              >
                ← Back
              </button>
              <button
                disabled={!canGo}
                onClick={() => setPhase("scanning")}
                className="px-7 py-3 rounded-full text-sm font-medium tracking-wide bg-[#1f1a14] text-[#f6f1e8] transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg"
              >
                Reveal my colours →
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /* ── SCANNING ── */
  if (phase === "scanning") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 grain">
        <div className="max-w-md text-center animate-fade-up">
          <div className="mb-10 flex justify-center gap-3">
            {COLOUR_ORDER.map((k, i) => (
              <span
                key={k}
                className="w-12 h-12 rounded-full animate-breathe"
                style={{
                  backgroundColor: COLOURS[k].hex + "33",
                  border: `1.5px solid ${COLOURS[k].hex}66`,
                  animationDelay: `${i * 300}ms`,
                }}
              />
            ))}
          </div>
          <p className="font-serif italic text-2xl text-[#1f1a14] mb-3">
            Weighing your four colours…
          </p>
          <div className="h-[3px] w-48 mx-auto bg-[#1f1a14]/10 rounded-full overflow-hidden">
            <div className="h-full bg-[#d4a02c] transition-all duration-100" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    );
  }

  /* ── RESULT ── */
  if (!result) return null;
  const dom = COLOURS[result.dominant];
  const sec = COLOURS[result.secondary];
  const least = COLOURS[result.least];

  return (
    <div className="min-h-screen grain">
      <div className="px-6 md:px-12 pt-10 pb-4 text-center">
        <button
          onClick={onHome}
          className="text-xs tracking-[0.2em] uppercase text-[#1f1a14]/40 hover:text-[#1f1a14] transition mb-8"
        >
          ← All assessments
        </button>
        <p className="font-serif italic text-[#d4a02c] tracking-widest text-sm mb-4 animate-fade-up">
          — your brain colour profile —
        </p>
        <h1 className="font-serif text-5xl md:text-6xl text-[#1f1a14] mb-4 animate-fade-up">
          <span style={{ color: dom.hex }}>{result.blend.name}</span>
        </h1>
        <p className="text-[#1f1a14]/70 max-w-xl mx-auto font-light animate-fade-up">
          {result.blend.line}
        </p>
      </div>

      {/* Diagram + bars */}
      <div className="px-6 py-10">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="flex justify-center animate-draw">
            <BrainQuadrant byColour={result.byColour} dominant={result.dominant} size={400} />
          </div>

          <div className="space-y-5 animate-fade-up">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-white/50 border border-[#1f1a14]/10">
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#1f1a14]/45 mb-2">
                  Hemisphere
                </p>
                <p className="font-serif text-lg text-[#1f1a14]">{result.axis.label}</p>
                <div className="mt-3 h-2 rounded-full overflow-hidden flex">
                  <div style={{ width: `${result.axis.left}%`, background: COLOURS.blue.hex }} />
                  <div style={{ width: `${result.axis.right}%`, background: COLOURS.red.hex }} />
                </div>
                <p className="text-[11px] text-[#1f1a14]/50 mt-1.5 tabular-nums">
                  L {result.axis.left}% · R {result.axis.right}%
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/50 border border-[#1f1a14]/10">
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#1f1a14]/45 mb-2">
                  Cortex mode
                </p>
                <p className="font-serif text-lg text-[#1f1a14]">{result.cortex.label}</p>
                <div className="mt-3 h-2 rounded-full overflow-hidden flex">
                  <div style={{ width: `${result.cortex.cerebral}%`, background: COLOURS.yellow.hex }} />
                  <div style={{ width: `${result.cortex.limbic}%`, background: COLOURS.green.hex }} />
                </div>
                <p className="text-[11px] text-[#1f1a14]/50 mt-1.5 tabular-nums">
                  C {result.cortex.cerebral}% · L {result.cortex.limbic}%
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {result.scores.map((s) => {
                const c = COLOURS[s.key];
                return (
                  <div key={s.key}>
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="font-serif text-[#1f1a14]">
                        {c.emoji} {c.name}{" "}
                        <span className="text-xs italic text-[#1f1a14]/50">· {c.tagline}</span>
                      </span>
                      <span
                        className="text-sm tabular-nums font-medium"
                        style={{ color: c.hex }}
                      >
                        {s.percent}%
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-[#1f1a14]/8 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${s.percent}%`, backgroundColor: c.hex }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Dominant colour deep dive */}
      <div className="px-6 py-12">
        <div
          className="max-w-4xl mx-auto rounded-3xl p-8 md:p-10 border animate-fade-up"
          style={{ borderColor: dom.hex + "35", background: dom.hex + "0a" }}
        >
          <div className="flex items-center gap-4 mb-6">
            <span
              className="w-14 h-14 rounded-full flex items-center justify-center font-serif text-2xl shrink-0"
              style={{ background: dom.hex + "22", color: dom.hex }}
            >
              {dom.kanji}
            </span>
            <div>
              <p className="text-[10px] tracking-[0.25em] uppercase" style={{ color: dom.hex }}>
                Dominant colour · {dom.quadrant}
              </p>
              <h2 className="font-serif text-3xl text-[#1f1a14]">
                {dom.name} — <span className="italic">{dom.tagline}</span>
              </h2>
            </div>
          </div>
          <p className="text-[#1f1a14]/80 leading-relaxed font-light mb-8 text-lg">{dom.description}</p>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#1f1a14]/45 mb-3">
                Strengths
              </p>
              <ul className="space-y-2">
                {dom.strengths.map((s, i) => (
                  <li key={i} className="flex gap-2 text-[#1f1a14]/80 text-sm">
                    <span style={{ color: dom.hex }}>◆</span>
                    <span className="font-light">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#1f1a14]/45 mb-3">
                Blind spots
              </p>
              <ul className="space-y-2">
                {dom.blindSpots.map((s, i) => (
                  <li key={i} className="flex gap-2 text-[#1f1a14]/80 text-sm">
                    <span className="text-[#1f1a14]/30">◇</span>
                    <span className="font-light">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t" style={{ borderColor: dom.hex + "25" }}>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#1f1a14]/45 mb-4">
              Where you thrive
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {dom.careers.map((c, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-full text-xs bg-white/60 border text-[#1f1a14]/75 font-light"
                  style={{ borderColor: dom.hex + "30" }}
                >
                  {c}
                </span>
              ))}
            </div>
            <p className="text-[#1f1a14]/70 font-light text-sm">
              <span className="font-serif italic" style={{ color: dom.hex }}>
                Ideal setting:{" "}
              </span>
              {dom.ideal}
            </p>
          </div>
        </div>
      </div>

      {/* All four colours summary */}
      <div className="px-6 pb-12">
        <div className="max-w-5xl mx-auto">
          <p className="font-serif italic text-center text-[#1f1a14]/60 mb-8">
            Your whole brain, all four colours
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {COLOUR_ORDER.map((k) => {
              const c = COLOURS[k];
              const isDom = k === result.dominant;
              const isSec = k === result.secondary;
              return (
                <div
                  key={k}
                  className="p-5 rounded-2xl border transition-all"
                  style={{
                    borderColor: c.hex + (isDom ? "66" : "28"),
                    background: c.hex + (isDom ? "14" : "07"),
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="w-10 h-10 rounded-full flex items-center justify-center font-serif text-lg"
                      style={{ background: c.hex + "22", color: c.hex }}
                    >
                      {c.kanji}
                    </span>
                    <span className="text-xs tabular-nums font-medium" style={{ color: c.hex }}>
                      {result.byColour[k].percent}%
                    </span>
                  </div>
                  <p className="font-serif text-[#1f1a14] leading-tight">
                    {c.name} · <span className="italic">{c.tagline}</span>
                  </p>
                  <p className="text-[10px] tracking-[0.15em] uppercase text-[#1f1a14]/40 mt-1 mb-3">
                    {isDom ? "Dominant" : isSec ? "Supporting" : k === result.least ? "Dormant" : "Present"}
                  </p>
                  <ul className="space-y-1.5">
                    {c.atWork.map((w, i) => (
                      <li key={i} className="text-xs text-[#1f1a14]/65 font-light">
                        · {w}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Big Five cross-read */}
      {bigFiveSummary && (
        <div className="px-6 pb-12">
          <div className="max-w-3xl mx-auto rounded-3xl border border-[#1f1a14]/12 bg-white/45 p-8 md:p-10">
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#29527a] mb-4 text-center">
              Brain colour × Big Five
            </p>
            <h2 className="font-serif text-2xl md:text-3xl text-center text-[#1f1a14] mb-5 leading-snug">
              A {dom.name.toLowerCase()} mind inside a{" "}
              <span className="italic">{bigFiveSummary.archetype}</span>
            </h2>
            <p className="text-[#1f1a14]/75 leading-relaxed font-light text-center">
              Your thinking style leans {dom.mode.toLowerCase()}, and your strongest personality dial
              is {bigFiveSummary.lead} at {bigFiveSummary.leadPct}% — those two together explain how
              you work: {dom.quadrant.toLowerCase()} pace, {bigFiveSummary.lead.toLowerCase()} as the
              driver. Your quietest dial, {bigFiveSummary.lowest} at {bigFiveSummary.lowestPct}%, is
              exactly the kind of thing a {dom.tagline.toLowerCase()} tends to skip — schedule it.
            </p>
          </div>
        </div>
      )}

      {/* Combined insight */}
      {ikigaiAnswers && (
        <div className="px-6 pb-12">
          <div className="max-w-3xl mx-auto rounded-3xl border border-[#1f1a14]/12 bg-white/45 p-8 md:p-10 text-center">
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#b5384c] mb-4">
              Ikigai × Brain Colour
            </p>
            <h2 className="font-serif text-2xl md:text-3xl text-[#1f1a14] mb-5 leading-snug">
              You're a <span style={{ color: dom.hex }}>{result.blend.name}</span> — so pursue your
              ikigai like one.
            </h2>
            <p className="text-[#1f1a14]/75 leading-relaxed font-light mb-6">
              Your dominant <span style={{ color: dom.hex }}>{dom.name}</span> brain wants{" "}
              {dom.mode.toLowerCase()} in whatever you build, and your supporting{" "}
              <span style={{ color: sec.hex }}>{sec.name}</span> will handle the rest. Your{" "}
              <span style={{ color: least.hex }}>{least.name}</span> quadrant is your quietest —
              borrow it deliberately rather than hoping for it.
            </p>
            <div className="text-left p-5 rounded-2xl border border-[#1f1a14]/10 bg-white/50">
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#1f1a14]/45 mb-2">
                Growth edge
              </p>
              <p className="font-serif italic text-[#1f1a14] text-lg">{dom.grows}</p>
            </div>
            <button
              onClick={() => onFinish(result)}
              className="mt-8 text-sm text-[#1f1a14]/60 hover:text-[#1f1a14] underline underline-offset-4 decoration-[#1f1a14]/20 hover:decoration-[#1f1a14]/60 transition"
            >
              ← Back to all assessments
            </button>
          </div>
        </div>
      )}

      {!ikigaiAnswers && (
        <div className="px-6 pb-16 text-center">
          <button
            onClick={() => onFinish(result)}
            className="text-sm text-[#1f1a14]/60 hover:text-[#1f1a14] underline underline-offset-4 decoration-[#1f1a14]/20 hover:decoration-[#1f1a14]/60 transition"
          >
            ← Back to all assessments
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}
