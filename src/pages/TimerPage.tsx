import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Square, CheckCircle2 } from "lucide-react";
import { useAppStore } from "../store";
import { Card } from "../components/ui";
import { SubjectTopicSelect } from "../components/SubjectTopicSelect";
import { formatDurationLong, todayISO } from "../lib/date";

type Phase = "focus" | "short" | "long";

const PHASE_LABEL: Record<Phase, string> = {
  focus: "Foco",
  short: "Pausa curta",
  long: "Pausa longa",
};

function usePhaseSeconds(phase: Phase) {
  const settings = useAppStore((s) => s.pomodoroSettings);
  if (phase === "focus") return settings.focusMinutes * 60;
  if (phase === "short") return settings.shortBreakMinutes * 60;
  return settings.longBreakMinutes * 60;
}

function PomodoroTimer({
  subjectId,
  topicId,
}: {
  subjectId: string;
  topicId: string;
}) {
  const settings = useAppStore((s) => s.pomodoroSettings);
  const addSession = useAppStore((s) => s.addSession);

  const [phase, setPhase] = useState<Phase>("focus");
  const phaseSeconds = usePhaseSeconds(phase);
  const [remaining, setRemaining] = useState(phaseSeconds);
  const [running, setRunning] = useState(false);
  const [cyclesDone, setCyclesDone] = useState(0);
  const intervalRef = useRef<number | null>(null);

  // Keep remaining in sync when settings change while idle at full time.
  useEffect(() => {
    if (!running) setRemaining(phaseSeconds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phaseSeconds, phase]);

  function logFocusSeconds(seconds: number) {
    if (seconds < 1) return;
    addSession({
      date: todayISO(),
      subjectId: subjectId || undefined,
      topicId: topicId || undefined,
      mode: "pomodoro",
      durationSeconds: seconds,
      startedAt: new Date().toISOString(),
    });
  }

  function advancePhase(completedFocusSeconds: number) {
    if (phase === "focus") {
      logFocusSeconds(completedFocusSeconds);
      const nextCycles = cyclesDone + 1;
      setCyclesDone(nextCycles);
      const goLong = nextCycles % settings.cyclesBeforeLongBreak === 0;
      setPhase(goLong ? "long" : "short");
    } else {
      setPhase("focus");
    }
    setRunning(false);
  }

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          window.clearInterval(intervalRef.current!);
          const full = phaseSeconds;
          advancePhase(full);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, phase]);

  function handleReset() {
    setRunning(false);
    setRemaining(phaseSeconds);
  }

  function handleFinishNow() {
    setRunning(false);
    if (phase === "focus") {
      const elapsed = phaseSeconds - remaining;
      logFocusSeconds(elapsed);
    }
    setPhase("focus");
    setCyclesDone(0);
  }

  const progress = 1 - remaining / phaseSeconds;
  const size = 220;
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <Card className="p-6 flex flex-col items-center gap-6">
      <div className="flex items-center gap-2">
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${
            phase === "focus"
              ? "bg-blue-100 text-blue-700"
              : "bg-emerald-100 text-emerald-700"
          }`}
        >
          {PHASE_LABEL[phase]}
        </span>
        <span className="text-xs text-slate-400">
          Ciclo {cyclesDone % settings.cyclesBeforeLongBreak}/
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
            stroke={phase === "focus" ? "#2563eb" : "#059669"}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
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
        {!running ? (
          <button
            onClick={() => setRunning(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-5 py-2.5"
          >
            <Play size={18} /> Iniciar
          </button>
        ) : (
          <button
            onClick={() => setRunning(false)}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg px-5 py-2.5"
          >
            <Pause size={18} /> Pausar
          </button>
        )}
        <button
          onClick={handleReset}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg px-4 py-2.5"
          title="Reiniciar fase atual"
        >
          <RotateCcw size={18} />
        </button>
        {phase === "focus" && (remaining < phaseSeconds || running) && (
          <button
            onClick={handleFinishNow}
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

function Stopwatch({
  subjectId,
  topicId,
}: {
  subjectId: string;
  topicId: string;
}) {
  const addSession = useAppStore((s) => s.addSession);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = window.setInterval(() => {
      setElapsed((e) => e + 1);
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running]);

  function handleSave() {
    setRunning(false);
    if (elapsed > 0) {
      addSession({
        date: todayISO(),
        subjectId: subjectId || undefined,
        topicId: topicId || undefined,
        mode: "cronometro",
        durationSeconds: elapsed,
        startedAt: new Date().toISOString(),
      });
    }
    setElapsed(0);
  }

  return (
    <Card className="p-6 flex flex-col items-center gap-6">
      <span className="text-6xl font-bold tabular-nums text-slate-900">
        {formatDurationLong(elapsed)}
      </span>
      <div className="flex items-center gap-3">
        {!running ? (
          <button
            onClick={() => setRunning(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-5 py-2.5"
          >
            <Play size={18} /> Iniciar
          </button>
        ) : (
          <button
            onClick={() => setRunning(false)}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg px-5 py-2.5"
          >
            <Pause size={18} /> Pausar
          </button>
        )}
        <button
          onClick={handleSave}
          disabled={elapsed === 0}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium rounded-lg px-4 py-2.5"
        >
          <Square size={16} /> Salvar e zerar
        </button>
      </div>
    </Card>
  );
}

export default function TimerPage() {
  const [mode, setMode] = useState<"pomodoro" | "cronometro">("pomodoro");
  const [subjectId, setSubjectId] = useState("");
  const [topicId, setTopicId] = useState("");
  const settings = useAppStore((s) => s.pomodoroSettings);
  const updatePomodoroSettings = useAppStore((s) => s.updatePomodoroSettings);

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Cronômetro</h1>
        <p className="text-sm text-slate-500 mt-1">
          Use o modo pomodoro para estudar em ciclos de foco/descanso, ou o
          cronômetro livre para registrar qualquer sessão de estudo.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setMode("pomodoro")}
          className={`text-sm font-medium rounded-lg px-4 py-2 ${
            mode === "pomodoro"
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Pomodoro
        </button>
        <button
          onClick={() => setMode("cronometro")}
          className={`text-sm font-medium rounded-lg px-4 py-2 ${
            mode === "cronometro"
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
          subjectId={subjectId}
          topicId={topicId}
          onChangeSubject={setSubjectId}
          onChangeTopic={setTopicId}
        />
      </Card>

      {mode === "pomodoro" ? (
        <PomodoroTimer subjectId={subjectId} topicId={topicId} />
      ) : (
        <Stopwatch subjectId={subjectId} topicId={topicId} />
      )}

      {mode === "pomodoro" && (
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
    </div>
  );
}
