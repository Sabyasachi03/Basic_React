from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserSignup, UserLogin, UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup", response_model=UserResponse)
def signup(user: UserSignup, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(name=user.name, email=user.email, password=user.password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/login", response_model=UserResponse)
def login(user: UserLogin, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()

    if not existing_user or existing_user.password != user.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return existing_user
