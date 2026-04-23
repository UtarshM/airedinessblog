import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProjects } from "@/hooks/useProjects";
import { CreateProjectDialog } from "@/components/CreateProjectDialog";
import { useState } from "react";
import {
  Edit,
  Layers,
  List,
  Calendar,
  Fingerprint,
  Settings,
  Settings2,
  LogOut,
  FolderOpen,
  Plus,
  Activity
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "./ui/button";
import { toast } from "sonner";

const AppSidebar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const { projects, canAddProject, currentPlan, projectLimit } = useProjects();
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);

  const contentLinks = [
    { to: "/generate", label: "Single Post Creation", icon: Edit },
    { to: "/bulk-generate", label: "Bulk Post Creation", icon: Layers },
    { to: "/manage-posts", label: "Manage Blog Posts", icon: List },
    { to: "/calendar", label: "Calendar", icon: Calendar, badge: "New" },
    { to: "/aeo-analytics", label: "AEO Analytics", icon: Activity, badge: "Soon" },
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
    <>
      <aside className="w-64 gradient-sidebar flex flex-col min-h-screen border-r border-sidebar-border">
        <div className="p-4 flex items-center gap-2 border-b border-sidebar-border/50">
          <Link to="/dashboard" className="flex items-center group flex-1">
            <img src="/fupilot.webp" alt="FUPilot Logo" className="h-8 w-auto" />
          </Link>
        </div>

        <div className="px-3 py-4 mb-2">
          <div className="flex items-center justify-between px-2 mb-2">
            <h3 className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
              Projects
            </h3>
          </div>
          
          <div className="space-y-1">
            {projects.length === 0 && (
              <div className="px-3 py-2 text-xs text-muted-foreground italic">
                No projects yet.
              </div>
            )}
            {projects.map((project) => (
              <div key={project.id} className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-sidebar-accent/40 text-sidebar-accent-foreground border border-transparent hover:border-sidebar-border/50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">{project.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate">{project.name}</span>
                    <span className="text-[10px] text-muted-foreground truncate">{project.domain}</span>
                  </div>
                </div>
                <Edit className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>

          <div className="mt-3 px-1">
            <Button 
              variant="ghost" 
              className="w-full flex justify-start gap-2 text-sm text-muted-foreground hover:text-foreground h-9 px-2"
              onClick={() => {
                if (canAddProject) {
                  setProjectDialogOpen(true);
                } else {
                  toast.error(`Your ${currentPlan} plan is limited to ${projectLimit} project(s). Please upgrade to add more.`);
                }
              }}
            >
              <Plus className="h-4 w-4" />
              Add Project
            </Button>
            {!canAddProject && (
              <Link to="/pricing" className="block px-2 py-1 text-xs text-primary hover:underline mt-1">
                Upgrade
              </Link>
            )}
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
      <CreateProjectDialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen} />
    </>
  );
};

export default AppSidebar;
