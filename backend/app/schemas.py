from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict

KpiUnit = Literal["numero", "moeda", "percentual"]


class KpiBase(BaseModel):
    name: str
    value: float
    unit: KpiUnit = "numero"
    variation: float = 0.0
    featured: bool = False


class KpiCreate(KpiBase):
    pass


class KpiOut(KpiBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    updated_at: datetime


class KpiHistoryPoint(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    period: date
    value: float


class DashboardKpi(KpiOut):
    history: list[KpiHistoryPoint] = []


class DashboardOut(BaseModel):
    kpis: list[DashboardKpi]
