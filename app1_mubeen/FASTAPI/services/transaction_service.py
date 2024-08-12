"""
Module imports for defining FastAPI endpoints related to transactions.

Imports:
    - Session: SQLAlchemy session for database operations.
    - HTTPException: FastAPI exception for HTTP errors.
    - status: FastAPI status codes for HTTP responses.
    - schemas: Transaction schemas defining data structures for input/output validation.
    - UUID4: Pydantic type for UUID version 4.
    - models: SQLAlchemy models representing database tables.
    - ErrorMessages: Constants for error messages related to transactions.

Usage:
    This module imports necessary components for defining FastAPI endpoints that handle
    CRUD operations on transactions. It includes SQLAlchemy session for database operations,
    FastAPI exceptions for error handling, transaction schemas for data validation,
    SQLAlchemy models for database interaction, and constants for error messages.
"""
from typing import Optional
import schemas.transaction_schema as schemas
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from sqlalchemy import func
from pydantic import UUID4
from fastapi_pagination import Page, Params
from fastapi_pagination.ext.sqlalchemy import paginate
from models import transaction_model
from utils.constants import ErrorMessages
from utils.config import get_logger

logger = get_logger()

def get_filtered_transactions_with_sum(
    db: Session, 
    search: Optional[str] = None, 
    page: int = 1, 
    size: int = 9,
    user_id: Optional[UUID4] = None  # Add this line to accept user_id
) -> dict:
    """
    Retrieve transactions from the database based on filtering criteria and their total sum.

    Args:
        db (Session): The database session.
        search (Optional[str]): The search term to filter transactions by category.
        page (int): The current page number.
        size (int): The number of items per page.
        user_id (Optional[UUID4]): The user ID to filter transactions by user.

    Returns:
        dict: A dictionary with a list of transactions and their total sum.
    """
    try:
        query = db.query(transaction_model.Transaction)
        
        if user_id:
            query = query.filter(transaction_model.Transaction.owner_id == user_id)
        
        if search:
            search = search.lower()
            query = query.filter(
                transaction_model.Transaction.category.ilike(f"%{search}%")|
                transaction_model.Transaction.description.ilike(f"%{search}%")|
                transaction_model.Transaction.date.ilike(f"%{search}%")
            )
        
        total_amount = db.query(func.sum(transaction_model.Transaction.amount)).filter(
            (transaction_model.Transaction.owner_id == user_id) &
            (transaction_model.Transaction.category.ilike(f"%{search}%")|
            transaction_model.Transaction.description.ilike(f"%{search}%")|
            transaction_model.Transaction.date.ilike(f"%{search}%"))
        ).scalar() or 0
        
        transactions_page = paginate(query, Params(page=page, size=size))
        
        return {
            "transactions": transactions_page.items,
            "total_amount": total_amount,
            "total": transactions_page.total,
            "page": transactions_page.page,
            "size": transactions_page.size,
            "pages": transactions_page.pages,
        }
    except Exception as e:
        logger.error(f"Error retrieving filtered transactions with sum: {e}")
        raise HTTPException(status_code=500, detail="Error retrieving transactions with sum") from e


#keeping code clean by using DRY principle 
def fetch_transaction_id(transaction_id: UUID4, db: Session) -> transaction_model.Transaction:
    """
    Fetch a transaction from the database by its ID.

    Args:
        transaction_id (UUID4): The UUID4 ID of the transaction to fetch.
        db (Session): The database session.

    Returns:
        models.Transaction: The transaction object corresponding to the given ID.

    Raises:
        HTTPException: Raised with status code 404 if the 
        transaction with the specified ID is not found.
    """
    db_transaction = db.query(transaction_model.Transaction).filter(
        transaction_model.Transaction.table_name_id == transaction_id).first()
    if not db_transaction:
        logger.error(f"Transaction with ID: {transaction_id} not found")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                            detail=ErrorMessages.TRANSACTION_NOT_FOUND)
    return db_transaction


