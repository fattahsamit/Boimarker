from fastapi import FastAPI, File, Form, UploadFile, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from .auth import get_current_user
import shutil
import io
from sqlalchemy.orm import Session
from .database import SessionLocal, engine
from . import models, schemas, crud, auth
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel

from fastapi.middleware.cors import CORSMiddleware

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

models.Base.metadata.create_all(bind=engine)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://boimarker.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.get("/books/{book_id}/download")
def download_book(
    book_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    book = db.query(models.Book).filter(
        models.Book.id == book_id,
        models.Book.owner_id == current_user.id
    ).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    # Return the file as a streaming response
    return StreamingResponse(
        io.BytesIO(book.file_data),
        media_type=book.mimetype or "application/octet-stream",
        headers={
            "Content-Disposition": f'attachment; filename="{book.filename}"'
        }
    )

@app.delete("/books/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_book(
    book_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    book = db.query(models.Book).filter(
        models.Book.id == book_id,
        models.Book.owner_id == current_user.id
    ).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    db.delete(book)
    db.commit()
    return

# Save or update progress
@app.post("/books/{book_id}/progress", response_model=schemas.ProgressOut)
def save_progress(
    book_id: int,
    progress_in: schemas.ProgressIn,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Ensure the user owns the book
    book = db.query(models.Book).filter(
        models.Book.id == book_id,
        models.Book.owner_id == current_user.id
    ).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    # Check if progress already exists
    progress = db.query(models.Progress).filter_by(
        book_id=book_id, user_id=current_user.id
    ).first()
    if progress:
        progress.position = progress_in.position
    else:
        progress = models.Progress(
            book_id=book_id, user_id=current_user.id, position=progress_in.position
        )
        db.add(progress)
    db.commit()
    db.refresh(progress)
    return progress

# Retrieve progress
@app.get("/books/{book_id}/progress", response_model=schemas.ProgressOut)
def get_progress(
    book_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    progress = db.query(models.Progress).filter_by(
        book_id=book_id, user_id=current_user.id
    ).first()
    if not progress:
        raise HTTPException(status_code=404, detail="No progress found for this book")
    return progress

@app.get("/books/{book_id}", response_model=schemas.BookOut)
def get_book(
    book_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    book = db.query(models.Book).filter(
        models.Book.id == book_id,
        models.Book.owner_id == current_user.id
    ).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book
