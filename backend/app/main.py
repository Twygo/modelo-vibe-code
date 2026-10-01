import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db import Base, SessionLocal, engine
from app.routers import dashboard, kpis, twygo
from app.seed import seed_if_empty


@asynccontextmanager
async def lifespan(_app: FastAPI):
    # Cria as tabelas que ainda não existem (não altera tabelas já criadas:
    # se mudar um model, rode `make reset` para recriar o banco local).
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_if_empty(db)
    yield


app = FastAPI(title="Twygo KPI API", lifespan=lifespan)

# Em desenvolvimento o Vite faz proxy de /api pro backend (vite.config.ts), e
# em produção (Dokploy) é o nginx que faz isso — ver frontend/nginx.conf. Nos
# dois casos o navegador fala com uma origem só, então CORS não entra em jogo
# de verdade. Isto aqui é só para quem acessa a API direto (Swagger em /docs,
# um teste manual com curl de outra origem) — CORS_ORIGINS separado por
# vírgula, com o padrão de desenvolvimento se a variável não existir.
origens = [o.strip() for o in
           os.environ.get("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
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


# Registre aqui cada novo router criado em app/routers/.
app.include_router(dashboard.router)
app.include_router(kpis.router)
app.include_router(twygo.router)
