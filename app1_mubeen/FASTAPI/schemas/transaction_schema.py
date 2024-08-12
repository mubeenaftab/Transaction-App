"""
Module for importing Pydantic components.

Imports BaseModel and UUID4 from Pydantic for defining data models and UUID fields respectively.

Usage:
    This module imports essential components from Pydantic to 
    facilitate data modeling and validation.

Example:
    from pydantic import BaseModel, UUID4

"""
from pydantic import BaseModel, UUID4

class TransactionBase(BaseModel):
    amount: float
    category: str
    description: str
    is_income: bool
    date: str


class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    """
    SQLAlchemy model representing a transaction.

    Inherits:
        TransactionBase: Pydantic BaseModel defining transaction attributes.

    Attributes:
        table_name_id (UUID4): Primary key UUID for identifying the transaction.

    Usage:
        This class defines the SQLAlchemy model for storing transaction data in the database.
        It inherits all attributes from TransactionBase and includes a primary key field
        'table_name_id' of type UUID4.

    Example:
        transaction_data = Transaction(amount=100.0, category="Food", 
        description="Grocery shopping",
                            is_income=False, date="2024-07-15", table_name_id=uuid.uuid4())

    """
    table_name_id: UUID4
    owner_id: UUID4
    class Config:
        """
        Config:
          from_attributes (bool): 
            When set to True, Pydantic will initialize the model using 
            attributes from an existing object rather than requiring 
            field names to match exactly. This is useful for working with 
            custom classes or data structures that do not conform to ORM 
            models. 
        """
        from_attributes = True

class TransactionsResponse(BaseModel):
    """
    for total amount
    """
    transactions: list[Transaction]
    total_amount: float
    total: int #total no of pages
    page: int  #current page of table
    size: int
    pages: int