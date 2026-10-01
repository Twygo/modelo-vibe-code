"""Endpoint de referência: entrega tudo que a página Dashboard precisa numa chamada só.

Padrão para novas páginas: crie um arquivo como este em app/routers/,
registre em app/main.py e consuma no frontend com `useApi("/api/...")`.
"""

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app import models, schemas
from app.db import get_db

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("", response_model=schemas.DashboardOut)
def get_dashboard(db: Session = Depends(get_db)):
    kpis = db.scalars(
        select(models.Kpi)
        .options(selectinload(models.Kpi.history))
        .order_by(models.Kpi.featured.desc(), models.Kpi.id)
    ).all()
    return {"kpis": kpis}
