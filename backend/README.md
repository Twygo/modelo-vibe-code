# KPI Backend

Boilerplate FastAPI + PostgreSQL para dashboards de KPI.

## Rodando com Docker

Requer um `docker-compose.yml` na raiz do projeto com um serviço `postgres` (não incluso aqui, é boilerplate só do backend). Alternativa rápida sem compose:

```bash
docker network create kpi-net
docker run -d --name postgres --network kpi-net -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=kpidb -p 5432:5432 postgres:16
docker build -t kpi-backend .
docker run -d --name kpi-backend --network kpi-net -p 8000:8000 --env-file .env kpi-backend
```

Copie `.env.example` para `.env` antes.

## Rodando local (sem Docker)

Requer um PostgreSQL rodando localmente (ou ajuste `DATABASE_URL`).

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # ajuste DATABASE_URL se necessário
uvicorn app.main:app --reload
```

## Endpoints

- `GET /health` — health check
- `GET /api/kpis/mock` — lista mockada de KPIs, exemplo pro dashboard consumir sem depender do banco
- `GET /api/kpis` — lista KPIs do banco
- `GET /api/kpis/{id}` — KPI por id
- `POST /api/kpis` — cria um KPI

Docs interativas em `/docs`.
