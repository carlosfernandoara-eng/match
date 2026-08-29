import { ArrowLeft, Trophy } from "lucide-react";
import { GROUP_KEYS, useDrawStore, type GroupKey } from "../store";
import { TEAM_BY_ID } from "../data/teams";
import { KIT_COLOR_BY_ID } from "../data/colors";
import { contrastTextColor } from "../lib/random";
import { Emblem } from "../components/Emblem";
import type { Screen } from "../App";

const GROUP_LABELS: Record<GroupKey, string> = {
  A: "Grupo A",
  B: "Grupo B",
  C: "Grupo C",
  D: "Grupo D",
};

export function ResultsPage({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const groups = useDrawStore((s) => s.groups);
  const colorAssignment = useDrawStore((s) => s.colorAssignment);

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
        <div className="flex items-center gap-2">
          <Emblem size={28} tone="lime" />
          <p className="font-display text-lg sm:text-2xl tracking-wide">
            Quadro Final
          </p>
        </div>
        <div className="w-16" />
      </header>

      <main className="flex-1 flex items-center px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 max-w-7xl mx-auto w-full">
          {GROUP_KEYS.map((g) => (
            <div
              key={g}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col"
            >
              <div className="bg-lime text-black font-display text-xl px-4 py-3 flex items-center gap-2">
                <Trophy size={18} />
                {GROUP_LABELS[g]}
              </div>
              <ul className="divide-y divide-white/10">
                {groups[g].map((teamId) => {
                  const team = TEAM_BY_ID[teamId];
                  const colorId = colorAssignment[teamId];
                  const color = colorId ? KIT_COLOR_BY_ID[colorId] : null;
                  return (
                    <li key={teamId} className="px-4 py-3.5 flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full border border-white/20 shrink-0 flex items-center justify-center text-[9px] font-display"
                        style={{
                          backgroundColor: color?.hex ?? "#1a1a1a",
                          color: color ? contrastTextColor(color.hex) : "#666",
                        }}
                      />
                      <div className="min-w-0">
                        <p className="text-base font-sans font-medium leading-tight">
                          {team.name}
                        </p>
                        <p className="text-sm text-white/40">
                          {color ? color.name : "cor não sorteada"}
                        </p>
                      </div>
                    </li>
                  );
                })}
                {groups[g].length === 0 && (
                  <li className="px-4 py-6 text-center text-white/25 italic text-sm">
                    grupo ainda não sorteado
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
