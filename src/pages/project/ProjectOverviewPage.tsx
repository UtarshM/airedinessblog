import { useProject } from "./ProjectLayout";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, Layers, Search, TrendingUp, Bot, Share2 } from "lucide-react";

export function ProjectOverviewPage() {
  const { project } = useProject();

  const tabs = [
    {
      label: "Content Creation",
      icon: FileText,
      color: "blue",
      description: "AI blog posts, keyword research, content calendar.",
      href: "generate",
    },
    {
      label: "Social Media",
      icon: Share2,
      color: "pink",
      description: "Create and schedule social posts and reels.",
      href: "social-posts",
    },
    {
      label: "Performance Ads",
      icon: TrendingUp,
      color: "amber",
      description: "Optimize Meta & Google Ads campaigns.",
      href: "ads/meta",
    },
    {
      label: "SEO Optimization",
      icon: Search,
      color: "emerald",
      description: "Keyword strategy and backlink management.",
      href: "seo/keywords",
    },
    {
      label: "AEO (AI Search)",
      icon: Bot,
      color: "purple",
      description: "AI prompt generation and visibility scoring.",
      href: "aeo/prompt-generation",
    },
    {
      label: "Brand Workspace",
      icon: Layers,
      color: "orange",
      description: "Your brand info, tagline, and competitors.",
      href: "brand",
    },
  ];

  const colorMap: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-500",
    pink: "bg-pink-500/10 text-pink-500",
    amber: "bg-amber-500/10 text-amber-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
    purple: "bg-purple-500/10 text-purple-500",
    orange: "bg-orange-500/10 text-orange-500",
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4 border-b pb-6">
        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-xl font-bold text-primary shrink-0">
          {(project.brand_name || project.name).charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{project.brand_name || project.name}</h1>
          {project.brand_tagline && (
            <p className="text-muted-foreground text-sm mt-0.5">{project.brand_tagline}</p>
          )}
          <a
            href={project.domain}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline mt-1 inline-block"
          >
            {project.domain}
          </a>
        </div>
      </div>

      {/* Brand description */}
      {project.brand_description && (
        <div className="bg-muted/40 border rounded-xl p-4 text-sm text-muted-foreground">
          {project.brand_description}
        </div>
      )}

      {/* Quick access grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Link
                key={tab.label}
                to={tab.href}
                className="p-5 rounded-xl border bg-card hover:shadow-md hover:border-primary/30 transition-all duration-200 group flex flex-col gap-3"
              >
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${colorMap[tab.color]}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{tab.label}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{tab.description}</p>
                </div>
                <div className="flex items-center text-primary text-xs font-medium mt-auto group-hover:underline">
                  Open <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
