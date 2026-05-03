import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-bg text-ink">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
