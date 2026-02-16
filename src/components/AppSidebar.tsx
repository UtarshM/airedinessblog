import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles, FileText, PlusCircle, LogOut, Settings, Settings2, BarChart3 } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const AppSidebar = () => {
  const { signOut } = useAuth();
  const location = useLocation();

  const links = [
    { to: "/dashboard", label: "My Content", icon: FileText },
    { to: "/generate", label: "New Blog", icon: PlusCircle },
    { to: "/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/integrations", label: "Integrations", icon: Settings },
    { to: "/settings", label: "Settings", icon: Settings2 },
  ];

  return (
    <aside className="w-64 gradient-sidebar flex flex-col min-h-screen border-r border-sidebar-border">
      <div className="p-6">
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="relative">
            <Sparkles className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-lg font-bold text-sidebar-primary-foreground">BlogForge</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {links.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${active
                ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground hover:translate-x-0.5"
                }`}
            >
              <Icon className={`h-4 w-4 transition-colors ${active ? "text-primary" : ""}`} />
              {label}
              {active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse-gentle" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 space-y-1 border-t border-sidebar-border">
        <ThemeToggle />
        <button
          onClick={signOut}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
