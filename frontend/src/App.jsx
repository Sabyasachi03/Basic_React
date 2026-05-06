import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CartPage from "./pages/CartPage";

function PrivateRoute({ children }) {
  const user = localStorage.getItem("user");
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <main className="min-h-screen px-4 py-10">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Cart App</h1>
            <p className="mt-2 text-sm text-slate-600">
              Beginner-friendly full-stack app with React, FastAPI, and PostgreSQL.
            </p>
          </div>

          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/cart"
              element={
                <PrivateRoute>
                  <CartPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </main>

      <ToastContainer position="bottom-right" autoClose={2500} />
    </BrowserRouter>
  );
}

export default App;
