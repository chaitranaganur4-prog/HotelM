from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr
from typing import Optional
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Staff
from app.utils import hash_password, verify_password, create_access_token
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None
    role: Optional[str] = "customer"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    role: str

    class Config:
        from_attributes = True

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate, db: Session = Depends(get_db)):
    logger.info(f"Signup attempt for email: {user.email}")
    # Check if user already exists
    try:
        existing_user = db.query(Staff).filter(Staff.email == user.email).first()
        if existing_user:
            logger.warning(f"Signup failed: Email {user.email} already exists")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        logger.info("Hashing password...")
        hashed_pwd = hash_password(user.password)
        new_staff = Staff(
            first_name=user.first_name,
            last_name=user.last_name,
            email=user.email,
            password_hash=hashed_pwd,
            phone=user.phone,
            role=user.role
        )
        
        logger.info("Adding to DB...")
        db.add(new_staff)
        logger.info("Committing...")
        db.commit()
        logger.info("Refreshing...")
        db.refresh(new_staff)
        logger.info(f"Signup successful for ID: {new_staff.id}")
        return new_staff
    except Exception as e:
        logger.error(f"Error in signup: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        raise e

@router.post("/signin", response_model=Token)
async def signin(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(Staff).filter(Staff.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": db_user.email, "role": db_user.role})
    return {"access_token": access_token, "token_type": "bearer", "role": db_user.role}
