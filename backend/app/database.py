"""
Hotel M — Database Connection
SQLAlchemy engine and session setup for Neon PostgreSQL.
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import get_settings

settings = get_settings()

# Strip channel_binding from URL (psycopg2 doesn't support it as a URL param)
_db_url = settings.database_url
if "channel_binding" in _db_url:
    import re
    _db_url = re.sub(r'[?&]channel_binding=[^&]*', '', _db_url)
    _db_url = re.sub(r'[?&]$', '', _db_url)

engine = create_engine(
    _db_url,
    connect_args={
        "sslmode": "require",
        "connect_timeout": 10,
    },
    pool_pre_ping=True,      # Test connections before use
    pool_recycle=180,        # Recycle connections every 3 min to beat Neon DB proxy drop
    pool_size=5,
    max_overflow=2,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Dependency that provides a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
