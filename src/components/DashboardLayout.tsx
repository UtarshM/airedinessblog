import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen relative overflow-hidden bg-bg">
      {/* Background Glows & Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute left-[-10%] top-[10%] w-[560px] h-[560px] rounded-full bg-[radial-gradient(circle,rgba(144,37,242,0.12)_0,transparent_65%)] blur-[20px] dark:opacity-50"></div>
        <div className="absolute right-[-10%] top-[30%] w-[620px] h-[620px] rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.1)_0,transparent_65%)] blur-[20px] dark:opacity-50"></div>
        <div className="absolute left-[30%] bottom-[-20%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.08)_0,transparent_65%)] blur-[20px] dark:opacity-50"></div>
        
        {/* SVG Radial Grid */}
        <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1700px] h-[1700px] opacity-5 dark:opacity-10" viewBox="-400 -400 800 800" fill="none" stroke="#9025F2" strokeWidth="0.6">
          <g id="spokes">
            <line x1="0" y1="0" x2="0" y2="-380" />
            <line x1="0" y1="0" x2="98" y2="-367" />
            <line x1="0" y1="0" x2="190" y2="-329" />
            <line x1="0" y1="0" x2="269" y2="-269" />
            <line x1="0" y1="0" x2="329" y2="-190" />
            <line x1="0" y1="0" x2="367" y2="-98" />
            <line x1="0" y1="0" x2="380" y2="0" />
            <line x1="0" y1="0" x2="367" y2="98" />
            <line x1="0" y1="0" x2="329" y2="190" />
            <line x1="0" y1="0" x2="269" y2="269" />
            <line x1="0" y1="0" x2="190" y2="329" />
            <line x1="0" y1="0" x2="98" y2="367" />
            <line x1="0" y1="0" x2="0" y2="380" />
            <line x1="0" y1="0" x2="-98" y2="367" />
            <line x1="0" y1="0" x2="-190" y2="329" />
            <line x1="0" y1="0" x2="-269" y2="269" />
            <line x1="0" y1="0" x2="-329" y2="190" />
            <line x1="0" y1="0" x2="-367" y2="98" />
            <line x1="0" y1="0" x2="-380" y2="0" />
            <line x1="0" y1="0" x2="-367" y2="-98" />
            <line x1="0" y1="0" x2="-329" y2="-190" />
            <line x1="0" y1="0" x2="-269" y2="-269" />
            <line x1="0" y1="0" x2="-190" y2="-329" />
            <line x1="0" y1="0" x2="-98" y2="-367" />
          </g>
          <circle cx="0" cy="0" r="60" strokeWidth="0.5" />
          <circle cx="0" cy="0" r="110" strokeWidth="0.5" />
          <circle cx="0" cy="0" r="170" strokeWidth="0.5" />
          <circle cx="0" cy="0" r="240" strokeWidth="0.5" />
          <circle cx="0" cy="0" r="310" strokeWidth="0.5" />
          <circle cx="0" cy="0" r="380" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="flex w-full z-10 relative">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
