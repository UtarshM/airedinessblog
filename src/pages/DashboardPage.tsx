import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, FileText, Trash2, RefreshCw, Layers, Fingerprint, Lightbulb, ArrowRight } from "lucide-react";
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
        // Auto-provision 50 credits for new users
        const { error: insertError } = await supabase
          .from("workspace_credits" as any)
          .insert({
            user_id: user.id,
            total_credits: 50,
            used_credits: 0,
            locked_credits: 0
          } as any);

        if (!insertError) {
          setCredits({ total: 50, used: 0, remaining: 50 });
        } else {
          console.error("Failed to provision initial credits", insertError);
          setCredits({ total: 0, used: 0, remaining: 0 });
        }
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
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome back to BlogForge</h1>
          <p className="text-muted-foreground text-sm mt-1">Ready to create high-quality, SEO-optimized blog content?</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800 hidden sm:flex px-3 py-1 text-xs">
            {credits?.remaining ?? "—"} Credits
          </Badge>
          <Button variant="default" className="shadow-sm">Quick Tour</Button>
        </div>
      </div>

      {/* Tip of the Day */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-3 text-sm">
        <Lightbulb className="h-5 w-5 text-primary shrink-0" />
        <p><span className="font-semibold text-primary">Pro Tip:</span> <span className="text-muted-foreground">Group related content around pillar topics to establish topical authority before generating posts.</span></p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Create Post */}
        <Link to="/generate" className="p-6 rounded-xl border bg-card hover:shadow-md hover:border-primary/30 transition-all duration-300 group flex flex-col justify-between min-h-[160px]">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-lg">Create Post</h3>
            </div>
            <p className="text-sm text-muted-foreground">Create a single blog post with AI assistance</p>
          </div>
          <div className="flex items-center text-primary text-sm font-medium mt-4 group-hover:underline">
            Get Started <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Bulk Creation */}
        <Link to="/bulk-generate" className="p-6 rounded-xl border bg-card hover:shadow-md hover:border-emerald-500/30 transition-all duration-300 group flex flex-col justify-between min-h-[160px]">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Layers className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-semibold text-lg">Bulk Creation</h3>
            </div>
            <p className="text-sm text-muted-foreground">Generate multiple blog posts in one go</p>
          </div>
          <div className="flex items-center text-primary text-sm font-medium mt-4 group-hover:underline">
            Get Started <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Brand Identity */}
        <Link to="/brand-identity" className="p-6 rounded-xl border bg-card hover:shadow-md hover:border-purple-500/30 transition-all duration-300 group flex flex-col justify-between min-h-[160px]">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Fingerprint className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-lg">Brand Identity</h3>
            </div>
            <p className="text-sm text-muted-foreground">Set up your brand voice and style</p>
          </div>
          <div className="flex items-center text-primary text-sm font-medium mt-4 group-hover:underline">
            Configure <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      </div>

      {/* Recent Posts List */}
      <div className="pt-8">
        <h2 className="text-xl font-bold mb-4">Recent Blog Posts</h2>
        {loading ? (
          <SkeletonDashboard />
        ) : items.length === 0 ? (
          <div className="text-center py-16 border rounded-xl bg-card border-dashed">
            <p className="text-muted-foreground mb-4">No blog posts found. Create your first blog post!</p>
            <Button asChild variant="default" className="shadow-sm">
              <Link to="/generate">
                Create Blog Post
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
    </div>
  );
};

export default DashboardPage;
