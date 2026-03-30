import { Wand2, CheckSquare, Layers, PenTool, Type, Link as LinkIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const ContentEngineTab = () => {
    return (
        <div className="space-y-6 mt-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/30 p-4 rounded-xl border border-primary/10">
                <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Wand2 className="h-5 w-5 text-primary" />
                        AI-Optimized Content Generation
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Sitefire auto-generates articles based on the exact entities and structures top-cited content uses.
                    </p>
                </div>
                <Button className="shrink-0 gap-2"><PenTool className="h-4 w-4" /> Generate New Brief</Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1 bg-gradient-to-b from-background to-muted/20">
                    <CardHeader>
                        <CardTitle>Content Setup</CardTitle>
                        <CardDescription>Configure parameters for AI optimization.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Target Prompt / Keyword</label>
                            <Input placeholder="e.g. b2b marketing automation" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2"><Type className="h-4 w-4" /> Tone Matching</label>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-white">Authoritative</Badge>
                                <Badge variant="default" className="cursor-pointer">Brand Voice</Badge>
                                <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-white">Conversational</Badge>
                            </div>
                        </div>
                        <div className="space-y-2 pt-2">
                            <label className="text-sm font-medium flex items-center gap-2"><Layers className="h-4 w-4" /> Schema Injection</label>
                            <div className="flex flex-col gap-2">
                                <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked className="rounded border-gray-300" /> FAQPage Schema</label>
                                <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked className="rounded border-gray-300" /> HowTo Schema</label>
                                <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="rounded border-gray-300" /> Article Schema</label>
                            </div>
                        </div>
                        <Button className="w-full mt-4" variant="secondary">Extract Competitor Entities</Button>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2 border-primary/20 shadow-md">
                    <CardHeader className="bg-primary/5 border-b">
                        <CardTitle className="text-primary flex items-center gap-2">
                            <CheckSquare className="h-5 w-5" /> Auto Content Brief
                        </CardTitle>
                        <CardDescription>Generated based on citations by top AI engines.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div>
                            <h4 className="font-bold text-lg mb-2">The Ultimate B2B Marketing Automation Guide</h4>
                            <div className="flex gap-2">
                                <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 bg-emerald-500/10">ChatGPT Optimized</Badge>
                                <Badge variant="outline" className="border-indigo-500/30 text-indigo-600 bg-indigo-500/10">14 Required Entities</Badge>
                                <Badge variant="outline" className="border-purple-500/30 text-purple-600 bg-purple-500/10">2,500 Words Suggested</Badge>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <p className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Required Structure (To Outrank Competitors)</p>
                            <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm">
                                <p className="font-bold">H1: The Ultimate Guide to B2B Marketing Automation in 2026</p>
                                <p className="pl-4 font-medium text-foreground/80">H2: What is Marketing Automation?</p>
                                <p className="pl-8 text-muted-foreground">↳ Must include entity: "CRM Syncing", "Lead Scoring"</p>
                                <p className="pl-4 font-medium text-foreground/80">H2: Top 5 Tools Comparison</p>
                                <p className="pl-8 text-muted-foreground">↳ Must include structural list items for Perplexity extraction.</p>
                                <p className="pl-4 font-medium text-foreground/80">H2: Frequently Asked Questions</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <p className="font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                                <LinkIcon className="h-4 w-4" /> Internal Linking Suggestions
                            </p>
                            <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm">
                                <p className="flex justify-between items-center">
                                    <span>Link to: <span className="text-primary hover:underline cursor-pointer">/features/lead-scoring</span></span>
                                    <Badge variant="secondary">High Impact</Badge>
                                </p>
                                <p className="flex justify-between items-center border-t pt-2">
                                    <span>Link to: <span className="text-primary hover:underline cursor-pointer">/pricing</span></span>
                                    <Badge variant="secondary">Conversion Focus</Badge>
                                </p>
                            </div>
                        </div>

                        <Button className="w-full gap-2 py-6 text-base font-semibold">
                            <Wand2 className="h-5 w-5" /> Generate Citation-Based Article
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
