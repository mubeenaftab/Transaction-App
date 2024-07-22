"""
Module for importing necessary packages and modules.

Imports:
    - uuid: Provides UUID (Universally Unique Identifier) generation and manipulation functions.
    - String, Column, Boolean, Float: SQLalchemy data types for defining table columns.
    - Base: SQLAlchemy Base class for declarative base.
    - UUID: PostgreSQL-specific UUID data type from SQLAlchemy dialects.

Usage:
    Use this module to import necessary packages and modules required for the application.
"""
import uuid
from sqlalchemy import String, Column, Boolean, Float
from sqlalchemy.dialects.postgresql import UUID
from .database import Base

#base an instance of sql alchemy thats how it knows this is class for creating table
class Transaction(Base):
    """
    SQLAlchemy model for transactions.
    """
    __tablename__ = "transactionsGIT"
    table_name_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    amount = Column(Float, nullable=False)
    category = Column(String)
    description = Column(String)
    is_income = Column(Boolean)
    date = Column(String)