import { BrainMini, PentagonChart, Reveal, VennMini } from "../components/ui";
import { TRAITS, TRAIT_ORDER, type TraitKey } from "../data/bigfive";

export interface HomeProps {
  done: { ikigai: boolean; brain: boolean; bigfive: boolean };
  bigFiveValues: Record<TraitKey, number> | null;
  onPick: (mode: "ikigai" | "brain" | "bigfive") => void;
}

const ENTRIES = [
  {
    mode: "ikigai" as const,
    numeral: "01",
    mark: "生き甲斐",
    title: "Ikigai",
    sub: "Your reason for being",
    accent: "#b5384c",
    desc: "Four pillars, twelve questions. Find the quiet overlap between what you love, what you're good at, what the world needs and what can pay — the Japanese answer to 'what is this life for?'",
    meta: ["12 open questions", "≈10 min", "written answers"],
    method: "Reflective interview",
  },
  {
    mode: "brain" as const,
    numeral: "02",
    mark: "四色",
    title: "Brain Colour",
    sub: "Your dominant thinking style",
    accent: "#d4a02c",
    desc: "Analytical Blue, organised Green, relational Red, imaginative Yellow. Twenty statements and a handful of words reveal which mode your brain reaches for first — and which one it quietly avoids.",
    meta: ["20 statements + word picks", "≈4 min", "tap to answer"],
    method: "Whole-brain quadrants",
  },
  {
    mode: "bigfive" as const,
    numeral: "03",
    mark: "五次性",
    title: "Big Five",
    sub: "OCEAN — the scientific standard",
    accent: "#29527a",
    desc: "Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism. Forty items, half of them reverse-keyed, plotted on a radar so you can see the shape of your temperament rather than a label.",
    meta: ["40 measured items", "≈5 min", "radar profile"],
    method: "Five-dial trait model",
  },
];

