import { Zap, CheckCircle2, ArrowRight, PlayCircle, Flame } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const tasks = [
    { title: "Publish 'Top CRM 2026' guide to WordPress", type: "Content", impact: "High", effort: "Low", status: "pending", cta: "1-Click Publish" },
    { title: "Outreach to r/SaaS moderators", type: "PR", impact: "High", effort: "Medium", status: "pending", cta: "Auto-Send Message" },
    { title: "Fix FAQ Schema on Homepage", type: "Technical", impact: "Medium", effort: "Low", status: "completed", cta: "Verify" },
    { title: "Generate brief for 'How to automate marketing'", type: "Content", impact: "High", effort: "High", status: "pending", cta: "Generate Brief" },
];

export const ActionEngineTab = () => {
    return (
        <div className="space-y-6 mt-6 animate-fade-in">
            <div className="bg-gradient-to-r from-yellow-500/10 via-amber-500/5 to-background border border-yellow-500/20 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl"></div>
                <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
                    <Flame className="h-6 w-6 text-yellow-500 animate-pulse" />
                    Your Weekly Action Plan
                </h3>
                <p className="text-muted-foreground w-full md:w-2/3">
                    Forget exploring dashboards. We've calculated the exact high-impact, low-effort tasks you need to complete this week to dominate AI answers.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Priority Execution Queue</CardTitle>
                    <CardDescription>Tasks sorted dynamically by Impact vs. Effort ratio.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 shadow-sm">
                        {tasks.map((task, i) => (
                            <div key={i} className={`flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-xl border ${task.status === 'completed' ? 'bg-muted/20 opacity-60' : 'bg-card hover:bg-muted/30'} transition-all gap-4`}>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1">
                                        {task.status === 'completed' ? (
                                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                        ) : (
                                            <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30"></div>
                                        )}
                                    </div>
                                    <div>
                                        <p className={`font-semibold text-base ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                                            {task.title}
                                        </p>
                                        <div className="flex items-center gap-3 mt-1 text-xs">
                                            <span className="bg-muted px-2 py-0.5 rounded-md text-muted-foreground font-medium">{task.type}</span>
                                            <span className={task.impact === 'High' ? 'text-emerald-500' : 'text-blue-500'}>
                                                Impact: {task.impact}
                                            </span>
                                            <span className="text-muted-foreground">
                                                Effort: {task.effort}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-auto mt-2 md:mt-0">
                                    <Button 
                                        variant={task.status === 'completed' ? "outline" : "default"} 
                                        className={`w-full gap-2 ${task.status !== 'completed' && 'bg-primary shadow-lg shadow-primary/20 hover:scale-105 transition-transform'}`}
                                        disabled={task.status === 'completed'}
                                    >
                                        {task.status !== 'completed' && <PlayCircle className="h-4 w-4" />}
                                        {task.cta}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4 mt-6">
                <Button className="h-16 text-lg bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-500/20" variant="default">
                    <Zap className="h-5 w-5 mr-2" /> Auto-Execute Entire Queue
                </Button>
                <Button className="h-16 text-lg border-primary/20 hover:bg-primary/5" variant="outline">
                    Regenerate Strategy
                </Button>
            </div>
        </div>
    );
};
