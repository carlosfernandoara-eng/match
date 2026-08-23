import type { Subject } from "../types";
import { uid } from "../lib/id";

// Estrutura inicial de exemplo, baseada nas disciplinas mais comuns em
// concursos de Polícia Civil (ex.: cargos de Agente/Escrivão/Investigador).
// IMPORTANTE: confira e ajuste os tópicos conforme o edital oficial da
// PC-AL 2026 quando ele for publicado — aqui dentro você pode adicionar,
// renomear ou remover qualquer disciplina/tópico livremente.
const now = new Date().toISOString();

function subject(name: string, color: string, topics: string[]): Subject {
  return {
    id: uid(),
    name,
    color,
    topics: topics.map((t) => ({
      id: uid(),
      name: t,
      status: "pendente" as const,
      updatedAt: now,
    })),
  };
}

export function buildSeedSubjects(): Subject[] {
  return [
    subject("Língua Portuguesa", "#2563eb", [
      "Compreensão e interpretação de textos",
      "Tipologia e gêneros textuais",
      "Ortografia oficial",
      "Acentuação gráfica",
      "Classes de palavras",
      "Emprego das classes de palavras",
      "Sintaxe da oração e do período",
      "Concordância verbal e nominal",
      "Regência verbal e nominal",
      "Crase",
      "Pontuação",
      "Coesão e coerência textual",
      "Semântica e figuras de linguagem",
    ]),
    subject("Raciocínio Lógico-Matemático", "#7c3aed", [
      "Estruturas lógicas e proposições",
      "Lógica de argumentação",
      "Diagramas lógicos",
      "Conjuntos",
      "Razão, proporção e porcentagem",
      "Probabilidade",
      "Análise combinatória",
      "Matemática financeira",
      "Sequências e padrões",
    ]),
    subject("Informática", "#0891b2", [
      "Conceitos de hardware e software",
      "Sistemas operacionais (Windows/Linux)",
      "Editores de texto e planilhas",
      "Internet, e-mail e navegadores",
      "Segurança da informação",
      "Redes de computadores — conceitos básicos",
      "Banco de dados — conceitos básicos",
    ]),
    subject("Direito Constitucional", "#b45309", [
      "Princípios fundamentais",
      "Direitos e garantias fundamentais",
      "Organização político-administrativa do Estado",
      "Administração pública (arts. 37 a 41)",
      "Poder Executivo, Legislativo e Judiciário",
      "Segurança pública (art. 144)",
      "Controle de constitucionalidade",
    ]),
    subject("Direito Administrativo", "#a16207", [
      "Regime jurídico-administrativo",
      "Administração direta e indireta",
      "Poderes administrativos",
      "Atos administrativos",
      "Licitações e contratos (Lei 14.133/2021)",
      "Processo administrativo",
      "Responsabilidade civil do Estado",
      "Improbidade administrativa (Lei 8.429/1992)",
      "Servidores públicos e regime disciplinar",
    ]),
    subject("Direito Penal", "#dc2626", [
      "Princípios do Direito Penal",
      "Aplicação da lei penal",
      "Teoria do crime",
      "Tipicidade, ilicitude e culpabilidade",
      "Concurso de pessoas e de crimes",
      "Penas e medidas de segurança",
      "Crimes contra a pessoa",
      "Crimes contra o patrimônio",
      "Crimes contra a fé pública",
      "Crimes contra a administração pública",
      "Crimes praticados por funcionário público",
    ]),
    subject("Direito Processual Penal", "#e11d48", [
      "Inquérito policial",
      "Ação penal",
      "Prova",
      "Prisões e medidas cautelares",
      "Sujeitos processuais",
      "Procedimentos",
      "Nulidades",
      "Recursos",
    ]),
    subject("Legislação Especial", "#16a34a", [
      "Lei de Drogas (Lei 11.343/2006)",
      "Estatuto do Desarmamento (Lei 10.826/2003)",
      "Estatuto da Criança e do Adolescente (Lei 8.069/1990)",
      "Lei Maria da Penha (Lei 11.340/2006)",
      "Lei de Crimes Hediondos (Lei 8.072/1990)",
      "Lei de Abuso de Autoridade (Lei 13.869/2019)",
      "Lei de Organização Criminosa (Lei 12.850/2013)",
      "Estatuto do Idoso (Lei 10.741/2003)",
      "Lei de Execução Penal (Lei 7.210/1984)",
    ]),
    subject("Direitos Humanos e Criminologia", "#0d9488", [
      "Fundamentos dos direitos humanos",
      "Tratados e sistemas internacionais de proteção",
      "Segurança pública e cidadania",
      "Teorias criminológicas",
      "Vitimologia",
      "Prevenção e controle social do crime",
    ]),
    subject("Medicina Legal e Criminalística", "#4338ca", [
      "Conceitos básicos de medicina legal",
      "Traumatologia forense",
      "Tanatologia forense",
      "Local de crime e preservação de vestígios",
      "Cadeia de custódia da prova",
      "Perícia criminal — noções gerais",
    ]),
  ];
}
