# Full Stack Cart App (React + FastAPI + PostgreSQL)

This project includes:
- Frontend: React (Vite) with React Router
- Backend: FastAPI + SQLAlchemy
- Database: PostgreSQL

## Project Structure

```
BasicReact/
  backend/
    app/
      models/
      routes/
      schemas/
      database.py
      main.py
    requirements.txt
  frontend/
    src/
      pages/
      services/
      App.jsx
      main.jsx
```

## 1. Database Setup (PostgreSQL)

Open PostgreSQL and run:

```sql
CREATE DATABASE cart_app;
```

Default backend DB config is in `backend/app/database.py`:

```python
DATABASE_URL = "postgresql+psycopg2://postgres:postgres@localhost:5432/cart_app"
```

Update username/password if needed.

## 2. Backend Setup (FastAPI)

From project root:

```bash
cd backend
python -m venv venv
```

Activate venv:

Windows PowerShell:

```bash
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run server:

```bash
uvicorn app.main:app --reload
```

Backend runs at: `http://127.0.0.1:8000`

## 3. Frontend Setup (React + Vite)

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

## 4. App Flow

1. Signup on `/signup`
2. Login on `/login`
3. After login, user is redirected to `/cart`
4. Cart page supports add, read, update, delete items

## API Endpoints

Auth:
- `POST /auth/signup`
- `POST /auth/login`

Cart:
- `POST /cart/{user_id}`
- `GET /cart/{user_id}`
- `PUT /cart/{user_id}/{item_id}`
- `DELETE /cart/{user_id}/{item_id}`
