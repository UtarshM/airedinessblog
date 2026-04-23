import { useState } from "react";
import { useProject } from "./ProjectLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ImageIcon, Loader2, Sparkles, Download, Save, RefreshCw, Send } from "lucide-react";
import { generatePollinationsImageUrl } from "@/lib/social";
import { SocialPostEditor } from "@/components/SocialPostEditor";

export function SocialImageGenerationPage() {
  const { project } = useProject();
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [refining, setRefining] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);

  const handleRefinePrompt = async () => {
    if (!prompt.trim()) {
      toast.error("Enter a simple prompt first to refine it");
      return;
    }
    setRefining(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-social-post", {
        body: { 
          refineOnly: true, 
          prompt, 
          brandName: project.brand_name || project.name,
          brandDescription: project.brand_description || "" 
        },
      });
      if (error) throw error;
      if (data && data.refinedPrompt) {
        setPrompt(data.refinedPrompt);
        toast.success("Prompt refined with AI!");
      }
    } catch (e: any) {
      toast.error("Refinement failed: " + e.message);
    } finally {
      setRefining(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter an image prompt");
      return;
    }
    
    setGenerating(true);
    try {
      // Small artificial delay to show loading state nicely
      await new Promise(resolve => setTimeout(resolve, 1000));
      const url = generatePollinationsImageUrl(prompt.trim());
      setImageUrl(url);
      toast.success("Image generated successfully!");
    } catch (e: any) {
      toast.error("Failed to generate image: " + e.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!imageUrl) return;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `social-image-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to download image");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ImageIcon className="h-6 w-6 text-pink-500" /> AI Image Generation
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Create stunning visuals for your social media posts instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Input */}
        <div className="space-y-6">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
            <div>
              <Label className="text-sm font-semibold flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-neon-blue" /> Describe your image
              </Label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. A modern office setup with a neon glowing laptop, cinematic lighting, photorealistic, 4k..."
                rows={5}
                className="bg-black/20 border-white/10 resize-none"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10 h-12"
                onClick={handleRefinePrompt}
                disabled={!prompt.trim() || refining}
              >
                {refining ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Refining...</>
                ) : (
                  <><Sparkles className="h-4 w-4 mr-2" /> AI Refine Prompt</>
                )}
              </Button>
              <Button
                className="flex-[2] bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold h-12 shadow-lg shadow-pink-500/20"
                onClick={handleGenerate}
                disabled={!prompt.trim() || generating}
              >
                {generating ? (
                  <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Generating Image...</>
                ) : (
                  <><ImageIcon className="h-5 w-5 mr-2" /> Generate Image</>
                )}
              </Button>
            </div>
          </div>
          
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="font-bold mb-3 text-sm flex items-center gap-2">
              <LightbulbIcon className="h-4 w-4 text-amber-400" /> Tips for great prompts
            </h3>
            <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-4">
              <li><strong>Be specific:</strong> Mention subject, setting, and lighting.</li>
              <li><strong>Style keywords:</strong> Add words like "photorealistic", "cinematic", "minimalist flat lay".</li>
              <li><strong>Brand elements:</strong> Mention your brand colors directly.</li>
              <li><strong>Format:</strong> End with "high quality, 4k resolution".</li>
            </ul>
          </div>
        </div>

        {/* Right: Output */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl border border-white/10 bg-black/40 overflow-hidden relative flex flex-col items-center justify-center">
            {generating ? (
              <div className="flex flex-col items-center text-neon-blue animate-pulse">
                <Sparkles className="h-12 w-12 mb-4" />
                <p className="font-semibold">AI is creating your masterpiece...</p>
              </div>
            ) : imageUrl ? (
              <img
                src={imageUrl}
                alt="Generated"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center text-muted-foreground/40">
                <ImageIcon className="h-16 w-16 mb-4 opacity-50" />
                <p className="font-medium text-sm">Your generated image will appear here</p>
              </div>
            )}
          </div>

          {imageUrl && !generating && (
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-white/10 bg-white/5 hover:bg-white/10"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-2" /> Download
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-[#00f0ff] to-[#7000ff] text-white"
                onClick={() => setEditorOpen(true)}
              >
                <Send className="h-4 w-4 mr-2" /> Create Post with Image
              </Button>
            </div>
          )}
        </div>
      </div>

      <SocialPostEditor
        open={editorOpen}
        onOpenChange={setEditorOpen}
        projectId={project.id}
        idea={null}
        existingPost={{ image_prompt: prompt, image_url: imageUrl, platform: "instagram" }}
        onSaved={() => toast.success("Post created successfully!")}
      />
    </div>
  );
}

function LightbulbIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="9" x2="15" y1="18" y2="18" />
      <line x1="10" x2="14" y1="22" y2="22" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1.45.62 2.84 1.5 3.5.76.76 1.23 1.52 1.41 2.5" />
    </svg>
  );
}
