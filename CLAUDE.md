# kpi-boilerplate

Boilerplate para dashboards de KPI / ferramentas de migração de dados da Twygo.

## Stack

- Frontend: React + TypeScript + Vite (`frontend/`, porta 5173)
- Backend: FastAPI + SQLAlchemy + PostgreSQL (`backend/`, porta 8000)

## Rodar o projeto

```bash
make up
```

Sobe os 3 serviços via docker compose (postgres, backend, frontend) com hot-reload.

## Convenções

- Novas páginas do frontend vão em `frontend/src/pages/` e devem ser registradas no `Sidebar.tsx` para aparecer na navegação.
- Novas rotas de API vão em `backend/app/routers/` e precisam ser incluídas em `backend/app/main.py`.

## Princípios

Isto é um boilerplate/ponto de partida. Mantenha simples: sem over-engineering, sem abstrações prematuras, sem features especulativas. Adicione só o que o dashboard/migração específico precisar.
