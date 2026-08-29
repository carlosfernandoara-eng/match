import { useEffect, useRef, useState } from "react";
import { ArrowLeft, RotateCcw, Shuffle, Trophy } from "lucide-react";
import { GROUP_KEYS, useDrawStore, type GroupKey } from "../store";
import { TEAMS, TEAM_BY_ID } from "../data/teams";
import type { Screen } from "../App";

const GROUP_LABELS: Record<GroupKey, string> = {
  A: "Grupo A",
  B: "Grupo B",
  C: "Grupo C",
  D: "Grupo D",
};

export function GroupDrawPage({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const groupRemaining = useDrawStore((s) => s.groupRemaining);
  const groupOrder = useDrawStore((s) => s.groupOrder);
  const groups = useDrawStore((s) => s.groups);
  const drawNextGroupTeam = useDrawStore((s) => s.drawNextGroupTeam);
  const resetGroups = useDrawStore((s) => s.resetGroups);

  const [spinning, setSpinning] = useState(false);
  const [spinName, setSpinName] = useState("");
  const [lastPick, setLastPick] = useState<{ name: string; group: GroupKey } | null>(
    null,
  );
  const [confirmReset, setConfirmReset] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const complete = groupOrder.length === TEAMS.length;

  useEffect(() => () => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
  }, []);

  function handleDraw() {
    if (spinning || complete || groupRemaining.length === 0) return;
    setSpinning(true);
    setLastPick(null);

    let ticks = 0;
    const totalTicks = 14;
    intervalRef.current = window.setInterval(() => {
      const pool = groupRemaining;
      const randomTeam = TEAM_BY_ID[pool[Math.floor(Math.random() * pool.length)]];
      setSpinName(randomTeam.name);
      ticks += 1;
      if (ticks >= totalTicks) {
        if (intervalRef.current) window.clearInterval(intervalRef.current);
        const result = drawNextGroupTeam();
        if (result) {
          setSpinName(result.team.name);
          setLastPick({ name: result.team.name, group: result.group });
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
    resetGroups();
    setLastPick(null);
    setSpinName("");
    setConfirmReset(false);
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
          Sorteio dos Grupos
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
            <div className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-10 flex flex-col items-center text-center gap-3">
              <p className="uppercase text-xs tracking-[0.3em] text-white/40 font-semibold">
                {spinning
                  ? "Sorteando..."
                  : lastPick
                    ? "Última equipe sorteada"
                    : `${groupRemaining.length} times no pote`}
              </p>
              <p
                key={spinName}
                className={`font-display text-3xl sm:text-4xl ${spinning ? "" : "reveal-in"} ${spinning ? "text-white/70" : "text-lime"}`}
              >
                {spinName || "?"}
              </p>
              {lastPick && !spinning && (
                <p className="text-white/60 font-sans text-sm">
                  vai para o <span className="text-white font-semibold">{GROUP_LABELS[lastPick.group]}</span>
                </p>
              )}
            </div>

            <button
              onClick={handleDraw}
              disabled={spinning}
              className="inline-flex items-center gap-3 bg-lime text-black font-display text-xl px-8 py-4 rounded-full hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:hover:scale-100 shadow-[0_6px_0_0_rgba(215,239,42,0.3)]"
            >
              <Shuffle size={22} />
              {groupOrder.length === 0 ? "Iniciar sorteio" : "Sortear próximo"}
            </button>
          </div>
        )}

        {complete && (
          <div className="flex flex-col items-center gap-2 text-center">
            <Trophy className="text-lime" size={36} />
            <p className="font-display text-2xl sm:text-3xl">Grupos definidos!</p>
            <button
              onClick={() => onNavigate("colors")}
              className="mt-3 inline-flex items-center gap-2 bg-lime text-black font-semibold px-6 py-3 rounded-full hover:scale-105 transition-transform"
            >
              Sortear as cores
              <Shuffle size={18} />
            </button>
          </div>
        )}

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 max-w-6xl">
          {GROUP_KEYS.map((g) => (
            <div
              key={g}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
            >
              <div className="bg-lime text-black font-display text-lg px-4 py-2">
                {GROUP_LABELS[g]}
              </div>
              <ul className="divide-y divide-white/10">
                {Array.from({ length: 3 }).map((_, i) => {
                  const teamId = groups[g][i];
                  const team = teamId ? TEAM_BY_ID[teamId] : null;
                  return (
                    <li
                      key={i}
                      className={`px-4 py-3.5 text-base font-sans font-medium ${team ? "pop-in text-white" : "text-white/25 italic"}`}
                    >
                      {team ? team.name : "aguardando sorteio..."}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
