export type TopicStatus = "pendente" | "estudando" | "revisar" | "concluido";

export interface Topic {
  id: string;
  name: string;
  status: TopicStatus;
  reviewed: boolean;
  notes?: string;
  updatedAt: string;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  topics: Topic[];
}

export type SessionMode = "pomodoro" | "cronometro" | "manual";

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

export interface FlashcardLog {
  id: string;
  date: string; // YYYY-MM-DD
  subjectId?: string;
  topicId?: string;
  created: number;
  reviewed: number;
  note?: string;
}

export interface PomodoroSettings {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  cyclesBeforeLongBreak: number;
}

export interface CronogramaItem {
  id: string;
  subjectLabel: string;
  description: string;
  done: boolean;
  linkedSubjectId?: string;
}

export interface CronogramaDay {
  id: string;
  label: string;
  estimatedTime?: string;
  items: CronogramaItem[];
}

export interface CronogramaCycle {
  id: string;
  name: string;
  subtitle?: string;
  days: CronogramaDay[];
}

export type TimerMode = "pomodoro" | "cronometro";
export type PomodoroPhase = "focus" | "short" | "long";

export interface TimerState {
  mode: TimerMode;
  phase: PomodoroPhase;
  cyclesDone: number;
  running: boolean;
  startedAt: string | null; // ISO timestamp of the current running segment, null when paused
  accumulatedSeconds: number; // seconds already counted in the current phase/session while paused
  subjectId?: string;
  topicId?: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  comment?: string;
  subjectId?: string;
  topicId?: string;
  createdAt: string;
  sourceMissedQuestionId?: string;
  lastReviewedAt?: string;
  reviewCount: number;
  intervalDays: number;
  dueAt: string; // YYYY-MM-DD
}

export interface MissedQuestion {
  id: string;
  date: string; // YYYY-MM-DD
  subjectId?: string;
  topicId?: string;
  statement: string;
  correctAnswer?: string;
  comment?: string;
  flashcardId: string;
}
