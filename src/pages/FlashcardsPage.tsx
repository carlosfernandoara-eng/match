import { useMemo, useState } from "react";
import { Check, Plus, Trash2, X } from "lucide-react";
import { useAppStore } from "../store";
import { Card } from "../components/ui";
import { SubjectTopicSelect } from "../components/SubjectTopicSelect";
import { formatDatePt, todayISO } from "../lib/date";
import { flashcardTotals } from "../lib/stats";
import type { Flashcard } from "../types";

function MissedQuestionForm() {
  const addMissedQuestion = useAppStore((s) => s.addMissedQuestion);
  const [date, setDate] = useState(todayISO());
  const [subjectId, setSubjectId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [statement, setStatement] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [comment, setComment] = useState("");

  function handleAdd() {
    if (!statement.trim()) return;
    addMissedQuestion({
      date,
      subjectId: subjectId || undefined,
      topicId: topicId || undefined,
      statement: statement.trim(),
      correctAnswer: correctAnswer.trim() || undefined,
      comment: comment.trim() || undefined,
    });
    setStatement("");
    setCorrectAnswer("");
    setComment("");
  }

  return (
    <Card className="p-4 space-y-3">
      <p className="text-sm font-semibold text-slate-700">
        Questão que errei
      </p>
      <p className="text-xs text-slate-400">
        Cole a questão (ou um resumo dela) e a resposta/justificativa
        correta. Um flashcard de revisão é criado automaticamente.
      </p>
      <label className="text-xs text-slate-500 block">
        Data
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 w-full sm:w-40 border border-slate-200 rounded-lg px-2 py-1.5 text-sm"
        />
      </label>
      <SubjectTopicSelect
        subjectId={subjectId}
        topicId={topicId}
        onChangeSubject={setSubjectId}
        onChangeTopic={setTopicId}
      />
      <textarea
        value={statement}
        onChange={(e) => setStatement(e.target.value)}
        placeholder="O que a questão pedia / onde você errou..."
        rows={2}
        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 resize-y"
      />
      <textarea
        value={correctAnswer}
        onChange={(e) => setCorrectAnswer(e.target.value)}
        placeholder="Resposta correta / justificativa (vira o verso do flashcard)"
        rows={2}
        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 resize-y"
      />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Comentário de alguém explicando a questão (opcional) — cole aqui a explicação de um professor, colega ou fórum"
        rows={3}
        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 resize-y"
      />
      <button
        onClick={handleAdd}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg px-4 py-2"
      >
        <Plus size={16} /> Registrar e gerar flashcard
      </button>
    </Card>
  );
}

function FlashcardReviewRow({
  card,
  subjectName,
}: {
  card: Flashcard;
  subjectName?: string;
}) {
  const [showBack, setShowBack] = useState(false);
  const reviewFlashcard = useAppStore((s) => s.reviewFlashcard);
  const removeFlashcard = useAppStore((s) => s.removeFlashcard);

  function handleReview(correct: boolean) {
    reviewFlashcard(card.id, correct);
    setShowBack(false);
  }

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        {subjectName && (
          <span className="text-xs text-slate-400">{subjectName}</span>
        )}
        <button
          onClick={() => removeFlashcard(card.id)}
          className="text-slate-300 hover:text-red-500 ml-auto"
          title="Remover flashcard"
        >
          <Trash2 size={14} />
        </button>
      </div>
      <p className="text-sm text-slate-800">{card.front}</p>
      {showBack ? (
        <div className="space-y-2">
          <p className="text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">
            {card.back}
          </p>
          {card.comment && card.comment !== card.back && (
            <div className="text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2">
              <p className="text-xs font-medium text-slate-400 mb-1">
                Comentário
              </p>
              {card.comment}
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => setShowBack(true)}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Mostrar resposta
        </button>
      )}
      {showBack && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleReview(true)}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg px-3 py-1.5"
          >
            <Check size={15} /> Acertei
          </button>
          <button
            onClick={() => handleReview(false)}
            className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium rounded-lg px-3 py-1.5"
          >
            <X size={15} /> Errei
          </button>
        </div>
      )}
    </Card>
  );
}

export default function FlashcardsPage() {
  const flashcardLogs = useAppStore((s) => s.flashcardLogs);
  const flashcards = useAppStore((s) => s.flashcards);
  const subjects = useAppStore((s) => s.subjects);
  const addFlashcardLog = useAppStore((s) => s.addFlashcardLog);
  const removeFlashcardLog = useAppStore((s) => s.removeFlashcardLog);

  const [date, setDate] = useState(todayISO());
  const [subjectId, setSubjectId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [created, setCreated] = useState("");
  const [reviewed, setReviewed] = useState("");
  const [note, setNote] = useState("");

  const subjectName = (id?: string) =>
    subjects.find((s) => s.id === id)?.name;

  function handleAdd() {
    const createdNum = Number(created || 0);
    const reviewedNum = Number(reviewed || 0);
    if (createdNum <= 0 && reviewedNum <= 0) return;
    addFlashcardLog({
      date,
      subjectId: subjectId || undefined,
      topicId: topicId || undefined,
      created: createdNum,
      reviewed: reviewedNum,
      note: note.trim() || undefined,
    });
    setCreated("");
    setReviewed("");
    setNote("");
  }

  const sorted = useMemo(
    () => [...flashcardLogs].sort((a, b) => (a.date < b.date ? 1 : -1)),
    [flashcardLogs],
  );

  const totals = flashcardTotals(flashcardLogs);

  const today = todayISO();
  const dueCards = useMemo(
    () =>
      [...flashcards]
        .filter((f) => f.dueAt <= today)
        .sort((a, b) => (a.dueAt < b.dueAt ? -1 : 1)),
    [flashcards, today],
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Flashcards</h1>
        <p className="text-sm text-slate-500 mt-1">
          Registre quantos flashcards você criou e revisou, transforme
          questões que você errou em flashcards automáticos, e revise os
          cartões que estão no prazo.
        </p>
      </div>

      <MissedQuestionForm />

      <Card className="p-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-semibold text-slate-700">
            Cartões para revisar hoje
          </p>
          <p className="text-xs text-slate-500">
            {dueCards.length} no prazo · {flashcards.length} no total
          </p>
        </div>
        {dueCards.length === 0 ? (
          <p className="text-sm text-slate-400 mt-2">
            {flashcards.length === 0
              ? "Nenhum flashcard ainda — registre uma questão errada acima para gerar o primeiro."
              : "Nenhum cartão no prazo hoje. Volte amanhã!"}
          </p>
        ) : (
          <div className="space-y-3 mt-3">
            {dueCards.map((card) => (
              <FlashcardReviewRow
                key={card.id}
                card={card}
                subjectName={subjectName(card.subjectId)}
              />
            ))}
          </div>
        )}
      </Card>

      <Card className="p-4 space-y-3">
        <p className="text-sm font-semibold text-slate-700">
          Registro diário de flashcards
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
            Criados
            <input
              type="number"
              min={0}
              value={created}
              onChange={(e) => setCreated(e.target.value)}
              placeholder="ex: 10"
              className="mt-1 w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm"
            />
          </label>
          <label className="text-xs text-slate-500">
            Revisados
            <input
              type="number"
              min={0}
              value={reviewed}
              onChange={(e) => setReviewed(e.target.value)}
              placeholder="ex: 30"
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
          placeholder="Observação (opcional)"
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
            {totals.created} criados · {totals.reviewed} revisados
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
                  {l.created} criados · {l.reviewed} revisados
                </span>
                <button
                  onClick={() => removeFlashcardLog(l.id)}
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
