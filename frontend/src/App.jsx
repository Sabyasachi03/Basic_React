import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CartPage from "./pages/CartPage";
import "./App.css";

function PrivateRoute({ children }) {
  const user = localStorage.getItem("user");
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <h1>Cart App</h1>
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
    </BrowserRouter>
  );
}

export default App;
