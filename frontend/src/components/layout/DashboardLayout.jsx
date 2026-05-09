import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

function DashboardLayout({ headerProps, sidebarProps, children }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#ecfeff_0,#f8fafc_45%,#fefce8_100%)]">
      <Header {...headerProps} />

      <div className="mx-auto grid max-w-[1400px] gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[280px_1fr]">
        <Sidebar {...sidebarProps} />
        <main>{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;