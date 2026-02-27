import { FileText, Search, Zap, BarChart3, Globe, PenTool } from "lucide-react";

export const FeaturesSection = () => {
    const features = [
        {
            icon: <PenTool className="h-6 w-6 text-primary" />,
            title: "AI-Powered Content",
            description: "Generate highly engaging, long-form articles that mimic human writing and pass AI detection."
        },
        {
            icon: <Search className="h-6 w-6 text-purple-500" />,
            title: "Advanced SEO Tools",
            description: "Perform keyword research, competitor analysis, and optimize your content for search engines directly."
        },
        {
            icon: <Zap className="h-6 w-6 text-amber-500" />,
            title: "Bulk Generation",
            description: "Create hundreds of articles at once and populate an entire blog within minutes, not months."
        },
        {
            icon: <Globe className="h-6 w-6 text-indigo-500" />,
            title: "Multi-Platform Export",
            description: "One-click publishing to WordPress, Shopify, Webflow, Notion, and customized webhooks."
        },
        {
            icon: <FileText className="h-6 w-6 text-emerald-500" />,
            title: "Content Calendar",
            description: "Visually plan, schedule, and organize your content strategy with our intuitive calendar interface."
        },
        {
            icon: <BarChart3 className="h-6 w-6 text-blue-500" />,
            title: "Rank Tracking",
            description: "Monitor your domain's rating, track keyword positions, and see your organic traffic grow over time."
        }
    ];

    return (
        <section id="features" className="py-24 bg-muted/30">
            <div className="container mx-auto px-4 md:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                        Everything you need to <span className="text-primary">dominate search</span>
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Rank.Scalezix replaces a dozen scattered SEO tools with one unified, incredibly powerful ecosystem.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="group bg-background p-8 rounded-2xl border hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-500 text-foreground pointer-events-none">
                                {feature.icon}
                            </div>

                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
