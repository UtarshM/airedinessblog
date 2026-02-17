import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, FileText, Trash2, TrendingUp, Zap, BookOpen, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { SkeletonDashboard } from "@/components/SkeletonCard";

interface ContentItem {
  id: string;
  main_keyword: string;
  h1: string;
  status: string;
  word_count_target: number;
  generated_title: string | null;
  created_at: string;
  sections_completed: number | null;
  total_sections: number | null;
}

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  draft: { bg: "bg-muted", text: "text-muted-foreground", dot: "bg-muted-foreground" },
  generating: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", dot: "bg-amber-500 animate-pulse" },
  completed: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500" },
  failed: { bg: "bg-red-500/10", text: "text-red-600 dark:text-red-400", dot: "bg-red-500" },
  published: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", dot: "bg-blue-500" },
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState<{ total: number; used: number; remaining: number } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const { data: contentData } = await supabase
      .from("content_items")
      .select("id, main_keyword, h1, status, word_count_target, generated_title, created_at, sections_completed, total_sections")
      .order("created_at", { ascending: false });

    setItems(contentData || []);

    if (user) {
      const { data: creditData } = await (supabase
        .from("workspace_credits" as any)
        .select("total_credits, used_credits, locked_credits")
        .eq("user_id", user.id)
        .single() as any);

      if (creditData) {
        setCredits({
          total: creditData.total_credits,
          used: creditData.used_credits,
          remaining: creditData.total_credits - creditData.used_credits - creditData.locked_credits
        });
      } else {
        setCredits({ total: 50, used: 5, remaining: 45 });
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const channel = supabase
      .channel("dashboard-updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "content_items" }, fetchData)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("content_items").delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else {
      setItems(prev => prev.filter(i => i.id !== id));
      toast.success("Deleted");
    }
  };

  const handleRetry = async (id: string) => {
    try {
      // Reset the content item
      const { error: updateError } = await supabase.from("content_items").update({
        status: "generating",
        sections_completed: 0,
        total_sections: null,
        current_section: null,
        generated_content: null,
        generated_title: null,
      }).eq("id", id);

      if (updateError) throw updateError;

      // Re-trigger generation
      supabase.functions.invoke("generate-blog", {
        body: { contentId: id },
      }).catch((err: any) => console.error("Retry invoke error:", err));

      toast.success("Retrying generation...");
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to retry");
    }
  };

  const completedCount = items.filter(i => i.status === "completed" || i.status === "published").length;
  const totalWords = items.reduce((sum, i) => sum + i.word_count_target, 0);

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">My Content</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your SEO blog posts</p>
        </div>
        <Button asChild className="shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
          <Link to="/generate">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Blog
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded-xl border bg-card hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{items.length}</p>
              <p className="text-xs text-muted-foreground">Total Posts</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl border bg-card hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completedCount}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl border bg-card hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{credits?.remaining ?? "—"}<span className="text-sm font-normal text-muted-foreground">/{credits?.total ?? "—"}</span></p>
              <p className="text-xs text-muted-foreground">Credits Left</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content List */}
      {loading ? (
        <SkeletonDashboard />
      ) : items.length === 0 ? (
        <div className="text-center py-20 border border-dashed rounded-xl bg-card/50">
          <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <h3 className="font-semibold mb-1">No content yet</h3>
          <p className="text-sm text-muted-foreground mb-4">Generate your first SEO blog post</p>
          <Button asChild size="sm">
            <Link to="/generate">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Blog
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => {
            const status = statusConfig[item.status] || statusConfig.draft;
            return (
              <Link
                key={item.id}
                to={`/content/${item.id}`}
                className="flex items-center justify-between p-4 rounded-xl border bg-card hover:shadow-md hover:border-primary/20 transition-all duration-300 group animate-slide-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                      {item.generated_title || item.h1}
                    </h3>
                    <Badge variant="secondary" className={`${status.bg} ${status.text} gap-1.5`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                      {item.status === "generating"
                        ? `Generating ${item.sections_completed || 0}/${item.total_sections || "?"}`
                        : item.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {item.main_keyword} · {item.word_count_target.toLocaleString()} words · {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {(item.status === "generating" || item.status === "failed") && (
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRetry(item.id); }}
                      className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-primary transition-all rounded-lg hover:bg-primary/10"
                      title="Retry generation"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(item.id); }}
                    className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-destructive transition-all rounded-lg hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
