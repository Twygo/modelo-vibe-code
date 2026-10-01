"""Dados de exemplo para o Dashboard não abrir vazio.

Roda sempre que o backend sobe, mas só insere se a tabela `kpis` estiver
vazia — então pode reiniciar à vontade que não duplica nada. Para voltar
aos dados de exemplo, rode `make reset` e depois `make up`.

Os números abaixo são FICTÍCIOS. Não coloque dados reais de pessoas aqui.
"""

from datetime import date

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Kpi, KpiHistory

# Meses do histórico (primeiro dia de cada mês).
MONTHS = [date(2026, m, 1) for m in range(3, 9)]  # mar..ago/2026

SAMPLE_KPIS = [
    {
        "name": "Usuários ativos",
        "value": 1200,
        "unit": "numero",
        "variation": 5.4,
        "featured": True,
        "history": [980, 1010, 1065, 1102, 1138, 1200],
    },
    {
        "name": "Receita mensal",
        "value": 89500.0,
        "unit": "moeda",
        "variation": -2.1,
        "featured": True,
        "history": [84200, 86900, 88100, 92300, 91400, 89500],
    },
    {
        "name": "Churn",
        "value": 3.2,
        "unit": "percentual",
        "variation": 0.5,
        "featured": True,
        "history": [3.9, 3.6, 3.4, 3.1, 3.0, 3.2],
    },
    {
        "name": "NPS",
        "value": 89,
        "unit": "numero",
        "variation": 18.7,
        "featured": True,
        "history": [62, 68, 71, 69, 75, 89],
    },
    {"name": "Ticket médio", "value": 149.9, "unit": "moeda", "variation": 1.2},
    {"name": "Tempo de resposta (h)", "value": 3.4, "unit": "numero", "variation": -9.8},
]


def seed_if_empty(db: Session) -> bool:
    """Insere os dados de exemplo se não houver nenhum KPI. Retorna True se inseriu."""
    if db.scalar(select(Kpi.id).limit(1)) is not None:
        return False

    for item in SAMPLE_KPIS:
        values = item.get("history", [])
        kpi = Kpi(
            name=item["name"],
            value=item["value"],
            unit=item["unit"],
            variation=item["variation"],
            featured=item.get("featured", False),
            history=[KpiHistory(period=p, value=v) for p, v in zip(MONTHS, values)],
        )
        db.add(kpi)
    db.commit()
    return True
