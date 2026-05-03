import { useState, useEffect } from "react";
import { useProject } from "./ProjectLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SocialPostEditor } from "@/components/SocialPostEditor";
import {
  fetchInstagramProfile,
  generatePostIdeas,
  generatePollinationsImageUrl,
  InstagramProfile,
  PostIdea,
} from "@/lib/social";
import {
  Instagram, Loader2, Sparkles, RefreshCw, Plus, Users,
  BookOpen, BarChart2, Image as ImageIcon, ArrowRight, Link2, Edit2, Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const TYPE_COLORS: Record<string, string> = {
  educational: "border-blue-500/30 bg-blue-500/5",
  promotional: "border-amber-500/30 bg-amber-500/5",
  engagement: "border-pink-500/30 bg-pink-500/5",
  story: "border-purple-500/30 bg-purple-500/5",
  product: "border-emerald-500/30 bg-emerald-500/5",
};

const TYPE_BADGE: Record<string, string> = {
  educational: "bg-blue-500/10 text-blue-400",
  promotional: "bg-amber-500/10 text-amber-400",
  engagement: "bg-pink-500/10 text-pink-400",
  story: "bg-purple-500/10 text-purple-400",
  product: "bg-emerald-500/10 text-emerald-400",
};

export function SocialPostsPage() {
  const { project } = useProject();
  const qc = useQueryClient();

  // Step: "dashboard" | "connect" | "scanning" | "ideas"
  const [step, setStep] = useState<"dashboard" | "connect" | "scanning" | "ideas">("dashboard");
  const [igInput, setIgInput] = useState("");
  const [profile, setProfile] = useState<InstagramProfile | null>(null);
  const [ideas, setIdeas] = useState<PostIdea[]>([]);
  const [generatingIdeas, setGeneratingIdeas] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<PostIdea | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editPost, setEditPost] = useState<any | null>(null);

  // Load connected account from DB
  const { data: savedAccount } = useQuery({
    queryKey: ["social_account", project.id, "instagram"],
    queryFn: async () => {
      const { data } = await supabase
        .from("social_accounts" as any)
        .select("*")
        .eq("project_id", project.id)
        .eq("platform", "instagram")
        .maybeSingle();
      return data as any;
    },
  });

  // Load saved posts
  const { data: savedPosts = [], refetch: refetchPosts } = useQuery({
    queryKey: ["social_posts", project.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("social_posts" as any)
        .select("*")
        .eq("project_id", project.id)
        .order("created_at", { ascending: false });
      return (data || []) as any[];
    },
  });

  useEffect(() => {
    if (savedAccount) {
      setProfile({
        handle: savedAccount.handle,
        fullName: savedAccount.handle,
        bio: savedAccount.bio || "",
        profilePicUrl: savedAccount.profile_pic_url || "",
        followersCount: savedAccount.followers_count || "—",
        postsCount: savedAccount.posts_count || "—",
        isPrivate: false,
        recentCaptions: savedAccount.recent_captions || [],
        recentHashtags: savedAccount.recent_hashtags || [],
      });
      setStep("dashboard");
    }
  }, [savedAccount]);

  const handleConnect = async () => {
    if (!igInput.trim()) return;
    setStep("scanning");
    const fetched = await fetchInstagramProfile(igInput.trim());
    setProfile(fetched);

    // Save to DB
    await supabase.from("social_accounts" as any).upsert({
      project_id: project.id,
      platform: "instagram",
      handle: fetched.handle,
      profile_pic_url: fetched.profilePicUrl,
      bio: fetched.bio,
      followers_count: fetched.followersCount,
      posts_count: fetched.postsCount,
      recent_captions: fetched.recentCaptions,
      recent_hashtags: fetched.recentHashtags,
    } as any, { onConflict: "project_id,platform" });

    qc.invalidateQueries({ queryKey: ["social_account", project.id, "instagram"] });
    setStep("dashboard");
  };

  const handleGenerateIdeas = async () => {
    setGeneratingIdeas(true);
    setStep("ideas");
    const generated = await generatePostIdeas({
      brandName: project.brand_name || project.name,
      brandDescription: project.brand_description || "",
      instagramBio: profile?.bio || "",
      recentCaptions: profile?.recentCaptions || [],
      recentHashtags: profile?.recentHashtags || [],
    });
    setIdeas(generated);
    setGeneratingIdeas(false);
  };

  const handleDeletePost = async (id: string) => {
    await supabase.from("social_posts" as any).delete().eq("id", id);
    refetchPosts();
    toast.success("Post deleted");
  };

  // ── STEP: Connect Instagram ──────────────────────────────────────────────
  if (step === "connect") {
    return (
      <div className="p-8 max-w-xl mx-auto flex flex-col items-center justify-center min-h-[500px] text-center">
        <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
          <Instagram className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Connect Your Instagram</h1>
        <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
          Enter your Instagram handle or profile URL. Our AI will scan your profile and generate optimized post ideas tailored to your brand.
        </p>
        <div className="w-full space-y-3">
          <div className="flex gap-2">
            <div className="flex items-center px-3 rounded-l-lg border border-r-0 border-input bg-muted/50 text-muted-foreground text-sm">
              @
            </div>
            <Input
              value={igInput}
              onChange={(e) => setIgInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConnect()}
              placeholder="yourbrand or instagram.com/yourbrand"
              className="rounded-l-none text-sm"
            />
          </div>
          <Button
            className="w-full shadow-sm"
            onClick={handleConnect}
            disabled={!igInput.trim()}
          >
            <Link2 className="h-4 w-4 mr-2" /> Connect & Scan Profile
          </Button>
        </div>
      </div>
    );
  }

  // ── STEP: Scanning ───────────────────────────────────────────────────────
  if (step === "scanning") {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[500px] text-center">
        <div className="relative h-20 w-20 mb-6">
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" />
          <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
          </div>
        </div>
        <h2 className="text-xl font-bold mb-2">Scanning Instagram Profile...</h2>
        <p className="text-muted-foreground text-sm">
          Fetching your bio, post history, hashtags, and content patterns.
        </p>
      </div>
    );
  }

  // ── STEP: Dashboard (profile connected) ─────────────────────────────────
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line pb-4">
        <div>
          <h1 className="text-2xl font-bold">Social Media Posts</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Create and schedule Instagram content with AI</p>
        </div>
        <div className="flex gap-3">
          {profile ? (
            <Button
              variant="outline"
              size="sm"
              className="text-muted-foreground"
              onClick={() => { setStep("connect"); setIgInput(""); }}
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Change Account
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="text-muted-foreground"
              onClick={() => { setStep("connect"); setIgInput(""); }}
            >
              <Instagram className="h-3.5 w-3.5 mr-1.5" /> Connect Instagram
            </Button>
          )}
          <Button
            size="sm"
            className="shadow-sm"
            onClick={() => { setSelectedIdea(null); setEditPost(null); setEditorOpen(true); }}
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" /> New Post
          </Button>
        </div>
      </div>

      {/* Instagram Profile Card OR Default Generate Card */}
      {profile ? (
        <div className="rounded-xl border border-line bg-card shadow-sm p-5 flex items-start gap-5">
          <div className="relative shrink-0">
            {profile.profilePicUrl ? (
              <img
                src={profile.profilePicUrl}
                alt={profile.handle}
                className="h-16 w-16 rounded-full object-cover border border-line"
                onError={(e: any) => { e.target.style.display = "none"; }}
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                {profile.handle.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center border-2 border-card">
              <Instagram className="h-2.5 w-2.5 text-primary-foreground" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold">@{profile.handle}</h3>
              <Badge className="bg-green-500/10 text-green-400 text-xs">Connected</Badge>
            </div>
            {profile.bio && <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{profile.bio}</p>}
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span><strong className="text-foreground">{profile.followersCount}</strong> Followers</span>
              <span><strong className="text-foreground">{profile.postsCount}</strong> Posts</span>
              {profile.recentHashtags.length > 0 && (
                <span><strong className="text-foreground">{profile.recentHashtags.length}</strong> Hashtags found</span>
              )}
            </div>
          </div>
          <Button
            className="shrink-0 shadow-sm"
            onClick={handleGenerateIdeas}
            disabled={generatingIdeas}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Post Ideas
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border border-line bg-card shadow-sm p-6 flex flex-col sm:flex-row items-center gap-5 justify-between">
          <div>
            <h3 className="font-bold text-lg mb-1">Generate AI Post Ideas</h3>
            <p className="text-sm text-muted-foreground">
              Create engaging content based on your project's brand name and description. Connect your Instagram for personalized suggestions.
            </p>
          </div>
          <Button
            className="shrink-0 shadow-sm"
            onClick={handleGenerateIdeas}
            disabled={generatingIdeas}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Ideas
          </Button>
        </div>
      )}

      {/* AI Post Ideas */}
      {step === "ideas" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> AI Post Ideas
            </h2>
            <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={handleGenerateIdeas}>
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Regenerate
            </Button>
          </div>

          {generatingIdeas ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="h-40 rounded-xl border border-line bg-card shadow-sm animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ideas.map((idea) => (
                <div
                  key={idea.id}
                  onClick={() => { setSelectedIdea(idea); setEditPost(null); setEditorOpen(true); }}
                  className={cn(
                    "p-5 rounded-xl border cursor-pointer transition-all hover:shadow-md bg-card shadow-sm group",
                    TYPE_COLORS[idea.type] || "border-line"
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <Badge className={cn("text-xs capitalize", TYPE_BADGE[idea.type] || "bg-muted text-muted-foreground")}>
                      {idea.type}
                    </Badge>
                    <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      Use this <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                  <p className="text-sm font-semibold mb-2 line-clamp-1">{idea.hook}</p>
                  <p className="text-xs text-muted-foreground line-clamp-3 mb-3">{idea.caption}</p>
                  <div className="flex flex-wrap gap-1">
                    {idea.hashtags.slice(0, 4).map(h => (
                      <span key={h} className="text-[10px] text-muted-foreground/60">#{h}</span>
                    ))}
                    {idea.hashtags.length > 4 && (
                      <span className="text-[10px] text-muted-foreground/40">+{idea.hashtags.length - 4} more</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Saved Posts */}
      {savedPosts.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-4">Your Posts</h2>
          <div className="space-y-2">
            {savedPosts.map((post: any) => (
              <div
                key={post.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-line bg-card shadow-sm group hover:border-primary/20 transition-all"
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-muted/50 border border-line">
                  {post.image_url ? (
                    <img src={post.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{post.caption}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={cn("text-xs",
                      post.status === "scheduled" ? "bg-blue-500/10 text-blue-400" :
                      post.status === "published" ? "bg-green-500/10 text-green-400" :
                      "bg-muted/50 text-muted-foreground"
                    )}>
                      {post.status}
                    </Badge>
                    {post.scheduled_at && (
                      <span className="text-xs text-muted-foreground">
                        {new Date(post.scheduled_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">{post.hashtags?.length || 0} hashtags</span>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => { setEditPost(post); setSelectedIdea(null); setEditorOpen(true); }}
                    className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state when dashboard but no posts/ideas */}
      {step === "dashboard" && savedPosts.length === 0 && (
        <div className="text-center py-12 border border-dashed border-line rounded-xl bg-card shadow-sm">
          <Sparkles className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
          <p className="text-muted-foreground text-sm mb-4">Ready to create your first post?</p>
          <Button
            className="shadow-sm"
            onClick={handleGenerateIdeas}
          >
            <Sparkles className="h-4 w-4 mr-2" /> Generate Post Ideas with AI
          </Button>
        </div>
      )}

      {/* Post Editor Dialog */}
      <SocialPostEditor
        open={editorOpen}
        onOpenChange={setEditorOpen}
        projectId={project.id}
        idea={selectedIdea}
        existingPost={editPost}
        onSaved={() => { refetchPosts(); setStep("dashboard"); }}
      />
    </div>
  );
}
