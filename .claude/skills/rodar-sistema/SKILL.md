---
name: rodar-sistema
description: Sobe, testa e derruba o kpi-boilerplate (frontend+backend+postgres) via docker compose. Use quando o usuário pedir "sobe o sistema", "liga o projeto", "roda o boilerplate", "testa se builda", "derruba tudo", "desliga", "vê os logs", "não está abrindo".
---

# Rodar o kpi-boilerplate

Stack: React+Vite (frontend, http://localhost:5173) + FastAPI (backend, http://localhost:8000)
+ Postgres 16 (sem porta publicada), tudo via docker compose na raiz do repo. As portas são
publicadas só em 127.0.0.1.

Fale com a pessoa em português simples: diga o que vai rodar e o que ela deve ver.

## Antes de subir

- Docker Desktop precisa estar aberto (`docker info` sem erro). Se não estiver, peça para a
  pessoa abrir o aplicativo e esperar a baleia parar de animar.
- Precisa existir `.env` na raiz. Se não existir: `cp .env.example .env`.

## Subir

```bash
make up            # em primeiro plano (Ctrl+C para parar)
# ou: docker compose up --build -d   (em segundo plano)
```

Ordem de boot: `postgres` (healthcheck `pg_isready`) → `backend` (só depois do postgres
saudável; cria tabelas e insere dados de exemplo se estiver vazio) → `frontend`.

## Checar se subiu certo

```bash
make ps                                                     # 3 containers "Up"
curl -s http://localhost:8000/health                        # {"status":"ok"}
curl -s http://localhost:8000/api/dashboard | head -c 300   # KPIs de exemplo
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5173/              # 200
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5173/api/dashboard # 200 (proxy do Vite)
```

Diga para a pessoa abrir http://localhost:5173 (Dashboard com cards, gráficos e tabela) e,
se for útil, http://localhost:8000/docs (lista de endpoints).

## Ver logs / debugar

```bash
make logs
# ou: docker compose logs -f backend   (ou frontend / postgres)
```

Problemas comuns:

- `port is already allocated` → outra coisa usa 5173/8000 (talvez outra cópia do projeto).
  `docker ps` para achar; `make down` na outra pasta.
- `psycopg.OperationalError: ... password authentication failed` → a senha do `.env` mudou
  depois do primeiro boot. Rodar `make reset` e `make up` (avise que apaga os dados locais).
- `UndefinedColumn` / `column ... does not exist` → um model mudou e a tabela antiga ficou
  no banco. `make reset` e `make up`.
- Página em branco → ver `docker compose logs frontend` (erro de TypeScript/import aparece
  ali e no console do navegador).

## Derrubar

```bash
make down          # para tudo, mantém os dados do banco
make reset         # para tudo e APAGA o banco local (docker compose down -v)
```

## Notas

- Imagem do backend é `python:3.12-alpine`; dependências com versão fixa em
  `backend/requirements.txt`. Frontend usa `npm ci` com `package-lock.json`.
- Hot-reload: `backend/app` e `frontend/src` (+ public/index.html/vite.config.ts) são
  montados como volume — editar código não precisa rebuild. Mudou dependência,
  `docker-compose.yml` ou `.env`? Rodar `make up` de novo.
