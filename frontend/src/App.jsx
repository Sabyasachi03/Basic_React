import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "@/router";

function App() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-600" />
            <p className="text-sm font-medium text-slate-500 animate-pulse">Loading console...</p>
          </div>
        </div>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;