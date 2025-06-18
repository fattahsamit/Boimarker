from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: EmailStr

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class BookOut(BaseModel):
    id: int
    title: str
    filename: str
    mimetype: str
    owner_id: int

    class Config:
        orm_mode = True

class ProgressIn(BaseModel):
    position: str

class ProgressOut(BaseModel):
    book_id: int
    user_id: int
    position: str

    class Config:
        orm_mode = True
