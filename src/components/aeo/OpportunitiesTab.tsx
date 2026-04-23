import { Megaphone, ExternalLink, Globe, MessageCircle, Send } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const opportunities = [
    { target: "Reddit r/SaaS", type: "Community", missing: true, impact: "High", action: "Comment here" },
    { target: "G2 Reviews", type: "Directory", missing: true, impact: "Critical", action: "Request Review" },
    { target: "SearchEngineLand", type: "News Site", missing: true, impact: "Medium", action: "Pitch Post" },
    { target: "Marketing Automation Substack", type: "Newsletter", missing: false, impact: "Low", action: "Sponsor" },
];

export const OpportunitiesTab = () => {
    return (
        <div className="space-y-6 mt-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Megaphone className="h-5 w-5 text-primary" />
                        Third-Party Distribution & PR
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Find out exactly where your competitors are mentioned, and let AI generate outreach messages to claim your spot.
                    </p>
                </div>
                <Button className="gap-2 shrink-0"><Globe className="h-4 w-4" /> Scan Web Landscape</Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Where should you get mentioned?</CardTitle>
                        <CardDescription>Domains that frequently feed AI Answers but are missing your brand.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {opportunities.map((opp, i) => (
                                <div key={i} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold text-base">{opp.target}</p>
                                            {opp.missing && <Badge variant="destructive" className="bg-red-500/10 text-red-500 border-red-500/20 text-[10px] h-5">Missing Presence</Badge>}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Badge variant="outline" className="h-5">{opp.type}</Badge>
                                            <span className="flex items-center gap-1 hover:text-primary cursor-pointer transition-colors">
                                                <ExternalLink className="h-3 w-3" /> View live mentions
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                        <span className={`text-xs font-semibold ${opp.impact === 'Critical' ? 'text-purple-500' : opp.impact === 'High' ? 'text-emerald-500' : 'text-blue-500'}`}>
                                            {opp.impact} Impact
                                        </span>
                                        <Button size="sm" variant={opp.impact === 'Critical' ? 'default' : 'secondary'} className="w-full sm:w-auto text-xs">
                                            {opp.action}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-indigo-500/5 to-purple-500/10 border-indigo-500/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageCircle className="h-5 w-5 text-indigo-500" />
                            AI PR Engine
                        </CardTitle>
                        <CardDescription>Generate perfect outreach with context.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-background rounded-lg p-4 border shadow-sm text-sm space-y-3">
                            <p className="font-medium text-xs text-muted-foreground uppercase">Generated Outreach: SearchEngineLand</p>
                            <p className="leading-relaxed">
                                "Hi Team,<br/><br/>I noticed your recent article on AEO tools cited legacy softwares but missed the modern stack. We recently launched SoloWeb, which is currently dominating Perplexity charts for 'programmatic seo'.<br/><br/>Would you be open to an addendum?"
                            </p>
                        </div>
                        <Button className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                            <Send className="h-4 w-4" /> Send via Gmail Integration
                        </Button>
                        <Button className="w-full" variant="outline">
                            Regenerate Message
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
