"""
    importing Base and engine from database and models

"""
from models.transaction_model import Base
from models.database import engine
def create_tables():
    """
    creates all the tables in the database
    """
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    create_tables()