import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <main className="min-h-screen bg-[linear-gradient(140deg,#ecfeff_0%,#f8fafc_45%,#fef9c3_100%)] px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <Outlet />
      </div>
    </main>
  );
}

export default AuthLayout;