---
name: integracao-twygo
description: Usa a API da Twygo (https://api.twygo.com/api/v2) a partir do backend do kpi-boilerplate, com o token só no .env (nunca no navegador). Use quando o usuário pedir "puxa os usuários da Twygo", "integra com a plataforma Twygo", "mostra dados da Twygo na página", "configura o token da Twygo".
---

# Integração com a API da Twygo

Já existe um exemplo pronto: `backend/app/routers/twygo.py` com `GET /api/twygo/users`,
que repassa para `https://api.twygo.com/api/v2/users` com `Authorization: Bearer
$TWYGO_API_TOKEN`. Sem token, responde **503** com uma mensagem amigável.

## Regras

- O token fica **só** no `.env` (`TWYGO_API_TOKEN=...`). Nunca no código, nunca no
  frontend, nunca em commit, nunca colado em arquivo versionado. Se a pessoa colar o token
  na conversa, coloque no `.env` e avise para não compartilhar.
- O frontend chama **só** `/api/twygo/...` do nosso backend (nunca a API da Twygo direto).
- **LGPD:** usuários da Twygo são dados pessoais. Use só com autorização, mostre apenas os
  campos necessários e não salve exportações com dados reais no Git (`dados/` é ignorada).
- Só leitura (GET) por padrão. Qualquer escrita na plataforma (POST/PUT/DELETE) só com
  pedido explícito e revisão de um dev.

## Configurar o token

1. Peça para a pessoa gerar/obter o token com quem administra a conta Twygo.
2. No `.env` da raiz: `TWYGO_API_TOKEN=<token>`.
3. `make up` de novo (variáveis do `.env` só são lidas ao subir).
4. Teste: `curl -s http://localhost:8000/api/twygo/users | head -c 300`
   - 503 → token não configurado; 502 "recusou o token" → token inválido/sem permissão.

## Novo endpoint da Twygo

Em `backend/app/routers/twygo.py`, reaproveite o helper `_get`:

```python
@router.get("/<recurso>")
async def list_<recurso>(request: Request):
    return await _get("/<recurso>", dict(request.query_params))
```

Prefira devolver só os campos que a página usa (ex.: montar uma lista com `id`, `name`)
em vez de repassar tudo.

## Consumir no frontend

```tsx
const { data, loading, error } = useApi<unknown>("/api/twygo/users");
```

Mostre o `error` num `state-card state-card--error` — a mensagem do backend já explica o
que fazer (ex.: preencher o token). Para a página completa, siga a skill `nova-pagina-kpi`.
