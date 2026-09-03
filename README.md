# Modelo - Vibe code

Boilerplate para montar rapidamente dashboards de KPI e ferramentas de migração de dados internas da Twygo. Nasce funcionando: banco, API e frontend já conversando entre si — a ideia é você começar direto na parte que interessa (o dado, o gráfico, a regra) sem gastar tempo com setup.

Stack: **React + TypeScript (Vite)** no frontend, **FastAPI** no backend, **PostgreSQL** como banco. Vem com um layout base pronto (navbar + sidebar + área de conteúdo) para você já começar adicionando páginas e rotas de API.

## Como rodar (desenvolvimento)

```bash
cp .env.example .env
make up
```

- Frontend: http://localhost:5173
- Backend (docs Swagger): http://localhost:8000/docs

`make down` para parar os containers, `make logs` para acompanhar os logs. Detalhes de como conferir se tudo subiu certo estão em `.claude/skills/rodar-sistema/`.

## Como publicar (produção)

Quando o projeto sair da fase "vibe coding" e precisar de uma URL de verdade, use o `docker-compose.dokploy.yml` — é a receita de produção (nginx servindo o build do React, proxy pra API, sem hot-reload) pro mesmo servidor Dokploy onde rodam o extrator de dados, os painéis e o JPMO da Twygo. Passo a passo em `.claude/skills/publicar-dokploy/`.

## Estrutura de pastas

```
modelo-vibe-code/
├── backend/                       # API FastAPI (SQLAlchemy + Postgres)
├── frontend/                      # SPA React + TypeScript (Vite)
├── docker-compose.yml             # desenvolvimento — hot-reload
├── docker-compose.dokploy.yml     # produção — Dokploy
└── .claude/skills/                # rodar-sistema, publicar-dokploy
```

## Próximos passos

- **Novas rotas de API**: adicione um router em `backend/app/routers/` e inclua-o em `backend/app/main.py`.
- **Novas páginas**: crie a página em `frontend/src/pages/` e adicione a entrada correspondente em `frontend/src/components/Sidebar.tsx` (ou onde o sidebar estiver definido).
- Ajuste as variáveis de `.env` conforme o dashboard/migração específico que você for construir a partir daqui.
- Quando for ao ar, veja `.claude/skills/publicar-dokploy/`.
