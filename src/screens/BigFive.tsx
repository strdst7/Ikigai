import { useEffect, useMemo, useState } from "react";
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip } from "chart.js";
import { Radar } from "react-chartjs-2";
import { ITEMS, LIKERT5, TRAITS, TRAIT_ORDER, type TraitKey } from "../data/bigfive";
import { scoreBigFive, type BigFiveAnswers } from "../utils/bigfive";
import { BAND_LABEL } from "../data/bigfive";
import { CountNumber, Footer, PentagonChart, Reveal } from "../components/ui";
import type { Answers } from "../utils/analyze";
import { analyzeIkigai } from "../utils/analyze";
import { COLOURS } from "../data/brainColour";
import type { BrainResult } from "../utils/brainColour";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

const PER_PAGE = 5;
const PAGES = Math.ceil(ITEMS.length / PER_PAGE);

type Phase = "intro" | "test" | "scanning" | "result";

/* ─── the O C E A N rail — a ring per trait that fills as you answer ─── */
function TraitRail({ answers, vertical = false }: { answers: BigFiveAnswers; vertical?: boolean }) {
  const CIRC = 2 * Math.PI * 15;
  return (
    <div className={vertical ? "flex flex-col gap-4" : "flex gap-3"}>
      {TRAIT_ORDER.map((t) => {
        const items = ITEMS.filter((i) => i.trait === t);
        const done = items.filter((i) => answers[i.id]).length;
        const pct = done / items.length;
        const meta = TRAITS[t];
        const complete = done === items.length;
        return (
          <div key={t} className="relative w-11" title={`${meta.name} — ${done}/${items.length} answered`}>
            <svg viewBox="0 0 36 36" className="w-full h-auto -rotate-90">
              <circle cx="18" cy="18" r="15" fill="none" stroke="#1f1a14" strokeOpacity="0.12" strokeWidth="2.5" />
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke={meta.hex}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={CIRC * (1 - pct)}
                style={{ transition: "stroke-dashoffset 600ms cubic-bezier(.2,.7,.2,1)" }}
              />
            </svg>
            <span
              className="absolute inset-0 grid place-items-center font-serif text-sm leading-none transition-opacity duration-500"
              style={{ color: meta.hex, opacity: complete ? 1 : 0.5 }}
            >
              {t}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Likert row ─── */
function ScaleRow({
  value,
  onChange,
  accent,
}: {
  value?: number;
  onChange: (v: number) => void;
  accent: string;
}) {
  return (
    <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
      {LIKERT5.map((l) => {
        const on = value === l.v;
        return (
          <button
            key={l.v}
            onClick={() => onChange(l.v)}
            title={l.label}
            aria-label={l.label}
            className={`group/scale relative flex flex-col items-center gap-1.5 py-2.5 rounded-lg border transition-all duration-200 ${
              on ? "shadow-md -translate-y-0.5" : "bg-white/40 border-[#1f1a14]/10 hover:border-[#1f1a14]/25"
            }`}
            style={on ? { backgroundColor: accent, borderColor: accent } : undefined}
          >
            <span
              className={`w-4 h-4 rounded-full border transition-all ${on ? "scale-110" : "group-hover/scale:scale-110"}`}
              style={{
                borderColor: on ? "rgba(255,255,255,.85)" : "#1f1a1455",
                backgroundColor: on ? "#fff" : "transparent",
              }}
            />
            <span
              className={`text-[9px] sm:text-[10px] leading-tight text-center px-0.5 ${
                on ? "text-white font-medium" : "text-[#1f1a14]/45"
              }`}
            >
              {l.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ─── Trait gauge ─── */
function TraitGauge({
  trait,
  percent,
  mounted,
  open,
  onToggle,
}: {
  trait: TraitKey;
  percent: number;
  mounted: boolean;
  open: boolean;
  onToggle: () => void;
}) {
  const meta = TRAITS[trait];
  const band = percent >= 60 ? "high" : percent < 40 ? "low" : "mid";
  const bandName = BAND_LABEL[
    percent >= 85 ? "very-high" : percent >= 60 ? "high" : percent >= 40 ? "moderate" : percent >= 15 ? "low" : "very-low"
  ];

  return (
    <div
      className="rounded-2xl border transition-all duration-500"
      style={{ borderColor: meta.hex + (open ? "55" : "25"), background: open ? meta.hex + "0c" : "rgba(255,255,255,.35)" }}
    >
      <button onClick={onToggle} className="w-full text-left p-5 sm:p-6 group">
        <div className="flex items-center gap-4 mb-3">
          <span
            className="w-11 h-11 rounded-full grid place-items-center font-jp text-xl shrink-0 transition-transform group-hover:scale-105"
            style={{ background: meta.hex + "22", color: meta.hex }}
          >
            {meta.kanji}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-serif text-xl sm:text-2xl text-[#1f1a14] leading-tight">
              {meta.fullName}
            </p>
            <p className="text-[11px] tracking-[0.16em] uppercase text-[#1f1a14]/45">
              {trait} · {meta.tagline}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-serif text-2xl sm:text-3xl leading-none" style={{ color: meta.hex }}>
              <CountNumber value={percent} suffix="%" />
            </p>
            <p className="text-[10px] tracking-[0.15em] uppercase text-[#1f1a14]/50 mt-1">{bandName}</p>
          </div>
        </div>

        <div className="relative h-3 rounded-full bg-[#1f1a14]/8 overflow-hidden">
          {/* population band */}
          <div className="absolute inset-y-0 left-[16%] w-[68%] bg-[#1f1a14]/[0.05]" />
          <div className="absolute inset-y-0 left-1/2 w-px bg-[#1f1a14]/25" />
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${mounted ? percent : 0}%`, backgroundColor: meta.hex }}
          />
        </div>
        <div className="flex justify-between mt-1.5 text-[9px] tracking-[0.12em] uppercase text-[#1f1a14]/30">
          <span>{meta.poles.low}</span>
          <span className="opacity-0">mid</span>
          <span>{meta.poles.high}</span>
        </div>
      </button>

      <div
        className="grid transition-all duration-500 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="px-5 sm:px-6 pb-6 pt-1 space-y-5 border-t" style={{ borderColor: meta.hex + "22" }}>
            <p className="text-[#1f1a14]/70 font-light leading-relaxed">{meta.describes}</p>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <p className="text-[10px] tracking-[0.22em] uppercase text-[#1f1a14]/40 mb-2">
                  What {band === "mid" ? "a middle score" : band === "high" ? "a high score" : "your score"} looks like
                </p>
                <ul className="space-y-1.5">
                  {(band === "low" ? meta.lowTraits : meta.highTraits).map((x, i) => (
                    <li key={i} className="text-sm text-[#1f1a14]/80 font-light flex gap-2">
                      <span style={{ color: meta.hex }}>◆</span>
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.22em] uppercase text-[#1f1a14]/40 mb-2">
                  Strengths to lean on
                </p>
                <ul className="space-y-1.5">
                  {(band === "low" ? meta.lowStrengths : meta.highStrengths).map((x, i) => (
                    <li key={i} className="text-sm text-[#1f1a14]/80 font-light flex gap-2">
                      <span className="text-[#1f1a14]/30">+</span>
                      {x}
                    </li>
                  ))}
                </ul>
                <p className="text-[10px] tracking-[0.22em] uppercase text-[#1f1a14]/40 mt-4 mb-2">
                  Watch for
                </p>
                <ul className="space-y-1.5">
                  {(band === "low" ? meta.lowWatch : meta.highWatch).map((x, i) => (
                    <li key={i} className="text-sm text-[#1f1a14]/65 font-light flex gap-2">
                      <span className="text-[#1f1a14]/30">!</span>
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="text-sm text-[#1f1a14]/65 font-light italic border-l-2 pl-4" style={{ borderColor: meta.hex + "66" }}>
              {meta.underPressure}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── Main ───────────────────────── */
export default function BigFive({
  onHome,
  onComplete,
  ikigaiAnswers,
  brainResult,
}: {
  onHome: () => void;
  onComplete: (a: BigFiveAnswers) => void;
  ikigaiAnswers: Answers | null;
  brainResult: BrainResult | null;
}) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState<BigFiveAnswers>({});
  const [scan, setScan] = useState(0);
  const [open, setOpen] = useState<TraitKey | null>("O");
  const [mounted, setMounted] = useState(false);

  const result = useMemo(() => (phase === "result" ? scoreBigFive(answers) : null), [phase, answers]);

  useEffect(() => {
    if (phase === "result") {
      const t = setTimeout(() => setMounted(true), 120);
      return () => clearTimeout(t);
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== "scanning") return;
    const id = setInterval(() => setScan((s) => Math.min(s + 3.5, 100)), 55);
    const t = setTimeout(() => {
      onComplete(answers);
      setPhase("result");
    }, 1750);
    return () => {
      clearInterval(id);
      clearTimeout(t);
    };
  }, [phase, answers, onComplete]);

  const start = page * PER_PAGE;
  const slice = ITEMS.slice(start, start + PER_PAGE);
  const answeredOnPage = slice.filter((i) => answers[i.id]).length;
  const pageDone = answeredOnPage === slice.length;
  const totalAnswered = ITEMS.filter((i) => answers[i.id]).length;

  /* keyboard: 1–5 rates the first unanswered statement, Enter advances */
  useEffect(() => {
    if (phase !== "test") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && pageDone) {
        e.preventDefault();
        if (page < PAGES - 1) {
          setPage(page + 1);
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else setPhase("scanning");
        return;
      }
      const n = Number(e.key);
      if (n >= 1 && n <= 5) {
        const target = slice.find((i) => !answers[i.id]);
        if (target) setAnswers({ ...answers, [target.id]: n });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, page, pageDone, answers, slice]);

  const values = useMemo(() => {
    const v = {} as Record<TraitKey, number>;
    for (const t of TRAIT_ORDER) v[t] = 50;
    return v;
  }, []);

  /* ── INTRO ── */
  if (phase === "intro") {
    return (
      <div className="min-h-screen relative ambient grain">
        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 py-10 lg:py-14">
          <button
            onClick={onHome}
            className="text-xs tracking-[0.25em] uppercase text-[#1f1a14]/40 hover:text-[#1f1a14] transition mb-12"
          >
            ← All assessments
          </button>

          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-16 items-center">
            <div className="animate-fade-up">
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-10 bg-[#1f1a14]/30" />
                <p className="text-[11px] tracking-[0.3em] uppercase text-[#1f1a14]/50">
                  Assessment three · the scientist's one
                </p>
              </div>
              <h1 className="font-serif text-[3.5rem] md:text-[5.5rem] leading-[0.86] text-[#1f1a14] mb-2">
                Big
                <span className="italic font-light"> Five</span>
              </h1>
              <p className="font-jp text-2xl text-[#1f1a14]/35 mb-7">五つの気質</p>

              <p className="text-lg text-[#1f1a14]/75 font-light leading-relaxed mb-4 max-w-xl">
                The only personality model that keeps surviving replication. Not types, not
                buckets — five dials, each of you set somewhere specific between two poles.
              </p>
              <p className="text-sm text-[#1f1a14]/55 font-light max-w-xl mb-8">
                40 statements · 8 per trait · half of them quietly reversed so you can't game it.
                Roughly five minutes. Answer for who you actually are, not who you're being at work.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setPhase("test")}
                  className="group inline-flex items-center gap-3 px-9 py-4 bg-[#1f1a14] text-[#f6f1e8] font-medium tracking-wide rounded-full hover:bg-[#2b2621] transition-all hover:shadow-xl hover:shadow-[#1f1a14]/20"
                >
                  <span>Measure my five dials</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </button>
                {ikigaiAnswers && (
                  <span className="text-[11px] tracking-[0.18em] uppercase text-[#4c6b3c]">
                    ✓ Will be cross-read with your ikigai
                  </span>
                )}
              </div>
            </div>

            {/* living pentagon */}
            <div className="relative">
              <div
                className="absolute inset-0 grid place-items-center opacity-[0.07]"
                aria-hidden
              >
                <svg viewBox="0 0 200 200" className="w-full h-full animate-spin-slow">
                  <polygon
                    points="100,8 187,71 154,177 46,177 13,71"
                    fill="none"
                    stroke="#1f1a14"
                    strokeWidth="0.6"
                    strokeDasharray="4 6"
                  />
                </svg>
              </div>
              <div className="relative grid grid-cols-2 gap-4 sm:gap-5">
                {TRAIT_ORDER.map((t, i) => {
                  const m = TRAITS[t];
                  return (
                    <button
                      key={t}
                      onClick={() => setPhase("test")}
                      className={`text-left p-4 rounded-2xl border backdrop-blur-[1px] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-fade-up ${
                        i === 4 ? "col-span-2" : ""
                      }`}
                      style={{
                        borderColor: m.hex + "3a",
                        background: m.hex + "0f",
                        animationDelay: `${i * 90}ms`,
                      }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-jp text-2xl" style={{ color: m.hex }}>
                          {m.kanji}
                        </span>
                        <span
                          className="font-serif text-3xl leading-none opacity-25"
                          style={{ color: m.hex }}
                        >
                          {m.name[0]}
                        </span>
                      </div>
                      <p className="font-serif text-lg text-[#1f1a14] leading-tight">{m.name}</p>
                      <p className="text-[10px] text-[#1f1a14]/50 mt-0.5">{m.tagline}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /* ── TEST ── */
  if (phase === "test") {
    return (
      <div className="min-h-screen relative grain">
        <div className="sticky top-0 z-20 backdrop-blur-sm bg-[#f6f1e8]/85 border-b border-[#1f1a14]/10">
          <div className="max-w-4xl mx-auto px-6 pt-5 pb-4">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => (page === 0 ? setPhase("intro") : setPage(page - 1))}
                className="text-sm text-[#1f1a14]/60 hover:text-[#1f1a14] transition"
              >
                ← Back
              </button>
              <div className="flex items-center gap-3 text-xs text-[#1f1a14]/50 tabular-nums">
                <span className="tracking-[0.2em] uppercase">Big Five</span>
                <span className="opacity-40">·</span>
                <span>
                  {totalAnswered} / {ITEMS.length}
                </span>
              </div>
              {totalAnswered >= Math.ceil(ITEMS.length * 0.6) ? (
                <button
                  onClick={() => setPhase("scanning")}
                  className="text-xs text-[#1f1a14]/55 hover:text-[#b5384c] transition"
                  title="Score the items you've answered — unanswered ones fall to neutral"
                >
                  Finish early →
                </button>
              ) : (
                <span className="text-xs text-[#1f1a14]/25 tabular-nums">
                  {ITEMS.length - totalAnswered} to go
                </span>
              )}
            </div>
            <div className="h-[2px] bg-[#1f1a14]/10 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-500 ease-out"
                style={{
                  width: `${(totalAnswered / ITEMS.length) * 100}%`,
                  background: "linear-gradient(90deg,#29527a,#4c6b3c,#c8552f,#b86a86,#6d4c63)",
                }}
              />
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8 flex gap-8">
          <aside className="hidden lg:flex flex-col items-center pt-14 sticky top-28 self-start gap-3">
            <span className="text-[9px] tracking-[0.25em] uppercase text-[#1f1a14]/35">
              answered
            </span>
            <TraitRail answers={answers} vertical />
            <span className="text-[9px] tracking-[0.2em] uppercase text-[#1f1a14]/30 tabular-nums">
              {totalAnswered}/{ITEMS.length}
            </span>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between mb-6 lg:hidden">
              <TraitRail answers={answers} />
            </div>

            <p className="font-serif text-2xl text-[#1f1a14] mb-1 animate-fade-up">
              Page {page + 1} of {PAGES}
            </p>
            <p className="text-sm text-[#1f1a14]/55 font-light mb-7 animate-fade-up">
              Rate how accurate each statement is <em className="font-serif">for you, generally</em> — not
              for this week. Press keys 1–5, then Enter.
            </p>

            <div className="space-y-3.5">
              {slice.map((item, i) => {
                const meta = TRAITS[item.trait];
                return (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-white/50 border transition-all duration-300 animate-fade-up"
                    style={{
                      borderColor: answers[item.id] ? meta.hex + "4d" : "#1f1a1414",
                      animationDelay: `${i * 70}ms`,
                      boxShadow: answers[item.id] ? `0 8px 24px -18px ${meta.hex}` : "none",
                    }}
                  >
                    <p className="font-serif text-lg sm:text-xl text-[#1f1a14] leading-snug mb-4">
                      <span className="text-[#1f1a14]/25 mr-2 text-base">
                        {String(start + i + 1).padStart(2, "0")}
                      </span>
                      {item.text}
                    </p>
                    <ScaleRow
                      value={answers[item.id]}
                      accent={meta.hex}
                      onChange={(v) => setAnswers({ ...answers, [item.id]: v })}
                    />
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex items-center justify-between gap-4">
              <p className="text-xs text-[#1f1a14]/40 font-serif italic">
                {pageDone
                  ? "✓ This page is complete"
                  : `${slice.length - answeredOnPage} statement${slice.length - answeredOnPage === 1 ? "" : "s"} left on this page`}
              </p>
              <button
                disabled={!pageDone}
                onClick={() => (page < PAGES - 1 ? setPage(page + 1) : setPhase("scanning"))}
                className="px-7 py-3 rounded-full text-sm font-medium tracking-wide text-[#f6f1e8] bg-[#1f1a14] transition-all disabled:opacity-25 disabled:cursor-not-allowed hover:shadow-xl"
              >
                {page < PAGES - 1 ? "Next page →" : "Plot my radar →"}
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
      <div className="min-h-screen grid place-items-center px-6 relative ambient grain">
        <div className="relative z-10 text-center max-w-sm animate-fade-up">
          <div className="mx-auto mb-8">
            <PentagonChart values={values} size={260} showLabels />
          </div>
          <p className="font-serif italic text-xl text-[#1f1a14] mb-4">
            Plotting your five dials…
          </p>
          <div className="h-[3px] bg-[#1f1a14]/10 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-100"
              style={{
                width: `${scan}%`,
                background: "linear-gradient(90deg,#29527a,#4c6b3c,#c8552f,#b86a86,#6d4c63)",
              }}
            />
          </div>
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#1f1a14]/40 mt-4">
            {totalAnswered} of {ITEMS.length} items scored
          </p>
        </div>
      </div>
    );
  }

  /* ── RESULT ── */
  if (!result) return null;

  const radarData = {
    labels: TRAIT_ORDER.map((t) => TRAITS[t].name),
    datasets: [
      {
        label: "You",
        data: TRAIT_ORDER.map((t) => result.scores[t].percent),
        backgroundColor: "rgba(41,82,122,0.16)",
        borderColor: "#1f1a14",
        borderWidth: 1.6,
        pointBackgroundColor: TRAIT_ORDER.map((t) => TRAITS[t].hex),
        pointBorderColor: "#f6f1e8",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 9,
        fill: true,
      },
      {
        label: "Population midpoint",
        data: TRAIT_ORDER.map(() => 50),
        backgroundColor: "rgba(31,26,20,0.03)",
        borderColor: "rgba(31,26,20,0.35)",
        borderWidth: 1,
        borderDash: [4, 4],
        pointRadius: 0,
        fill: true,
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1200, easing: "easeOutQuart" as const },
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 25,
          showLabelBackdrop: false,
          color: "rgba(31,26,20,0.35)",
          font: { size: 9, family: "Zen Kaku Gothic New" },
          callback: (v: number | string) => `${v}`,
        },
        grid: { color: "rgba(31,26,20,0.12)" },
        angleLines: { color: "rgba(31,26,20,0.12)" },
        pointLabels: {
          color: "#1f1a14",
          font: { size: 13, family: "Fraunces", weight: 500 as const },
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1f1a14",
        padding: 10,
        titleFont: { family: "Zen Kaku Gothic New", size: 11 },
        bodyFont: { family: "Zen Kaku Gothic New", size: 12 },
        callbacks: {
          label: (ctx: { datasetIndex: number; parsed: { r: number } }) =>
            ctx.datasetIndex === 1
              ? "reference midpoint"
              : `${ctx.parsed.r}% · ${BAND_LABEL[
                  ctx.parsed.r >= 85
                    ? "very-high"
                    : ctx.parsed.r >= 60
                      ? "high"
                      : ctx.parsed.r >= 40
                        ? "moderate"
                        : ctx.parsed.r >= 15
                          ? "low"
                          : "very-low"
                ]}`,
        },
      },
    },
  };

  const ikigai = ikigaiAnswers ? analyzeIkigai(ikigaiAnswers) : null;

  return (
    <div className="min-h-screen relative grain">
      <div className="max-w-6xl mx-auto px-6 md:px-10 pt-10 pb-6">
        <button
          onClick={onHome}
          className="text-xs tracking-[0.25em] uppercase text-[#1f1a14]/40 hover:text-[#1f1a14] transition mb-10"
        >
          ← All assessments
        </button>

        {/* header — asymmetric, not centered */}
        <div className="grid lg:grid-cols-[1.35fr_1fr] gap-8 lg:gap-14 items-end mb-12">
          <div className="animate-fade-up">
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#1f1a14]/45 mb-4">
              Your Big Five profile
            </p>
            <h1 className="font-serif text-5xl md:text-7xl leading-[0.88] text-[#1f1a14] mb-5">
              {result.archetype.name.split(" ").slice(0, 2).join(" ")}{" "}
              <span className="italic font-light">{result.archetype.name.split(" ").slice(2).join(" ")}</span>
            </h1>
            <p className="text-[#1f1a14]/75 leading-relaxed font-light text-lg max-w-2xl">
              {result.archetype.line}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 lg:justify-end animate-fade-up">
            {TRAIT_ORDER.map((t) => {
              const s = result.scores[t];
              const m = TRAITS[t];
              const up = s.pole === "high";
              return (
                <span
                  key={t}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-full border text-xs"
                  style={{ borderColor: m.hex + "44", background: m.hex + "12" }}
                >
                  <span className="font-serif text-base leading-none" style={{ color: m.hex }}>
                    {t}
                  </span>
                  <span className="text-[#1f1a14]/70 tabular-nums">{s.percent}</span>
                  <span style={{ color: m.hex }}>{up ? "↑" : s.pole === "low" ? "↓" : "→"}</span>
                </span>
              );
            })}
          </div>
        </div>

        {/* radar */}
        <Reveal className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-center mb-6">
          <div className="rounded-3xl border border-[#1f1a14]/12 bg-white/45 p-5 sm:p-8">
            <div className="flex items-start justify-between mb-4 gap-4">
              <div>
                <p className="font-serif text-xl text-[#1f1a14] leading-tight">OCEAN, plotted</p>
                <p className="text-xs text-[#1f1a14]/50">
                  Solid line = you · dashed ring = population midpoint
                </p>
              </div>
              <p className="font-jp text-3xl text-[#1f1a14]/15 hidden sm:block">五角形</p>
            </div>
            <div className="relative h-[300px] sm:h-[380px]">
              <Radar data={radarData as never} options={radarOptions as never} />
            </div>
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-[#1f1a14]/10">
              {TRAIT_ORDER.map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5 text-xs text-[#1f1a14]/65">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: TRAITS[t].hex }} />
                  {TRAITS[t].name}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl bg-[#1f1a14] text-[#f6f1e8] p-6 sm:p-7">
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#f6f1e8]/45 mb-2">
                Shape reading
              </p>
              <p className="font-serif text-2xl leading-snug mb-3">{result.headline}</p>
              <p className="text-sm text-[#f6f1e8]/70 font-light leading-relaxed">
                Your lowest dial is{" "}
                <span style={{ color: TRAITS[result.least.key].hex }}>
                  {TRAITS[result.least.key].name} at {result.least.percent}%
                </span>
                . High-low contrast is where your energy goes: you're not balanced, you're
                specialised — which is what makes you useful at anything.
              </p>
            </div>

            <div className="rounded-3xl border border-[#1f1a14]/12 bg-white/45 p-6">
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#1f1a14]/45 mb-2">
                Binary type code
              </p>
              <p className="font-serif text-4xl tracking-[0.35em] text-[#1f1a14] mb-2">{result.code}</p>
              <p className="text-xs text-[#1f1a14]/55 font-light leading-relaxed">
                Reading left to right as O-C-E-A-N: a 1 means that dial sits above the midpoint. It's a
                shorthand, not a box — the percentages matter more than the code.
              </p>
            </div>

            <div
              className="rounded-3xl border p-6"
              style={{ borderColor: TRAITS.N.hex + "40", background: TRAITS.N.hex + "0d" }}
            >
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#1f1a14]/45 mb-2">
                Emotional stability
              </p>
              <p className="text-sm text-[#1f1a14]/75 font-light leading-relaxed">{result.stabilityNote}</p>
            </div>

            {result.responseNote && (
              <p className="text-xs text-[#1f1a14]/55 font-light italic px-2">
                Note on responding: {result.responseNote}
              </p>
            )}
          </div>
        </Reveal>
      </div>

      {/* five gauges */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-10">
        <Reveal>
          <div className="flex items-end justify-between gap-6 mb-6">
            <h2 className="font-serif text-3xl md:text-4xl text-[#1f1a14] leading-tight">
              Each dial, <span className="italic">dial by dial</span>
            </h2>
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#1f1a14]/40 hidden sm:block">
              Tap a trait to open it
            </p>
          </div>
        </Reveal>
        <div className="grid gap-4">
          {TRAIT_ORDER.map((t, i) => (
            <Reveal key={t} delay={i * 60}>
              <TraitGauge
                trait={t}
                percent={result.scores[t].percent}
                mounted={mounted}
                open={open === t}
                onToggle={() => setOpen(open === t ? null : t)}
              />
            </Reveal>
          ))}
        </div>
      </div>

      {/* combined read */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 pb-12">
        <Reveal>
          <div className="rounded-3xl border border-[#1f1a14]/12 bg-white/50 overflow-hidden">
            <div className="px-6 sm:px-8 py-6 border-b border-[#1f1a14]/10 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-serif text-2xl text-[#1f1a14]">
                Your three maps, <span className="italic">read together</span>
              </h2>
              <div className="flex gap-2">
                {[
                  { on: !!ikigaiAnswers, label: "Ikigai", c: "#b5384c" },
                  { on: !!brainResult, label: "Brain colour", c: "#d4a02c" },
                  { on: true, label: "Big Five", c: "#29527a" },
                ].map((p) => (
                  <span
                    key={p.label}
                    className="text-[10px] tracking-[0.15em] uppercase px-2.5 py-1 rounded-full"
                    style={{
                      color: p.on ? "#f6f1e8" : "#1f1a1466",
                      background: p.on ? p.c : "transparent",
                      border: `1px solid ${p.on ? p.c : "#1f1a1422"}`,
                    }}
                  >
                    {p.on ? p.label : `${p.label} — not yet`}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#1f1a14]/10">
              <div className="p-6 sm:p-8">
                <p className="text-[10px] tracking-[0.25em] uppercase mb-3" style={{ color: TRAITS.O.hex }}>
                  How you should work
                </p>
                <p className="text-sm text-[#1f1a14]/80 font-light leading-relaxed">
                  {result.scores.C.percent >= 60
                    ? "Structure is your multiplier — give yourself deadlines and visible progress and you'll outrun almost anyone."
                    : result.scores.C.percent < 40
                      ? "You need short horizons. Commit to 48-hour sprints, not yearly plans, and let momentum do the organising."
                      : "You can hold structure when it matters and loosen it when it doesn't — design both modes on purpose."}{" "}
                  {result.scores.E.percent >= 60
                    ? "Work where there are people: thinking out loud is your engine."
                    : "Protect long quiet stretches; your best thinking happens unwatched."}
                </p>
              </div>

              <div className="p-6 sm:p-8">
                <p className="text-[10px] tracking-[0.25em] uppercase mb-3" style={{ color: brainResult ? COLOURS[brainResult.dominant].hex : "#d4a02c" }}>
                  Your lead colour
                </p>
                {brainResult ? (
                  <p className="text-sm text-[#1f1a14]/80 font-light leading-relaxed">
                    You think in {COLOURS[brainResult.dominant].name.toLowerCase()} —{" "}
                    {COLOURS[brainResult.dominant].mode.toLowerCase()} — which pairs naturally with{" "}
                    {TRAITS[result.most.key].name.toLowerCase()} at {result.most.percent}%. Your{" "}
                    {COLOURS[brainResult.least].name.toLowerCase()} side is the one to borrow from
                    others, not force alone.
                  </p>
                ) : (
                  <p className="text-sm text-[#1f1a14]/60 font-light leading-relaxed">
                    Take assessment two and this panel will show how your whole-brain style and these
                    five dials reinforce each other.
                  </p>
                )}
              </div>

              <div className="p-6 sm:p-8">
                <p className="text-[10px] tracking-[0.25em] uppercase mb-3" style={{ color: "#b5384c" }}>
                  Your ikigai
                </p>
                {ikigai ? (
                  <p className="font-serif italic text-[#1f1a14] leading-snug">"{ikigai.intersection}"</p>
                ) : (
                  <p className="text-sm text-[#1f1a14]/60 font-light leading-relaxed">
                    Not taken yet. Your Big Five won't tell you your purpose — it tells you the temperament
                    you'll carry it with. Take assessment one for the direction.
                  </p>
                )}
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
          <p className="font-serif italic text-[#1f1a14]/50">
            "Traits explain the weather. Your choices are still the forecast."
          </p>
          <div className="flex gap-5">
            <button
              onClick={() => {
                setAnswers({});
                setPage(0);
                setMounted(false);
                setPhase("test");
              }}
              className="text-sm text-[#1f1a14]/60 hover:text-[#1f1a14] underline underline-offset-4 decoration-[#1f1a14]/20 hover:decoration-[#1f1a14]/60 transition"
            >
              Retake
            </button>
            <button
              onClick={onHome}
              className="text-sm text-[#1f1a14]/60 hover:text-[#1f1a14] underline underline-offset-4 decoration-[#1f1a14]/20 hover:decoration-[#1f1a14]/60 transition"
            >
              All assessments →
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
