
"""
Module for importing necessary libraries and modules for database configuration.

Imports:
    os: Provides a way of using operating system dependent functionality 
    like reading or writing to the file system.
    create_engine: A function from SQLAlchemy used to create a new database connection.
    load_dotenv: A function from python-dotenv used to load environment variables from a .env file.
"""
import os
from sqlalchemy import create_engine
from dotenv import load_dotenv
from loguru import logger


# Remove default logger to prevent duplicate logs
logger.remove()
# Add a logger with your desired settings
logger.add("app.log", rotation="500 MB", level="DEBUG", format="{time} {level} {message}")
# Function to get the logger
def get_logger():
    """
    function for initalizing logger
    """
    return logger

class Config:
    """
    Configuration class for handling application settings.
    """

    def __init__(self):
        self.load_env()
        self.setup_database()

    def load_env(self):
        """
        Load environment variables from .env file.
        """
        load_dotenv()

    def setup_database(self):
        """
        Setup database connection and engine.
        """
        database_url = os.getenv("DATABASE_URL")
        if database_url is None:
            raise ValueError("No DATABASE_URL found in environment variables")

        self.engine = create_engine(database_url, echo=True)

config = Config()
