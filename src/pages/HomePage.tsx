import { Shuffle, Palette, Trophy, ArrowRight } from "lucide-react";
import { Emblem } from "../components/Emblem";
import type { Screen } from "../App";
import { useDrawStore } from "../store";
import { TEAMS } from "../data/teams";

export function HomePage({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const groupOrder = useDrawStore((s) => s.groupOrder);
  const colorAssignment = useDrawStore((s) => s.colorAssignment);

  const groupsDone = groupOrder.length === TEAMS.length;
  const colorsDone = Object.keys(colorAssignment).length === TEAMS.length;

  return (
    <div className="min-h-screen bg-lime text-black relative overflow-hidden flex flex-col">
      <div
        className="absolute inset-0 text-black/10 chevron-bg"
        style={{ backgroundColor: "var(--color-lime)" }}
      />

      <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-16 text-center gap-8">
        <div className="flex flex-col items-center gap-4">
          <Emblem size={84} tone="dark" />
          <div>
            <h1 className="font-display text-5xl sm:text-7xl leading-[0.9] tracking-tight">
              COPA PMVR
            </h1>
            <p className="font-sans text-2xl sm:text-4xl font-semibold tracking-wide uppercase mt-1">
              Intercolegial
            </p>
          </div>
          <p className="font-sans text-sm sm:text-base uppercase tracking-[0.3em] font-medium text-black/70">
            Intercolegial ◆ 2026 ◆ Maceió
          </p>
        </div>

        <p className="max-w-xl text-black/80 font-sans text-lg">
          Sorteio oficial dos grupos e das cores dos uniformes — 12 times, 4
          grupos, 12 cores. Ao vivo, para todos verem.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 w-full max-w-2xl">
          <button
            onClick={() => onNavigate("groups")}
            className="group bg-black text-white rounded-2xl p-6 flex flex-col items-start gap-4 text-left hover:-translate-y-1 transition-transform shadow-[0_8px_0_0_rgba(0,0,0,0.25)]"
          >
            <Shuffle size={32} className="text-lime" />
            <div>
              <p className="font-display text-2xl">Sorteio dos Grupos</p>
              <p className="text-white/60 text-sm font-sans mt-1">
                {groupsDone
                  ? "Sorteio concluído — ver resultado"
                  : `${groupOrder.length}/${TEAMS.length} times sorteados`}
              </p>
            </div>
            <span className="mt-auto flex items-center gap-2 text-lime font-semibold text-sm">
              {groupsDone ? "Revisar" : "Começar sorteio"}
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </span>
          </button>

          <button
            onClick={() => onNavigate("colors")}
            disabled={!groupsDone}
            className="group bg-black text-white rounded-2xl p-6 flex flex-col items-start gap-4 text-left hover:-translate-y-1 transition-transform shadow-[0_8px_0_0_rgba(0,0,0,0.25)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            <Palette size={32} className="text-lime" />
            <div>
              <p className="font-display text-2xl">Sorteio das Cores</p>
              <p className="text-white/60 text-sm font-sans mt-1">
                {!groupsDone
                  ? "Disponível após o sorteio dos grupos"
                  : colorsDone
                    ? "Sorteio concluído — ver resultado"
                    : `${Object.keys(colorAssignment).length}/${TEAMS.length} cores sorteadas`}
              </p>
            </div>
            <span className="mt-auto flex items-center gap-2 text-lime font-semibold text-sm">
              {colorsDone ? "Revisar" : "Começar sorteio"}
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </span>
          </button>
        </div>

        <button
          onClick={() => onNavigate("results")}
          className="inline-flex items-center gap-2 font-sans font-semibold uppercase tracking-wide text-sm border-2 border-black rounded-full px-6 py-3 hover:bg-black hover:text-lime transition-colors"
        >
          <Trophy size={18} />
          Ver quadro final
        </button>
      </div>
    </div>
  );
}
