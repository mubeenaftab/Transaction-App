"""
Main application entry point for the FastAPI application.

This module sets up the FastAPI application, configures middleware,
and includes routes for handling transactions.

Imports:
    FastAPI: The FastAPI framework for creating the application instance.
    CORSMiddleware: Middleware for handling Cross-Origin Resource Sharing (CORS).
    transaction_controller: Module that contains transaction-related routes.

Usage:
    This module should be run to start the FastAPI application server.
    It sets up the necessary middleware and includes the transaction routes.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from controllers import transaction_controller
from utils.config import get_logger
from models.database import engine, Base
app = FastAPI()
# Initialize logger
logger = get_logger()

#allowing application on this port to interact with fastapi
origins = [
    'http://localhost:5173'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['GET', 'POST', 'PUT', 'DELETE'],
    allow_headers=['*']
)


app.include_router(transaction_controller.router)

Base.metadata.create_all(bind=engine)

@app.on_event("startup")
async def startup_event():
    """
    function for application startup log
    """
    logger.info("Application startup")


@app.on_event("shutdown")
async def shutdown_event():
    """
    function for application shutdown log
    """
    logger.info("Application shutdown")