"""
Importing the Enum class from the enum module.

This import is used to define enumeration classes that provide a set of symbolic names
(bound to unique, constant values) for use in the application. Enumerations are useful
for defining sets of related constants and improving code readability.

Usage:
    This module import is used in defining error message constants, configuration options,
    and other sets of named values.
"""
from enum import Enum

class ErrorMessages(Enum):
    """
    Enumeration for standardized error messages used throughout the application.

    Attributes:
        TRANSACTION_NOT_FOUND (str): Error message indicating that a requested transaction was not found.
    """
    TRANSACTION_NOT_FOUND = "Transaction not Found"
    ERROR_RETRIEVING_TRANSACTION = "Error retrieving transactions"
    ERROR_CREATING_TRANSACTION = "Error creating transaction"
    ERROR_UPDATING_TRANSACTION = "Error updating transaction"
    ERROR_DELETING_TRANSACTION = "Error deleting transaction"