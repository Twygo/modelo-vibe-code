from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas
from app.db import get_db

router = APIRouter(prefix="/api/kpis", tags=["kpis"])


@router.get("", response_model=list[schemas.KpiOut])
def list_kpis(db: Session = Depends(get_db)):
    return db.query(models.Kpi).all()


@router.get("/{kpi_id}", response_model=schemas.KpiOut)
def get_kpi(kpi_id: int, db: Session = Depends(get_db)):
    kpi = db.get(models.Kpi, kpi_id)
    if kpi is None:
        raise HTTPException(status_code=404, detail="Kpi not found")
    return kpi


@router.post("", response_model=schemas.KpiOut, status_code=201)
def create_kpi(kpi_in: schemas.KpiCreate, db: Session = Depends(get_db)):
    kpi = models.Kpi(**kpi_in.model_dump())
    db.add(kpi)
    db.commit()
    db.refresh(kpi)
    return kpi
