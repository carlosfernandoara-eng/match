import { useEffect, useRef, useState } from "react";
import { ArrowLeft, RotateCcw, Shuffle, Palette, Trophy } from "lucide-react";
import { GROUP_KEYS, useDrawStore } from "../store";
import { TEAMS, TEAM_BY_ID } from "../data/teams";
import { KIT_COLOR_BY_ID, KIT_COLORS, type KitColor } from "../data/colors";
import { contrastTextColor } from "../lib/random";
import type { Screen } from "../App";

export function ColorDrawPage({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const groupOrder = useDrawStore((s) => s.groupOrder);
  const groups = useDrawStore((s) => s.groups);
  const colorRemaining = useDrawStore((s) => s.colorRemaining);
  const colorAssignment = useDrawStore((s) => s.colorAssignment);
  const drawNextColor = useDrawStore((s) => s.drawNextColor);
  const resetColors = useDrawStore((s) => s.resetColors);

  const groupsReady = groupOrder.length === TEAMS.length;
  const teamSequence = GROUP_KEYS.flatMap((g) => groups[g]);
  const nextTeamId = teamSequence.find((id) => !colorAssignment[id]);
  const nextTeam = nextTeamId ? TEAM_BY_ID[nextTeamId] : null;
  const complete = groupsReady && Object.keys(colorAssignment).length === TEAMS.length;

  const [spinning, setSpinning] = useState(false);
  const [spinColor, setSpinColor] = useState<KitColor | null>(null);
  const [lastPick, setLastPick] = useState<{ team: string; color: KitColor } | null>(
    null,
  );
  const [confirmReset, setConfirmReset] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
  }, []);

  function handleDraw() {
    if (spinning || complete || !nextTeamId || colorRemaining.length === 0) return;
    setSpinning(true);
    setLastPick(null);
    const drawingTeamName = nextTeam?.name ?? "";

    let ticks = 0;
    const totalTicks = 14;
    intervalRef.current = window.setInterval(() => {
      const pool = colorRemaining;
      const randomColor = KIT_COLOR_BY_ID[pool[Math.floor(Math.random() * pool.length)]];
      setSpinColor(randomColor);
      ticks += 1;
      if (ticks >= totalTicks) {
        if (intervalRef.current) window.clearInterval(intervalRef.current);
        const result = drawNextColor();
        if (result) {
          setSpinColor(result.color);
          setLastPick({ team: drawingTeamName, color: result.color });
        }
        setSpinning(false);
      }
    }, 70);
  }

  function handleReset() {
    if (!confirmReset) {
      setConfirmReset(true);
      window.setTimeout(() => setConfirmReset(false), 3000);
      return;
    }
    resetColors();
    setLastPick(null);
    setSpinColor(null);
    setConfirmReset(false);
  }

  if (!groupsReady) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-5 px-6 text-center">
        <Palette size={40} className="text-lime" />
        <p className="font-display text-2xl sm:text-3xl">
          Sorteie os grupos primeiro
        </p>
        <p className="text-white/60 max-w-md">
          As cores são sorteadas na ordem dos grupos já definidos. Volte e
          finalize o sorteio dos grupos antes de continuar.
        </p>
        <button
          onClick={() => onNavigate("groups")}
          className="inline-flex items-center gap-2 bg-lime text-black font-semibold px-6 py-3 rounded-full hover:scale-105 transition-transform"
        >
          Ir para o sorteio dos grupos
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="flex items-center justify-between px-5 sm:px-8 py-5 border-b border-white/10">
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 text-white/60 hover:text-white text-sm font-semibold uppercase tracking-wide"
        >
          <ArrowLeft size={18} />
          Início
        </button>
        <p className="font-display text-lg sm:text-2xl tracking-wide">
          Sorteio das Cores
        </p>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 text-white/40 hover:text-red-400 text-xs sm:text-sm font-semibold uppercase tracking-wide"
        >
          <RotateCcw size={16} />
          {confirmReset ? "Confirmar reinício" : "Reiniciar"}
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center gap-10 px-4 sm:px-8 py-10">
        {!complete && (
          <div className="w-full max-w-xl flex flex-col items-center gap-6">
            <div className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-8 flex flex-col items-center text-center gap-4">
              <p className="uppercase text-xs tracking-[0.3em] text-white/40 font-semibold">
                Sorteando a cor de
              </p>
              <p className="font-display text-2xl sm:text-3xl text-white">
                {lastPick ? lastPick.team : nextTeam?.name}
              </p>

              <div
                key={spinColor?.id ?? "empty"}
                className={`w-28 h-28 rounded-2xl border-4 border-white/10 flex items-center justify-center ${spinning ? "" : "pop-in"}`}
                style={{ backgroundColor: spinColor?.hex ?? "#1a1a1a" }}
              >
                {spinColor && (
                  <span
                    className="font-display text-xs uppercase tracking-wide text-center px-2"
                    style={{ color: contrastTextColor(spinColor.hex) }}
                  >
                    {!spinning ? spinColor.name : ""}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleDraw}
              disabled={spinning}
              className="inline-flex items-center gap-3 bg-lime text-black font-display text-xl px-8 py-4 rounded-full hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:hover:scale-100 shadow-[0_6px_0_0_rgba(215,239,42,0.3)]"
            >
              <Shuffle size={22} />
              {Object.keys(colorAssignment).length === 0
                ? "Iniciar sorteio"
                : "Sortear próxima cor"}
            </button>
          </div>
        )}

        {complete && (
          <div className="flex flex-col items-center gap-2 text-center">
            <Trophy className="text-lime" size={36} />
            <p className="font-display text-2xl sm:text-3xl">Cores definidas!</p>
            <button
              onClick={() => onNavigate("results")}
              className="mt-3 inline-flex items-center gap-2 bg-lime text-black font-semibold px-6 py-3 rounded-full hover:scale-105 transition-transform"
            >
              Ver quadro final
              <Trophy size={18} />
            </button>
          </div>
        )}

        <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-3">
          {teamSequence.map((teamId) => {
            const team = TEAM_BY_ID[teamId];
            const colorId = colorAssignment[teamId];
            const color = colorId ? KIT_COLOR_BY_ID[colorId] : null;
            const isNext = teamId === nextTeamId;
            return (
              <div
                key={teamId}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 border ${
                  isNext
                    ? "border-lime bg-lime/10"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <div
                  className="w-8 h-8 rounded-full border border-white/20 shrink-0"
                  style={{ backgroundColor: color?.hex ?? "#1a1a1a" }}
                />
                <div className="min-w-0">
                  <p className="text-base font-sans font-medium leading-tight">{team.name}</p>
                  <p className="text-sm text-white/40">
                    {color ? color.name : isNext ? "sorteando..." : "aguardando"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-white/30 text-xs">
          {colorRemaining.length} cores restantes no pote de{" "}
          {KIT_COLORS.length}
        </p>
      </main>
    </div>
  );
}
