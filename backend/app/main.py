from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db import Base, engine
from app.routers import kpis

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Twygo KPI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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
