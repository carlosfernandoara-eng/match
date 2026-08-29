export interface Team {
  id: string;
  name: string;
  colegio: string;
  turma: string;
}

// Ordem oficial informada para o sorteio (4 grupos de 3 times).
export const TEAMS: Team[] = [
  { id: "t01", name: "SEB 2026", colegio: "SEB", turma: "2026" },
  {
    id: "t02",
    name: "MONTEIRO LOBATO 2026",
    colegio: "Monteiro Lobato",
    turma: "2026",
  },
  { id: "t03", name: "CONTATO 2026", colegio: "Contato", turma: "2026" },
  {
    id: "t04",
    name: "MADALENA SOFIA 2026",
    colegio: "Madalena Sofia",
    turma: "2026",
  },
  {
    id: "t05",
    name: "SANTA ÚRSULA 2026",
    colegio: "Santa Úrsula",
    turma: "2026",
  },
  { id: "t06", name: "MARISTA 2027", colegio: "Marista", turma: "2027" },
  { id: "t07", name: "CONTATO 2027", colegio: "Contato", turma: "2027" },
  {
    id: "t08",
    name: "MADALENA SOFIA 2027",
    colegio: "Madalena Sofia",
    turma: "2027",
  },
  {
    id: "t09",
    name: "MARIA MONTESSORI 2027",
    colegio: "Maria Montessori",
    turma: "2027",
  },
  {
    id: "t10",
    name: "SANTA ÚRSULA 2027",
    colegio: "Santa Úrsula",
    turma: "2027",
  },
  {
    id: "t11",
    name: "SACRAMENTO 2027",
    colegio: "Sacramento",
    turma: "2027",
  },
  { id: "t12", name: "MONTEIRO 2027", colegio: "Monteiro", turma: "2027" },
];

export const TEAM_BY_ID: Record<string, Team> = Object.fromEntries(
  TEAMS.map((t) => [t.id, t]),
);
