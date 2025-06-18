# Boimarker

A modern web application for managing your eBook library. Upload, organize, and read your books from anywhere with this sleek, responsive interface.

---

## Features

- **User Authentication**: Secure registration and login system
- **Book Management**: Upload, browse, and organize your eBook collection
- **Online Reader**: Read your books directly in the browser
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Mode**: Toggle between themes for comfortable reading
- **File Support**: Handles popular formats like PDF and EPUB

---

## Technologies

- **Frontend:** Next.js with TypeScript, Shadcn
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

- `POST /register` — Register a new user

- `POST /token` — Login and retrieve access token

### Books

- `GET /books` — List all books
- `POST /books/upload` — Upload a new book
- `GET /books/{id}` — Get book details
- `GET /books/{id}/file` — Get book file for reading
- `GET /books/{id}/download` — Download book file

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
