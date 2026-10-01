from datetime import date, datetime, timezone

from sqlalchemy import Boolean, Date, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class Kpi(Base):
    """Um indicador (ex.: "Usuários ativos"). É o que aparece nos cards e na tabela."""

    __tablename__ = "kpis"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    value: Mapped[float] = mapped_column(Float, nullable=False)
    # Como exibir o valor: "numero", "moeda" (R$) ou "percentual" (%).
    unit: Mapped[str] = mapped_column(String(20), nullable=False, default="numero")
    # Variação em % em relação ao período anterior (ex.: 5.4 = +5,4%).
    variation: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    # True = aparece como card no topo do Dashboard; False = só na tabela.
    featured: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    history: Mapped[list["KpiHistory"]] = relationship(
        back_populates="kpi",
        cascade="all, delete-orphan",
        order_by="KpiHistory.period",
    )


class KpiHistory(Base):
    """Valor de um indicador em um mês (alimenta o gráfico de linha)."""

    __tablename__ = "kpi_history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    kpi_id: Mapped[int] = mapped_column(ForeignKey("kpis.id", ondelete="CASCADE"), index=True)
    # Primeiro dia do mês a que o valor se refere (ex.: 2026-03-01).
    period: Mapped[date] = mapped_column(Date, nullable=False)
    value: Mapped[float] = mapped_column(Float, nullable=False)

    kpi: Mapped[Kpi] = relationship(back_populates="history")
