import { useAppStore } from "../store";

export function SubjectTopicSelect({
  subjectId,
  topicId,
  onChangeSubject,
  onChangeTopic,
}: {
  subjectId: string;
  topicId: string;
  onChangeSubject: (id: string) => void;
  onChangeTopic: (id: string) => void;
}) {
  const subjects = useAppStore((s) => s.subjects);
  const subject = subjects.find((s) => s.id === subjectId);

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <select
        value={subjectId}
        onChange={(e) => {
          onChangeSubject(e.target.value);
          onChangeTopic("");
        }}
        className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
      >
        <option value="">Disciplina (opcional)</option>
        {subjects.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
      <select
        value={topicId}
        onChange={(e) => onChangeTopic(e.target.value)}
        disabled={!subject}
        className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white disabled:bg-slate-50 disabled:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
      >
        <option value="">Tópico (opcional)</option>
        {subject?.topics.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>
    </div>
  );
}
