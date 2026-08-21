---
name: rodar-sistema
description: Sobe, testa e derruba o kpi-boilerplate (frontend+backend+postgres) via docker compose. Use quando o usuário pedir "sobe o sistema", "roda o boilerplate", "testa se builda", "derruba tudo", "vê os logs".
---

# Rodar o kpi-boilerplate

Stack: React+Vite (frontend, :5173) + FastAPI (backend, :8000) + Postgres 16 (:5432), tudo via docker compose na raiz do repo.

## Subir

```bash
make up
# ou: docker compose up --build -d
```

Ordem de boot: `postgres` (com healthcheck `pg_isready`) → `backend` só sobe depois do postgres saudável (`depends_on: condition: service_healthy`) → `frontend`.

## Checar se subiu certo

```bash
docker compose ps                                  # os 3 containers "Up"/"healthy"
curl -s http://localhost:8000/health                # {"status":"ok"}
curl -s http://localhost:8000/api/kpis/mock         # lista mockada (dashboard de exemplo)
curl -s http://localhost:8000/api/kpis              # CRUD real (Postgres), começa vazio []
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5173/   # 200
```

Frontend: abrir http://localhost:5173 (navbar + sidebar + Dashboard).
Backend docs (Swagger): http://localhost:8000/docs

## Ver logs / debugar

```bash
make logs
# ou: docker compose logs -f backend   (ou frontend / postgres)
```

Erro comum se algo mudar no docker-compose: se `backend` conectar antes do postgres estar pronto dá
`psycopg.OperationalError: connection to server ... Connection refused` — confirmar que o healthcheck
do serviço `postgres` e o `depends_on.condition: service_healthy` do `backend` continuam no
`docker-compose.yml`.

## Derrubar

```bash
make down
# ou: docker compose down          (mantém o volume postgres_data)
# docker compose down -v           (apaga também os dados do Postgres)
```

## Notas

- Imagem do backend é `python:3.12-alpine` (leve, ~48MB) — precisa dos build-deps `gcc musl-dev libpq-dev`
  só durante o build (removidos depois via `apk del .build-deps`), e `libpq` (runtime) fica instalada.
- Hot-reload: `backend/app` e `frontend/src` (+ public/index.html/vite.config.ts) são montados como
  volume, então editar o código não precisa rebuild — só reload automático (`--reload` no uvicorn,
  Vite dev server no frontend).
