import { useEffect, useState } from "react";
import {
  Pause,
  Play,
  RotateCcw,
  Square,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { useAppStore } from "../store";
import { Card } from "../components/ui";
import { SubjectTopicSelect } from "../components/SubjectTopicSelect";
import { formatDatePt, formatDurationLong, todayISO } from "../lib/date";
import { phaseTargetSeconds, timerElapsedSeconds } from "../lib/timer";
import type { PomodoroPhase, SessionMode, TimerState } from "../types";

const PHASE_LABEL: Record<PomodoroPhase, string> = {
  focus: "Foco",
  short: "Pausa curta",
  long: "Pausa longa",
};

const SESSION_MODE_LABEL: Record<SessionMode, string> = {
  pomodoro: "Pomodoro",
  cronometro: "Cronômetro",
  manual: "Manual",
};

// Força um novo render a cada segundo enquanto o cronômetro está rodando, e
// dispara a troca de fase do pomodoro quando o tempo-alvo é atingido — tudo
// calculado a partir de timestamps reais, então o valor exibido continua
// correto mesmo que este componente fique desmontado por um tempo (troca de
// aba) e volte a montar depois.
function useTimerHeartbeat(timer: TimerState) {
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!timer.running) return;
    function beat() {
      const state = useAppStore.getState();
      if (state.timer.mode === "pomodoro") {
        const target = phaseTargetSeconds(
          state.timer.phase,
          state.pomodoroSettings,
        );
        if (timerElapsedSeconds(state.timer) >= target) {
          state.timerCompletePhase();
          return;
        }
      }
      setTick((n) => n + 1);
    }
    beat();
    const id = window.setInterval(beat, 1000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer.running, timer.mode, timer.phase, timer.startedAt]);
}

