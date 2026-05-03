import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { generatePollinationsImageUrl, generateHighQualityImage, PostIdea } from "@/lib/social";
import {
  Instagram, Facebook, Linkedin, X, Calendar, Send, FileText,
  RefreshCw, Loader2, Hash, ImageIcon, Sparkles, Clock
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const PLATFORMS = [
  { id: "instagram", label: "Instagram", icon: Instagram, color: "from-pink-500 to-purple-600" },
  { id: "facebook", label: "Facebook", icon: Facebook, color: "from-blue-600 to-blue-700" },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin, color: "from-blue-500 to-blue-600" },
];

const POST_TYPES: Record<string, { label: string; color: string }> = {
  educational: { label: "Educational", color: "bg-blue-500/10 text-blue-400" },
  promotional: { label: "Promotional", color: "bg-amber-500/10 text-amber-400" },
  engagement: { label: "Engagement", color: "bg-pink-500/10 text-pink-400" },
  story: { label: "Story", color: "bg-purple-500/10 text-purple-400" },
  product: { label: "Product", color: "bg-emerald-500/10 text-emerald-400" },
};

interface SocialPostEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  idea?: PostIdea | null;
  existingPost?: any | null;
  onSaved: () => void;
}

export function SocialPostEditor({ open, onOpenChange, projectId, idea, existingPost, onSaved }: SocialPostEditorProps) {
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [scheduledAt, setScheduledAt] = useState("");
  const [saving, setSaving] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);

  useEffect(() => {
    if (idea) {
      setCaption(idea.caption);
      setHashtags(idea.hashtags || []);
      setImagePrompt(idea.imagePrompt || "");
      setImageUrl("");
    } else if (existingPost) {
      setCaption(existingPost.caption);
      setHashtags(existingPost.hashtags || []);
      setImagePrompt(existingPost.image_prompt || "");
      setImageUrl(existingPost.image_url || "");
      setPlatform(existingPost.platform || "instagram");
      setScheduledAt(existingPost.scheduled_at ? format(new Date(existingPost.scheduled_at), "yyyy-MM-dd'T'HH:mm") : "");
    }
  }, [idea, existingPost, open]);

  const handleGenerateImage = async () => {
    if (!imagePrompt) {
      toast.error("Add an image prompt first");
      return;
    }
    setGeneratingImage(true);
    try {
      const url = await generateHighQualityImage(imagePrompt);
      setImageUrl(url);
      toast.success("High-quality image generated!");
    } catch (e) {
      console.error("Fireworks failed, falling back to Pollinations:", e);
      const url = generatePollinationsImageUrl(imagePrompt);
      setImageUrl(url);
      toast.info("Generated via fallback engine");
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleAddHashtag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const tag = hashtagInput.replace(/#/g, "").trim();
      if (tag && !hashtags.includes(tag)) {
        setHashtags([...hashtags, tag]);
      }
      setHashtagInput("");
    }
  };

  const handleSave = async (status: "draft" | "scheduled" | "published") => {
    if (!caption.trim()) { toast.error("Caption is required"); return; }
    if (status === "scheduled" && !scheduledAt) { toast.error("Set a schedule date/time"); return; }
    setSaving(true);
    try {
      const payload: any = {
        project_id: projectId,
        platform,
        caption: caption.trim(),
        hashtags,
        image_prompt: imagePrompt,
        image_url: imageUrl,
        status,
        scheduled_at: status === "scheduled" ? new Date(scheduledAt).toISOString() : null,
      };

      if (existingPost?.id) {
        const { error } = await supabase.from("social_posts").update(payload).eq("id", existingPost.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("social_posts").insert([payload]);
        if (error) throw error;
      }

      toast.success(status === "draft" ? "Saved as draft!" : status === "scheduled" ? "Post scheduled! 🗓️" : "Published! 🎉");
      onSaved();
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e.message || "Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  const fullCaption = caption + (hashtags.length > 0 ? "\n\n" + hashtags.map(h => `#${h}`).join(" ") : "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0 bg-card border-line shadow-lg">
        <DialogHeader className="px-6 py-4 border-b border-line flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-lg font-bold">
                {existingPost ? "Edit Post" : "Create Instagram Post"}
              </DialogTitle>
              {idea && (
                <Badge className={cn("text-xs", POST_TYPES[idea.type]?.color || "bg-muted text-muted-foreground")}>
                  {POST_TYPES[idea.type]?.label || idea.type}
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Left: Editor */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 border-r border-line">
            {/* Platform */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">Platform</Label>
              <div className="flex gap-2">
                {PLATFORMS.map((p) => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setPlatform(p.id)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition-all",
                        platform === p.id
                          ? `bg-primary text-primary-foreground shadow-sm border-transparent`
                          : "border-input text-muted-foreground hover:border-line hover:bg-muted/50"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" /> {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hook */}
            {idea?.hook && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-3">
                <p className="text-xs text-primary font-semibold mb-1 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" /> Hook
                </p>
                <p className="text-sm font-bold">{idea.hook}</p>
              </div>
            )}

            {/* Caption */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">Caption</Label>
              <Textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write your caption..."
                rows={6}
                className="bg-muted/50 border-input resize-none text-sm"
              />
              <p className="text-xs text-muted-foreground text-right">{caption.length} chars</p>
            </div>

            {/* Hashtags */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Hash className="h-3.5 w-3.5" /> Hashtags
              </Label>
              <div className="flex flex-wrap gap-1.5 p-3 rounded-lg bg-muted/50 border border-input min-h-[60px]">
                {hashtags.map((tag) => (
                  <span
                    key={tag}
                    onClick={() => setHashtags(hashtags.filter((h) => h !== tag))}
                    className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs cursor-pointer hover:bg-red-500/20 hover:text-red-400 transition-colors"
                  >
                    #{tag} ×
                  </span>
                ))}
                <input
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  onKeyDown={handleAddHashtag}
                  placeholder="Type hashtag, press Enter..."
                  className="flex-1 min-w-[120px] bg-transparent text-xs outline-none text-muted-foreground placeholder:text-muted-foreground/50"
                />
              </div>
              <p className="text-xs text-muted-foreground">{hashtags.length}/30 hashtags • Click a tag to remove it</p>
            </div>

            {/* Image Prompt */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="h-3.5 w-3.5" /> Image Prompt
              </Label>
              <div className="flex gap-2">
                <Input
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  placeholder="Describe the image for AI generation..."
                  className="bg-muted/50 border-input text-sm"
                />
                <Button
                  onClick={handleGenerateImage}
                  disabled={!imagePrompt || generatingImage}
                  size="sm"
                  variant="outline"
                  className="shrink-0 border-primary/30 text-primary hover:bg-primary/5"
                >
                  {generatingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Schedule */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> Schedule Date & Time
              </Label>
              <Input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="bg-muted/50 border-input text-sm"
              />
            </div>
          </div>

          {/* Right: Preview */}
          <div className="w-72 flex-shrink-0 p-5 overflow-y-auto space-y-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Preview</p>

            {/* Instagram mock */}
            <div className="rounded-xl border border-line bg-card shadow-sm overflow-hidden">
              {/* Image */}
              <div className="aspect-square bg-muted/30 flex items-center justify-center relative overflow-hidden">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Post preview"
                    className="w-full h-full object-cover"
                    onError={() => setImageUrl("")}
                  />
                ) : (
                  <div className="text-center text-muted-foreground/40 p-4">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-30" />
                    <p className="text-xs">Generate image above</p>
                  </div>
                )}
              </div>

              {/* Caption preview */}
              <div className="p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20" />
                  <span className="text-xs font-bold">your_brand</span>
                </div>
                <p className="text-xs text-foreground leading-relaxed line-clamp-4">
                  {fullCaption || "Your caption will appear here..."}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <Button
                className="w-full shadow-sm"
                onClick={() => handleSave("scheduled")}
                disabled={saving}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Post
              </Button>
              <Button
                variant="outline"
                className="w-full border-input text-muted-foreground hover:bg-muted"
                onClick={() => handleSave("draft")}
                disabled={saving}
              >
                <FileText className="h-4 w-4 mr-2" />
                Save as Draft
              </Button>
              <Button
                variant="outline"
                className="w-full border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
                onClick={() => handleSave("published")}
                disabled={saving}
              >
                <Send className="h-4 w-4 mr-2" />
                Mark as Published
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
