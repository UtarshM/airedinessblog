import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, X, Plus, Sparkles, LayoutTemplate, FileText, ListOrdered, GitCompare, BookOpen } from "lucide-react";

// --- BLOG TEMPLATES ---
const TEMPLATES = [
  {
    id: "service",
    name: "Service Page",
    icon: FileText,
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    description: "For agencies & businesses",
    h2s: ["What is [Service]", "Benefits of [Service]", "Our Process", "Why Choose Us", "Pricing & Packages"],
    h3s: [],
  },
  {
    id: "howto",
    name: "How-To Guide",
    icon: BookOpen,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    description: "Step-by-step tutorials",
    h2s: ["Prerequisites", "Step-by-Step Guide", "Tips & Best Practices", "Common Mistakes to Avoid"],
    h3s: ["Step 1", "Step 2", "Step 3"],
  },
  {
    id: "listicle",
    name: "Listicle",
    icon: ListOrdered,
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    description: "Top N lists & roundups",
    h2s: ["Top Pick #1", "Top Pick #2", "Top Pick #3", "Top Pick #4", "Top Pick #5"],
    h3s: [],
  },
  {
    id: "comparison",
    name: "Comparison",
    icon: GitCompare,
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    description: "A vs B comparisons",
    h2s: ["Overview", "Feature Comparison", "Pros and Cons", "Pricing", "Which One Should You Choose?"],
    h3s: ["Pros of A", "Cons of A", "Pros of B", "Cons of B"],
  },
];

const GeneratePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Load defaults from localStorage (set in Settings)
  const defaultTone = localStorage.getItem("bf_default_tone") || "Professional";
  const defaultCountry = localStorage.getItem("bf_default_country") || "India";
  const defaultWordCount = parseInt(localStorage.getItem("bf_default_word_count") || "1200", 10);

  const [mainKeyword, setMainKeyword] = useState("");
  const [h1, setH1] = useState("");
  const [wordCount, setWordCount] = useState(defaultWordCount);
  const [tone, setTone] = useState(defaultTone);
  const [targetCountry, setTargetCountry] = useState(defaultCountry);
  const [secondaryKeywords, setSecondaryKeywords] = useState<string[]>([]);
  const [skInput, setSkInput] = useState("");
  const [h2List, setH2List] = useState<string[]>([""]);
  const [h3List, setH3List] = useState<string[]>([]);

  const applyTemplate = (templateId: string) => {
    const template = TEMPLATES.find(t => t.id === templateId);
    if (!template) return;
    setSelectedTemplate(templateId);
    setH2List([...template.h2s]);
    setH3List([...template.h3s]);
    toast.success(`Template "${template.name}" applied`);
  };

  const addSecondaryKeyword = () => {
    if (skInput.trim() && !secondaryKeywords.includes(skInput.trim())) {
      setSecondaryKeywords([...secondaryKeywords, skInput.trim()]);
      setSkInput("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validH2s = h2List.filter(h => h.trim());
    if (validH2s.length < 2) {
      toast.error("Add at least 2 H2 headings");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.from("content_items").insert({
        user_id: user!.id,
        main_keyword: mainKeyword.trim(),
        secondary_keywords: secondaryKeywords,
        word_count_target: wordCount,
        tone,
        target_country: targetCountry,
        h1: h1.trim(),
        h2_list: validH2s,
        h3_list: h3List.filter(h => h.trim()),
        status: "generating",
      }).select("id").single();

      if (error) throw error;

      // Fire-and-forget: start generation in background, don't wait for it
      // The edge function updates the DB as each section completes
      // The content view page polls for live progress
      supabase.functions.invoke("generate-blog", {
        body: { contentId: data.id },
      }).catch((err: any) => {
        console.error("Generation invoke error:", err);
      });

      toast.success("Generation started!");
      navigate(`/content/${data.id}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to start generation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-1">Generate SEO Blog</h1>
      <p className="text-muted-foreground text-sm mb-6">Define your structure and let AI write the content</p>

      {/* Template Picker */}
      <div className="mb-8">
        <Label className="flex items-center gap-2 mb-3">
          <LayoutTemplate className="h-4 w-4 text-primary" />
          Quick Templates
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TEMPLATES.map((template) => {
            const Icon = template.icon;
            const isSelected = selectedTemplate === template.id;
            return (
              <button
                key={template.id}
                type="button"
                onClick={() => applyTemplate(template.id)}
                className={`p-3 rounded-xl border text-left transition-all duration-200 hover:shadow-md group ${isSelected
                  ? `${template.color} border-2 shadow-sm`
                  : "bg-card hover:border-primary/30"
                  }`}
              >
                <Icon className={`h-5 w-5 mb-2 transition-transform group-hover:scale-110 ${isSelected ? "" : "text-muted-foreground"}`} />
                <p className="text-sm font-semibold">{template.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{template.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Keyword */}
        <div>
          <Label htmlFor="keyword">Main Keyword *</Label>
          <Input
            id="keyword"
            value={mainKeyword}
            onChange={(e) => setMainKeyword(e.target.value)}
            placeholder="e.g. best digital marketing agency in Mumbai"
            required
          />
        </div>

        {/* H1 */}
        <div>
          <Label htmlFor="h1">H1 Heading *</Label>
          <Input
            id="h1"
            value={h1}
            onChange={(e) => setH1(e.target.value)}
            placeholder="e.g. Best Digital Marketing Agency in Mumbai"
            required
          />
        </div>

        {/* Word Count */}
        <div>
          <Label>Word Count Target: {wordCount}</Label>
          <Slider
            value={[wordCount]}
            onValueChange={([v]) => setWordCount(v)}
            min={500}
            max={3000}
            step={100}
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>500</span>
            <span>3000</span>
          </div>
        </div>

        {/* H2 List */}
        <div>
          <Label>H2 Headings * (minimum 2)</Label>
          <div className="space-y-2 mt-2">
            {h2List.map((h2, i) => (
              <div key={i} className="flex gap-2 animate-slide-in" style={{ animationDelay: `${i * 30}ms` }}>
                <Input
                  value={h2}
                  onChange={(e) => {
                    const copy = [...h2List];
                    copy[i] = e.target.value;
                    setH2List(copy);
                  }}
                  placeholder={`H2 heading ${i + 1}`}
                />
                {h2List.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setH2List(h2List.filter((_, j) => j !== i))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setH2List([...h2List, ""])}
            >
              <Plus className="mr-1 h-3 w-3" />
              Add H2
            </Button>
          </div>
        </div>

        {/* H3 List */}
        <div>
          <Label>H3 Headings (optional)</Label>
          <div className="space-y-2 mt-2">
            {h3List.map((h3, i) => (
              <div key={i} className="flex gap-2 animate-slide-in" style={{ animationDelay: `${i * 30}ms` }}>
                <Input
                  value={h3}
                  onChange={(e) => {
                    const copy = [...h3List];
                    copy[i] = e.target.value;
                    setH3List(copy);
                  }}
                  placeholder={`H3 heading ${i + 1}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setH3List(h3List.filter((_, j) => j !== i))}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setH3List([...h3List, ""])}
            >
              <Plus className="mr-1 h-3 w-3" />
              Add H3
            </Button>
          </div>
        </div>

        {/* Secondary Keywords */}
        <div>
          <Label>Secondary Keywords (optional)</Label>
          <div className="flex gap-2 mt-2">
            <Input
              value={skInput}
              onChange={(e) => setSkInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSecondaryKeyword(); } }}
              placeholder="Add keyword and press Enter"
            />
            <Button type="button" variant="outline" onClick={addSecondaryKeyword}>Add</Button>
          </div>
          {secondaryKeywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {secondaryKeywords.map((kw, i) => (
                <Badge key={i} variant="secondary" className="gap-1">
                  {kw}
                  <button type="button" onClick={() => setSecondaryKeywords(secondaryKeywords.filter((_, j) => j !== i))}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Tone & Country */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Professional">Professional</SelectItem>
                <SelectItem value="Conversational">Conversational</SelectItem>
                <SelectItem value="Formal">Formal</SelectItem>
                <SelectItem value="Friendly">Friendly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Target Country</Label>
            <Select value={targetCountry} onValueChange={setTargetCountry}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="India">India</SelectItem>
                <SelectItem value="USA">USA</SelectItem>
                <SelectItem value="UK">UK</SelectItem>
                <SelectItem value="Global">Global</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button type="submit" className="w-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow" size="lg" disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Generate Blog
        </Button>
      </form>
    </div>
  );
};

export default GeneratePage;
