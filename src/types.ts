export type TopicStatus = "pendente" | "estudando" | "revisar" | "concluido";

export interface Topic {
  id: string;
  name: string;
  status: TopicStatus;
  notes?: string;
  updatedAt: string;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  topics: Topic[];
}

export type SessionMode = "pomodoro" | "cronometro";

export interface StudySession {
  id: string;
  date: string; // YYYY-MM-DD
  subjectId?: string;
  topicId?: string;
  mode: SessionMode;
  durationSeconds: number;
  startedAt: string;
  note?: string;
}

export interface QuestionLog {
  id: string;
  date: string; // YYYY-MM-DD
  subjectId?: string;
  topicId?: string;
  total: number;
  correct: number;
  note?: string;
}

export interface PomodoroSettings {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  cyclesBeforeLongBreak: number;
}
