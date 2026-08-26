import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CronogramaCycle,
  Flashcard,
  FlashcardLog,
  MissedQuestion,
  PomodoroSettings,
  QuestionLog,
  Subject,
  StudySession,
  TimerState,
  TopicStatus,
} from "./types";
import { buildSeedSubjects } from "./data/seed";
import { buildCronogramaSeed } from "./data/cronogramaSeed";
import { uid } from "./lib/id";
import { todayISO } from "./lib/date";
import { timerElapsedSeconds, phaseTargetSeconds } from "./lib/timer";
import { dueDateAfter, nextInterval } from "./lib/srs";

interface AppState {
  subjects: Subject[];
  sessions: StudySession[];
  questionLogs: QuestionLog[];
  flashcardLogs: FlashcardLog[];
  pomodoroSettings: PomodoroSettings;
  cronogramaCycles: CronogramaCycle[];
  timer: TimerState;
  flashcards: Flashcard[];
  missedQuestions: MissedQuestion[];
  installedAt: string;
  lastBackupAt: string | null;
  snoozeBackupUntil: string | null;
  lastCronogramaUpdateAt: string | null;
  snoozeCronogramaUntil: string | null;

  addSubject: (name: string, color: string) => void;
  renameSubject: (subjectId: string, name: string) => void;
  removeSubject: (subjectId: string) => void;

  addTopic: (subjectId: string, name: string) => void;
  renameTopic: (subjectId: string, topicId: string, name: string) => void;
  setTopicStatus: (
    subjectId: string,
    topicId: string,
    status: TopicStatus,
  ) => void;
  setTopicReviewed: (
    subjectId: string,
    topicId: string,
    reviewed: boolean,
  ) => void;
  removeTopic: (subjectId: string, topicId: string) => void;

  addSession: (session: Omit<StudySession, "id">) => void;
  removeSession: (sessionId: string) => void;

  addQuestionLog: (log: Omit<QuestionLog, "id">) => void;
  updateQuestionLog: (id: string, patch: Partial<QuestionLog>) => void;
  removeQuestionLog: (id: string) => void;

  addFlashcardLog: (log: Omit<FlashcardLog, "id">) => void;
  updateFlashcardLog: (id: string, patch: Partial<FlashcardLog>) => void;
  removeFlashcardLog: (id: string) => void;

  updatePomodoroSettings: (patch: Partial<PomodoroSettings>) => void;

  timerSetMode: (mode: TimerState["mode"]) => void;
  timerSetSubjectTopic: (subjectId?: string, topicId?: string) => void;
  timerStart: () => void;
  timerPause: () => void;
  timerResetPhase: () => void;
  timerCompletePhase: () => void;
  timerFinishFocusNow: () => void;
  timerSaveStopwatch: () => void;

  addMissedQuestion: (
    q: Omit<MissedQuestion, "id" | "flashcardId">,
  ) => void;
  removeMissedQuestion: (id: string) => void;
  reviewFlashcard: (id: string, correct: boolean) => void;
  removeFlashcard: (id: string) => void;

  toggleCronogramaItem: (
    cycleId: string,
    dayId: string,
    itemId: string,
  ) => void;
  setCronogramaDayDone: (
    cycleId: string,
    dayId: string,
    done: boolean,
  ) => void;
  syncCronogramaSeed: () => void;
  snoozeCronogramaReminder: (days: number) => void;

  markBackupDone: () => void;
  snoozeBackupReminder: (days: number) => void;

  importData: (data: {
    subjects: Subject[];
    sessions: StudySession[];
    questionLogs: QuestionLog[];
    flashcardLogs?: FlashcardLog[];
    cronogramaCycles?: CronogramaCycle[];
    flashcards?: Flashcard[];
    missedQuestions?: MissedQuestion[];
    pomodoroSettings?: PomodoroSettings;
  }) => void;
  resetAll: () => void;
}

const initialTimer: TimerState = {
  mode: "pomodoro",
  phase: "focus",
  cyclesDone: 0,
  running: false,
  startedAt: null,
  accumulatedSeconds: 0,
};

const defaultPomodoro: PomodoroSettings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  cyclesBeforeLongBreak: 4,
};

