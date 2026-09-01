import { useEffect, useMemo, useRef, useState } from "react";
import { QUESTIONS, PILLAR_META, Pillar } from "../data/questions";
import { analyzeIkigai, type Answers } from "../utils/analyze";
import { Footer, VennDiagram, Reveal, BrainMini } from "../components/ui";
import type { BrainResult } from "../utils/brainColour";
import type { BigFiveSummary } from "./BrainColour";
import { COLOURS } from "../data/brainColour";

type Stage = "intro" | "questions" | "analyzing" | "result";

function Intro({ onStart, onHome }: { onStart: () => void; onHome: () => void }) {
  return (
    <div className="min-h-screen flex flex-col justify-center px-6 pt-12 pb-6 relative ambient grain">
      <div className="max-w-5xl w-full mx-auto relative z-10">
        <button
          onClick={onHome}
          className="text-xs tracking-[0.2em] uppercase text-[#1f1a14]/40 hover:text-[#1f1a14] transition mb-10"
        >
          ← All assessments
        </button>
        <p className="font-serif italic text-[#b5384c] tracking-widest text-sm mb-6">
          — assessment one · a quiet practice —
        </p>
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center">
          <div className="animate-fade-up">
            <h1 className="font-serif text-6xl md:text-7xl font-medium text-[#1f1a14] leading-[0.9] mb-6">
              Find your <span className="italic">ikigai</span>
            </h1>
            <p className="font-jp text-xl text-[#1f1a14]/55 mb-5">
              生き甲斐 — <em className="font-serif not-italic">iki</em> (life) +{" "}
              <em className="font-serif not-italic">gai</em> (value, worth)
            </p>
            <p className="text-[#1f1a14]/70 text-lg leading-relaxed mb-4 font-light">
              The Japanese art of discovering your reason for being — the place where what you love,
              what you're good at, what the world needs, and what can sustain you all quietly
              overlap.
            </p>
            <p className="text-[#1f1a14]/50 text-sm mb-8 italic font-serif">
              Twelve questions. Ten minutes. No right answers — only yours.
            </p>

            <button
              onClick={onStart}
              className="group relative inline-flex items-center gap-3 px-10 py-4 bg-[#1f1a14] text-[#f6f1e8] font-medium tracking-wide rounded-full hover:bg-[#2b2621] transition-all hover:shadow-xl hover:shadow-[#1f1a14]/20"
            >
              <span>Begin the journey</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>

            <ul className="mt-10 space-y-2.5">
              {(["love", "good", "needs", "paid"] as Pillar[]).map((p, i) => {
                const m = PILLAR_META[p];
                return (
                  <li
                    key={p}
                    className="flex items-center gap-3 text-sm text-[#1f1a14]/70 animate-fade-up"
                    style={{ animationDelay: `${200 + i * 90}ms` }}
                  >
                    <span className="font-jp text-base w-5" style={{ color: m.color }}>
                      {m.symbol}
                    </span>
                    <span className="h-px w-6" style={{ background: m.color + "66" }} />
                    <span className="font-light">{m.label}</span>
                    <span
                      className="text-[10px] tracking-[0.2em] uppercase ml-auto opacity-60"
                      style={{ color: m.color }}
                    >
                      {m.subtitle}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="relative">
            <div className="absolute inset-0 grid place-items-center opacity-[0.06]" aria-hidden>
              <svg viewBox="0 0 200 200" className="w-full h-full animate-spin-slow">
                <circle cx="100" cy="100" r="96" fill="none" stroke="#1f1a14" strokeWidth="0.5" strokeDasharray="3 7" />
                <circle cx="100" cy="100" r="74" fill="none" stroke="#1f1a14" strokeWidth="0.5" strokeDasharray="2 9" />
              </svg>
            </div>
            <div className="relative">
              <VennDiagram highlighted={null} size={440} />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-14 w-full">
        <Footer />
      </div>
    </div>
  );
}

function Questions({
  answers,
  setAnswers,
  onDone,
  onBack,
}: {
  answers: Answers;
  setAnswers: (a: Answers) => void;
  onDone: () => void;
  onBack: () => void;
}) {
  const [index, setIndex] = useState(0);
  const question = QUESTIONS[index];
  const meta = PILLAR_META[question.pillar];
  const progress = ((index + 1) / QUESTIONS.length) * 100;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [index]);

  const current = answers[question.id] || "";
  const canProceed = current.trim().length >= 10;

  const next = () => (index < QUESTIONS.length - 1 ? setIndex(index + 1) : onDone());
  const prev = () => (index > 0 ? setIndex(index - 1) : onBack());

  return (
    <div className="min-h-screen flex flex-col grain">
      <div className="px-6 md:px-12 pt-8 pb-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prev}
              className="text-sm text-[#1f1a14]/60 hover:text-[#1f1a14] transition flex items-center gap-1"
            >
              ← Back
            </button>
            <div className="flex items-center gap-3">
              <span className="text-xs tracking-[0.2em] text-[#1f1a14]/50 uppercase">
                Pillar {index < 3 ? "I" : index < 6 ? "II" : index < 9 ? "III" : "IV"}
              </span>
              <span className="text-xs text-[#1f1a14]/40">·</span>
              <span className="text-xs text-[#1f1a14]/50 tabular-nums">
                {String(index + 1).padStart(2, "0")} / {QUESTIONS.length}
              </span>
            </div>
          </div>
          <div className="h-[2px] bg-[#1f1a14]/10 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%`, backgroundColor: meta.color }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div key={question.id} className="max-w-2xl w-full animate-fade-up">
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-serif text-lg"
              style={{ backgroundColor: meta.color + "18", color: meta.color }}
            >
              {meta.symbol}
            </div>
            <div>
              <p className="text-xs tracking-[0.25em] uppercase" style={{ color: meta.color }}>
                {meta.subtitle}
              </p>
              <p className="text-sm text-[#1f1a14]/70 font-serif italic">{meta.label}</p>
            </div>
          </div>

          <h2 className="font-serif text-3xl md:text-4xl text-[#1f1a14] leading-tight mb-4">
            {question.prompt}
          </h2>
          <p className="text-[#1f1a14]/60 mb-8 font-light">{question.helper}</p>

          <textarea
            ref={textareaRef}
            value={current}
            onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
            placeholder={question.placeholder}
            rows={6}
            className="w-full resize-none bg-transparent border-b-2 border-[#1f1a14]/20 focus:border-[#1f1a14]/60 transition-colors py-4 text-lg text-[#1f1a14] placeholder:text-[#1f1a14]/30 font-light"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && canProceed) {
                e.preventDefault();
                next();
              }
            }}
          />

          <div className="flex items-center justify-between mt-8">
            <p className="text-xs text-[#1f1a14]/40 font-serif italic">
              {current.length < 10
                ? "A sentence or two is enough — write what feels true."
                : "✓ Press ⌘/Ctrl + Enter to continue"}
            </p>
            <button
              onClick={next}
              disabled={!canProceed}
              className="px-7 py-3 rounded-full text-sm font-medium tracking-wide transition-all disabled:opacity-30 disabled:cursor-not-allowed text-[#f6f1e8]"
              style={{ backgroundColor: meta.color }}
            >
              {index < QUESTIONS.length - 1 ? "Next question →" : "Reveal my ikigai →"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Analyzing({ onDone }: { onDone: () => void }) {
  const [dot, setDot] = useState(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setDot((d) => (d + 1) % 4), 400);
    const t = setTimeout(onDone, 2600);
    return () => {
      clearInterval(id);
      clearTimeout(t);
    };
  }, [onDone]);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 900);
    const t2 = setTimeout(() => setStep(2), 1800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const messages = [
    "Listening to what you said…",
    "Tracing the threads between your answers…",
    "Finding where the four circles meet…",
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 grain">
      <div className="max-w-md text-center animate-fade-up">
        <div className="mb-10 animate-breathe">
          <VennDiagram highlighted="center" size={360} />
        </div>
        <p className="font-serif italic text-2xl text-[#1f1a14] mb-3">
          {messages[step]}
          {".".repeat(dot)}
        </p>
        <p className="text-[#1f1a14]/50 text-sm font-light">
          Your ikigai isn't computed — it's remembered.
        </p>
      </div>
    </div>
  );
}

function Result({
  answers,
  onRestart,
  onHome,
  onComplete,
  brainResult,
  bigFiveSummary,
  onPick,
}: {
  answers: Answers;
  onRestart: () => void;
  onHome: () => void;
  onComplete: (a: Answers) => void;
  brainResult: BrainResult | null;
  bigFiveSummary: BigFiveSummary | null;
  onPick: (m: "brain" | "bigfive") => void;
}) {
  const result = useMemo(() => analyzeIkigai(answers), [answers]);
  const [activePillar, setActivePillar] = useState<Pillar | "center">("center");

  useEffect(() => {
    onComplete(answers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pillars: { key: Pillar; themes: string[] }[] = [
    { key: "love", themes: result.loveThemes },
    { key: "good", themes: result.goodThemes },
    { key: "needs", themes: result.needsThemes },
    { key: "paid", themes: result.paidThemes },
  ];

  return (
    <div className="min-h-screen grain">
      <div className="px-6 md:px-12 pt-10 pb-6 text-center">
        <button
          onClick={onHome}
          className="text-xs tracking-[0.2em] uppercase text-[#1f1a14]/40 hover:text-[#1f1a14] transition mb-8"
        >
          ← All assessments
        </button>
        <p className="font-serif italic text-[#b5384c] tracking-widest text-sm mb-4 animate-fade-up">
          — your reason for being —
        </p>
        <h1 className="font-serif text-5xl md:text-6xl text-[#1f1a14] mb-4 animate-fade-up">
          <span className="italic">Ikigai</span>, drawn from your own words
        </h1>
        <p className="text-[#1f1a14]/60 max-w-xl mx-auto font-light animate-fade-up">
          Not a single answer, but a direction. Below is what your twelve answers pointed toward.
        </p>
      </div>

      <div className="px-6 py-10">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="flex justify-center">
            <VennDiagram highlighted={activePillar} size={460} />
          </div>
          <div className="space-y-6 animate-fade-up">
            <div className="border-l-2 border-[#1f1a14] pl-6 py-2">
              <p className="text-xs tracking-[0.25em] uppercase text-[#1f1a14]/50 mb-2">Your Ikigai</p>
              <p className="font-serif text-2xl md:text-3xl text-[#1f1a14] leading-snug italic">
                "{result.intersection}"
              </p>
            </div>
            <p className="text-[#1f1a14]/70 leading-relaxed font-light">{result.explanation}</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <p className="font-serif italic text-center text-[#1f1a14]/60 mb-8">
            The four currents that carry you
          </p>
          <div className="grid sm:grid-cols-2 gap-5">
            {pillars.map(({ key, themes }) => {
              const meta = PILLAR_META[key];
              const isActive = activePillar === key || activePillar === "center";
              return (
                <button
                  key={key}
                  onMouseEnter={() => setActivePillar(key)}
                  onMouseLeave={() => setActivePillar("center")}
                  className={`text-left p-6 rounded-2xl border transition-all duration-500 ${
                    isActive ? "shadow-lg scale-[1.01]" : "opacity-70"
                  }`}
                  style={{ borderColor: meta.color + "30", backgroundColor: meta.color + "08" }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center font-serif"
                      style={{ backgroundColor: meta.color + "22", color: meta.color }}
                    >
                      {meta.symbol}
                    </div>
                    <div>
                      <p className="font-serif text-lg text-[#1f1a14]">{meta.label}</p>
                      <p className="text-[10px] tracking-[0.25em] uppercase" style={{ color: meta.color }}>
                        {meta.subtitle}
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {themes.map((t, i) => (
                      <li key={i} className="flex items-start gap-2 text-[#1f1a14]/80">
                        <span style={{ color: meta.color }}>◆</span>
                        <span className="font-light">{t}</span>
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <p className="font-serif italic text-center text-[#1f1a14]/60 mb-2">Where to walk next</p>
          <h2 className="font-serif text-3xl md:text-4xl text-center text-[#1f1a14] mb-10">
            Three small beginnings
          </h2>
          <div className="space-y-4">
            {result.nextSteps.map((step, i) => (
              <div
                key={i}
                className="flex gap-5 p-5 rounded-xl bg-white/40 border border-[#1f1a14]/10 animate-fade-up"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="font-serif text-4xl text-[#b5384c]/60 leading-none">{i + 1}</div>
                <p className="text-[#1f1a14]/80 leading-relaxed font-light pt-1">{step}</p>
              </div>
            ))}
          </div>

          {/* temperament cross-read */}
          <Reveal className="mt-14">
            <div className="rounded-3xl border border-[#1f1a14]/12 bg-white/45 overflow-hidden">
              <div className="px-6 py-5 border-b border-[#1f1a14]/10">
                <p className="text-[10px] tracking-[0.25em] uppercase text-[#29527a]">
                  Temperament check
                </p>
                <h3 className="font-serif text-2xl text-[#1f1a14] mt-1">
                  Will your mind actually <span className="italic">walk</span> this direction?
                </h3>
              </div>

              <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#1f1a14]/10">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-9 shrink-0">
                      {brainResult ? <BrainMini size={90} /> : null}
                    </span>
                    <p className="text-[10px] tracking-[0.22em] uppercase text-[#1f1a14]/45">
                      Brain colour
                    </p>
                  </div>
                  {brainResult ? (
                    <p className="text-sm text-[#1f1a14]/80 font-light leading-relaxed">
                      You think in{" "}
                      <span style={{ color: COLOURS[brainResult.dominant].hex }}>
                        {COLOURS[brainResult.dominant].name.toLowerCase()}
                      </span>{" "}
                      — {COLOURS[brainResult.dominant].mode.toLowerCase()}. Your ikigai will only stick
                      if the daily texture of it matches that mode.
                    </p>
                  ) : (
                    <button
                      onClick={() => onPick("brain")}
                      className="text-sm text-[#1f1a14]/60 hover:text-[#d4a02c] underline underline-offset-4 decoration-dotted transition"
                    >
                      Take assessment two to see how your thinking style fits this →
                    </button>
                  )}
                </div>

                <div className="p-6">
                  <p className="text-[10px] tracking-[0.22em] uppercase text-[#1f1a14]/45 mb-3">
                    Big Five
                  </p>
                  {bigFiveSummary ? (
                    <p className="text-sm text-[#1f1a14]/80 font-light leading-relaxed">
                      As{" "}
                      <span className="font-serif italic">{bigFiveSummary.archetype}</span>, your
                      strongest dial is{" "}
                      <span className="font-medium">{bigFiveSummary.lead}</span> (
                      {bigFiveSummary.leadPct}%) — use it as the engine of this path, and build
                      scaffolding around {bigFiveSummary.lowest.toLowerCase()} ({
                      bigFiveSummary.lowestPct}
                      %), which this direction will ask of you.
                    </p>
                  ) : (
                    <button
                      onClick={() => onPick("bigfive")}
                      className="text-sm text-[#1f1a14]/60 hover:text-[#29527a] underline underline-offset-4 decoration-dotted transition"
                    >
                      Take assessment three to measure the temperament you'll carry this with →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Reveal>

          <div className="mt-16 text-center">
            <p className="font-serif italic text-[#1f1a14]/50 mb-6 text-lg">
              "Your ikigai is a compass, not a destination."
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <button
                onClick={onRestart}
                className="text-sm text-[#1f1a14]/60 hover:text-[#1f1a14] underline underline-offset-4 decoration-[#1f1a14]/20 hover:decoration-[#1f1a14]/60 transition"
              >
                Begin again with fresh answers
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function Ikigai({
  onComplete,
  onHome,
  brainResult,
  bigFiveSummary,
  onPick,
}: {
  onComplete: (answers: Answers) => void;
  onHome: () => void;
  brainResult: BrainResult | null;
  bigFiveSummary: BigFiveSummary | null;
  onPick: (m: "brain" | "bigfive") => void;
}) {
  const [stage, setStage] = useState<Stage>("intro");
  const [answers, setAnswers] = useState<Answers>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [stage]);

  if (stage === "intro") return <Intro onStart={() => setStage("questions")} onHome={onHome} />;
  if (stage === "questions")
    return (
      <Questions
        answers={answers}
        setAnswers={setAnswers}
        onDone={() => setStage("analyzing")}
        onBack={() => setStage("intro")}
      />
    );
  if (stage === "analyzing") return <Analyzing onDone={() => setStage("result")} />;
  return (
    <Result
      answers={answers}
      onRestart={() => {
        setAnswers({});
        setStage("intro");
      }}
      onHome={onHome}
      onComplete={onComplete}
      brainResult={brainResult}
      bigFiveSummary={bigFiveSummary}
      onPick={onPick}
    />
  );
}
