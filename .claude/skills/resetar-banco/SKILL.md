---
name: resetar-banco
description: Apaga e recria o banco de dados local do kpi-boilerplate (make reset + make up), voltando aos dados de exemplo. Use quando o usuário pedir "zera o banco", "começa do zero", "apaga os dados", quando mudou a senha do banco no .env, ou quando aparecer erro de coluna/tabela que não existe depois de mudar um model.
---

# Resetar o banco local

`make reset` roda `docker compose down -v`: para os containers **e apaga o volume do
Postgres** (todos os dados locais). No próximo `make up` o banco é recriado vazio, o
backend cria as tabelas e insere os dados de exemplo (`backend/app/seed.py`).

Só afeta o banco **local** desta pasta. Não afeta nada da Twygo nem de outras pessoas.

## Quando usar

- Mudou `POSTGRES_PASSWORD`/`POSTGRES_USER`/`POSTGRES_DB` no `.env` depois do primeiro
  boot (o Postgres só aplica essas variáveis ao criar o banco) — erro típico:
  `password authentication failed`.
- Mudou/removeu coluna de um model existente em `backend/app/models.py` — erro típico:
  `UndefinedColumn` / `column ... does not exist`.
- A pessoa quer voltar aos dados de exemplo.

## Passos

1. **Avise antes e peça confirmação**, em português simples: "Isso apaga todos os dados
   que estão no banco local (ex.: planilhas que você importou). Os dados de exemplo voltam.
   Posso seguir?" Se houver dados importados importantes, lembre que dá para importar de
   novo a partir da planilha.
2. Rode:

```bash
make reset
make up            # ou: docker compose up --build -d
```

3. Confira:

```bash
curl -s http://localhost:8000/health                       # {"status":"ok"}
curl -s http://localhost:8000/api/dashboard | head -c 200   # dados de exemplo de volta
```

4. Diga para a pessoa recarregar http://localhost:5173.
