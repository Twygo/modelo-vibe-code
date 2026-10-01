import os

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

# Dentro do Docker, o docker-compose.yml define DATABASE_URL a partir das
# variáveis POSTGRES_* do .env. O valor padrão abaixo só vale para rodar o
# backend fora do Docker (ver backend/README.md) e usa as mesmas credenciais.
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg://kpi:kpi@localhost:5433/kpidb",
)

engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
