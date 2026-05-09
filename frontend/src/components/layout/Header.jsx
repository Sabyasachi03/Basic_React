import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

function Header({ userName, onLogout }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-6">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-700">Admin Console</p>
          <h1 className="text-lg font-bold text-slate-900 sm:text-xl">Country Cart Dashboard</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 sm:block">
            <p className="text-xs text-slate-500">Logged in as</p>
            <p className="text-sm font-semibold text-slate-800">{userName}</p>
          </div>

          <Button variant="outline" onClick={onLogout}>
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Header;