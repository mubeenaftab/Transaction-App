from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from models.database import get_db
from schemas.user_schema import UserCreate, User, Token
from services import user_service
from schemas.user_schema import User as UserSchema
router = APIRouter()

@router.post("/register", response_model=UserSchema)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = user_service.create_user(db, user)
    return UserSchema.from_orm(db_user)

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = user_service.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    access_token = user_service.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}