function PomodoroView({ timer }: { timer: TimerState }) {
  const settings = useAppStore((s) => s.pomodoroSettings);
  const timerStart = useAppStore((s) => s.timerStart);
  const timerPause = useAppStore((s) => s.timerPause);
  const timerResetPhase = useAppStore((s) => s.timerResetPhase);
  const timerFinishFocusNow = useAppStore((s) => s.timerFinishFocusNow);

  const elapsed = timerElapsedSeconds(timer);
  const target = phaseTargetSeconds(timer.phase, settings);
  const remaining = Math.max(0, target - elapsed);
  const progress = target > 0 ? elapsed / target : 0;

  const size = 220;
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <Card className="p-6 flex flex-col items-center gap-6">
      <div className="flex items-center gap-2">
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${
            timer.phase === "focus"
              ? "bg-blue-100 text-blue-700"
              : "bg-emerald-100 text-emerald-700"
          }`}
        >
          {PHASE_LABEL[timer.phase]}
        </span>
        <span className="text-xs text-slate-400">
          Ciclo {timer.cyclesDone % settings.cyclesBeforeLongBreak}/
          {settings.cyclesBeforeLongBreak}
        </span>
      </div>

      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={stroke}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={timer.phase === "focus" ? "#2563eb" : "#059669"}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - Math.min(1, progress))}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold tabular-nums text-slate-900">
            {formatDurationLong(remaining).replace(/^00:/, "")}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {!timer.running ? (
          <button
            onClick={timerStart}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-5 py-2.5"
          >
            <Play size={18} /> Iniciar
          </button>
        ) : (
          <button
            onClick={timerPause}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg px-5 py-2.5"
          >
            <Pause size={18} /> Pausar
          </button>
        )}
        <button
          onClick={timerResetPhase}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg px-4 py-2.5"
          title="Reiniciar fase atual"
        >
          <RotateCcw size={18} />
        </button>
        {timer.phase === "focus" && elapsed > 0 && (
          <button
            onClick={timerFinishFocusNow}
            className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium rounded-lg px-4 py-2.5"
            title="Encerrar sessão agora e salvar o tempo estudado"
          >
            <CheckCircle2 size={18} /> Concluir agora
          </button>
        )}
      </div>
    </Card>
  );
}

function StopwatchView({ timer }: { timer: TimerState }) {
  const timerStart = useAppStore((s) => s.timerStart);
  const timerPause = useAppStore((s) => s.timerPause);
  const timerSaveStopwatch = useAppStore((s) => s.timerSaveStopwatch);
  const elapsed = timerElapsedSeconds(timer);

  return (
    <Card className="p-6 flex flex-col items-center gap-6">
      <span className="text-6xl font-bold tabular-nums text-slate-900">
        {formatDurationLong(elapsed)}
      </span>
      <div className="flex items-center gap-3">
        {!timer.running ? (
          <button
            onClick={timerStart}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-5 py-2.5"
          >
            <Play size={18} /> Iniciar
          </button>
        ) : (
          <button
            onClick={timerPause}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg px-5 py-2.5"
          >
            <Pause size={18} /> Pausar
          </button>
        )}
        <button
          onClick={timerSaveStopwatch}
          disabled={elapsed < 1}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium rounded-lg px-4 py-2.5"
        >
          <Square size={16} /> Salvar e zerar
        </button>
      </div>
    </Card>
  );
}

function ManualEntryForm() {
  const addSession = useAppStore((s) => s.addSession);
  const [date, setDate] = useState(todayISO());
  const [subjectId, setSubjectId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [note, setNote] = useState("");

  function handleAdd() {
    const totalSeconds = (Number(hours) || 0) * 3600 + (Number(minutes) || 0) * 60;
    if (totalSeconds < 60) return;
    addSession({
      date,
      subjectId: subjectId || undefined,
      topicId: topicId || undefined,
      mode: "manual",
      durationSeconds: totalSeconds,
      startedAt: new Date().toISOString(),
      note: note.trim() || undefined,
    });
    setHours("");
    setMinutes("");
    setNote("");
  }

  return (
    <Card className="p-4 space-y-3">
      <p className="text-sm font-semibold text-slate-700">
        Registrar tempo manualmente
      </p>
      <p className="text-xs text-slate-400">
        Já estudou sem usar o cronômetro? Lance as horas aqui direto.
      </p>
      <div className="grid grid-cols-3 gap-3">
        <label className="text-xs text-slate-500 col-span-3 sm:col-span-1">
          Data
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm"
          />
        </label>
        <label className="text-xs text-slate-500">
          Horas
          <input
            type="number"
            min={0}
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="ex: 1"
            className="mt-1 w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm"
          />
        </label>
        <label className="text-xs text-slate-500">
          Minutos
          <input
            type="number"
            min={0}
            max={59}
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            placeholder="ex: 30"
            className="mt-1 w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm"
          />
        </label>
      </div>
      <SubjectTopicSelect
        subjectId={subjectId}
        topicId={topicId}
        onChangeSubject={setSubjectId}
        onChangeTopic={setTopicId}
      />
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Observação (opcional)"
        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2"
      />
      <button
        onClick={handleAdd}
        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg px-4 py-2"
      >
        Registrar
      </button>
    </Card>
  );
}

function RecentSessions() {
  const sessions = useAppStore((s) => s.sessions);
  const subjects = useAppStore((s) => s.subjects);
  const removeSession = useAppStore((s) => s.removeSession);
  const subjectName = (id?: string) => subjects.find((s) => s.id === id)?.name;

  const recent = [...sessions]
    .sort((a, b) => (a.startedAt < b.startedAt ? 1 : -1))
    .slice(0, 10);

  if (recent.length === 0) return null;

  return (
    <Card className="p-4">
      <p className="text-sm font-semibold text-slate-700 mb-3">
        Sessões recentes
      </p>
      <div className="divide-y divide-slate-50">
        {recent.map((s) => (
          <div key={s.id} className="flex items-center gap-3 py-2 text-sm group">
            <span className="text-slate-500 w-24 shrink-0">
              {formatDatePt(s.date)}
            </span>
            <span className="flex-1 min-w-0 truncate">
              {subjectName(s.subjectId) ?? "Geral"}
            </span>
            <span className="text-xs text-slate-400 shrink-0">
              {SESSION_MODE_LABEL[s.mode]}
            </span>
            <span className="font-medium text-slate-800 shrink-0">
              {formatDurationLong(s.durationSeconds)}
            </span>
            <button
              onClick={() => removeSession(s.id)}
              className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 shrink-0"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function TimerPage() {
  const timer = useAppStore((s) => s.timer);
  const timerSetMode = useAppStore((s) => s.timerSetMode);
  const timerSetSubjectTopic = useAppStore((s) => s.timerSetSubjectTopic);
  const settings = useAppStore((s) => s.pomodoroSettings);
  const updatePomodoroSettings = useAppStore((s) => s.updatePomodoroSettings);

  useTimerHeartbeat(timer);

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Cronômetro</h1>
        <p className="text-sm text-slate-500 mt-1">
          Use o modo pomodoro para estudar em ciclos de foco/descanso, ou o
          cronômetro livre para registrar qualquer sessão de estudo. Continua
          contando mesmo se você trocar de aba.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => timerSetMode("pomodoro")}
          className={`text-sm font-medium rounded-lg px-4 py-2 ${
            timer.mode === "pomodoro"
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Pomodoro
        </button>
        <button
          onClick={() => timerSetMode("cronometro")}
          className={`text-sm font-medium rounded-lg px-4 py-2 ${
            timer.mode === "cronometro"
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Cronômetro livre
        </button>
      </div>

      <Card className="p-4">
        <p className="text-xs font-medium text-slate-500 mb-2">
          Associar sessão a (opcional)
        </p>
        <SubjectTopicSelect
          subjectId={timer.subjectId ?? ""}
          topicId={timer.topicId ?? ""}
          onChangeSubject={(id) => timerSetSubjectTopic(id || undefined, undefined)}
          onChangeTopic={(id) =>
            timerSetSubjectTopic(timer.subjectId, id || undefined)
          }
        />
      </Card>

      {timer.mode === "pomodoro" ? (
        <PomodoroView timer={timer} />
      ) : (
        <StopwatchView timer={timer} />
      )}

      {timer.mode === "pomodoro" && (
        <Card className="p-4">
          <p className="text-sm font-semibold text-slate-700 mb-3">
            Configuração do pomodoro
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <label className="text-xs text-slate-500">
              Foco (min)
              <input
                type="number"
                min={1}
                value={settings.focusMinutes}
                onChange={(e) =>
                  updatePomodoroSettings({
                    focusMinutes: Number(e.target.value) || 1,
                  })
                }
                className="mt-1 w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm"
              />
            </label>
            <label className="text-xs text-slate-500">
              Pausa curta (min)
              <input
                type="number"
                min={1}
                value={settings.shortBreakMinutes}
                onChange={(e) =>
                  updatePomodoroSettings({
                    shortBreakMinutes: Number(e.target.value) || 1,
                  })
                }
                className="mt-1 w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm"
              />
            </label>
            <label className="text-xs text-slate-500">
              Pausa longa (min)
              <input
                type="number"
                min={1}
                value={settings.longBreakMinutes}
                onChange={(e) =>
                  updatePomodoroSettings({
                    longBreakMinutes: Number(e.target.value) || 1,
                  })
                }
                className="mt-1 w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm"
              />
            </label>
            <label className="text-xs text-slate-500">
              Ciclos p/ pausa longa
              <input
                type="number"
                min={1}
                value={settings.cyclesBeforeLongBreak}
                onChange={(e) =>
                  updatePomodoroSettings({
                    cyclesBeforeLongBreak: Number(e.target.value) || 1,
                  })
                }
                className="mt-1 w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm"
              />
            </label>
          </div>
        </Card>
      )}

      <ManualEntryForm />
      <RecentSessions />
    </div>
  );
}
