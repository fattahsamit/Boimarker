from sqlalchemy.orm import Session
from . import models, schemas, auth

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_pw = auth.hash_password(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_pw)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_book(db: Session, title: str, filename: str, mimetype: str, file_bytes: bytes, owner_id: int):
    db_book = models.Book(
        title=title,
        filename=filename,
        mimetype=mimetype,
        file_data=file_bytes,
        owner_id=owner_id
    )
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book