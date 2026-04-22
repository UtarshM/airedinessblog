import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { GlowCard } from "@/components/marketing/GlowCard";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const BlogPage = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <MarketingNavbar />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-black mb-6">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Agentic</span> Future
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Insights, strategies, and thought leadership on replacing software with autonomous agents.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Featured Post */}
            <div className="md:col-span-2 lg:col-span-3">
              <GlowCard glowColor="purple" className="p-0 overflow-hidden border-white/10 group">
                <div className="grid md:grid-cols-2">
                  <div className="h-64 md:h-auto bg-gradient-to-br from-neon-purple/20 to-neon-blue/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-mesh opacity-50" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full border border-neon-purple/30 flex items-center justify-center relative">
                        <div className="absolute inset-0 rounded-full border border-neon-blue/30 scale-110 animate-pulse-gentle" />
                        <span className="text-4xl">🤖</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="px-3 py-1 bg-neon-purple/20 text-neon-purple rounded-full text-xs font-bold uppercase tracking-wide">Featured</span>
                      <span className="text-gray-500 text-sm">October 24, 2026</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-4 group-hover:text-neon-purple transition-colors">The Death of the Dashboard: Why UI is Becoming Obsolete</h2>
                    <p className="text-gray-400 mb-8 leading-relaxed">
                      For 20 years, SaaS companies have competed on who can build the prettiest dashboard. But what happens when agents do the work for you? You don't need a dashboard if you don't need to log in.
                    </p>
                    <Link to="#" className="flex items-center gap-2 text-white font-semibold group-hover:gap-3 transition-all">
                      Read Article <ArrowRight className="w-4 h-4 text-neon-purple" />
                    </Link>
                  </div>
                </div>
              </GlowCard>
            </div>

            {/* Standard Posts */}
            {[
              {
                title: "How an Agency Scaled from 10 to 100 Clients with Zero New Hires",
                category: "Case Study",
                color: "blue",
                date: "October 18, 2026"
              },
              {
                title: "Prompt Engineering vs. Agentic Orchestration",
                category: "Engineering",
                color: "pink",
                date: "October 12, 2026"
              },
              {
                title: "The Economics of AI Labor: Calculating ROI on Co-Agents",
                category: "Strategy",
                color: "green",
                date: "October 5, 2026"
              }
            ].map((post, i) => (
              <GlowCard key={i} glowColor={post.color as any} className="flex flex-col border-white/10 group cursor-pointer">
                <div className="h-48 rounded-xl bg-white/5 mb-6 relative overflow-hidden flex items-center justify-center border border-white/5">
                   <div className="absolute inset-0 bg-mesh opacity-30" />
                   <span className="text-3xl opacity-50 relative z-10 text-white">CoAgent</span>
                </div>
                <div className="flex items-center gap-4 mb-3">
                  <span className={`text-${post.color === 'green' ? '[#00FF66]' : `neon-${post.color}`} text-xs font-bold uppercase tracking-wide`}>{post.category}</span>
                  <span className="text-gray-500 text-sm">{post.date}</span>
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-white text-gray-200 transition-colors flex-grow">
                  {post.title}
                </h3>
                <div className="flex items-center gap-2 text-gray-400 font-medium group-hover:text-white transition-colors">
                  Read More <ArrowRight className="w-4 h-4" />
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
};

export default BlogPage;
