import { Sparkles, Star, Zap, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const GenieSection = () => {
    return (
        <section className="relative py-24 overflow-hidden bg-mesh">
            {/* Magical background blur */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full bg-primary/10 rounded-full blur-[100px] -z-10" />

            <div className="container mx-auto px-4 md:px-8">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
                    
                    {/* Visual Genie Side */}
                    <div className="w-full lg:w-1/2 relative flex justify-center items-center">
                        <div className="relative w-64 h-64 md:w-96 md:h-96">
                            {/* Star sparkles floating */}
                            <Star className="absolute top-10 left-10 text-yellow-400 h-8 w-8 animate-pulse" />
                            <Sparkles className="absolute bottom-20 left-0 text-primary h-6 w-6 animate-bounce" />
                            <Star className="absolute top-20 right-10 text-purple-400 h-10 w-10 animate-pulse delay-300" />
                            
                            {/* The Genie Silhouette inside a glowing orb */}
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse duration-[4000ms]"></div>
                            
                            {/* Genie / Chirag SVG */}
                            <div className="relative z-10 w-full h-full flex items-center justify-center transform hover:scale-105 transition-transform duration-500 cursor-pointer">
                                <svg viewBox="0 0 100 100" className="w-[80%] h-[80%] text-primary fill-current filter drop-shadow-[0_0_20px_rgba(var(--primary),0.8)]" xmlns="http://www.w3.org/2000/svg">
                                    {/* Lamp (Chirag) */}
                                    <path d="M70 85 C65 85, 60 88, 55 88 C40 88, 35 75, 50 75 C60 75, 65 78, 70 80 C80 83, 85 80, 85 80 C85 80, 82 85, 75 85 Z" />
                                    <path d="M62 75 C62 70, 58 68, 55 68 C52 68, 48 70, 48 75 Z" />
                                    <path d="M50 88 L60 88 L62 92 L48 92 Z" />
                                    
                                    {/* Genie Tail */}
                                    <path d="M40 75 C30 75, 20 65, 25 50 C28 40, 35 30, 45 40 C50 45, 55 40, 55 40 C55 40, 50 35, 45 35 C35 35, 10 50, 15 70 C20 85, 40 85, 40 75 Z" />
                                    
                                    {/* Genie Body */}
                                    <path d="M25 50 C15 50, 10 40, 20 35 C30 30, 40 30, 50 35 C60 40, 55 50, 45 50 Z" />
                                    
                                    {/* Genie Head */}
                                    <circle cx="35" cy="25" r="8" />
                                    <circle cx="27" cy="25" r="2" />
                                    <circle cx="43" cy="25" r="2" />
                                    
                                    {/* Top Knot/Hair */}
                                    <path d="M35 17 C35 10, 45 5, 55 10 C50 15, 40 10, 35 17 Z" />
                                </svg>
                            </div>
                        </div>
                        
                        {/* Floating chat bubble */}
                        <div className="absolute top-0 md:top-10 -right-4 md:-right-10 bg-background border-2 border-[#00FF66]/30 p-4 rounded-2xl shadow-2xl max-w-xs animate-bounce duration-[4000ms] z-20 hidden sm:block">
                            <p className="text-sm font-semibold text-[#00FF66] mb-1">Onboarding Complete! 🤖</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">I've assigned your Brand, Social, and Digital agents. They're already analyzing your competitors.</p>
                            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-background border-b-2 border-l-2 border-[#00FF66]/30 transform -rotate-45"></div>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6 border border-primary/20">
                            <Sparkles className="w-4 h-4" /> The Magic of AI
                        </div>
                        
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
                            Meet your <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF66] to-blue-600">Agent Commander</span>
                        </h2>
                        
                        <p className="text-lg text-muted-foreground mb-8 max-w-xl">
                            Stop managing tools and start managing results. With our Agent Commander, you don't just get a co-pilot; you get a fully autonomous team that researches, writes, and publishes for you.
                        </p>

                        <div className="space-y-4 mb-8 w-full max-w-xl">
                            {
                                [
                                    "Autonomous competitor intelligence gathering.",
                                    "Dynamic content execution across all channels.",
                                    "Instant multi-platform distribution and sync."
                                ].map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3 glass-card hover-glow p-4 rounded-xl transition-all duration-300">
                                        <div className="h-8 w-8 rounded-full bg-[#00FF66]/20 text-[#00FF66] flex items-center justify-center shrink-0">
                                            <Zap className="h-4 w-4" />
                                        </div>
                                        <span className="font-medium text-foreground">{feature}</span>
                                    </div>
                                ))
                            }
                        </div>

                        <Button size="lg" className="rounded-full bg-[#00FF66] text-black hover:bg-[#00CC52] font-bold shadow-lg shadow-[#00FF66]/20 hover:-translate-y-1 transition-all h-14 px-8 text-base">
                            Deploy Your Team
                            <ChevronRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>

                </div>
            </div>
        </section>
    );
};
