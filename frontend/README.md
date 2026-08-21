# KPI Boilerplate — Frontend

React + TypeScript + Vite. Layout de dashboard com navbar, sidebar e área de conteúdo, consumindo `GET /api/kpis` do backend FastAPI.

## Rodando localmente (sem Docker)

```bash
cd frontend
npm install
npm run dev
```

Acesse http://localhost:5173. O Vite faz proxy de `/api` para `http://localhost:8000` (backend FastAPI deve estar rodando nessa porta).

## Rodando com Docker

```bash
cd frontend
docker build -t kpi-frontend .
docker run -p 5173:5173 -e VITE_API_TARGET=http://backend:8000 kpi-frontend
```

Se o backend estiver em outro serviço/host dentro de uma rede docker (ex: docker-compose), defina `VITE_API_TARGET` com a URL correta (ex: `http://backend:8000`). Se não definido, usa `http://localhost:8000`.

## Estrutura

- `src/layout/AppLayout.tsx` — compõe Navbar + Sidebar + conteúdo (via `<Outlet/>` do react-router).
- `src/components/Navbar.tsx`, `src/components/Sidebar.tsx` — navbar superior e menu lateral.
- `src/pages/` — páginas roteadas: Dashboard, KPIs, Configurações.
- `src/styles.css` — estilos globais do layout.
