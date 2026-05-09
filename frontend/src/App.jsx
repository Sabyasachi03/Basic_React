import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import ProtectedRoute from "@/routes/ProtectedRoute";
import { getStoredUser } from "@/services/authService";

function AuthLayout({ children }) {
  return (
    <main className="min-h-screen bg-[linear-gradient(140deg,#ecfeff_0%,#f8fafc_45%,#fef9c3_100%)] px-4 py-12">
      <div className="mx-auto max-w-5xl">{children}</div>
    </main>
  );
}

function RootRedirect() {
  const user = getStoredUser();
  return <Navigate to={user ? "/dashboard" : "/login"} replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route
          path="/login"
          element={
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          }
        />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer position="bottom-right" autoClose={2500} />
    </BrowserRouter>
  );
}

export default App;
