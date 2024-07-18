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
    """
    Base Pydantic model for defining transaction data.

    Attributes:
        amount (float): The amount of the transaction.
        category (str): The category of the transaction.
        description (str): The description of the transaction.
        is_income (bool): Indicates if the transaction is income (`True`) or expense (`False`).
        date (str): The date of the transaction.

    Usage:
        This model is used for validating and serializing transaction data in FastAPI endpoints.
        It inherits from Pydantic's BaseModel for data validation and schema definition.

    Example:
        transaction_data = TransactionBase(amount=100.0, category="Groceries", 
                         description="Grocery shopping", is_income=False, date="2024-07-15")

    """
    amount: float
    category: str
    description: str
    is_income: bool
    date: str

class TransactionCreate(TransactionBase):
    """
    Pydantic model for creating a new transaction based on TransactionBase.

    Inherits:
        TransactionBase: Base Pydantic model for defining transaction data.

    Usage:
        This model is used to create new transaction records in the database. It inherits all
        attributes from TransactionBase and does not add any new attributes.

    Example:
        create_data = TransactionCreate(amount=150.0, category="Shopping", 
                             description="Online shopping", is_income=False, date="2024-07-15")

    """

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

    class Config:
        """
        Config:
        orm_mode (bool): SQLAlchemy mode for data interaction.
        """
        orm_mode = True