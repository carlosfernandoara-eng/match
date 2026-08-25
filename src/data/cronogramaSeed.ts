import type { CronogramaCycle, CronogramaDay, CronogramaItem, Subject } from "../types";
import { uid } from "../lib/id";

// Mapeia o "rótulo" usado pelo cursinho (DSO Concursos) para o nome da
// disciplina correspondente no edital verticalizado. Itens sem
// correspondência (Redação, Leitura diária, Simulados) ficam sem vínculo —
// eles não fazem parte do conteúdo objetivo do Anexo II do edital.
const COURSE_TO_EDITAL: Record<string, string> = {
  Português: "Língua Portuguesa",
  "D. Constitucional": "Noções de Direito Constitucional",
  "Tec. da Informação": "Tecnologia da Informação",
  RLM: "Raciocínio Lógico-Matemático",
  "Leg. Institucional": "Legislação Institucional do Estado de Alagoas",
  "Direito Penal": "Noções de Direito Penal",
  "D. Penal Especial": "Noções de Direito Penal",
  Contabilidade: "Noções de Contabilidade",
  Estatística: "Estatística",
  Atualidades: "Atualidades",
  "D. Administrativo": "Noções de Direito Administrativo",
  "Leg. Penal Espec.": "Legislação Penal Especial",
};

function makeDay(
  label: string,
  bullets: string[],
  subjectIdByName: Map<string, string>,
): CronogramaDay {
  let estimatedTime: string | undefined;
  const items: CronogramaItem[] = [];

  function push(subjectLabel: string, description: string) {
    items.push({
      id: uid(),
      subjectLabel,
      description,
      done: false,
      linkedSubjectId: subjectIdByName.get(COURSE_TO_EDITAL[subjectLabel] ?? ""),
    });
  }

  for (const raw of bullets) {
    const timeOnly = raw.match(/^\(~?(\d+h\d+)\)$/);
    if (timeOnly) {
      estimatedTime = timeOnly[1];
      continue;
    }
    const sepIdx = raw.indexOf(" — ");
    if (sepIdx === -1) {
      const withTime = raw.match(/^(.*?)\s*\(~?(\d+h\d+)\)\s*$/);
      if (withTime) {
        push(withTime[1].trim(), "");
        estimatedTime = withTime[2];
      } else {
        push(raw.trim(), "");
      }
      continue;
    }
    push(raw.slice(0, sepIdx).trim(), raw.slice(sepIdx + 3).trim());
  }

  return { id: uid(), label, estimatedTime, items };
}

function makeCycle(
  name: string,
  subtitle: string,
  days: CronogramaDay[],
): CronogramaCycle {
  return { id: uid(), name, subtitle, days };
}

