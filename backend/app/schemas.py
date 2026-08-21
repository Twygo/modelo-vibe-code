from datetime import datetime

from pydantic import BaseModel, ConfigDict


class KpiBase(BaseModel):
    name: str
    value: float


class KpiCreate(KpiBase):
    pass


class KpiOut(KpiBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    updated_at: datetime
