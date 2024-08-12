"""
Module defining FastAPI router setup and dependencies.
Importing APIRouter and Depends from FastAPI for defining routes and managing dependencies.
importing sql alchemy for database
"""
from typing import Optional
import schemas.transaction_schema as schemas
import services.transaction_service as transaction_service
from fastapi import APIRouter, Depends
from fastapi_pagination import Page, add_pagination
from sqlalchemy.orm import Session
from pydantic import UUID4
from models.database import get_db
from utils.config import get_logger  # Import the logger
from schemas.user_schema import User
from utils.security import get_current_user

# Get the logger instance
logger = get_logger()

router = APIRouter()


@router.post("/transactions", response_model=schemas.Transaction)
async def create_transaction(
    transaction: schemas.TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> schemas.Transaction:
    """
    Create a new transaction in the database.
    """
    logger.info(f"Attempting to create a new transaction with data: {transaction}")
    created_transaction = transaction_service.create_transaction(transaction, current_user.id, db)
    logger.info(f"Transaction created successfully with ID: {created_transaction.table_name_id}")
    return created_transaction

@router.get("/transactions", response_model=schemas.TransactionsResponse)
async def read_transactions(
    db: Session = Depends(get_db),
    search: Optional[str] = None,
    page: int = 1,
    size: int = 9,
    current_user: User = Depends(get_current_user)
) -> schemas.TransactionsResponse:
    """
    Retrieve filtered transactions and their total amount from the database.

    Args:
        search (Optional[str]): The search term to filter transactions by category.
        db (Session): The database session.
        page (int): The current page number.
        size (int): The number of items per page.

    Returns:
        dict: A dictionary with a list of filtered transactions and their total sum.
    """
    logger.info("Fetching filtered transactions and their total amount from the database")
    result = transaction_service.get_filtered_transactions_with_sum(db, search, page, size, user_id=current_user.id )
    logger.info("Retrieved filtered transactions and their total amount from the database")
    return result

@router.get("/transactions/{transaction_id}", response_model=schemas.Transaction)
def read_transaction(transaction_id: UUID4, db: Session = Depends(get_db), current_user: User = Depends(get_current_user))-> schemas.Transaction:
    """
    Retrieve a specific transaction by its ID.

    Args:
        transaction_id (UUID4): The ID of the transaction to retrieve.
        db (Session): The database session.

    Returns:
        schemas.Transaction: The transaction with the specified ID.
    """
    logger.info(f"Fetching transaction with ID: {transaction_id}")
    transaction = transaction_service.get_transaction_by_id(transaction_id, db)
    logger.info(f"Transaction retrieved successfully with ID: {transaction_id}")
    return transaction

@router.put("/transactions/{transaction_id}", response_model=schemas.Transaction)
def update_transaction(transaction_id: UUID4,
        transaction: schemas.TransactionBase, db: Session = Depends(get_db))-> schemas.Transaction:
    """
    Update an existing transaction by its ID.

    Args:
        transaction_id (UUID4): The ID of the transaction to update.
        transaction (schemas.TransactionBase): The updated transaction data.
        db (Session): The database session.

    Returns:
        schemas.Transaction: The updated transaction.
    """
    logger.info(f"Updating transaction with ID: {transaction_id} with data: {transaction}")
    updated_transaction = transaction_service.update_transaction(transaction_id, transaction, db)
    logger.info(f"Transaction updated successfully with ID: {transaction_id}")
    return updated_transaction

@router.delete("/transactions/{transaction_id}")
def delete_transaction(transaction_id: UUID4, db: Session = Depends(get_db))-> None:
    """
    Delete a transaction by its ID.

    Args:
        transaction_id (UUID4): The ID of the transaction to be deleted.
        db (Session): The database session.

    Returns:
        None
    """
    logger.info(f"Deleting transaction with ID: {transaction_id}")
    transaction_service.delete_transaction(transaction_id, db)
    logger.info(f"Transaction deleted successfully with ID: {transaction_id}")

add_pagination(router)