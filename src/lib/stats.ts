import { format, parseISO, subDays } from "date-fns";
import type {
  CronogramaCycle,
  FlashcardLog,
  QuestionLog,
  StudySession,
  Subject,
} from "../types";

export function totalSeconds(sessions: StudySession[]): number {
  return sessions.reduce((n, s) => n + s.durationSeconds, 0);
}

export function secondsSince(sessions: StudySession[], sinceISO: string): number {
  return sessions
    .filter((s) => s.date >= sinceISO)
    .reduce((n, s) => n + s.durationSeconds, 0);
}

export function last14DaysSeries(sessions: StudySession[]) {
  const days: { date: string; label: string; hours: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = subDays(new Date(), i);
    const iso = format(d, "yyyy-MM-dd");
    const seconds = sessions
      .filter((s) => s.date === iso)
      .reduce((n, s) => n + s.durationSeconds, 0);
    days.push({ date: iso, label: format(d, "dd/MM"), hours: +(seconds / 3600).toFixed(2) });
  }
  return days;
}

export function studyStreak(
  sessions: StudySession[],
  questionLogs: QuestionLog[],
  flashcardLogs: FlashcardLog[] = [],
): number {
  const activeDates = new Set<string>([
    ...sessions.map((s) => s.date),
    ...questionLogs.map((q) => q.date),
    ...flashcardLogs.map((f) => f.date),
  ]);
  let streak = 0;
  let cursor = new Date();
  while (activeDates.has(format(cursor, "yyyy-MM-dd"))) {
    streak++;
    cursor = subDays(cursor, 1);
  }
  return streak;
}

export function editalProgress(subjects: Subject[]) {
  const total = subjects.reduce((n, s) => n + s.topics.length, 0);
  const done = subjects.reduce(
    (n, s) => n + s.topics.filter((t) => t.status === "concluido").length,
    0,
  );
  return { total, done, percent: total ? Math.round((done / total) * 100) : 0 };
}

export function questionTotals(questionLogs: QuestionLog[]) {
  return questionLogs.reduce(
    (acc, l) => ({ total: acc.total + l.total, correct: acc.correct + l.correct }),
    { total: 0, correct: 0 },
  );
}

export function topicQuestionTotals(
  questionLogs: QuestionLog[],
): Map<string, { total: number; correct: number }> {
  const map = new Map<string, { total: number; correct: number }>();
  for (const log of questionLogs) {
    if (!log.topicId) continue;
    const cur = map.get(log.topicId) ?? { total: 0, correct: 0 };
    cur.total += log.total;
    cur.correct += log.correct;
    map.set(log.topicId, cur);
  }
  return map;
}

export function cronogramaProgress(cycles: CronogramaCycle[]) {
  let total = 0;
  let done = 0;
  for (const c of cycles) {
    for (const day of c.days) {
      for (const item of day.items) {
        total++;
        if (item.done) done++;
      }
    }
  }
  return { total, done, percent: total ? Math.round((done / total) * 100) : 0 };
}

export function cronogramaCycleProgress(cycle: CronogramaCycle) {
  let total = 0;
  let done = 0;
  for (const day of cycle.days) {
    for (const item of day.items) {
      total++;
      if (item.done) done++;
    }
  }
  return { total, done, percent: total ? Math.round((done / total) * 100) : 0 };
}

export function cronogramaEditalCoverage(
  cycles: CronogramaCycle[],
  subjects: Subject[],
) {
  const touched = new Map<string, { itemsCount: number; doneCount: number }>();
  for (const c of cycles) {
    for (const day of c.days) {
      for (const item of day.items) {
        if (!item.linkedSubjectId) continue;
        const cur = touched.get(item.linkedSubjectId) ?? {
          itemsCount: 0,
          doneCount: 0,
        };
        cur.itemsCount++;
        if (item.done) cur.doneCount++;
        touched.set(item.linkedSubjectId, cur);
      }
    }
  }
  const rows = subjects.map((s) => ({
    subjectId: s.id,
    name: s.name,
    color: s.color,
    itemsCount: touched.get(s.id)?.itemsCount ?? 0,
    doneCount: touched.get(s.id)?.doneCount ?? 0,
  }));
  return {
    rows,
    subjectsTouched: rows.filter((r) => r.itemsCount > 0).length,
    subjectsTotal: subjects.length,
  };
}

export function flashcardTotals(flashcardLogs: FlashcardLog[]) {
  return flashcardLogs.reduce(
    (acc, l) => ({
      created: acc.created + l.created,
      reviewed: acc.reviewed + l.reviewed,
    }),
    { created: 0, reviewed: 0 },
  );
}

export function subjectTimeBreakdown(sessions: StudySession[], subjects: Subject[]) {
  const bySubject = new Map<string, number>();
  for (const s of sessions) {
    if (!s.subjectId) continue;
    bySubject.set(s.subjectId, (bySubject.get(s.subjectId) ?? 0) + s.durationSeconds);
  }
  return subjects
    .map((s) => ({
      name: s.name,
      color: s.color,
      hours: +((bySubject.get(s.id) ?? 0) / 3600).toFixed(2),
    }))
    .filter((s) => s.hours > 0)
    .sort((a, b) => b.hours - a.hours);
}

export function weekAgoISO(): string {
  return format(subDays(new Date(), 6), "yyyy-MM-dd");
}

export function isoToDate(iso: string): Date {
  return parseISO(iso);
}
