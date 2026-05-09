# Full Stack Admin Dashboard (React + FastAPI + PostgreSQL)

This repository contains a full-stack admin dashboard application.

- Frontend: React (Vite), React Router, Tailwind CSS, React Hook Form, Zod, Axios
- Backend: FastAPI, SQLAlchemy
- Database: PostgreSQL

## Current Features

- Login-only authentication (`/login`)
- Protected dashboard route (`/dashboard`)
- Dashboard layout with header, sidebar, and main content
- Country Master CRUD
- Country-specific cart CRUD
- Cart fields: cart name, budget, country, created date, updated date
- Activities log for API operations (method, endpoint, payload, response, status, timestamp)
- Clear activity logs per selected country

## Project Structure

```text
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
      components/
      constants/
      pages/
      routes/
      services/
      App.jsx
      main.jsx
```

## 1. PostgreSQL Setup

Create database:

```sql
CREATE DATABASE cart_app;
```

Default DB config is in `backend/app/database.py`:

```python
DATABASE_URL = "postgresql+psycopg2://postgres:postgres@localhost:5432/cart_app"
```

Update credentials if needed.

## 2. Backend Setup (FastAPI)

```bash
cd backend
python -m venv venv
```

Activate venv (PowerShell):

```bash
.\venv\Scripts\Activate.ps1
```

Install dependencies and run:

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend URL: `http://127.0.0.1:8000`

## 3. Frontend Setup (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

## 4. Routes

- `/login` - login page
- `/dashboard` - protected admin dashboard

## API Endpoints

### Auth

- `POST /auth/signup` (still available in backend API)
- `POST /auth/login`

### Dashboard

- `GET /dashboard/{user_id}/countries`
- `POST /dashboard/{user_id}/countries`
- `PUT /dashboard/{user_id}/countries/{country_id}`
- `DELETE /dashboard/{user_id}/countries/{country_id}`

- `GET /dashboard/{user_id}/countries/{country_id}/carts`
- `POST /dashboard/{user_id}/countries/{country_id}/carts`
- `GET /dashboard/{user_id}/countries/{country_id}/carts/{cart_id}`
- `PUT /dashboard/{user_id}/countries/{country_id}/carts/{cart_id}`
- `DELETE /dashboard/{user_id}/countries/{country_id}/carts/{cart_id}`

- `GET /dashboard/{user_id}/activities?country_id={country_id}`
- `DELETE /dashboard/{user_id}/activities?country_id={country_id}`