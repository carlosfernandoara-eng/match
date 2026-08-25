import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ListChecks,
  CalendarDays,
  Timer as TimerIcon,
  ClipboardList,
  Layers,
  Settings as SettingsIcon,
} from "lucide-react";
import DashboardPage from "./pages/DashboardPage";
import SubjectsPage from "./pages/SubjectsPage";
import CronogramaPage from "./pages/CronogramaPage";
import TimerPage from "./pages/TimerPage";
import QuestionsPage from "./pages/QuestionsPage";
import FlashcardsPage from "./pages/FlashcardsPage";
import SettingsPage from "./pages/SettingsPage";
import { BackupReminder } from "./components/BackupReminder";
import { CronogramaReminder } from "./components/CronogramaReminder";
import { useAppStore } from "./store";

type Tab =
  | "dashboard"
  | "edital"
  | "cronograma"
  | "timer"
  | "questoes"
  | "flashcards"
  | "config";

const TABS: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Painel", icon: LayoutDashboard },
  { id: "edital", label: "Edital", icon: ListChecks },
  { id: "cronograma", label: "Cronograma", icon: CalendarDays },
  { id: "timer", label: "Cronômetro", icon: TimerIcon },
  { id: "questoes", label: "Questões", icon: ClipboardList },
  { id: "flashcards", label: "Flashcards", icon: Layers },
  { id: "config", label: "Config", icon: SettingsIcon },
];

export default function App() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const syncCronogramaSeed = useAppStore((s) => s.syncCronogramaSeed);

  useEffect(() => {
    syncCronogramaSeed();
  }, [syncCronogramaSeed]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <nav className="md:w-56 md:min-h-screen bg-slate-900 text-slate-200 flex md:flex-col shrink-0">
        <div className="hidden md:block px-5 py-6 border-b border-slate-800">
          <p className="text-lg font-bold text-white leading-tight">
            PC-AL 2026
          </p>
          <p className="text-xs text-slate-400 mt-0.5">Painel de estudos</p>
        </div>
        <div className="flex md:flex-col w-full overflow-x-auto md:overflow-visible">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-l-2 md:border-l-2 border-transparent transition-colors ${
                tab === id
                  ? "bg-slate-800 text-white border-l-blue-500"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-1 min-w-0 p-4 md:p-8 space-y-4">
        <BackupReminder />
        <CronogramaReminder />
        {tab === "dashboard" && <DashboardPage />}
        {tab === "edital" && <SubjectsPage />}
        {tab === "cronograma" && <CronogramaPage />}
        {tab === "timer" && <TimerPage />}
        {tab === "questoes" && <QuestionsPage />}
        {tab === "flashcards" && <FlashcardsPage />}
        {tab === "config" && <SettingsPage />}
      </main>
    </div>
  );
}
