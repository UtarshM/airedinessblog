import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Sparkles,
  Edit,
  Layers,
  List,
  Calendar,
  Fingerprint,
  Settings,
  Settings2,
  LogOut,
  FolderOpen,
  Plus
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "./ui/button";

const AppSidebar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'My';

  const workspaces = [
    { id: "1", name: `${userName}'s Workspace` }
  ];

  const contentLinks = [
    { to: "/generate", label: "Single Post Creation", icon: Edit },
    { to: "/bulk-generate", label: "Bulk Post Creation", icon: Layers },
    { to: "/manage-posts", label: "Manage Blog Posts", icon: List },
    { to: "/calendar", label: "Calendar", icon: Calendar, badge: "New" },
  ];

  const brandLinks = [
    { to: "/brand-identity", label: "Brand Identity", icon: Fingerprint },
  ];

  const marketingLinks = [
    { to: "/integrations", label: "Integrations", icon: Settings },
  ];

  const settingLinks = [
    { to: "/settings", label: "Setting", icon: Settings2 },
  ];

  const renderNavSection = (title: string, links: any[]) => (
    <div className="mb-6">
      <h3 className="px-5 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-2">
        {title}
      </h3>
      <div className="space-y-0.5 px-3">
        {links.map((link) => {
          const active = location.pathname === link.to;
          const Icon = link.icon;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${active
                ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                }`}
            >
              <Icon className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
              {link.label}
              {link.badge && (
                <span className="ml-auto bg-primary/10 text-primary text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full">
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside className="w-64 gradient-sidebar flex flex-col min-h-screen border-r border-sidebar-border">
      <div className="p-4 flex items-center gap-2 border-b border-sidebar-border/50">
        <Link to="/dashboard" className="flex items-center gap-2 group flex-1">
          <div className="bg-primary/10 p-1.5 rounded-lg">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight">BlogForge</span>
        </Link>
      </div>

      <div className="p-4">
        <Button className="w-full flex justify-start gap-2 shadow-sm" size="sm">
          <Plus className="h-4 w-4" />
          Create Workspace
        </Button>
      </div>

      <div className="px-3 mb-6">
        <h3 className="px-2 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-2">
          WORKSPACES
        </h3>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-sidebar-accent/40 text-sidebar-accent-foreground border border-sidebar-border/50">
          <FolderOpen className="h-4 w-4 text-primary" />
          <span className="truncate">{workspaces[0].name}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pt-2 scrollbar-thin">
        {renderNavSection("CONTENT", contentLinks)}
        {renderNavSection("BRAND", brandLinks)}
        {renderNavSection("MARKETING", marketingLinks)}
        {renderNavSection("SETTING", settingLinks)}
      </div>

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
