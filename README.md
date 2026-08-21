# kpi-boilerplate

Boilerplate para montar rapidamente dashboards de KPI e ferramentas de migração de dados internas da Twygo.

Stack: **React + TypeScript (Vite)** no frontend, **FastAPI** no backend, **PostgreSQL** como banco. Vem com um layout base pronto (navbar + sidebar + área de conteúdo) para você já começar adicionando páginas e rotas de API.

## Como rodar

```bash
cp .env.example .env
make up
```

- Frontend: http://localhost:5173
- Backend (docs Swagger): http://localhost:8000/docs

`make down` para parar os containers, `make logs` para acompanhar os logs.

## Estrutura de pastas

```
kpi-boilerplate/
├── backend/     # API FastAPI (SQLAlchemy + Postgres)
└── frontend/    # SPA React + TypeScript (Vite)
```

## Próximos passos

- **Novas rotas de API**: adicione um router em `backend/app/routers/` e inclua-o em `backend/app/main.py`.
- **Novas páginas**: crie a página em `frontend/src/pages/` e adicione a entrada correspondente em `frontend/src/components/Sidebar.tsx` (ou onde o sidebar estiver definido).
- Ajuste as variáveis de `.env` conforme o dashboard/migração específico que você for construir a partir daqui.
