import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Plus, Trash2, X } from "lucide-react";
import { useAppStore } from "../store";
import { Card, ProgressBar } from "../components/ui";
import { topicQuestionTotals } from "../lib/stats";
import type { Topic, TopicStatus } from "../types";

const STATUS_LABEL: Record<TopicStatus, string> = {
  pendente: "Pendente",
  estudando: "Estudando",
  revisar: "Revisar",
  concluido: "Concluído",
};

const STATUS_CLASS: Record<TopicStatus, string> = {
  pendente: "bg-slate-100 text-slate-600",
  estudando: "bg-amber-100 text-amber-700",
  revisar: "bg-purple-100 text-purple-700",
  concluido: "bg-emerald-100 text-emerald-700",
};

const SUBJECT_COLORS = [
  "#2563eb",
  "#7c3aed",
  "#0891b2",
  "#b45309",
  "#dc2626",
  "#16a34a",
  "#0d9488",
  "#4338ca",
  "#db2777",
];

function subjectProgress(topics: Topic[]) {
  if (topics.length === 0) return 0;
  const done = topics.filter((t) => t.status === "concluido").length;
  return Math.round((done / topics.length) * 100);
}

function TopicRow({
  subjectId,
  topic,
  questionStats,
}: {
  subjectId: string;
  topic: Topic;
  questionStats?: { total: number; correct: number };
}) {
  const setTopicStatus = useAppStore((s) => s.setTopicStatus);
  const setTopicReviewed = useAppStore((s) => s.setTopicReviewed);
  const removeTopic = useAppStore((s) => s.removeTopic);

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 py-2 px-1 group">
      <label className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0 cursor-pointer">
        <input
          type="checkbox"
          checked={topic.status === "concluido"}
          onChange={(e) =>
            setTopicStatus(
              subjectId,
              topic.id,
              e.target.checked ? "concluido" : "pendente",
            )
          }
          className="w-3.5 h-3.5 rounded accent-blue-600 shrink-0"
        />
        Estudei
      </label>
      <label className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0 cursor-pointer">
        <input
          type="checkbox"
          checked={topic.reviewed}
          onChange={(e) =>
            setTopicReviewed(subjectId, topic.id, e.target.checked)
          }
          className="w-3.5 h-3.5 rounded accent-purple-600 shrink-0"
        />
        Revisei
      </label>
      <span
        className={`flex-1 min-w-[160px] text-sm ${
          topic.status === "concluido"
            ? "text-slate-400 line-through"
            : "text-slate-800"
        }`}
      >
        {topic.name}
      </span>
      {questionStats && questionStats.total > 0 && (
        <span
          className="text-xs text-slate-400 shrink-0"
          title="Questões respondidas associadas a este tópico"
        >
          {questionStats.correct}/{questionStats.total} questões (
          {Math.round((questionStats.correct / questionStats.total) * 100)}%)
        </span>
      )}
      <select
        value={topic.status}
        onChange={(e) =>
          setTopicStatus(subjectId, topic.id, e.target.value as TopicStatus)
        }
        className={`text-xs font-medium rounded-full px-2 py-1 border-0 cursor-pointer ${STATUS_CLASS[topic.status]}`}
      >
        {(Object.keys(STATUS_LABEL) as TopicStatus[]).map((st) => (
          <option key={st} value={st}>
            {STATUS_LABEL[st]}
          </option>
        ))}
      </select>
      <button
        onClick={() => removeTopic(subjectId, topic.id)}
        className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-opacity shrink-0"
        title="Remover tópico"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}

