import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useAppStore } from "../store";
import { Card } from "../components/ui";
import { SubjectTopicSelect } from "../components/SubjectTopicSelect";
import { formatDatePt, todayISO } from "../lib/date";

export default function QuestionsPage() {
  const questionLogs = useAppStore((s) => s.questionLogs);
  const subjects = useAppStore((s) => s.subjects);
  const addQuestionLog = useAppStore((s) => s.addQuestionLog);
  const removeQuestionLog = useAppStore((s) => s.removeQuestionLog);

  const [date, setDate] = useState(todayISO());
  const [subjectId, setSubjectId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [total, setTotal] = useState("");
  const [correct, setCorrect] = useState("");
  const [note, setNote] = useState("");

  const subjectName = (id?: string) =>
    subjects.find((s) => s.id === id)?.name;

  function handleAdd() {
    const totalNum = Number(total);
    const correctNum = Number(correct || 0);
    if (!totalNum || totalNum <= 0) return;
    if (correctNum > totalNum) return;
    addQuestionLog({
      date,
      subjectId: subjectId || undefined,
      topicId: topicId || undefined,
      total: totalNum,
      correct: correctNum,
      note: note.trim() || undefined,
    });
    setTotal("");
    setCorrect("");
    setNote("");
  }

  const sorted = useMemo(
    () =>
      [...questionLogs].sort((a, b) => (a.date < b.date ? 1 : -1)),
    [questionLogs],
  );

  const totals = questionLogs.reduce(
    (acc, l) => ({ total: acc.total + l.total, correct: acc.correct + l.correct }),
    { total: 0, correct: 0 },
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Questões</h1>
        <p className="text-sm text-slate-500 mt-1">
          Registre quantas questões você fez em cada dia de estudo, com
          acertos por disciplina.
        </p>
      </div>

      <Card className="p-4 space-y-3">
        <p className="text-sm font-semibold text-slate-700">
          Novo registro
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <label className="text-xs text-slate-500 col-span-2 sm:col-span-1">
            Data
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm"
            />
          </label>
          <label className="text-xs text-slate-500">
            Total de questões
            <input
              type="number"
              min={1}
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              placeholder="ex: 20"
              className="mt-1 w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm"
            />
          </label>
          <label className="text-xs text-slate-500">
            Acertos
            <input
              type="number"
              min={0}
              value={correct}
              onChange={(e) => setCorrect(e.target.value)}
              placeholder="ex: 15"
              className="mt-1 w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm"
            />
          </label>
        </div>
        <SubjectTopicSelect
          subjectId={subjectId}
          topicId={topicId}
          onChangeSubject={setSubjectId}
          onChangeTopic={setTopicId}
        />
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Observação (opcional) — ex: simulado, banca X..."
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2"
        />
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg px-4 py-2"
        >
          <Plus size={16} /> Registrar
        </button>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-slate-700">Histórico</p>
          <p className="text-xs text-slate-500">
            {totals.total} questões · {totals.correct} acertos
            {totals.total > 0 &&
              ` (${Math.round((totals.correct / totals.total) * 100)}%)`}
          </p>
        </div>
        {sorted.length === 0 ? (
          <p className="text-sm text-slate-400">Nenhum registro ainda.</p>
        ) : (
          <div className="divide-y divide-slate-50">
            {sorted.map((l) => (
              <div
                key={l.id}
                className="flex items-center gap-3 py-2.5 text-sm group"
              >
                <span className="text-slate-500 w-24 shrink-0">
                  {formatDatePt(l.date)}
                </span>
                <span className="flex-1 min-w-0 truncate">
                  {subjectName(l.subjectId) ?? "Geral"}
                </span>
                <span className="font-medium text-slate-800 shrink-0">
                  {l.correct}/{l.total}{" "}
                  <span className="text-slate-400">
                    ({l.total ? Math.round((l.correct / l.total) * 100) : 0}
                    %)
                  </span>
                </span>
                <button
                  onClick={() => removeQuestionLog(l.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 shrink-0"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
