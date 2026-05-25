import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearStoredUser, getStoredUser } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Building2, ChevronDown, Landmark, LayoutDashboard, MapPinned, Navigation } from "lucide-react";

function MasterLayout() {
  const user = getStoredUser();
  const navigate = useNavigate();
  const [masterOpen, setMasterOpen] = useState(true);

  const navClasses = ({ isActive }) =>
    `flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
      isActive
        ? "border-cyan-200 bg-cyan-50 text-cyan-900 shadow-sm"
        : "border-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-50"
    }`;

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 w-72 border-r border-slate-200 bg-white">
        <div className="flex h-full flex-col p-4">
          <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <LayoutDashboard className="h-5 w-5 text-cyan-700" />
            <p className="text-base font-semibold text-slate-900">Master Console</p>
          </div>

          <div className="mb-2 rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700">{user?.name}</div>

          <nav className="space-y-2">
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-left text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
              onClick={() => {
                navigate("/master");
                setMasterOpen((prev) => !prev);
              }}
            >
              <span>MASTER</span>
              <ChevronDown className={`h-4 w-4 transition ${masterOpen ? "rotate-180" : ""}`} />
            </button>

            {masterOpen && (
              <div className="space-y-2 pl-2">
                <NavLink to="/master/country" className={navClasses}>
                  <Landmark className="h-4 w-4" /> Country Master
                </NavLink>
                <NavLink to="/master/state" className={navClasses}>
                  <Building2 className="h-4 w-4" /> State Master
                </NavLink>
                <NavLink to="/master/district" className={navClasses}>
                  <MapPinned className="h-4 w-4" /> District Master
                </NavLink>
                <NavLink to="/master/city" className={navClasses}>
                  <Navigation className="h-4 w-4" /> City Master
                </NavLink>
              </div>
            )}
          </nav>

          <div className="mt-auto">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                clearStoredUser();
                navigate("/login");
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </aside>

      <div className="ml-72 min-h-screen p-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MasterLayout;
