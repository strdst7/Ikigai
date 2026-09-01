import { useEffect, useRef, useState, type ReactNode } from "react";
import { Pillar, PILLAR_META } from "../data/questions";
import { TRAITS, TRAIT_ORDER, type TraitKey } from "../data/bigfive";
import { COLOURS, type ColourKey } from "../data/brainColour";

/* ───────────────────────── Footer ───────────────────────── */
export function Footer() {
  return (
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
  );
}

/* ───────────────────────── Scroll reveal ───────────────────────── */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setSeen(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${seen ? "is-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ───────────────────────── Count-up ───────────────────────── */
export function useCountUp(target: number, duration = 1100, active = true) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, active]);
  return n;
}

export function CountNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const n = useCountUp(value);
  return (
    <span className="tabular-nums">
      {n}
      {suffix}
    </span>
  );
}

/* ───────────────────────── Ikigai Venn ───────────────────────── */
export function VennDiagram({
  highlighted,
  size = 420,
}: {
  highlighted?: Pillar | "center" | null;
  size?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.26;
  const d = size * 0.16;

  const circles: { pillar: Pillar; x: number; y: number }[] = [
    { pillar: "love", x: cx - d, y: cy - d },
    { pillar: "good", x: cx + d, y: cy - d },
    { pillar: "needs", x: cx - d, y: cy + d },
    { pillar: "paid", x: cx + d, y: cy + d },
  ];

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto max-w-[520px] animate-draw">
      <defs>
        {circles.map((c) => (
          <radialGradient
            key={`g-${c.pillar}`}
            id={`grad-${c.pillar}`}
            cx="50%"
            cy="40%"
            r="70%"
          >
            <stop offset="0%" stopColor={PILLAR_META[c.pillar].color} stopOpacity="0.55" />
            <stop offset="100%" stopColor={PILLAR_META[c.pillar].color} stopOpacity="0.15" />
          </radialGradient>
        ))}
      </defs>

      {circles.map((c) => {
        const isActive = highlighted === c.pillar || highlighted === "center";
        return (
          <circle
            key={c.pillar}
            cx={c.x}
            cy={c.y}
            r={r}
            fill={`url(#grad-${c.pillar})`}
            stroke={PILLAR_META[c.pillar].color}
            strokeWidth={isActive ? 1.5 : 1}
            strokeOpacity={isActive ? 0.8 : 0.35}
            style={{ mixBlendMode: "multiply", transition: "opacity 0.6s ease" }}
          />
        );
      })}

      {circles.map((c) => {
        const meta = PILLAR_META[c.pillar];
        const labelY =
          c.pillar === "love" || c.pillar === "good" ? c.y - r * 0.55 : c.y + r * 0.75;
        const labelX =
          c.pillar === "love" || c.pillar === "needs" ? c.x - r * 0.2 : c.x + r * 0.2;
        return (
          <g key={`l-${c.pillar}`}>
            <text
              x={labelX}
              y={labelY - 8}
              textAnchor="middle"
              fontFamily="Fraunces, serif"
              fontSize="13"
              fontStyle="italic"
              fill={meta.color}
              opacity="0.9"
            >
              {meta.subtitle}
            </text>
            <text
              x={labelX}
              y={labelY + 10}
              textAnchor="middle"
              fontFamily="inherit"
              fontSize="9.5"
              letterSpacing="1.5"
              fill={meta.color}
              opacity="0.6"
            >
              {meta.label.toUpperCase()}
            </text>
          </g>
        );
      })}

      <text
        x={cx}
        y={cy - 4}
        textAnchor="middle"
        fontFamily="Zen Old Mincho, serif"
        fontSize="22"
        fill="#1f1a14"
        opacity={highlighted === "center" ? 1 : 0.4}
        style={{ transition: "opacity 0.6s ease" }}
      >
        生き甲斐
      </text>
      <text
        x={cx}
        y={cy + 14}
        textAnchor="middle"
        fontSize="9"
        letterSpacing="3"
        fill="#1f1a14"
        opacity={highlighted === "center" ? 0.7 : 0.3}
        style={{ transition: "opacity 0.6s ease" }}
      >
        IKIGAI
      </text>
    </svg>
  );
}

