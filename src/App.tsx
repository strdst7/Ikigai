import { useEffect, useMemo, useState } from "react";
import Home from "./screens/Home";
import Ikigai from "./screens/Ikigai";
import BrainColour from "./screens/BrainColour";
import BigFive from "./screens/BigFive";
import type { Answers } from "./utils/analyze";
import type { BrainResult } from "./utils/brainColour";
import { scoreBigFive, type BigFiveAnswers } from "./utils/bigfive";
import { TRAITS, TRAIT_ORDER, type TraitKey } from "./data/bigfive";

type Mode = "home" | "ikigai" | "brain" | "bigfive";

export default function App() {
  const [mode, setMode] = useState<Mode>("home");
  const [ikigaiAnswers, setIkigaiAnswers] = useState<Answers | null>(null);
  const [brainResult, setBrainResult] = useState<BrainResult | null>(null);
  const [bigFiveAnswers, setBigFiveAnswers] = useState<BigFiveAnswers | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [mode]);

  const bigFive = useMemo(
    () => (bigFiveAnswers ? scoreBigFive(bigFiveAnswers) : null),
    [bigFiveAnswers]
  );

  const bigFiveValues = useMemo(() => {
    if (!bigFive) return null;
    const v = {} as Record<TraitKey, number>;
    for (const t of TRAIT_ORDER) v[t] = bigFive.scores[t].percent;
    return v;
  }, [bigFive]);

  const bigFiveSummary = bigFive
    ? {
        archetype: bigFive.archetype.name.replace(/^The /, ""),
        lead: TRAITS[bigFive.most.key].name,
        leadPct: bigFive.most.percent,
        lowest: TRAITS[bigFive.least.key].name,
        lowestPct: bigFive.least.percent,
      }
    : null;

  const goHome = () => setMode("home");

  return (
    <>
      {mode === "home" && (
        <Home
          done={{ ikigai: !!ikigaiAnswers, brain: !!brainResult, bigfive: !!bigFive }}
          bigFiveValues={bigFiveValues}
          onPick={(m) => setMode(m)}
        />
      )}

      {mode === "ikigai" && (
        <Ikigai
          key="ikigai"
          onHome={goHome}
          onComplete={(a) => setIkigaiAnswers(a)}
          brainResult={brainResult}
          bigFiveSummary={bigFiveSummary}
          onPick={(m) => setMode(m)}
        />
      )}

      {mode === "brain" && (
        <BrainColour
          key="brain"
          ikigaiAnswers={ikigaiAnswers}
          bigFiveSummary={bigFiveSummary}
          onHome={goHome}
          onFinish={(r) => {
            if (r) setBrainResult(r);
            goHome();
          }}
        />
      )}

      {mode === "bigfive" && (
        <BigFive
          key="bigfive"
          onHome={goHome}
          onComplete={(a) => setBigFiveAnswers(a)}
          ikigaiAnswers={ikigaiAnswers}
          brainResult={brainResult}
        />
      )}
    </>
  );
}
