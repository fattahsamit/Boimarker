from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, LargeBinary, UniqueConstraint
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    books = relationship("Book", back_populates="owner")
    progress = relationship("Progress", back_populates="user")
    progress = relationship("Progress", back_populates="user", uselist=True)
    

class Book(Base):
    __tablename__ = "books"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    filename = Column(String, nullable=False)
    mimetype = Column(String, nullable=True)
    file_data = Column(LargeBinary, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="books")
    progress = relationship("Progress", back_populates="book")
    progress = relationship("Progress", back_populates="book", uselist=False)

class Progress(Base):
    __tablename__ = "progress"
    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    position = Column(String, nullable=False)  # Store as string (e.g., page number, CFI, etc.)

    __table_args__ = (UniqueConstraint('book_id', 'user_id', name='_book_user_uc'),)

    book = relationship("Book", back_populates="progress")
    user = relationship("User", back_populates="progress")