function SubjectCard({
  subject,
  questionStatsByTopic,
}: {
  subject: ReturnType<typeof useAppStore.getState>["subjects"][number];
  questionStatsByTopic: Map<string, { total: number; correct: number }>;
}) {
  const [open, setOpen] = useState(true);
  const [newTopic, setNewTopic] = useState("");
  const addTopic = useAppStore((s) => s.addTopic);
  const removeSubject = useAppStore((s) => s.removeSubject);
  const progress = subjectProgress(subject.topics);

  function handleAddTopic() {
    const name = newTopic.trim();
    if (!name) return;
    addTopic(subject.id, name);
    setNewTopic("");
  }

  return (
    <Card className="p-0 overflow-hidden">
      <div
        className="flex items-center gap-3 p-4 cursor-pointer"
        onClick={() => setOpen((o) => !o)}
      >
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: subject.color }}
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-800 truncate">
            {subject.name}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="w-40 max-w-full">
              <ProgressBar value={progress} color={subject.color} />
            </div>
            <span className="text-xs text-slate-500 shrink-0">
              {subject.topics.filter((t) => t.status === "concluido").length}/
              {subject.topics.length} ({progress}%)
            </span>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm(`Remover a disciplina "${subject.name}"?`)) {
              removeSubject(subject.id);
            }
          }}
          className="text-slate-300 hover:text-red-500 shrink-0"
          title="Remover disciplina"
        >
          <Trash2 size={16} />
        </button>
        {open ? (
          <ChevronDown size={18} className="text-slate-400 shrink-0" />
        ) : (
          <ChevronRight size={18} className="text-slate-400 shrink-0" />
        )}
      </div>

      {open && (
        <div className="border-t border-slate-100 px-4 pb-4">
          <div className="divide-y divide-slate-50">
            {subject.topics.map((t) => (
              <TopicRow
                key={t.id}
                subjectId={subject.id}
                topic={t}
                questionStats={questionStatsByTopic.get(t.id)}
              />
            ))}
          </div>
          {subject.topics.length === 0 && (
            <p className="text-sm text-slate-400 py-3">
              Nenhum tópico ainda. Adicione abaixo.
            </p>
          )}
          <div className="flex items-center gap-2 mt-3">
            <input
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTopic()}
              placeholder="Novo tópico..."
              className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            />
            <button
              onClick={handleAddTopic}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 shrink-0"
            >
              <Plus size={16} /> Adicionar
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}

function AddSubjectForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(SUBJECT_COLORS[0]);
  const addSubject = useAppStore((s) => s.addSubject);

  function handleAdd() {
    const trimmed = name.trim();
    if (!trimmed) return;
    addSubject(trimmed, color);
    onClose();
  }

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-slate-800 text-sm">
          Nova disciplina
        </p>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700"
        >
          <X size={16} />
        </button>
      </div>
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        placeholder="Nome da disciplina"
        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
      />
      <div className="flex items-center gap-2 flex-wrap">
        {SUBJECT_COLORS.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className={`w-6 h-6 rounded-full ${color === c ? "ring-2 ring-offset-2 ring-slate-400" : ""}`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
      <button
        onClick={handleAdd}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg py-2"
      >
        Criar disciplina
      </button>
    </Card>
  );
}

export default function SubjectsPage() {
  const subjects = useAppStore((s) => s.subjects);
  const questionLogs = useAppStore((s) => s.questionLogs);
  const [showAdd, setShowAdd] = useState(false);
  const questionStatsByTopic = useMemo(
    () => topicQuestionTotals(questionLogs),
    [questionLogs],
  );

  const totalTopics = subjects.reduce((n, s) => n + s.topics.length, 0);
  const doneTopics = subjects.reduce(
    (n, s) => n + s.topics.filter((t) => t.status === "concluido").length,
    0,
  );
  const overall = totalTopics ? Math.round((doneTopics / totalTopics) * 100) : 0;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Edital</h1>
        <p className="text-sm text-slate-500 mt-1">
          Marque se já estudou e se já revisou cada tópico — o número de
          questões feitas aparece automaticamente quando você registra
          questões associadas a ele em Questões. Conteúdo programático do
          Edital nº 1 – PC/AL (Cebraspe), cargo de Escrivão de Polícia Civil,
          verticalizado por disciplina. Em caso de retificação do edital,
          ajuste os tópicos por aqui.
        </p>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-slate-700">
            Progresso geral do edital
          </p>
          <p className="text-sm font-semibold text-slate-900">
            {doneTopics}/{totalTopics} tópicos ({overall}%)
          </p>
        </div>
        <ProgressBar value={overall} />
      </Card>

      <div className="space-y-4">
        {subjects.map((s) => (
          <SubjectCard
            key={s.id}
            subject={s}
            questionStatsByTopic={questionStatsByTopic}
          />
        ))}
      </div>

      {showAdd ? (
        <AddSubjectForm onClose={() => setShowAdd(false)} />
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <Plus size={16} /> Nova disciplina
        </button>
      )}
    </div>
  );
}
