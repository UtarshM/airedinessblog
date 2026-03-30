import { AlertTriangle, Lightbulb, Link as LinkIcon, AlertCircle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

const gaps = [
    { topic: "AI Automation Workflows", competitor: "zapier.com", relevance: "High", difficulty: "Medium" },
    { topic: "Cold Outreach Templates", competitor: "instantly.ai", relevance: "Critical", difficulty: "Low" },
    { topic: "Programmatic SEO Guide", competitor: "ahrefs.com", relevance: "High", difficulty: "High" }
];

export const CompetitorInsightsTab = () => {
    return (
        <div className="space-y-6 mt-6 animate-fade-in">
            {/* Alerts */}
            <div className="grid md:grid-cols-2 gap-4">
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400">
                    <AlertTriangle className="h-5 w-5" />
                    <AlertTitle className="text-base font-bold">🔥 You are NOT visible for critical prompts</AlertTitle>
                    <AlertDescription className="mt-2 text-red-600/80 dark:text-red-400/80 flex flex-col gap-2">
                        <span>"best CRM for b2b saas" is generating 12k monthly AI queries. Competitor <b>hubspot.com</b> occupies 84% of citations.</span>
                        <Button size="sm" variant="outline" className="w-fit border-red-500/30 hover:bg-red-500/20 text-red-600">
                            Steal this traffic
                        </Button>
                    </AlertDescription>
                </Alert>

                <Alert className="bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400">
                    <Lightbulb className="h-5 w-5" />
                    <AlertTitle className="text-base font-bold">💡 Competitor dominates this topic</AlertTitle>
                    <AlertDescription className="mt-2 text-amber-600/80 dark:text-amber-400/80 flex flex-col gap-2">
                        <span>Competitor <b>gohighlevel.com</b> is heavily cited by Perplexity for "marketing automation setup".</span>
                        <Button size="sm" variant="outline" className="w-fit border-amber-500/30 hover:bg-amber-500/20 text-amber-600">
                            View Citation Analysis
                        </Button>
                    </AlertDescription>
                </Alert>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Topic Gap Detection */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-primary" />
                            Missing Topic Gaps
                        </CardTitle>
                        <CardDescription>Topics your competitors are cited for, but you are not.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {gaps.map((gap, i) => (
                            <div key={i} className="flex justify-between items-center p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                                <div className="space-y-1">
                                    <p className="font-semibold">{gap.topic}</p>
                                    <p className="text-xs text-muted-foreground">Cited via: <span className="font-medium text-foreground">{gap.competitor}</span></p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <Badge variant="outline" className={gap.relevance === 'Critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' : ''}>
                                        {gap.relevance} Priority
                                    </Badge>
                                    <Button size="sm" variant="ghost" className="h-6 text-xs text-primary px-2">
                                        Draft Brief <ArrowRight className="h-3 w-3 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Why are they ranking? */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LinkIcon className="h-5 w-5 text-emerald-500" />
                            Citation Deep-Dive
                        </CardTitle>
                        <CardDescription>Why AI engines prefer competitor content.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="relative border-l-2 border-primary/30 pl-4 py-1 space-y-4">
                                <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-2 shadow-[0_0_10px_rgba(var(--primary),0.8)]"></div>
                                <div>
                                    <h4 className="font-semibold text-sm">High Information Density</h4>
                                    <p className="text-xs text-muted-foreground mt-1">Their page "CRM Automation 101" contains 14 distinct entities recognized by ChatGPT's knowledge graph.</p>
                                </div>
                            </div>
                            <div className="relative border-l-2 border-primary/30 pl-4 py-1 space-y-4">
                                <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-2 shadow-[0_0_10px_rgba(var(--primary),0.8)]"></div>
                                <div>
                                    <h4 className="font-semibold text-sm">Superior Schema Markup</h4>
                                    <p className="text-xs text-muted-foreground mt-1">They utilize valid FAQPage schema which Claude extracts directly into the structured answer.</p>
                                </div>
                            </div>
                            <div className="relative border-l-2 border-primary/30 pl-4 py-1 space-y-4 border-transparent">
                                <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-2 shadow-[0_0_10px_rgba(var(--primary),0.8)]"></div>
                                <div>
                                    <h4 className="font-semibold text-sm">Third-Party Verification</h4>
                                    <p className="text-xs text-muted-foreground mt-1">Mentioned actively in 3 highly-ranked Reddit threads this month.</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
