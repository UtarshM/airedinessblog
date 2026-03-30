import { LineChart as LineChartIcon, ArrowUpRight, Users, MousePointerClick, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const trafficData = [
  { name: 'Week 1', chatgpt: 400, perplexity: 240, claude: 150 },
  { name: 'Week 2', chatgpt: 500, perplexity: 320, claude: 210 },
  { name: 'Week 3', chatgpt: 600, perplexity: 450, claude: 300 },
  { name: 'Week 4', chatgpt: 850, perplexity: 580, claude: 420 },
];

export const AnalyticsTab = () => {
    return (
        <div className="space-y-6 mt-6 animate-fade-in">
            <div className="grid md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total AI Traffic</CardTitle>
                        <Users className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4,021</div>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                            <span className="text-emerald-500 flex items-center mr-1">
                                <ArrowUpRight className="h-3 w-3" /> +32%
                            </span>
                             growth MoM
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                        <MousePointerClick className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">6.4%</div>
                        <p className="text-xs text-muted-foreground mt-1 text-emerald-500">
                             Outperforming Organic Search (2.1%)
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Leads Originated</CardTitle>
                        <TrendingUp className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">257</div>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                            <span className="text-emerald-500 flex items-center mr-1">
                                <ArrowUpRight className="h-3 w-3" /> +18
                            </span>
                             new leads this week
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <LineChartIcon className="h-5 w-5 text-primary" />
                        AI Traffic by Source Model
                    </CardTitle>
                    <CardDescription>Verified GA4 referral data from major AI Engines.</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={trafficData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                            <Tooltip 
                                cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                            />
                            <Bar dataKey="chatgpt" name="ChatGPT" stackId="a" fill="#10a37f" radius={[0, 0, 4, 4]} />
                            <Bar dataKey="perplexity" name="Perplexity" stackId="a" fill="#262626" />
                            <Bar dataKey="claude" name="Claude" stackId="a" fill="#d97757" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
};
