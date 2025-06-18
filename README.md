# Boimarker

A full-stack web application for managing an eBook collection, supporting user authentication, book uploads, and browsing via a Next.js (TypeScript) frontend and a FastAPI backend.

---

## Features

- User registration and login (JWT authentication)
- Upload eBooks (e.g., EPUB, PDF)
- Browse uploaded books
- RESTful API (FastAPI)
- TypeScript Next.js frontend
- Protected routes for authenticated users

---

## Technologies

- **Frontend:** Next.js
- **Backend:** FastAPI
- **Auth:** JWT tokens
- **Database:** PostgreSQL
- **File Storage:** Local

---

## Getting Started

### 1. Backend

#### Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

#### Run

```bash
uvicorn src.main:app --reload
```

#### Environment

- By default, runs on [http://localhost:8000](http://localhost:8000)
- Make sure CORS is enabled for frontend origin (`http://localhost:3000` by default)

### 2. Frontend (Next.js)

#### Setup

```bash
cd frontend
npm install
```

#### Run

```bash
npm run dev
```

#### Environment

- By default, runs on [http://localhost:3000](http://localhost:3000)
- Update API URLs in code if backend is running elsewhere

---

## API Endpoints

### Authentication

- `POST /register` — Register with `{ "email": "...", "password": "..." }`
- `POST /token` — Login with `username=<email>&password=...` (form data), returns `{ "access_token": "...", ... }`

### Books

- `GET /books` — List all books
- `POST /books/upload` — Upload an eBook file (multipart/form-data, field: `file`)
- (Add more endpoints as needed)

---

## Environment Variables

- **Backend:** (e.g., DB connection string, JWT secret)
- **Frontend:** (e.g., NEXT_PUBLIC_API_URL)

---

## Development Notes

- Book upload and browsing are protected; login is required.
- Update field names in frontend/backend if you change the schema
- Make sure the backend and frontend API expectations (field names, content-types) match exactly.

---

## License

MIT

---

## Credits

Created by Fattah Samit
