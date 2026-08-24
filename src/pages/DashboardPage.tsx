import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Clock, Flame, Layers, ListChecks, Target } from "lucide-react";
import { useAppStore } from "../store";
import { Card, ProgressBar, StatCard } from "../components/ui";
import { formatDuration } from "../lib/date";
import {
  editalProgress,
  flashcardTotals,
  last14DaysSeries,
  questionTotals,
  secondsSince,
  studyStreak,
  subjectTimeBreakdown,
  totalSeconds,
  weekAgoISO,
} from "../lib/stats";

export default function DashboardPage() {
  const subjects = useAppStore((s) => s.subjects);
  const sessions = useAppStore((s) => s.sessions);
  const questionLogs = useAppStore((s) => s.questionLogs);
  const flashcardLogs = useAppStore((s) => s.flashcardLogs);

  const total = totalSeconds(sessions);
  const weekTotal = secondsSince(sessions, weekAgoISO());
  const series = last14DaysSeries(sessions);
  const streak = studyStreak(sessions, questionLogs, flashcardLogs);
  const edital = editalProgress(subjects);
  const questions = questionTotals(questionLogs);
  const flashcards = flashcardTotals(flashcardLogs);
  const bySubject = subjectTimeBreakdown(sessions, subjects);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Painel de estudos — PC-AL 2026
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Visão geral do seu progresso no edital.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="Horas totais estudadas"
          value={formatDuration(total)}
          sub={`${formatDuration(weekTotal)} nos últimos 7 dias`}
          icon={<Clock size={28} />}
        />
        <StatCard
          label="Sequência de estudo"
          value={`${streak} dia${streak === 1 ? "" : "s"}`}
          sub="dias seguidos com atividade"
          icon={<Flame size={28} />}
        />
        <StatCard
          label="Edital concluído"
          value={`${edital.percent}%`}
          sub={`${edital.done}/${edital.total} tópicos`}
          icon={<ListChecks size={28} />}
        />
        <StatCard
          label="Questões respondidas"
          value={`${questions.total}`}
          sub={
            questions.total
              ? `${Math.round((questions.correct / questions.total) * 100)}% de acerto`
              : "nenhum registro ainda"
          }
          icon={<Target size={28} />}
        />
        <StatCard
          label="Flashcards revisados"
          value={`${flashcards.reviewed}`}
          sub={`${flashcards.created} criados no total`}
          icon={<Layers size={28} />}
        />
      </div>

      <Card className="p-4">
        <p className="text-sm font-semibold text-slate-700 mb-4">
          Horas estudadas — últimos 14 dias
        </p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={series} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <Tooltip
                formatter={(v) => [`${v}h`, "Horas"]}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Bar dataKey="hours" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-4">
          <p className="text-sm font-semibold text-slate-700 mb-3">
            Progresso por disciplina
          </p>
          {subjects.length === 0 ? (
            <p className="text-sm text-slate-400">Nenhuma disciplina cadastrada.</p>
          ) : (
            <div className="space-y-3">
              {subjects.map((s) => {
                const done = s.topics.filter((t) => t.status === "concluido").length;
                const pct = s.topics.length ? Math.round((done / s.topics.length) * 100) : 0;
                return (
                  <div key={s.id}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-600 truncate">{s.name}</span>
                      <span className="text-slate-400 shrink-0">
                        {done}/{s.topics.length}
                      </span>
                    </div>
                    <ProgressBar value={pct} color={s.color} />
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card className="p-4">
          <p className="text-sm font-semibold text-slate-700 mb-3">
            Tempo de estudo por disciplina
          </p>
          {bySubject.length === 0 ? (
            <p className="text-sm text-slate-400">
              Nenhuma sessão associada a disciplinas ainda.
            </p>
          ) : (
            <div className="space-y-3">
              {bySubject.map((s) => {
                const max = bySubject[0].hours || 1;
                return (
                  <div key={s.name}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-600 truncate">{s.name}</span>
                      <span className="text-slate-400 shrink-0">{s.hours}h</span>
                    </div>
                    <ProgressBar value={(s.hours / max) * 100} color={s.color} />
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
