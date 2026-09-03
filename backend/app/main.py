import os

from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db import Base, engine
from app.routers import kpis

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Twygo KPI API")

# Em desenvolvimento o Vite faz proxy de /api pro backend (vite.config.ts), e
# em produção (Dokploy) é o nginx que faz isso — ver frontend/nginx.conf. Nos
# dois casos o navegador fala com uma origem só, então CORS não entra em jogo
# de verdade. Isto aqui é só para quem acessa a API direto (Swagger em /docs,
# um teste manual com curl de outra origem) — CORS_ORIGINS separado por
# vírgula, com o padrão de desenvolvimento se a variável não existir.
origens = [o.strip() for o in
           os.environ.get("CORS_ORIGINS", "http://localhost:5173").split(",")
           if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origens,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


# Example router with mocked data, useful to wire up the dashboard
# before the real /api/kpis (routers/kpis.py) has any data in the DB.
mock_router = APIRouter(prefix="/api/kpis", tags=["kpis-mock"])


@mock_router.get("/mock")
def mock_kpis():
    return [
        {"id": 1, "nome": "Usuarios ativos", "valor": 1200, "variacao": 5.4},
        {"id": 2, "nome": "Receita mensal", "valor": 89500.0, "variacao": -2.1},
        {"id": 3, "nome": "Churn", "valor": 3.2, "variacao": 0.5},
    ]


app.include_router(mock_router)
app.include_router(kpis.router)
