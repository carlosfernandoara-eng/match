import type { TimerState } from "../types";

export function timerElapsedSeconds(timer: TimerState): number {
  if (!timer.running || !timer.startedAt) return timer.accumulatedSeconds;
  const runningSeconds = (Date.now() - new Date(timer.startedAt).getTime()) / 1000;
  return timer.accumulatedSeconds + Math.max(0, runningSeconds);
}

export function phaseTargetSeconds(
  phase: TimerState["phase"],
  settings: { focusMinutes: number; shortBreakMinutes: number; longBreakMinutes: number },
): number {
  if (phase === "focus") return settings.focusMinutes * 60;
  if (phase === "short") return settings.shortBreakMinutes * 60;
  return settings.longBreakMinutes * 60;
}
