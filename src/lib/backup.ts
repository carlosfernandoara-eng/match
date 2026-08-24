import type {
  FlashcardLog,
  PomodoroSettings,
  QuestionLog,
  StudySession,
  Subject,
} from "../types";

export function downloadBackupJson(payload: {
  subjects: Subject[];
  sessions: StudySession[];
  questionLogs: QuestionLog[];
  flashcardLogs: FlashcardLog[];
  pomodoroSettings: PomodoroSettings;
}) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `pcal-2026-estudos-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
