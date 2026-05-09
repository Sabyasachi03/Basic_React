# Frontend (React + Vite)

Frontend for the Admin Dashboard app.

## Stack

- React + Vite
- React Router
- Tailwind CSS
- React Hook Form + Zod
- Axios
- React Toastify

## Run Locally

```bash
npm install
npm run dev
```

App URL: `http://localhost:5173`

## Pages

- `/login` - authentication page
- `/dashboard` - protected admin dashboard

## Notes

- Dashboard data is loaded from backend APIs (FastAPI + PostgreSQL).
- Login stores authenticated user in local storage for route protection.