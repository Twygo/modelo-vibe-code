# Backend

FastAPI + SQLAlchemy 2 + psycopg 3 + PostgreSQL 16.

## Como rodar

Use `make up` na raiz do projeto: o `docker-compose.yml` da raiz sobe o Postgres, o backend
e o frontend. A conexão com o banco (`DATABASE_URL`) é montada a partir de `POSTGRES_*` do
`.env` da raiz. Ao iniciar, o backend cria as tabelas que faltam e insere dados de exemplo
se a tabela `kpis` estiver vazia (`app/seed.py`, idempotente).

Mudou um model de tabela existente ou a senha do banco? Rode `make reset` (apaga o banco
local) e `make up`.

### Fora do Docker (só para devs)

1. Descomente a porta `127.0.0.1:5433:5432` do serviço `postgres` no `docker-compose.yml`
   e rode `docker compose up -d postgres`.
2. Depois:

```bash
python3.12 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # DATABASE_URL apontando para localhost:5433
set -a; source .env; set +a
uvicorn app.main:app --reload
```

## Endpoints

- `GET /health` — health check
- `GET /api/dashboard` — dados da página Dashboard (KPIs + histórico mensal)
- `GET /api/kpis` — lista KPIs
- `GET /api/kpis/{id}` — KPI por id
- `POST /api/kpis` — cria um KPI
- `GET /api/twygo/users` — exemplo de proxy para a API da Twygo (precisa de
  `TWYGO_API_TOKEN` no `.env`; sem ele responde 503)

Docs interativas em http://localhost:8000/docs.

## Estrutura

- `app/main.py` — cria o app e registra os routers.
- `app/routers/` — um arquivo por grupo de endpoints (`dashboard.py` é a referência).
- `app/models.py` — tabelas. `app/schemas.py` — formato de entrada/saída.
- `app/seed.py` — dados de exemplo (fictícios).
- `app/db.py` — conexão com o banco.
