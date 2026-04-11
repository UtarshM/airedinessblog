import { Clock, Search, Zap, BarChart3, Globe, TrendingUp } from "lucide-react";

export const FeaturesSection = () => {
    const features = [
        {
            icon: <TrendingUp className="h-6 w-6 text-emerald-500" />,
            title: "Brand Marketing Agent",
            description: "Master your market with competitor tracking, trends analysis, and content gap insights. Fuel your entire action engine with timely recommendations."
        },
        {
            icon: <Globe className="h-6 w-6 text-blue-500" />,
            title: "Social Media Agent",
            description: "Maintain a consistent brand voice across LinkedIn, X, and Meta. Automated ideation, image generation, and multi-platform publishing."
        },
        {
            icon: <Zap className="h-6 w-6 text-amber-500" />,
            title: "Digital Marketing Agent",
            description: "Execute precision-targeted campaigns with keyword research, ad group composition, and optimized ad copy generation on autopilot."
        },
        {
            icon: <Clock className="h-6 w-6 text-indigo-500" />,
            title: "Always Available",
            description: "Your agents work 24/7. No sick days, no time zones, just continuous execution of your marketing strategy."
        },
        {
            icon: <Search className="h-6 w-6 text-purple-500" />,
            title: "Specialized Specialized Roles",
            description: "Deploy specific agents for specific tasks. Onboard new capabilities instantly without complex setup or human contracts."
        },
        {
            icon: <BarChart3 className="h-6 w-6 text-primary" />,
            title: "Performance Tracking",
            description: "Detailed measurement and optimization for every campaign, ensuring your agents are always delivering peak ROI."
        }
    ];

    return (
        <section id="features" className="py-24 bg-muted/30">
            <div className="container mx-auto px-4 md:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                        Meet Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF66] to-blue-500">Autonomous Team</span>
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Why hire a co-pilot when you can hire a specialized agent? Deploy a team that executes across every channel.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="group glass-card p-8 rounded-2xl hover-glow transition-all duration-500 relative overflow-hidden"
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
