import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  PomodoroSettings,
  QuestionLog,
  Subject,
  StudySession,
  TopicStatus,
} from "./types";
import { buildSeedSubjects } from "./data/seed";
import { uid } from "./lib/id";

interface AppState {
  subjects: Subject[];
  sessions: StudySession[];
  questionLogs: QuestionLog[];
  pomodoroSettings: PomodoroSettings;

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
  removeTopic: (subjectId: string, topicId: string) => void;

  addSession: (session: Omit<StudySession, "id">) => void;
  removeSession: (sessionId: string) => void;

  addQuestionLog: (log: Omit<QuestionLog, "id">) => void;
  updateQuestionLog: (id: string, patch: Partial<QuestionLog>) => void;
  removeQuestionLog: (id: string) => void;

  updatePomodoroSettings: (patch: Partial<PomodoroSettings>) => void;

  importData: (data: {
    subjects: Subject[];
    sessions: StudySession[];
    questionLogs: QuestionLog[];
    pomodoroSettings?: PomodoroSettings;
  }) => void;
  resetAll: () => void;
}

const defaultPomodoro: PomodoroSettings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  cyclesBeforeLongBreak: 4,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      subjects: buildSeedSubjects(),
      sessions: [],
      questionLogs: [],
      pomodoroSettings: defaultPomodoro,

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

      updatePomodoroSettings: (patch) =>
        set((s) => ({
          pomodoroSettings: { ...s.pomodoroSettings, ...patch },
        })),

      importData: (data) =>
        set(() => ({
          subjects: data.subjects,
          sessions: data.sessions,
          questionLogs: data.questionLogs,
          pomodoroSettings: data.pomodoroSettings ?? defaultPomodoro,
        })),

      resetAll: () =>
        set(() => ({
          subjects: buildSeedSubjects(),
          sessions: [],
          questionLogs: [],
          pomodoroSettings: defaultPomodoro,
        })),
    }),
    { name: "pcal-2026-estudos" },
  ),
);
