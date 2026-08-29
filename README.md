# Copa PMVR Intercolegial — Sorteio Oficial

Aplicação web para conduzir ao vivo, em telão, os dois sorteios da Copa PMVR
Intercolegial 2026 (Maceió):

- **Sorteio dos Grupos**: distribui os 12 times em 4 grupos de 3, um por vez,
  com animação de suspense.
- **Sorteio das Cores**: define a cor do uniforme de cada colégio, sorteada
  na ordem dos grupos já definidos, a partir da paleta oficial das camisas.
- **Quadro Final**: visão geral dos 4 grupos com o time e a cor sorteada de
  cada um.

O progresso de cada sorteio é salvo automaticamente no `localStorage` do
navegador, então um recarregamento de página não reinicia o sorteio. Cada
tela de sorteio tem um botão "Reiniciar" (com confirmação) para começar do
zero, caso necessário.

Os times e a paleta de cores estão definidos em `src/data/teams.ts` e
`src/data/colors.ts` — ajuste ali se a lista oficial mudar.

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

Aplicação 100% client-side (sem backend): o conteúdo de `dist/` pode ser
hospedado em qualquer serviço de arquivos estáticos (Vercel, Netlify, GitHub
Pages, etc.) — ideal para abrir no telão no dia do evento.

## Stack

React + TypeScript + Vite, Tailwind CSS v4, Zustand (estado do sorteio +
persistência local), lucide-react (ícones).
