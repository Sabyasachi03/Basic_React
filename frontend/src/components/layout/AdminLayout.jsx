import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearStoredUser, getStoredUser } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Building2, Landmark, LayoutDashboard, MapPinned } from "lucide-react";

function AdminLayout() {
  const navigate = useNavigate();
  const user = getStoredUser();

  const handleLogout = () => {
    clearStoredUser();
    navigate("/login");
  };

  const navClasses = ({ isActive }) =>
    `flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
      isActive
        ? "border-cyan-200 bg-cyan-50 text-cyan-900 shadow-sm"
        : "border-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-50"
    }`;

  return (
    <div className="min-h-screen bg-[linear-gradient(145deg,#f8fafc_0%,#eef2ff_55%,#ecfeff_100%)]">
      <header className="border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <LayoutDashboard className="h-5 w-5 text-cyan-700" />
            Master Management
          </h1>
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-sm text-slate-600">{user?.name}</span>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-4 p-4 lg:grid-cols-[260px_1fr]">
        <aside className="sticky top-20 h-[calc(100vh-6.5rem)] rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm">
          <div className="mb-4 border-b border-slate-100 pb-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Navigation</p>
            <p className="mt-1 text-sm text-slate-600">Master Modules</p>
          </div>

          <nav className="space-y-2">
            <NavLink to="/dashboard/countries" className={navClasses}>
              <Landmark className="h-4 w-4" />
              Country Master
            </NavLink>
            <NavLink to="/dashboard/states" className={navClasses}>
              <Building2 className="h-4 w-4" />
              State Master
            </NavLink>
            <NavLink to="/dashboard/districts" className={navClasses}>
              <MapPinned className="h-4 w-4" />
              District Master
            </NavLink>
          </nav>
        </aside>

        <main>
          <div className="min-h-[70vh] rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
export default AdminLayout;