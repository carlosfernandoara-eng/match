import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useAppStore } from "../store";
import { Card, ProgressBar } from "../components/ui";
import {
  cronogramaCycleProgress,
  cronogramaEditalCoverage,
  cronogramaProgress,
} from "../lib/stats";
import type { CronogramaCycle, CronogramaDay, CronogramaItem } from "../types";

type SubjectInfo = { name: string; color: string };

function ItemRow({
  cycleId,
  dayId,
  item,
  subjectInfo,
}: {
  cycleId: string;
  dayId: string;
  item: CronogramaItem;
  subjectInfo?: SubjectInfo;
}) {
  const toggleCronogramaItem = useAppStore((s) => s.toggleCronogramaItem);

  return (
    <label className="flex items-start gap-2 text-sm py-1 cursor-pointer group">
      <input
        type="checkbox"
        checked={item.done}
        onChange={() => toggleCronogramaItem(cycleId, dayId, item.id)}
        className="w-3.5 h-3.5 rounded accent-blue-600 mt-0.5 shrink-0"
      />
      <span
        className={`flex-1 ${item.done ? "text-slate-400 line-through" : "text-slate-700"}`}
      >
        <span className="font-medium">{item.subjectLabel}</span>
        {item.description && <> — {item.description}</>}
      </span>
      {subjectInfo && (
        <span
          className="w-2 h-2 rounded-full shrink-0 mt-1.5"
          style={{ backgroundColor: subjectInfo.color }}
          title={`Edital: ${subjectInfo.name}`}
        />
      )}
    </label>
  );
}

function DayBlock({
  cycleId,
  day,
  subjectsById,
}: {
  cycleId: string;
  day: CronogramaDay;
  subjectsById: Map<string, SubjectInfo>;
}) {
  const setCronogramaDayDone = useAppStore((s) => s.setCronogramaDayDone);
  const doneCount = day.items.filter((i) => i.done).length;
  const allDone = day.items.length > 0 && doneCount === day.items.length;

  return (
    <div className="py-2.5">
      <div className="flex items-center gap-2 mb-1.5">
        <input
          type="checkbox"
          checked={allDone}
          onChange={(e) =>
            setCronogramaDayDone(cycleId, day.id, e.target.checked)
          }
          className="w-3.5 h-3.5 rounded accent-emerald-600 shrink-0"
          title="Marcar o dia inteiro"
        />
        <span className="text-xs font-semibold text-slate-600">
          {day.label}
        </span>
        {day.estimatedTime && (
          <span className="text-xs text-slate-400">~{day.estimatedTime}</span>
        )}
        <span className="text-xs text-slate-400 ml-auto shrink-0">
          {doneCount}/{day.items.length}
        </span>
      </div>
      <div className="pl-5">
        {day.items.map((item) => (
          <ItemRow
            key={item.id}
            cycleId={cycleId}
            dayId={day.id}
            item={item}
            subjectInfo={
              item.linkedSubjectId
                ? subjectsById.get(item.linkedSubjectId)
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}

function CycleCard({
  cycle,
  subjectsById,
  defaultOpen,
}: {
  cycle: CronogramaCycle;
  subjectsById: Map<string, SubjectInfo>;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const progress = cronogramaCycleProgress(cycle);

  return (
    <Card className="p-0 overflow-hidden">
      <div
        className="flex items-center gap-3 p-4 cursor-pointer"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-800 truncate">
            {cycle.name}
            {cycle.subtitle && (
              <span className="text-slate-400 font-normal">
                {" "}
                — {cycle.subtitle}
              </span>
            )}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="w-40 max-w-full">
              <ProgressBar value={progress.percent} />
            </div>
            <span className="text-xs text-slate-500 shrink-0">
              {progress.done}/{progress.total} ({progress.percent}%)
            </span>
          </div>
        </div>
        {open ? (
          <ChevronDown size={18} className="text-slate-400 shrink-0" />
        ) : (
          <ChevronRight size={18} className="text-slate-400 shrink-0" />
        )}
      </div>
      {open && (
        <div className="border-t border-slate-100 px-4 pb-2 divide-y divide-slate-50">
          {cycle.days.map((day) => (
            <DayBlock
              key={day.id}
              cycleId={cycle.id}
              day={day}
              subjectsById={subjectsById}
            />
          ))}
        </div>
      )}
    </Card>
  );
}

export default function CronogramaPage() {
  const cycles = useAppStore((s) => s.cronogramaCycles);
  const subjects = useAppStore((s) => s.subjects);

  const subjectsById = useMemo(
    () => new Map(subjects.map((s) => [s.id, { name: s.name, color: s.color }])),
    [subjects],
  );
  const overall = cronogramaProgress(cycles);
  const coverage = useMemo(
    () => cronogramaEditalCoverage(cycles, subjects),
    [cycles, subjects],
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Cronograma do cursinho
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Cronograma teórico do DSO Concursos, ciclo por ciclo. Marque o que
          já cumpriu — cada ciclo novo que o cursinho postar é adicionado
          aqui automaticamente, sem apagar o que você já marcou.
        </p>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-slate-700">
            Progresso do cronograma
          </p>
          <p className="text-sm font-semibold text-slate-900">
            {overall.done}/{overall.total} itens ({overall.percent}%)
          </p>
        </div>
        <ProgressBar value={overall.percent} />
      </Card>

      <Card className="p-4">
        <p className="text-sm font-semibold text-slate-700 mb-1">
          Cobertura do edital pelo cursinho
        </p>
        <p className="text-xs text-slate-400 mb-3">
          {coverage.subjectsTouched} de {coverage.subjectsTotal} disciplinas
          do edital já apareceram no cronograma. Contagem por disciplina —
          o cronograma do cursinho não segue a numeração exata dos tópicos
          do edital, então isto é uma aproximação.
        </p>
        <div className="space-y-1.5">
          {coverage.rows.map((r) => (
            <div key={r.subjectId} className="flex items-center gap-2 text-sm">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: r.color }}
              />
              <span className="flex-1 min-w-0 truncate text-slate-700">
                {r.name}
              </span>
              {r.itemsCount > 0 ? (
                <span className="text-xs text-emerald-700 bg-emerald-50 rounded-full px-2 py-0.5 shrink-0">
                  {r.doneCount}/{r.itemsCount} itens vistos
                </span>
              ) : (
                <span className="text-xs text-slate-400 shrink-0">
                  Ainda não no cronograma
                </span>
              )}
            </div>
          ))}
        </div>
      </Card>

      <div className="space-y-4">
        {cycles.map((cycle, idx) => (
          <CycleCard
            key={cycle.id}
            cycle={cycle}
            subjectsById={subjectsById}
            defaultOpen={idx === cycles.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
