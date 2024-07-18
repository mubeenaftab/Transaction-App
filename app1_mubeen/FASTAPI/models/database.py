"""
Module for configuring SQLAlchemy ORM and database session management.

Imports SQLAlchemy components such as declarative_base, sessionmaker, and create_engine
for defining database models and managing database connections.

Also imports load_dotenv from dotenv for loading environment variables from .env files,
and os for operating system-level functionalities.

Usage:
    This module sets up SQLAlchemy for database operations and loads environment variables
    required for database configurations.
"""
from utils.config import config
from sqlalchemy.orm import declarative_base, sessionmaker
# from sqlalchemy.ext.declarative import declarative_base

engine = config.engine
Base = declarative_base()
SessionLocal = sessionmaker(bind=engine)

def get_db():
    """
    Provides a database session to interact with the database.
    Yields:
        SessionLocal: A SQLAlchemy database session.
    Usage:
        Use this function as a dependency in FastAPI endpoints to obtain a database session.
        It yields a session that can be used within a context manager (`with` statement).
        The session is automatically closed and returned to the connection pool after usage.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