export function buildCronogramaSeed(subjects: Subject[]): CronogramaCycle[] {
  const subjectIdByName = new Map(subjects.map((s) => [s.name, s.id]));
  const d = (label: string, bullets: string[]) =>
    makeDay(label, bullets, subjectIdByName);

  return [
    makeCycle("Ciclo 01", "Vídeos de Fixação", [
      d("Dia 02", [
        "Português — Morfologia x Sintaxe; Artigo, Substantivo e Adjetivo; Preposição (aula 01 a 03)",
        "D. Constitucional — Teoria dos Direitos Fundamentais (aula 01 a 06)",
        "Tec. da Informação — Segurança da Informação (aula 01, partes 01 e 02)",
        "Leitura diária (~02h58)",
      ]),
      d("Dia 03", [
        "D. Constitucional — Direitos Fundamentais (aula 07 a 13)",
        "Tec. da Informação — Segurança da Informação (aula 02, partes 01 e 02)",
        "RLM — Diagrama de Venn (quantificadores, silogismos) — aula 01 (parte 1)",
        "Leitura diária (~02h57)",
      ]),
      d("Dia 04", [
        "Português — Advérbio; Verbo; Pronomes (aula 04 a 06)",
        "D. Constitucional — Direitos Fundamentais (aula 14 a 20)",
        "RLM — Diagrama de Venn (quantificadores, silogismos) — aula 01 (parte 2)",
        "Leitura diária (~02h50)",
      ]),
      d("Dia 05", [
        "D. Constitucional — Direitos Fundamentais (aula 21 a 28)",
        "RLM — Diagrama de Venn (quantificadores, silogismos) — aula 01 (parte 3)",
        "Leg. Institucional — Lei nº 3.437/1975 e alterações (aula 01 a 03)",
        "Leitura diária (~02h59)",
      ]),
      d("Dia 06", [
        "Português — Frase, oração e período; Sujeito (aula 01 e 02)",
        "D. Constitucional — Remédios Constitucionais (aula 29 a 35)",
        "Tec. da Informação — Segurança da Informação (aula 03 a 05)",
        "Leitura diária (~02h52)",
      ]),
    ]),

    makeCycle("Ciclo 02", "Teoria do Zero + Exercícios de Fixação", [
      d("Dia 01", [
        "Direito Penal — Princípios (aula 01 a 03)",
        "RLM — Estruturas lógicas (aula 02, partes 1, 2 e 3)",
        "Português — Sujeito indeterminado (aula 03)",
        "Leitura diária (~02h49)",
      ]),
      d("Dia 02", [
        "Contabilidade — Conceitos Iniciais; Princípios Contábeis (aula 01 e 02)",
        "Tec. da Informação — Inteligência Artificial (aula 06 a 08)",
        "Tec. da Informação — Windows 11 (aula 09)",
        "Leitura diária (~02h36)",
      ]),
      d("Dia 03", [
        "RLM — Estruturas lógicas (aula 03, partes 1, 2 e 3)",
        "Direito Penal — Lei Penal no Tempo (aula 04 e 05)",
        "Leitura diária (~02h41)",
      ]),
      d("Dia 04", [
        "Português — Sujeito inexistente (aula 04, partes 1 e 2)",
        "Contabilidade — Patrimônio (aula 03)",
        "Estatística — Análise Exploratória de Dados (aula 01, partes 1 e 2)",
        "Leitura diária (~02h53)",
      ]),
      d("Dia 05", [
        "Tec. da Informação — Windows 11 (aula 10 e 11)",
        "Estatística — Análise Exploratória de Dados (aula 02, partes 1, 2 e 3)",
        "Leitura diária (~02h35)",
      ]),
      d("Dia 06", [
        "Estatística — Medidas de Posição (aula 03, partes 1, 2 e 3)",
        "Contabilidade — Regimes Contábeis (aula 04)",
        "Atualidades — Segurança Pública (aula 01)",
        "Leitura diária (~02h35)",
      ]),
    ]),

    makeCycle("Ciclo 03", "Teoria do Zero + Exercícios de Fixação", [
      d("Dia 01", [
        "Direito Penal — Aplicação da Lei Penal (aula 06 a 10)",
        "RLM — Estruturas lógicas (questões certo/errado) (aula 04)",
        "Tec. da Informação — Windows 11 (aula 12 e 13)",
        "Leitura diária (~02h30)",
      ]),
      d("Dia 02", [
        "RLM — Equivalências lógicas e negações lógicas (aula 05, partes 1, 2 e 3)",
        "Português — Predicação verbal (VTD, VTI, VTDI, VI e VL) (aula 05)",
        "Leitura diária (~02h20)",
      ]),
      d("Dia 03", [
        "RLM — Equivalências lógicas e negações lógicas (aula 06)",
        "Atualidades — Segurança Pública; Transportes (aula 02, partes 1 e 2, e aula 03)",
        "Estatística — Medidas de Posição (aula 04, partes 1 e 2)",
        "Leitura diária (~02h16)",
      ]),
      d("Dia 04", [
        "Contabilidade — Conceitos e Classificações de Contas Contábeis (aula 05)",
        "D. Constitucional — Direitos Sociais; Nacionalidade (aula 36 a 41)",
        "Leitura diária (~02h52)",
      ]),
      d("Dia 05", [
        "Tec. da Informação — Windows 11 (aula 14 a 16)",
        "Estatística — Medidas de Posição (aula 05, partes 1 e 2)",
        "Leitura diária (~02h34)",
      ]),
      d("Dia 06", [
        "Estatística — Medidas de Posição (aula 06, partes 1, 2 e 3)",
        "Contabilidade — Contas do Ativo (aula 06)",
        "Leitura diária (~02h13)",
      ]),
    ]),

    makeCycle("Ciclo 04", "Teoria do Zero + Exercícios de Fixação", [
      d("Dia 01", [
        "D. Administrativo — Organização Administrativa (aula 01 a 04)",
        "RLM — Lógica de argumentação e tentativa e erro (certo/errado) (aula 07, partes 1, 2 e 3, e aula 08)",
        "Leitura diária (~02h47)",
      ]),
      d("Dia 02", [
        "RLM — (aula 09)",
        "D. Administrativo — Organização Administrativa (aula 05 a 12)",
        "Leitura diária (~02h32)",
      ]),
      d("Dia 03", [
        "Contabilidade — Contas do Passivo; Contas do Patrimônio Líquido (aula 07 e 08)",
        'Atualidades — Política: "PL da Devastação" / "Tarifaço de Trump" (aula 04, partes 1 e 2, e aula 05)',
        "Estatística — Medidas de Posição (aula 07)",
        "Leitura diária (~02h42)",
      ]),
      d("Dia 04", [
        "D. Penal Especial — Crimes contra a Vida (aula 01 a 05)",
        "Tec. da Informação — Windows 11 (aula 17 a 19)",
        "Leitura diária (~02h37)",
      ]),
      d("Dia 05", [
        "Tec. da Informação — Windows 11 (aula 20 a 23)",
        "Estatística — Medidas de Posição (aula 08, partes 1, 2 e 3)",
        "Leitura diária (~02h33)",
      ]),
      d("Dia 06", [
        "Estatística — Medidas de Posição (aula 09, partes 1, 2 e 3)",
        "Redação — Estrutura do texto dissertativo (aula 01)",
        "(~02h15)",
      ]),
    ]),

    makeCycle("Ciclo 05", "Teoria do Zero + Exercícios de Fixação", [
      d("Dia 01", [
        "Português — Complementos verbais (aula 06)",
        "RLM — Teoria dos Conjuntos (aula 10, partes 1, 2 e 3)",
        "D. Penal Especial — Crimes contra a Vida (aula 06 a 09)",
        "Leitura diária (~02h56)",
      ]),
      d("Dia 02", [
        "RLM — Conjuntos Numéricos - 2 conjuntos (aula 11, partes 1 e 2)",
        "D. Penal Especial — Lesões Corporais (aula 10 a 13)",
        "Contabilidade — Contas de Resultado; Contas Retificadoras (aula 09 e 10)",
        "Leitura diária (~02h50)",
      ]),
      d("Dia 03", [
        "Português — Predicativo; Tipos de predicado (aula 07 e 08)",
        "RLM — Conjuntos Numéricos - 3 conjuntos (aula 12, partes 1, 2 e 3, e aula 13)",
        "Leitura diária (~02h55)",
      ]),
      d("Dia 04", [
        "Estatística — Medidas de Dispersão (aula 10, partes 1, 2 e 3)",
        "Tec. da Informação — Linux (aula 24, partes 1, 2 e 3)",
        "Leg. Institucional — Lei nº 5.247/1991 (aula 04 e 05)",
        "Leitura diária (~02h54)",
      ]),
      d("Dia 05", [
        "Português — Adjunto adnominal e complemento nominal (aula 09, partes 1 e 2)",
        "Estatística — Medidas de Dispersão (aula 11, partes 1, 2 e 3)",
        "Atualidades — Economia (aula 06 e 07)",
        "Leitura diária (~03h04)",
      ]),
      d("Dia 06", [
        "Estatística — Assimetria (aula 12, partes 1, 2 e 3)",
        "Leg. Penal Espec. — Lei de Tortura (aula 01 a 03)",
        "Leitura diária (~02h34)",
      ]),
    ]),

    makeCycle("Ciclo 06", "Teoria do Zero + Exercícios de Fixação", [
      d("Dia 01", [
        "Português — Adjunto adverbial (aula 10)",
        "RLM — Análise combinatória (Contagem) (aula 14, partes 1, 2 e 3)",
        "Leitura diária (~02h58)",
      ]),
      d("Dia 02", [
        "RLM — Análise combinatória (Contagem) (aula 15, partes 1, 2 e 3)",
        "D. Penal Especial — Crimes Contra a Honra (aula 14 a 21)",
        "Leitura diária (~02h54)",
      ]),
      d("Dia 03", [
        "Português — Aposto; Vocativo (aula 11 e 12)",
        "RLM — Cálculo de Probabilidade (aula 16)",
        "D. Constitucional — Direitos e Partidos Políticos (aula 42 a 47)",
        "Leitura diária (~03h00)",
      ]),
      d("Dia 04", [
        "Estatística — Curtose (aula 13, partes 1, 2 e 3)",
        "Tec. da Informação — Linux (aula 25 a 27, partes 1 e 2)",
        "Contabilidade — Plano de Contas (aula 11)",
        "Leitura diária (~03h03)",
      ]),
      d("Dia 05", [
        "Português — Agente da passiva (aula 13)",
        "Estatística — Correlação Simples; Regressão Simples (aula 14 e 15)",
        "Tec. da Informação — Internet (aula 29 e 30, partes 1 e 2)",
        "Leitura diária (~03h04)",
      ]),
      d("Dia 06", [
        "Estatística — Correlação e Regressão (aula 16, partes 1, 2 e 3)",
        "Atualidades — Sociedade (Racismo/Xenofobia/Refugiados/Apátridas) (aula 08)",
        "Redação — Apresentação da redação e uso de conectivos; Desenvolvimento (aula 02 e 03)",
        "Leitura diária (~02h59)",
      ]),
      d("Dia 07", [
        "Leg. Penal Espec. — Crimes Hediondos (aula 04 a 06)",
        "Atualidades — Sociedade; Saúde; Cultura (aula 09 a 11)",
        "Contabilidade — Bônus de contas contábeis, resolução de questões (aula 12)",
        "(~02h19)",
      ]),
    ]),

    makeCycle("Ciclo 07", "Teoria do Zero + Exercícios de Fixação", [
      d("Dia 01", [
        "Português — Pronome Apassivador X Pronome indeterminador do Sujeito (aula 14)",
        "D. Constitucional — Defesa do Estado e das Instituições Democráticas; Segurança Pública (aula 48 e 49)",
        "Estatística — Cálculo de Probabilidade (aula 17, partes 1, 2 e 3)",
        "Leitura diária (~02h47)",
      ]),
      d("Dia 02", [
        "Estatística — Cálculo de Probabilidade (aula 18, partes 1, 2 e 3)",
        "D. Penal Especial — Crimes contra a Liberdade Individual; Crimes Contra a Inviolabilidade dos Segredos (aula 22 a 32)",
        "Leitura diária (~02h52)",
      ]),
      d("Dia 03", [
        "Português — Conjunções (aula 15, partes 1, 2 e 3)",
        "Estatística — Cálculo de Probabilidade (aula 19, partes 1 e 2)",
        "Leitura diária (~02h54)",
      ]),
      d("Dia 04", [
        "Tec. da Informação — Internet (aula 31 a 33, partes 1 e 2)",
        "Leg. Penal Espec. — Lei de Crimes Ambientais (aula 07 a 14)",
        "Leitura diária (~03h10)",
      ]),
      d("Dia 05", [
        "Leg. Penal Espec. — Lei de Crimes Ambientais (aula 15 a 21)",
        "Português — Orações coordenadas (aula 16, partes 1 e 2)",
        "Tec. da Informação — Correio Eletrônico (aula 34, partes 1 e 2, e aula 35)",
        "Leitura diária (~02h59)",
      ]),
      d("Dia 06", [
        "D. Penal Especial — Periclitação da Vida e da Saúde (aula 33 a 40)",
        "Tec. da Informação — Banco de Dados (aula 36, partes 1, 2 e 3, e aula 37, partes 1 e 2)",
        "RLM — Cálculo de Probabilidade (aula 17 e 18)",
        "(~03h01)",
      ]),
      d("Dia 07", [
        "Leg. Penal Espec. — Estatuto do Desarmamento (aula 22 a 29)",
        "Contabilidade — Método das Partidas Dobradas; Fórmulas de Lançamentos (aula 13 e 14)",
        "D. Administrativo — Poderes da Administração (aula 13 a 20)",
        "(~03h04)",
      ]),
    ]),

    makeCycle("Ciclo 08", "Teoria do Zero + Exercícios de Fixação", [
      d("Dia 01", [
        "Português — Orações subordinadas adverbiais (aula 17, partes 1, 2 e 3)",
        "D. Administrativo — Atos Administrativos (aula 21 a 23)",
        "RLM — Regra de Três Simples (aula 19, partes 1 e 2)",
        "Leitura diária (~02h52)",
      ]),
      d("Dia 02", [
        "RLM — Regra de Três Composta (aula 20, partes 1 e 2)",
        "D. Administrativo — Atos Administrativos (aula 24 a 35)",
        "Redação — Habilidade argumentativa: coesão e coerência, repertório (aula 04)",
        "Leitura diária (~03h03)",
      ]),
      d("Dia 03", [
        "Português — Orações subordinadas substantivas (aula 18, partes 1 e 2)",
        "RLM — Porcentagem (aula 21, partes 1, 2 e 3)",
        "Tec. da Informação — Banco de Dados (aula 38, partes 1 e 2)",
        "Leitura diária (~03h04)",
      ]),
      d("Dia 04", [
        "Tec. da Informação — Banco de Dados (aula 39, partes 1, 2 e 3, e aula 40, partes 1 e 2)",
        "Leg. Institucional — Lei nº 5.247/1991, Estatuto dos Servidores de Alagoas (aula 06 e 07)",
        "Contabilidade — Tipos de Fatos Contábeis; Operações com Juros (aula 15 e 16)",
        "Leitura diária (~03h01)",
      ]),
      d("Dia 05", [
        "Estatística — Teoria da Probabilidade (aula 20, partes 1, 2 e 3)",
        "Português — Orações subordinadas adjetivas; Orações reduzidas e justapostas (aula 19, partes 1 e 2, e aula 20)",
        "Tec. da Informação — Serviços públicos digitais (aula 41)",
        "Leitura diária (~03h00)",
      ]),
      d("Dia 06", [
        "Estatística — Teoria da Probabilidade (aula 21, partes 1, 2 e 3)",
        "Tec. da Informação — Linguagem de programação: Python (aula 42, partes 1 e 2)",
        "Contabilidade — Operações com Descontos (aula 17)",
        "(~02h32)",
      ]),
      d("Dia 07 — Simulado 01", [
        "Simulado 01 — Dicas do cursinho: controle emocional (não deixar afetar o desempenho), ajuste do controle do tempo (resolver questões no ritmo certo), análise pós-prova (entender por que errou, não só o que errou), fazer anotações rápidas para revisar depois.",
      ]),
    ]),
  ];
}
