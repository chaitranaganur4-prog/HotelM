"""
Hotel M — Guest Routes
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from app.dependencies import get_current_active_user
from pydantic import BaseModel, EmailStr
from typing import Optional

router = APIRouter()


# --- Pydantic Schemas ---

class GuestCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    id_proof_type: Optional[str] = None
    id_proof_number: Optional[str] = None
    address: Optional[str] = None


class GuestResponse(GuestCreate):
    id: int

    class Config:
        from_attributes = True


# --- Endpoints ---

@router.get("/", response_model=list[GuestResponse])
def get_guests(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Guest).offset(skip).limit(limit).all()


@router.get("/{guest_id}", response_model=GuestResponse)
def get_guest(guest_id: int, db: Session = Depends(get_db)):
    guest = db.query(models.Guest).filter(models.Guest.id == guest_id).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Guest not found")
    return guest


@router.post("/", response_model=GuestResponse, status_code=201)
def create_guest(guest: GuestCreate, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    # Check if guest with this email already exists
    existing_guest = db.query(models.Guest).filter(models.Guest.email == guest.email).first()
    if existing_guest:
        return existing_guest
        
    db_guest = models.Guest(**guest.model_dump())
    db.add(db_guest)
    db.commit()
    db.refresh(db_guest)
    return db_guest


@router.delete("/{guest_id}", status_code=204)
def delete_guest(guest_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    guest = db.query(models.Guest).filter(models.Guest.id == guest_id).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Guest not found")
    db.delete(guest)
    db.commit()
