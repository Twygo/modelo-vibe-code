# Modelo - Vibe code

Boilerplate para dashboards de KPI / ferramentas de migração de dados da Twygo.

## Stack

- Frontend: React + TypeScript + Vite (`frontend/`, porta 5173)
- Backend: FastAPI + SQLAlchemy + PostgreSQL (`backend/`, porta 8000)

## Rodar o projeto

```bash
make up
```

Sobe os 3 serviços via docker compose (postgres, backend, frontend) com hot-reload. Use a skill `rodar-sistema` pra subir, testar e derrubar.

## Publicar

Este projeto tem um segundo compose, `docker-compose.dokploy.yml`, que é a
receita de **produção** — nginx servindo o build do React (com proxy `/api`
pro backend, sem CORS porque fica tudo na mesma origem) e o backend sem
`--reload`. É o mesmo padrão usado pelo extrator de dados, os painéis
corporativos e o JPMO da Twygo, todos no mesmo servidor Dokploy. Use a skill
`publicar-dokploy` quando o usuário pedir pra colocar isto no ar.

**Não misture os dois composes.** `docker-compose.yml` é sempre dev
(hot-reload, portas em localhost); `docker-compose.dokploy.yml` é sempre
produção (sem bind mount, sem porta exposta em localhost — quem expõe é o
Dokploy). Se você adicionar uma rota ou variável de ambiente nova, ela
precisa existir nos dois lugares onde fizer sentido, e explicada no
`.env.example`.

## Convenções

- Novas páginas do frontend vão em `frontend/src/pages/` e devem ser registradas no `Sidebar.tsx` para aparecer na navegação.
- Novas rotas de API vão em `backend/app/routers/` e precisam ser incluídas em `backend/app/main.py`.
- Nome de serviço no compose é `postgres`, não `db` — os dois composes usam o mesmo nome de propósito, pra não haver tradução entre dev e produção.

## Princípios

Isto é um boilerplate/ponto de partida. Mantenha simples: sem over-engineering, sem abstrações prematuras, sem features especulativas. Adicione só o que o dashboard/migração específico precisar. Isso vale também pro deploy: nada de Kubernetes, nada de CI/CD sofisticado — Docker Compose e Dokploy bastam pro tamanho destes projetos.
