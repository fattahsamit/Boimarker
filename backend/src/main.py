from fastapi import FastAPI, File, Form, UploadFile, Depends, HTTPException, status
from .auth import get_current_user
import shutil
from sqlalchemy.orm import Session
from .database import SessionLocal, engine
from . import models, schemas, crud, auth

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

models.Base.metadata.create_all(bind=engine)
app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if crud.get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db, user)

@app.post("/login", response_model=schemas.Token)
def login(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, user.email)
    if not db_user or not auth.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = auth.create_access_token({"sub": db_user.email})
    return {"access_token": token, "token_type": "bearer"}

@app.post("/books/upload", response_model=schemas.BookOut)
async def upload_book(
    title: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Limit file size
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413, detail="File too large (max 5MB allowed)"
        )

    book = crud.create_book(
        db, title=title, filename=file.filename,
        mimetype=file.content_type, file_bytes=contents,
        owner_id=current_user.id
    )
    return book

@app.get("/books", response_model=list[schemas.BookOut])
def list_books(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    books = db.query(models.Book).filter(models.Book.owner_id == current_user.id).all()
    return books