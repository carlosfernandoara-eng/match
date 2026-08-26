import { addDays, format } from "date-fns";

// Repetição espaçada simples: cada acerto dobra o intervalo (mínimo 2 dias,
// máximo 30); cada erro volta para revisar no dia seguinte.
export function nextInterval(prevIntervalDays: number, correct: boolean): number {
  if (!correct) return 1;
  return Math.min(prevIntervalDays > 0 ? prevIntervalDays * 2 : 2, 30);
}

export function dueDateAfter(intervalDays: number): string {
  return format(addDays(new Date(), intervalDays), "yyyy-MM-dd");
}
