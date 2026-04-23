import { useProject } from "./ProjectLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState } from "react";
import { Globe, Save } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { ComingSoonPage } from "./ComingSoonPage";
import { Users } from "lucide-react";

export function BrandWorkspacePage() {
  const { project } = useProject();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    brand_name: project.brand_name || "",
    brand_tagline: project.brand_tagline || "",
    brand_description: project.brand_description || "",
    domain: project.domain || "",
  });

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("projects")
      .update({
        brand_name: form.brand_name,
        brand_tagline: form.brand_tagline,
        brand_description: form.brand_description,
        domain: form.domain,
        name: form.brand_name || project.name,
      })
      .eq("id", project.id);
    setSaving(false);
    if (error) toast.error("Failed to save");
    else {
      toast.success("Brand workspace saved!");
      queryClient.invalidateQueries({ queryKey: ["project", project.id] });
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">Brand Workspace</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your brand identity and settings.</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>

      {project.og_image_url && (
        <div className="w-full h-40 rounded-xl overflow-hidden border">
          <img src={project.og_image_url} alt="Brand OG" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary border shrink-0">
            {(form.brand_name || project.name).charAt(0).toUpperCase()}
          </div>
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{form.brand_name || project.name}</p>
            <p>{form.domain}</p>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label>Brand Website</Label>
            <div className="flex gap-2 items-center">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <Input value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Brand Name</Label>
            <Input value={form.brand_name} onChange={(e) => setForm({ ...form, brand_name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Brand Tagline</Label>
            <Input value={form.brand_tagline} onChange={(e) => setForm({ ...form, brand_tagline: e.target.value })} placeholder="e.g. AI Automation Agency" />
          </div>
          <div className="space-y-2">
            <Label>Brand Description</Label>
            <Textarea value={form.brand_description} onChange={(e) => setForm({ ...form, brand_description: e.target.value })} rows={4} placeholder="Describe your brand..." />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CompetitorsPage() {
  return <ComingSoonPage title="Competitors" icon={Users} description="Track and analyze your competitors to stay ahead in search, ads, and social." features={["Competitor SEO Analysis","Ad Spend Estimation","Content Gap Analysis","Social Media Benchmarking","Share of Voice Tracking"]} />;
}
