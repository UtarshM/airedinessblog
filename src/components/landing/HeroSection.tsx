import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, TrendingUp, Search, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const HeroSection = () => {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/20 rounded-[100%] blur-[120px] -z-10" />
            <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] -z-10" />

            <div className="container mx-auto px-4 md:px-8 text-center">
                <Badge variant="outline" className="mb-6 px-4 py-1 border-primary/30 bg-primary/5 text-primary">
                    <Sparkles className="h-4 w-4 mr-2" />
                    The Ultimate SEO Companion
                </Badge>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 max-w-5xl mx-auto leading-tight">
                    Grow Organic Traffic on <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-indigo-600">
                        Auto-Pilot
                    </span>
                </h1>

                <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
                    Get traffic and outrank competitors with SEO-optimized content, keyword research, and multi-platform publishing while you sleep.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                    <Link to="/auth">
                        <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">
                            Start ranking for free
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                    <p className="text-sm text-muted-foreground sm:hidden tracking-wide mt-2">No credit card required</p>
                </div>

                {/* Dashboard Mockup Header */}
                <div className="relative max-w-6xl mx-auto">
                    <div className="absolute -inset-1 bg-gradient-to-tr from-primary/30 to-purple-500/30 rounded-2xl blur-xl opacity-50"></div>
                    <div className="relative rounded-2xl border border-border/50 bg-background/50 backdrop-blur-xl shadow-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9]">
                        {/* Top Bar Fake UI */}
                        <div className="h-12 border-b bg-muted/30 flex items-center px-4 gap-2">
                            <div className="flex space-x-2">
                                <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                                <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                            </div>
                            <div className="flex-1 px-8">
                                <div className="h-6 w-full max-w-sm mx-auto bg-background rounded-md border text-xs text-muted-foreground flex items-center px-4">
                                    <span className="opacity-50">rank.scalezix.com/dashboard</span>
                                </div>
                            </div>
                        </div>

                        {/* Dashboard Abstract Representation */}
                        <div className="p-8 grid grid-cols-12 gap-6 h-full">
                            {/* Sidebar */}
                            <div className="col-span-3 hidden md:flex flex-col gap-4 border-r pr-6 h-full">
                                <div className="h-8 w-2/3 bg-primary/20 rounded-md mb-8"></div>
                                <div className="space-y-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-6 w-full bg-muted rounded-md flex items-center px-3">
                                            <div className="h-4 w-4 rounded-sm bg-foreground/10 mr-3"></div>
                                            <div className="h-3 w-1/2 bg-foreground/10 rounded-sm"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="col-span-12 md:col-span-9 flex flex-col gap-6">
                                <div className="flex justify-between items-end mb-4">
                                    <div>
                                        <div className="h-8 w-48 bg-foreground/20 rounded-md mb-2"></div>
                                        <div className="h-4 w-64 bg-foreground/10 rounded-md"></div>
                                    </div>
                                    <div className="h-10 w-32 bg-primary/80 rounded-md hidden sm:block"></div>
                                </div>

                                {/* Stats Cards */}
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { icon: <TrendingUp className="h-5 w-5 text-green-500" /> },
                                        { icon: <Search className="h-5 w-5 text-indigo-500" /> },
                                        { icon: <Sparkles className="h-5 w-5 text-purple-500" /> }
                                    ].map((item, i) => (
                                        <div key={i} className="bg-background/80 rounded-xl border p-4 shadow-sm flex flex-col gap-3">
                                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                                {item.icon}
                                            </div>
                                            <div className="space-y-2 mt-2">
                                                <div className="h-6 w-1/2 bg-foreground/20 rounded-md"></div>
                                                <div className="h-3 w-1/3 bg-foreground/10 rounded-md"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Graph Area */}
                                <div className="mt-4 flex-1 bg-background/80 rounded-xl border p-6 flex items-end overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
                                    <div className="w-full flex items-end gap-2 h-32 opacity-30 px-2 justify-between">
                                        {[30, 45, 25, 60, 40, 75, 55, 90, 80, 100].map((h, i) => (
                                            <div key={i} className="w-full bg-primary/60 rounded-t-sm" style={{ height: `${h}%` }}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trusted By (Optional/Placeholder) */}
                <div className="mt-20 pt-10 border-t border-border/50">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-8">
                        Trusted by forward-thinking teams
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Fake company logos using CSS */}
                        <div className="text-xl font-bold flex items-center gap-2"><div className="w-6 h-6 rounded-sm bg-foreground/80"></div> Luminous</div>
                        <div className="text-xl font-bold flex items-center"><div className="w-8 h-8 rounded-md bg-[#fdb23b] flex items-center justify-center text-[#1c448e] font-sans mr-2">F3</div></div>
                        <div className="text-xl font-serif flex items-center gap-2 tracking-widest"><div className="w-5 h-5 rounded-full border-4 border-foreground/80"></div> NEXUS</div>
                        <div className="text-2xl font-black tracking-tighter flex items-center">
                            <span className="text-primary">CLIC</span>
                            <span className="text-blue-600 relative flex items-center">X<ArrowUpRight className="absolute -top-3 -right-3 h-4 w-4" strokeWidth={4} /></span>
                            <span className="text-orange-500 ml-1">IA</span>
                        </div>
                        <div className="text-xl font-extrabold flex items-center gap-1 italic"><Search className="h-5 w-5" /> Vector</div>
                        <div className="text-xl font-mono flex items-center gap-2">sys.log</div>
                    </div>
                </div>
            </div>
        </section>
    );
};