def get_transaction_by_id(transaction_id: UUID4, db: Session) -> transaction_model.Transaction:
    """
    Retrieve a specific transaction from the database by its ID.

    Args:
        transaction_id (UUID4): The UUID4 ID of the transaction to retrieve.
        db (Session): The database session.

    Returns:
        models.Transaction: The transaction object corresponding to the given ID.

    Raises:
        HTTPException: Raised with status code 404 if the 
        transaction with the specified ID is not found.
    """
    try:
        db_transaction = fetch_transaction_id(transaction_id, db)
        if not db_transaction:
            logger.error(f"Transaction with ID: {transaction_id} not found")
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                                detail=ErrorMessages.TRANSACTION_NOT_FOUND)
        logger.info(f"Transaction retrieved successfully with ID: {transaction_id}")
        return db_transaction
    except Exception as e:
        logger.error(f"Error retrieving transaction: {e}")
        raise HTTPException(status_code=500, detail=ErrorMessages.ERROR_RETRIEVING_TRANSACTION)from e
    
def update_transaction(transaction_id: UUID4, 
            transaction: schemas.TransactionBase, db: Session) -> transaction_model.Transaction:
    """
    Update an existing transaction in the database.

    Args:
        transaction_id (UUID4): The ID of the transaction to update.
        transaction (schemas.TransactionBase): The updated transaction data.
        db (Session): The database session.

    Returns:
        models.Transaction: The updated transaction object.

    Raises:
        HTTPException: Raised if the transaction with the given ID is not found.
    """
    try:
        db_transaction = fetch_transaction_id(transaction_id, db)
        if not db_transaction:
            logger.error(f"Transaction with ID: {transaction_id} not found")
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=ErrorMessages.TRANSACTION_NOT_FOUND)
        for field, value in transaction.dict(exclude_unset=True).items():
            setattr(db_transaction, field, value)
        db.commit()
        db.refresh(db_transaction)
        logger.info(f"Transaction updated successfully with ID: {transaction_id}")
        return db_transaction
    except Exception as e:
        logger.error(f"Error updating transaction: {e}")
        raise HTTPException(status_code=500, detail=ErrorMessages.ERROR_UPDATING_TRANSACTION)from e


def create_transaction(transaction: schemas.TransactionCreate, owner_id: UUID4, db: Session) -> transaction_model.Transaction:
    """
    Create a new transaction in the database.
    """
    try:
        transaction_data = transaction.dict()
        transaction_data['owner_id'] = owner_id
        db_transaction = transaction_model.Transaction(**transaction_data)
        db.add(db_transaction)
        db.commit()
        db.refresh(db_transaction)
        logger.info(f"Transaction created successfully with ID: {db_transaction.table_name_id}")
        return db_transaction
    except Exception as e:
        logger.error(f"Error creating transaction: {e}")
        raise HTTPException(status_code=500, detail=ErrorMessages.ERROR_CREATING_TRANSACTION) from e



def delete_transaction(transaction_id: UUID4, db: Session) -> None:
    """
    Delete a transaction from the database by its ID.

    Args:
        transaction_id (UUID4): The ID of the transaction to delete.
        db (Session): The database session.

    Raises:
        HTTPException: Raised if the transaction with the given ID is not found.
    """
    try:
        db_transaction = db.query(transaction_model.Transaction).filter(
            transaction_model.Transaction.table_name_id == transaction_id).first()
        if not db_transaction:
            logger.error(f"Transaction with ID: {transaction_id} not found")
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=ErrorMessages.TRANSACTION_NOT_FOUND)
        db.delete(db_transaction)
        db.commit()
        logger.info(f"Transaction deleted successfully with ID: {transaction_id}")
    except Exception as e:
        logger.error(f"Error deleting transaction: {e}")
        raise HTTPException(status_code=500, detail=ErrorMessages.ERROR_DELETING_TRANSACTION)from e