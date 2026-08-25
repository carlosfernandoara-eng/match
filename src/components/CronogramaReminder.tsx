import { X } from "lucide-react";
import { useAppStore } from "../store";
import { daysAgo } from "../lib/date";

export function CronogramaReminder() {
  const lastCronogramaUpdateAt = useAppStore((s) => s.lastCronogramaUpdateAt);
  const snoozeCronogramaUntil = useAppStore((s) => s.snoozeCronogramaUntil);
  const snoozeCronogramaReminder = useAppStore(
    (s) => s.snoozeCronogramaReminder,
  );

  const daysSince = lastCronogramaUpdateAt
    ? daysAgo(lastCronogramaUpdateAt)
    : Infinity;
  const snoozed =
    !!snoozeCronogramaUntil && new Date(snoozeCronogramaUntil) > new Date();
  const shouldRemind = daysSince >= 7 && !snoozed;

  if (!shouldRemind) return null;

  return (
    <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm">
      <p className="flex-1 text-blue-800">
        {Number.isFinite(daysSince)
          ? `Já se passaram ${daysSince} dias desde o último ciclo adicionado ao cronograma.`
          : "Ainda não há um ciclo recente registrado no cronograma."}{" "}
        Confira se o cursinho postou uma semana nova e envie o conteúdo aqui
        no chat para eu atualizar a aba Cronograma.
      </p>
      <button
        onClick={() => snoozeCronogramaReminder(7)}
        className="text-blue-500 hover:text-blue-700 shrink-0"
        title="Lembrar em 7 dias"
      >
        <X size={16} />
      </button>
    </div>
  );
}
