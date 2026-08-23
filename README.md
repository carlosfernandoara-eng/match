# Painel de Estudos — PC-AL 2026

Aplicação web para acompanhar os estudos para o concurso da Polícia Civil
de Alagoas (PC-AL) 2026: checklist de tópicos do edital, cronômetro
pomodoro, registro de horas estudadas e registro de questões feitas por
dia.

## Funcionalidades

- **Edital**: disciplinas e tópicos organizados em checklist, com status
  (pendente / estudando / revisar / concluído) e barra de progresso por
  disciplina. Totalmente editável — adicione, renomeie ou remova
  disciplinas e tópicos.
- **Cronômetro**: modo pomodoro configurável (foco / pausa curta / pausa
  longa / ciclos) e cronômetro livre, ambos podendo ser associados a uma
  disciplina/tópico. O tempo estudado é salvo automaticamente.
- **Questões**: registro diário de questões feitas, com total de acertos
  e percentual, por disciplina.
- **Painel**: visão geral com horas totais, sequência de dias de estudo,
  progresso do edital, gráfico de horas nos últimos 14 dias e distribuição
  por disciplina.
- **Dados locais**: tudo é salvo no `localStorage` do navegador. Em
  Configurações é possível exportar/importar um backup em JSON e resetar
  os dados.

> A lista de disciplinas/tópicos pré-carregada é um ponto de partida
> genérico para concursos de Polícia Civil — ajuste-a conforme o edital
> oficial da PC-AL 2026 assim que ele for publicado.

## Rodando localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`.

## Build de produção

```bash
npm run build
npm run preview
```

Como é uma aplicação 100% client-side (sem backend), o conteúdo de
`dist/` pode ser hospedado em qualquer serviço de arquivos estáticos
(Vercel, Netlify, GitHub Pages, etc.).

## Stack

React + TypeScript + Vite, Tailwind CSS, Zustand (estado + persistência),
Recharts (gráficos).
