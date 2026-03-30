import { Search, Plus, TrendingUp, TrendingDown, Minus, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const mockPrompts = [
    { id: 1, prompt: "best CRM for small agencies", engine: "ChatGPT", rank: 1, prevRank: 3, change: "up", volume: "High" },
    { id: 2, prompt: "how to automate seo content", engine: "Perplexity", rank: 2, prevRank: 2, change: "flat", volume: "Medium" },
    { id: 3, prompt: "fupilot reviews 2026", engine: "Google AI", rank: 1, prevRank: 1, change: "flat", volume: "Low" },
    { id: 4, prompt: "alternatives to scalezix crm", engine: "ChatGPT", rank: 4, prevRank: 2, change: "down", volume: "Medium" },
    { id: 5, prompt: "what is answer engine optimization", engine: "Claude", rank: 1, prevRank: 5, change: "up", volume: "High" },
    { id: 6, prompt: "AI tools for programmatic seo", engine: "Perplexity", rank: 3, prevRank: 3, change: "flat", volume: "High" }
];

export const PromptsTrackingTab = () => {
    return (
        <div className="space-y-6 mt-6 animate-fade-in">
            {/* Header / Add Prompt */}
            <Card className="bg-gradient-to-r from-primary/10 via-background to-background border-primary/20">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Target className="h-5 w-5 text-primary" /> 
                                Track New Prompts
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Monitor your brand's ranking across 500+ specific AI questions.
                            </p>
                        </div>
                        <div className="flex w-full md:w-auto items-center gap-2">
                            <Input placeholder="e.g. 'best seo tools'" className="w-full md:w-64" />
                            <Button className="shrink-0 gap-2"><Plus className="h-4 w-4" /> Add Prompt</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tracking Table */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Active Prompt Rankings</CardTitle>
                        <CardDescription>Real-time positions within AI-generated responses.</CardDescription>
                    </div>
                    <div className="relative w-64 hidden sm:block">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="search" placeholder="Search tracked prompts..." className="pl-8" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                                <tr>
                                    <th className="px-6 py-4 rounded-tl-lg font-medium">Target Prompt</th>
                                    <th className="px-6 py-4 font-medium">Primary Engine</th>
                                    <th className="px-6 py-4 font-medium">Search Volume</th>
                                    <th className="px-6 py-4 font-medium">Current Position</th>
                                    <th className="px-6 py-4 rounded-tr-lg font-medium">7-Day Change</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {mockPrompts.map((item) => (
                                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4 font-medium text-foreground">{item.prompt}</td>
                                        <td className="px-6 py-4 text-muted-foreground">{item.engine}</td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" className={
                                                item.volume === 'High' ? 'text-orange-500 border-orange-500/30 bg-orange-500/10' :
                                                item.volume === 'Medium' ? 'text-blue-500 border-blue-500/30 bg-blue-500/10' :
                                                'text-muted-foreground'
                                            }>
                                                {item.volume}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                                                #{item.rank}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium flex items-center gap-1">
                                            {item.change === 'up' && <span className="text-emerald-500 flex items-center"><TrendingUp className="h-4 w-4 mr-1" /> +{(item.prevRank - item.rank)}</span>}
                                            {item.change === 'down' && <span className="text-red-500 flex items-center"><TrendingDown className="h-4 w-4 mr-1" /> -{(item.rank - item.prevRank)}</span>}
                                            {item.change === 'flat' && <span className="text-muted-foreground flex items-center"><Minus className="h-4 w-4 mr-1" /> 0</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