/* ───────────────────────── Big Five pentagon (decorative + data) ───────────────────────── */
export function PentagonChart({
  values,
  size = 320,
  showLabels = true,
  baseline = false,
}: {
  values: Record<TraitKey, number>; // 0..100
  size?: number;
  showLabels?: boolean;
  baseline?: boolean;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.36;
  const angle = (i: number) => (i * (2 * Math.PI)) / 5 - Math.PI / 2;
  const pt = (i: number, rad: number) => [cx + rad * Math.cos(angle(i)), cy + rad * Math.sin(angle(i))];

  const poly = TRAIT_ORDER.map((t, i) => pt(i, (R * (values[t] ?? 50)) / 100).join(",")).join(" ");
  const basePoly = TRAIT_ORDER.map((_, i) => pt(i, R * 0.5).join(",")).join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto">
      {[0.25, 0.5, 0.75, 1].map((ring, i) => (
        <polygon
          key={i}
          points={TRAIT_ORDER.map((_, j) => pt(j, R * ring).join(",")).join(" ")}
          fill="none"
          stroke="#1f1a14"
          strokeOpacity={i === 3 ? 0.22 : 0.09}
          strokeWidth="1"
        />
      ))}
      {TRAIT_ORDER.map((t, i) => {
        const [x, y] = pt(i, R);
        return <line key={t} x1={cx} y1={cy} x2={x} y2={y} stroke="#1f1a14" strokeOpacity="0.12" />;
      })}

      {baseline && (
        <polygon
          points={basePoly}
          fill="none"
          stroke="#1f1a14"
          strokeOpacity="0.3"
          strokeDasharray="3 4"
          strokeWidth="1"
        />
      )}

      <polygon
        points={poly}
        fill={TRAITS.O.hex}
        fillOpacity="0.14"
        stroke="#1f1a14"
        strokeOpacity="0.45"
        strokeWidth="1.2"
        style={{ transition: "all 900ms cubic-bezier(.2,.7,.2,1)" }}
      />

      {TRAIT_ORDER.map((t, i) => {
        const [x, y] = pt(i, (R * (values[t] ?? 50)) / 100);
        return <circle key={t} cx={x} cy={y} r="4.5" fill={TRAITS[t].hex} stroke="#f6f1e8" strokeWidth="1.5" />;
      })}

      {showLabels &&
        TRAIT_ORDER.map((t, i) => {
          const [x, y] = pt(i, R + size * 0.075);
          return (
            <text
              key={t}
              x={x}
              y={y}
              textAnchor="middle"
              fontFamily="Zen Old Mincho, serif"
              fontSize={size * 0.055}
              fill={TRAITS[t].hex}
            >
              {TRAITS[t].kanji}
            </text>
          );
        })}
    </svg>
  );
}

/* ───────────────────────── Small marks for the index ───────────────────────── */
export function BrainMini({ size = 120 }: { size?: number }) {
  const c = size / 2;
  const r = size * 0.4;
  const order: ColourKey[] = ["blue", "yellow", "red", "green"];
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto">
      {order.map((k, i) => {
        const a0 = i * 90;
        const rad = r * (0.62 + (i % 2) * 0.2);
        const p0x = c + rad * Math.cos((a0 * Math.PI) / 180);
        const p0y = c + rad * Math.sin((a0 * Math.PI) / 180);
        const p1x = c + rad * Math.cos(((a0 + 86) * Math.PI) / 180);
        const p1y = c + rad * Math.sin(((a0 + 86) * Math.PI) / 180);
        return (
          <path
            key={k}
            d={`M ${c} ${c} L ${p0x} ${p0y} A ${rad} ${rad} 0 0 1 ${p1x} ${p1y} Z`}
            fill={COLOURS[k].hex}
            fillOpacity="0.35"
            stroke={COLOURS[k].hex}
            strokeOpacity="0.6"
          />
        );
      })}
    </svg>
  );
}

export function VennMini({ size = 120 }: { size?: number }) {
  const c = size / 2;
  const r = size * 0.26;
  const d = size * 0.15;
  const set: { p: Pillar; x: number; y: number }[] = [
    { p: "love", x: c - d, y: c - d },
    { p: "good", x: c + d, y: c - d },
    { p: "needs", x: c - d, y: c + d },
    { p: "paid", x: c + d, y: c + d },
  ];
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto">
      {set.map((s) => (
        <circle
          key={s.p}
          cx={s.x}
          cy={s.y}
          r={r}
          fill={PILLAR_META[s.p].color}
          fillOpacity="0.3"
          stroke={PILLAR_META[s.p].color}
          strokeOpacity="0.6"
          style={{ mixBlendMode: "multiply" }}
        />
      ))}
    </svg>
  );
}
