import { Download, X } from "lucide-react";
import { useAppStore } from "../store";
import { daysAgo } from "../lib/date";
import { downloadBackupJson } from "../lib/backup";

export function BackupReminder() {
  const subjects = useAppStore((s) => s.subjects);
  const sessions = useAppStore((s) => s.sessions);
  const questionLogs = useAppStore((s) => s.questionLogs);
  const flashcardLogs = useAppStore((s) => s.flashcardLogs);
  const cronogramaCycles = useAppStore((s) => s.cronogramaCycles);
  const pomodoroSettings = useAppStore((s) => s.pomodoroSettings);
  const installedAt = useAppStore((s) => s.installedAt);
  const lastBackupAt = useAppStore((s) => s.lastBackupAt);
  const snoozeBackupUntil = useAppStore((s) => s.snoozeBackupUntil);
  const markBackupDone = useAppStore((s) => s.markBackupDone);
  const snoozeBackupReminder = useAppStore((s) => s.snoozeBackupReminder);

  const hasData =
    sessions.length > 0 ||
    questionLogs.length > 0 ||
    flashcardLogs.length > 0 ||
    subjects.some((s) => s.topics.some((t) => t.status !== "pendente")) ||
    cronogramaCycles.some((c) =>
      c.days.some((d) => d.items.some((i) => i.done)),
    );

  const daysSinceInstall = daysAgo(installedAt);
  const daysSinceBackup = lastBackupAt ? daysAgo(lastBackupAt) : daysSinceInstall;
  const snoozed = !!snoozeBackupUntil && new Date(snoozeBackupUntil) > new Date();

  const shouldRemind =
    hasData && daysSinceInstall >= 3 && daysSinceBackup >= 7 && !snoozed;

  if (!shouldRemind) return null;

  function handleExportNow() {
    downloadBackupJson({
      subjects,
      sessions,
      questionLogs,
      flashcardLogs,
      cronogramaCycles,
      pomodoroSettings,
    });
    markBackupDone();
  }

  return (
    <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm">
      <p className="flex-1 text-amber-800">
        {lastBackupAt
          ? `Já se passaram ${daysSinceBackup} dias desde seu último backup.`
          : "Você ainda não exportou um backup do seu progresso."}{" "}
        Seus dados ficam só neste navegador — exporte para não correr risco
        de perder tudo.
      </p>
      <button
        onClick={handleExportNow}
        className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg px-3 py-1.5 shrink-0"
      >
        <Download size={14} /> Exportar agora
      </button>
      <button
        onClick={() => snoozeBackupReminder(3)}
        className="text-amber-500 hover:text-amber-700 shrink-0"
        title="Lembrar em 3 dias"
      >
        <X size={16} />
      </button>
    </div>
  );
}
