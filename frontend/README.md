# Frontend

React 18 + TypeScript + Vite + Recharts. Layout no padrão Twygo (menu lateral de duas colunas, sem barra no topo) e área de conteúdo.
A página **Dashboard** busca os dados em `GET /api/dashboard` do backend (via
`useApi` de `src/lib/api.ts`) e mostra carregando/erro/vazio.

## Como rodar

Use `make up` na raiz do projeto (tudo roda no Docker). O Vite encaminha (proxy) tudo que
começa com `/api` para o backend (`VITE_API_TARGET`, padrão `http://backend:8000` no compose).

Para devs que queiram rodar fora do Docker: `npm ci && VITE_API_TARGET=http://localhost:8000 npm run dev`.

## Estrutura

- `src/App.tsx` — rotas (`<Route path="/..." element={...} />`).
- `src/layout/AppLayout.tsx` — menu + conteúdo (`<Outlet/>`), aplica a cor de `src/config.ts`.
- `src/components/Sidebar.tsx` — menu lateral Twygo (`NAV_MODULES`: módulos → itens).
- `src/config.ts` — título, usuário e cor principal.
- `src/pages/` — páginas: Dashboard (referência), KPIs, Configurações.
- `src/lib/api.ts` — `api.get/post/put/delete/upload` e hook `useApi`.
- `src/lib/format.ts` — formatação pt-BR (número, R$, %, data, mês).
- `src/lib/csv.ts` — `downloadCsv` (exportar tabela).
- `src/twygo-ui.css` — design system Twygo (classes `twg-*`, ver skill `twygo-design-system`).
- `src/styles.css` — estilos do boilerplate e tokens de cor (`--series-*`, `--viz-*`).

## Adicionar uma página

1. Crie `src/pages/MinhaPagina.tsx`.
2. Registre a rota em `src/App.tsx`: `<Route path="/minha-pagina" element={<MinhaPagina />} />`.
3. Adicione o item em `NAV_MODULES` de `src/components/Sidebar.tsx` (ícone do Material Symbols).
