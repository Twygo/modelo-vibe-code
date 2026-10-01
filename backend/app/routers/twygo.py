"""Exemplo de integração com a API da Twygo.

O token fica SÓ no backend (variável TWYGO_API_TOKEN no .env). O navegador
chama /api/twygo/users e o backend repassa para a API da Twygo com o token —
assim o token nunca aparece no frontend.

Sem token configurado, as rotas respondem 503 com uma mensagem explicando.

LGPD: a lista de usuários contém dados pessoais. Use só com autorização,
não salve em arquivos versionados e não publique telas com esses dados.
"""

import os

import httpx
from fastapi import APIRouter, HTTPException, Request

router = APIRouter(prefix="/api/twygo", tags=["twygo"])

TWYGO_API_BASE = os.getenv("TWYGO_API_BASE", "https://api.twygo.com/api/v2")


def _token() -> str:
    token = os.getenv("TWYGO_API_TOKEN", "").strip()
    if not token:
        raise HTTPException(
            status_code=503,
            detail=(
                "Integração com a Twygo desligada: preencha TWYGO_API_TOKEN no arquivo .env "
                "e rode `make up` de novo."
            ),
        )
    return token


async def _get(path: str, params: dict[str, str]):
    token = _token()
    try:
        async with httpx.AsyncClient(base_url=TWYGO_API_BASE, timeout=20) as client:
            res = await client.get(
                path,
                params=params,
                headers={"Authorization": f"Bearer {token}", "Accept": "application/json"},
            )
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="A API da Twygo demorou demais para responder.")
    except httpx.HTTPError:
        raise HTTPException(status_code=502, detail="Não foi possível conectar na API da Twygo.")

    if res.status_code in (401, 403):
        raise HTTPException(
            status_code=502,
            detail="A API da Twygo recusou o token (TWYGO_API_TOKEN inválido ou sem permissão).",
        )
    if res.status_code >= 400:
        raise HTTPException(
            status_code=502,
            detail=f"A API da Twygo respondeu com erro {res.status_code}.",
        )
    return res.json()


@router.get("/users")
async def list_users(request: Request):
    """Repassa GET /users da API da Twygo (query params como page/per_page são repassados)."""
    return await _get("/users", dict(request.query_params))
