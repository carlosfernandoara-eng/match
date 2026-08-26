import { useRef, useState } from "react";
import { Download, Upload, TriangleAlert } from "lucide-react";
import { useAppStore } from "../store";
import { Card } from "../components/ui";
import { downloadBackupJson } from "../lib/backup";

export default function SettingsPage() {
  const subjects = useAppStore((s) => s.subjects);
  const sessions = useAppStore((s) => s.sessions);
  const questionLogs = useAppStore((s) => s.questionLogs);
  const flashcardLogs = useAppStore((s) => s.flashcardLogs);
  const cronogramaCycles = useAppStore((s) => s.cronogramaCycles);
  const flashcards = useAppStore((s) => s.flashcards);
  const missedQuestions = useAppStore((s) => s.missedQuestions);
  const pomodoroSettings = useAppStore((s) => s.pomodoroSettings);
  const lastBackupAt = useAppStore((s) => s.lastBackupAt);
  const markBackupDone = useAppStore((s) => s.markBackupDone);
  const importData = useAppStore((s) => s.importData);
  const resetAll = useAppStore((s) => s.resetAll);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState("");

  function handleExport() {
    downloadBackupJson({
      subjects,
      sessions,
      questionLogs,
      flashcardLogs,
      cronogramaCycles,
      flashcards,
      missedQuestions,
      pomodoroSettings,
    });
    markBackupDone();
  }

  function handleImportFile(file: File) {
    setImportError("");
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (!Array.isArray(data.subjects) || !Array.isArray(data.sessions)) {
          throw new Error("Formato inválido");
        }
        importData(data);
      } catch {
        setImportError("Não foi possível ler o arquivo. Verifique se é um JSON exportado por este app.");
      }
    };
    reader.readAsText(file);
  }

  function handleReset() {
    if (
      confirm(
        "Isso vai apagar todo o seu progresso (tópicos, sessões, questões, flashcards e marcações do cronograma) e restaurar o edital e o cronograma padrão. Deseja continuar?",
      )
    ) {
      resetAll();
    }
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Configurações</h1>
        <p className="text-sm text-slate-500 mt-1">
          Seus dados ficam salvos apenas neste navegador (localStorage).
          Exporte periodicamente para não perder seu progresso.
        </p>
      </div>

      <Card className="p-4 space-y-3">
        <p className="text-sm font-semibold text-slate-700">
          Backup dos dados
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg px-4 py-2"
          >
            <Download size={16} /> Exportar dados (JSON)
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg px-4 py-2"
          >
            <Upload size={16} /> Importar dados
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImportFile(file);
              e.target.value = "";
            }}
          />
        </div>
        {importError && (
          <p className="text-xs text-red-600">{importError}</p>
        )}
        <p className="text-xs text-slate-400">
          {lastBackupAt
            ? `Último backup: ${new Date(lastBackupAt).toLocaleString("pt-BR")}`
            : "Você ainda não exportou nenhum backup."}
        </p>
      </Card>

      <Card className="p-4 space-y-3 border-red-100">
        <p className="text-sm font-semibold text-red-700 flex items-center gap-2">
          <TriangleAlert size={16} /> Zona de risco
        </p>
        <p className="text-xs text-slate-500">
          Restaura a lista padrão de disciplinas/tópicos e o cronograma
          padrão, apagando todas as sessões de estudo, registros de
          questões, de flashcards e marcações do cronograma.
        </p>
        <button
          onClick={handleReset}
          className="text-sm font-medium text-red-600 hover:text-red-700"
        >
          Resetar todos os dados
        </button>
      </Card>
    </div>
  );
}