const initialSubjects = buildSeedSubjects();

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      subjects: initialSubjects,
      sessions: [],
      questionLogs: [],
      flashcardLogs: [],
      pomodoroSettings: defaultPomodoro,
      cronogramaCycles: buildCronogramaSeed(initialSubjects),
      timer: initialTimer,
      flashcards: [],
      missedQuestions: [],
      installedAt: new Date().toISOString(),
      lastBackupAt: null,
      snoozeBackupUntil: null,
      lastCronogramaUpdateAt: new Date().toISOString(),
      snoozeCronogramaUntil: null,

      addSubject: (name, color) =>
        set((s) => ({
          subjects: [...s.subjects, { id: uid(), name, color, topics: [] }],
        })),

      renameSubject: (subjectId, name) =>
        set((s) => ({
          subjects: s.subjects.map((sub) =>
            sub.id === subjectId ? { ...sub, name } : sub,
          ),
        })),

      removeSubject: (subjectId) =>
        set((s) => ({
          subjects: s.subjects.filter((sub) => sub.id !== subjectId),
        })),

      addTopic: (subjectId, name) =>
        set((s) => ({
          subjects: s.subjects.map((sub) =>
            sub.id === subjectId
              ? {
                  ...sub,
                  topics: [
                    ...sub.topics,
                    {
                      id: uid(),
                      name,
                      status: "pendente",
                      reviewed: false,
                      updatedAt: new Date().toISOString(),
                    },
                  ],
                }
              : sub,
          ),
        })),

      renameTopic: (subjectId, topicId, name) =>
        set((s) => ({
          subjects: s.subjects.map((sub) =>
            sub.id === subjectId
              ? {
                  ...sub,
                  topics: sub.topics.map((t) =>
                    t.id === topicId ? { ...t, name } : t,
                  ),
                }
              : sub,
          ),
        })),

      setTopicStatus: (subjectId, topicId, status) =>
        set((s) => ({
          subjects: s.subjects.map((sub) =>
            sub.id === subjectId
              ? {
                  ...sub,
                  topics: sub.topics.map((t) =>
                    t.id === topicId
                      ? { ...t, status, updatedAt: new Date().toISOString() }
                      : t,
                  ),
                }
              : sub,
          ),
        })),

      setTopicReviewed: (subjectId, topicId, reviewed) =>
        set((s) => ({
          subjects: s.subjects.map((sub) =>
            sub.id === subjectId
              ? {
                  ...sub,
                  topics: sub.topics.map((t) =>
                    t.id === topicId
                      ? { ...t, reviewed, updatedAt: new Date().toISOString() }
                      : t,
                  ),
                }
              : sub,
          ),
        })),

      removeTopic: (subjectId, topicId) =>
        set((s) => ({
          subjects: s.subjects.map((sub) =>
            sub.id === subjectId
              ? { ...sub, topics: sub.topics.filter((t) => t.id !== topicId) }
              : sub,
          ),
        })),

      addSession: (session) =>
        set((s) => ({
          sessions: [...s.sessions, { ...session, id: uid() }],
        })),

      removeSession: (sessionId) =>
        set((s) => ({
          sessions: s.sessions.filter((sess) => sess.id !== sessionId),
        })),

      addQuestionLog: (log) =>
        set((s) => ({
          questionLogs: [...s.questionLogs, { ...log, id: uid() }],
        })),

      updateQuestionLog: (id, patch) =>
        set((s) => ({
          questionLogs: s.questionLogs.map((l) =>
            l.id === id ? { ...l, ...patch } : l,
          ),
        })),

      removeQuestionLog: (id) =>
        set((s) => ({
          questionLogs: s.questionLogs.filter((l) => l.id !== id),
        })),

      addFlashcardLog: (log) =>
        set((s) => ({
          flashcardLogs: [...s.flashcardLogs, { ...log, id: uid() }],
        })),

      updateFlashcardLog: (id, patch) =>
        set((s) => ({
          flashcardLogs: s.flashcardLogs.map((l) =>
            l.id === id ? { ...l, ...patch } : l,
          ),
        })),

      removeFlashcardLog: (id) =>
        set((s) => ({
          flashcardLogs: s.flashcardLogs.filter((l) => l.id !== id),
        })),

      updatePomodoroSettings: (patch) =>
        set((s) => ({
          pomodoroSettings: { ...s.pomodoroSettings, ...patch },
        })),

      timerSetMode: (mode) =>
        set((s) => ({
          timer: {
            ...s.timer,
            mode,
            phase: "focus",
            cyclesDone: 0,
            running: false,
            startedAt: null,
            accumulatedSeconds: 0,
          },
        })),

      timerSetSubjectTopic: (subjectId, topicId) =>
        set((s) => ({ timer: { ...s.timer, subjectId, topicId } })),

      timerStart: () =>
        set((s) =>
          s.timer.running
            ? {}
            : {
                timer: {
                  ...s.timer,
                  running: true,
                  startedAt: new Date().toISOString(),
                },
              },
        ),

      timerPause: () =>
        set((s) => {
          if (!s.timer.running) return {};
          return {
            timer: {
              ...s.timer,
              running: false,
              accumulatedSeconds: timerElapsedSeconds(s.timer),
              startedAt: null,
            },
          };
        }),

      timerResetPhase: () =>
        set((s) => ({
          timer: {
            ...s.timer,
            running: false,
            startedAt: null,
            accumulatedSeconds: 0,
          },
        })),

      timerCompletePhase: () => {
        const s = get();
        const t = s.timer;
        if (t.mode !== "pomodoro") return;
        if (t.phase === "focus") {
          const target = phaseTargetSeconds(t.phase, s.pomodoroSettings);
          if (target >= 1) {
            get().addSession({
              date: todayISO(),
              subjectId: t.subjectId,
              topicId: t.topicId,
              mode: "pomodoro",
              durationSeconds: Math.round(target),
              startedAt: new Date().toISOString(),
            });
          }
          const nextCycles = t.cyclesDone + 1;
          const goLong =
            nextCycles % s.pomodoroSettings.cyclesBeforeLongBreak === 0;
          set(() => ({
            timer: {
              ...t,
              phase: goLong ? "long" : "short",
              cyclesDone: nextCycles,
              running: false,
              startedAt: null,
              accumulatedSeconds: 0,
            },
          }));
        } else {
          set(() => ({
            timer: {
              ...t,
              phase: "focus",
              running: false,
              startedAt: null,
              accumulatedSeconds: 0,
            },
          }));
        }
      },

      timerFinishFocusNow: () => {
        const s = get();
        const t = s.timer;
        const elapsed = timerElapsedSeconds(t);
        if (t.mode === "pomodoro" && t.phase === "focus" && elapsed >= 1) {
          get().addSession({
            date: todayISO(),
            subjectId: t.subjectId,
            topicId: t.topicId,
            mode: "pomodoro",
            durationSeconds: Math.round(elapsed),
            startedAt: new Date().toISOString(),
          });
        }
        set(() => ({
          timer: {
            ...t,
            phase: "focus",
            cyclesDone: 0,
            running: false,
            startedAt: null,
            accumulatedSeconds: 0,
          },
        }));
      },

      timerSaveStopwatch: () => {
        const s = get();
        const t = s.timer;
        const elapsed = timerElapsedSeconds(t);
        if (elapsed >= 1) {
          get().addSession({
            date: todayISO(),
            subjectId: t.subjectId,
            topicId: t.topicId,
            mode: "cronometro",
            durationSeconds: Math.round(elapsed),
            startedAt: new Date().toISOString(),
          });
        }
        set(() => ({
          timer: { ...t, running: false, startedAt: null, accumulatedSeconds: 0 },
        }));
      },

      addMissedQuestion: (q) => {
        const flashcardId = uid();
        const missedQuestionId = uid();
        set((s) => ({
          flashcards: [
            ...s.flashcards,
            {
              id: flashcardId,
              front: q.statement,
              back: q.correctAnswer?.trim() || "Revisar tópico.",
              subjectId: q.subjectId,
              topicId: q.topicId,
              createdAt: new Date().toISOString(),
              sourceMissedQuestionId: missedQuestionId,
              reviewCount: 0,
              intervalDays: 0,
              dueAt: todayISO(),
            },
          ],
          missedQuestions: [
            ...s.missedQuestions,
            { ...q, id: missedQuestionId, flashcardId },
          ],
        }));
      },

      removeMissedQuestion: (id) =>
        set((s) => {
          const mq = s.missedQuestions.find((m) => m.id === id);
          return {
            missedQuestions: s.missedQuestions.filter((m) => m.id !== id),
            flashcards: mq
              ? s.flashcards.filter((f) => f.id !== mq.flashcardId)
              : s.flashcards,
          };
        }),

      reviewFlashcard: (id, correct) =>
        set((s) => ({
          flashcards: s.flashcards.map((f) => {
            if (f.id !== id) return f;
            const intervalDays = nextInterval(f.intervalDays, correct);
            return {
              ...f,
              intervalDays,
              dueAt: dueDateAfter(intervalDays),
              reviewCount: f.reviewCount + 1,
              lastReviewedAt: new Date().toISOString(),
            };
          }),
        })),

      removeFlashcard: (id) =>
        set((s) => ({
          flashcards: s.flashcards.filter((f) => f.id !== id),
          missedQuestions: s.missedQuestions.filter(
            (m) => m.flashcardId !== id,
          ),
        })),

      toggleCronogramaItem: (cycleId, dayId, itemId) =>
        set((s) => ({
          cronogramaCycles: s.cronogramaCycles.map((c) =>
            c.id !== cycleId
              ? c
              : {
                  ...c,
                  days: c.days.map((day) =>
                    day.id !== dayId
                      ? day
                      : {
                          ...day,
                          items: day.items.map((item) =>
                            item.id === itemId
                              ? { ...item, done: !item.done }
                              : item,
                          ),
                        },
                  ),
                },
          ),
        })),

      setCronogramaDayDone: (cycleId, dayId, done) =>
        set((s) => ({
          cronogramaCycles: s.cronogramaCycles.map((c) =>
            c.id !== cycleId
              ? c
              : {
                  ...c,
                  days: c.days.map((day) =>
                    day.id !== dayId
                      ? day
                      : {
                          ...day,
                          items: day.items.map((item) => ({ ...item, done })),
                        },
                  ),
                },
          ),
        })),

      syncCronogramaSeed: () => {
        const s = get();
        const freshCycles = buildCronogramaSeed(s.subjects);
        const existingNames = new Set(s.cronogramaCycles.map((c) => c.name));
        const newCycles = freshCycles.filter(
          (c) => !existingNames.has(c.name),
        );
        if (newCycles.length === 0) return;
        set(() => ({
          cronogramaCycles: [...s.cronogramaCycles, ...newCycles],
          lastCronogramaUpdateAt: new Date().toISOString(),
          snoozeCronogramaUntil: null,
        }));
      },

      snoozeCronogramaReminder: (days) =>
        set(() => ({
          snoozeCronogramaUntil: new Date(
            Date.now() + days * 24 * 60 * 60 * 1000,
          ).toISOString(),
        })),

      markBackupDone: () =>
        set(() => ({
          lastBackupAt: new Date().toISOString(),
          snoozeBackupUntil: null,
        })),

      snoozeBackupReminder: (days) =>
        set(() => ({
          snoozeBackupUntil: new Date(
            Date.now() + days * 24 * 60 * 60 * 1000,
          ).toISOString(),
        })),

      importData: (data) =>
        set(() => ({
          subjects: data.subjects,
          sessions: data.sessions,
          questionLogs: data.questionLogs,
          flashcardLogs: data.flashcardLogs ?? [],
          cronogramaCycles:
            data.cronogramaCycles ?? buildCronogramaSeed(data.subjects),
          flashcards: data.flashcards ?? [],
          missedQuestions: data.missedQuestions ?? [],
          pomodoroSettings: data.pomodoroSettings ?? defaultPomodoro,
        })),

      resetAll: () => {
        const freshSubjects = buildSeedSubjects();
        set(() => ({
          subjects: freshSubjects,
          sessions: [],
          questionLogs: [],
          flashcardLogs: [],
          cronogramaCycles: buildCronogramaSeed(freshSubjects),
          flashcards: [],
          missedQuestions: [],
          timer: initialTimer,
          pomodoroSettings: defaultPomodoro,
          lastBackupAt: null,
          snoozeBackupUntil: null,
          lastCronogramaUpdateAt: new Date().toISOString(),
          snoozeCronogramaUntil: null,
        }));
      },
    }),
    { name: "pcal-2026-estudos" },
  ),
);