export default function Home({ done, bigFiveValues, onPick }: HomeProps) {
  const count = Object.values(done).filter(Boolean).length;

  return (
    <div className="min-h-screen relative ambient grain">
      <div className="relative z-10">
        {/* ── masthead ── */}
        <header className="max-w-6xl mx-auto px-6 md:px-10 pt-10 md:pt-14">
          <div className="flex items-start justify-between gap-6 border-b border-[#1f1a14]/15 pb-6">
            <div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-[#1f1a14]/45 mb-2">
                MI4INC · Self-discovery series
              </p>
              <h1 className="font-serif text-[2.6rem] leading-[0.92] sm:text-6xl md:text-7xl text-[#1f1a14]">
                Three maps,
                <br />
                <span className="italic font-light">one</span> territory.
              </h1>
            </div>
            <div className="text-right shrink-0 pt-1">
              <p className="font-jp text-2xl sm:text-3xl text-[#1f1a14]/25 leading-none mb-3 hidden sm:block">
                自分を知る
              </p>
              <div className="flex gap-1.5 justify-end mb-1.5">
                {(["ikigai", "brain", "bigfive"] as const).map((k) => (
                  <span
                    key={k}
                    className="w-7 h-1.5 rounded-full transition-all duration-500"
                    style={{ background: done[k] ? ENTRIES.find((e) => e.mode === k)!.accent : "#1f1a1420" }}
                  />
                ))}
              </div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#1f1a14]/50 tabular-nums">
                {count} of 3 mapped
              </p>
            </div>
          </div>
        </header>

        {/* ── lede ── */}
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-10 md:py-14 grid md:grid-cols-[1fr_auto] gap-8 items-end">
          <p className="max-w-xl text-lg md:text-xl text-[#1f1a14]/75 font-light leading-relaxed">
            Purpose, thinking style, temperament. Each assessment reads you from a different angle —
            and once two or more are complete, they start talking to each other, cross-referencing
            your answers into a single profile.
          </p>
          <p className="font-serif italic text-[#1f1a14]/45 text-sm md:text-right">
            {count === 0 && "Begin anywhere. Nothing is saved until you finish."}
            {count === 1 && "One map drawn. The second will annotate it."}
            {count === 2 && "Two down — the combined read is close."}
            {count === 3 && "All three drawn. Your profile is complete."}
          </p>
        </div>

        {/* ── index rows ── */}
        <main className="max-w-6xl mx-auto px-6 md:px-10 pb-16">
          <div className="border-t border-[#1f1a14]/15">
            {ENTRIES.map((e, i) => (
              <Reveal key={e.mode} delay={i * 90}>
                <button
                  onClick={() => onPick(e.mode)}
                  className="group w-full text-left border-b border-[#1f1a14]/15 py-8 md:py-10 transition-colors duration-500 hover:bg-white/40"
                  style={{ position: "relative" }}
                >
                  {/* accent wash on hover */}
                  <span
                    className="absolute inset-y-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ width: "38%", background: `linear-gradient(90deg, ${e.accent}14, transparent)` }}
                  />
                  <span
                    className="absolute left-0 top-0 bottom-0 w-[3px] scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top"
                    style={{ background: e.accent }}
                  />

                  <div className="relative grid md:grid-cols-[auto_1fr_auto] gap-6 md:gap-10 items-center px-2 md:px-6">
                    {/* numeral + mark */}
                    <div className="flex md:block items-center gap-4">
                      <span className="font-serif text-5xl md:text-7xl leading-none text-[#1f1a14]/12 group-hover:text-[#1f1a14]/25 transition-colors duration-500">
                        {e.numeral}
                      </span>
                      <span
                        className="font-jp text-3xl md:text-4xl leading-tight tracking-widest transition-transform duration-500 group-hover:-translate-y-0.5"
                        style={{ color: e.accent }}
                      >
                        {e.mark.split("").map((ch, j) => (
                          <span key={j} className="block">
                            {ch}
                          </span>
                        ))}
                      </span>
                    </div>

                    {/* text */}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-2">
                        <h2 className="font-serif text-3xl md:text-4xl text-[#1f1a14] leading-none">
                          {e.title}
                        </h2>
                        <p className="font-serif italic text-[#1f1a14]/55">{e.sub}</p>
                        {done[e.mode] && (
                          <span
                            className="text-[10px] tracking-[0.18em] uppercase px-2.5 py-1 rounded-full text-white"
                            style={{ background: e.accent }}
                          >
                            ✓ Mapped
                          </span>
                        )}
                      </div>
                      <p className="text-[#1f1a14]/70 font-light leading-relaxed max-w-2xl mb-4">
                        {e.desc}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] text-[#1f1a14]/45">
                        <span
                          className="tracking-[0.18em] uppercase"
                          style={{ color: e.accent }}
                        >
                          {e.method}
                        </span>
                        {e.meta.map((m) => (
                          <span key={m} className="inline-flex items-center gap-3">
                            <span className="opacity-30">·</span>
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* mini diagram */}
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 md:w-28 md:h-28 shrink-0 transition-transform duration-700 group-hover:scale-[1.07]">
                        {e.mode === "ikigai" && <VennMini />}
                        {e.mode === "brain" && <BrainMini />}
                        {e.mode === "bigfive" && (
                          <PentagonChart
                            values={bigFiveValues ?? ({ O: 50, C: 50, E: 50, A: 50, N: 50 } as Record<TraitKey, number>)}
                            size={200}
                            showLabels={false}
                            baseline={!bigFiveValues}
                          />
                        )}
                      </div>
                      <span
                        className="text-2xl transition-transform duration-500 group-hover:translate-x-1.5"
                        style={{ color: e.accent }}
                      >
                        →
                      </span>
                    </div>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>

          {/* ── how it works strip ── */}
          <Reveal className="mt-14">
            <div className="rounded-3xl bg-[#1f1a14] text-[#f6f1e8] px-6 py-8 md:px-10 md:py-9 grid md:grid-cols-3 gap-8">
              {[
                { n: "One", t: "Answer honestly, not aspirationally", d: "The instruments only resolve when you describe the real you — the Monday-morning you." },
                { n: "Two", t: "Let the results disagree", d: "Your ikigai and your temperament will argue sometimes. That argument is the useful part." },
                { n: "Three", t: "Treat all three as drafts", d: "Revisit in a season. Traits drift slowly, and your purpose is allowed to sharpen." },
              ].map((s, i) => (
                <div key={s.n} className={`md:px-1 ${i > 0 ? "md:border-l md:border-[#f6f1e8]/15" : ""}`}>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#f6f1e8]/40 mb-2">
                    {s.n}
                  </p>
                  <p className="font-serif text-xl mb-2 leading-snug">{s.t}</p>
                  <p className="text-sm text-[#f6f1e8]/65 font-light leading-relaxed">{s.d}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* trait ticker */}
          <Reveal className="mt-10">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs">
              <span className="tracking-[0.25em] uppercase text-[#1f1a14]/40">Instruments used</span>
              {TRAIT_ORDER.map((t) => (
                <span key={t} className="inline-flex items-center gap-2 text-[#1f1a14]/60">
                  <span className="w-2 h-2 rounded-full" style={{ background: TRAITS[t].hex }} />
                  {TRAITS[t].name}
                </span>
              ))}
              <span className="inline-flex items-center gap-2 text-[#1f1a14]/60">
                <span className="w-2 h-2 rounded-full" style={{ background: "#d4a02c" }} />
                Whole-brain model
              </span>
              <span className="inline-flex items-center gap-2 text-[#1f1a14]/60">
                <span className="w-2 h-2 rounded-full" style={{ background: "#b5384c" }} />
                Ikigai diagram
              </span>
            </div>
          </Reveal>
        </main>
      </div>

      <footer className="relative z-10 w-full py-6 px-6 text-center text-[#1f1a14]/45">
        <p className="text-[11px] tracking-[0.2em] uppercase font-light flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <span>Nur Amirah Mohd Kamil</span>
          <span className="opacity-40">|</span>
          <span className="font-serif not-italic">MI4INC.</span>
          <span className="opacity-40">|</span>
          <a
            href="https://aimirah.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#b5384c] transition-colors underline underline-offset-4 decoration-transparent hover:decoration-[#b5384c]/50"
          >
            aimirah.com
          </a>
        </p>
      </footer>
    </div>
  );
}
