import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { AnimatedHero } from "@/components/marketing/AnimatedHero";
import { AgentShowcase } from "@/components/marketing/AgentShowcase";
import { GlowCard } from "@/components/marketing/GlowCard";
import { Link } from "react-router-dom";
import { ArrowRight, Bot, Clock, Crosshair, Users } from "lucide-react";
import { useEffect } from "react";

const Index = () => {
  // Smooth scroll
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-neon-purple/30 selection:text-white overflow-x-hidden">
      <MarketingNavbar />
      
      <main>
        <AnimatedHero />

        {/* Social Proof */}
        <section className="py-12 border-y border-white/10 bg-white/[0.02]">
          <div className="container mx-auto px-4">
            <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-widest mb-8">Trusted by hyper-growth teams</p>
            <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <span className="text-2xl font-black italic tracking-tighter">AcmeCorp</span>
              <span className="text-2xl font-bold tracking-widest">GLOBAL</span>
              <span className="text-2xl font-serif">StarkTech</span>
              <span className="text-2xl font-black lowercase">massive.</span>
              <span className="text-2xl font-mono">/nexus</span>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Hiring teams is <span className="text-red-400">slow</span>, <span className="text-red-400">expensive</span>, and <span className="text-red-400">inefficient</span>.</h2>
              <p className="text-xl text-gray-400 mb-16 leading-relaxed">
                You post a job. Wait 30 days. Interview. Hire. Wait 90 days for them to ramp up. And then they spend 60% of their time on manual data entry and "coordinating" rather than executing.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-8 rounded-2xl bg-white/5 border border-red-500/20">
                  <Clock className="w-10 h-10 text-red-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">90 Days</h3>
                  <p className="text-sm text-gray-400">Average ramp-up time for a new human hire.</p>
                </div>
                <div className="p-8 rounded-2xl bg-white/5 border border-red-500/20 md:-translate-y-4">
                  <Users className="w-10 h-10 text-red-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">$85,000+</h3>
                  <p className="text-sm text-gray-400">Average starting salary plus benefits and overhead.</p>
                </div>
                <div className="p-8 rounded-2xl bg-white/5 border border-red-500/20">
                  <Crosshair className="w-10 h-10 text-red-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">60%</h3>
                  <p className="text-sm text-gray-400">Time wasted on manual, non-revenue-generating tasks.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-24 bg-gradient-to-b from-[#050505] to-[#0A0D14] border-t border-white/5 relative">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neon-purple/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-neon-blue/30 mb-6">
                  <span className="text-sm font-medium text-neon-blue uppercase tracking-wider">The Solution</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Enter <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Co-Agents</span>.
                </h2>
                <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                  They don't need onboarding. They don't sleep. And they execute complex, multi-step workflows across your entire tech stack simultaneously.
                </p>
                <ul className="space-y-4">
                  {[
                    "Instantly trained on your docs & playbooks",
                    "Executes actions directly in Salesforce, HubSpot, etc.",
                    "Self-corrects when encountering errors",
                    "Scales infinitely with a click of a button"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-neon-blue/20 flex items-center justify-center shrink-0">
                        <ArrowRight className="w-4 h-4 text-neon-blue" />
                      </div>
                      <span className="text-gray-300 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:w-1/2 w-full">
                {/* Dashboard Preview / Visualization */}
                <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_-12px_rgba(112,0,255,0.3)]">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                  <div className="bg-[#0A0D14] p-4 border-b border-white/10 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                  <div className="p-6 bg-[#050505] space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-4">
                         <Bot className="w-8 h-8 text-neon-blue" />
                         <div>
                           <p className="font-bold text-white">Content Generation</p>
                           <p className="text-xs text-neon-blue">Executing • 1,240 Assets Created</p>
                         </div>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">100% HEALTHY</div>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-4">
                         <Bot className="w-8 h-8 text-neon-purple" />
                         <div>
                           <p className="font-bold text-white">Ad Optimization</p>
                           <p className="text-xs text-neon-purple">Executing • 4 Campaigns Active</p>
                         </div>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">100% HEALTHY</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <AgentShowcase />

        {/* How It Works */}
        <section className="py-24 bg-[#050505] border-t border-white/5 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">How it works</h2>
              <p className="text-xl text-gray-400">Three steps to autonomous operations.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink opacity-20 -translate-y-1/2 z-0" />

              <GlowCard glowColor="blue" className="bg-[#0A0D14] z-10">
                <div className="w-12 h-12 rounded-full bg-neon-blue text-black font-black flex items-center justify-center text-xl mb-6 shadow-[0_0_20px_rgba(0,240,255,0.5)]">1</div>
                <h3 className="text-2xl font-bold mb-4">Connect Tools</h3>
                <p className="text-gray-400">1-click OAuth into Salesforce, HubSpot, LinkedIn, and 100+ other platforms.</p>
              </GlowCard>

              <GlowCard glowColor="purple" className="bg-[#0A0D14] z-10">
                <div className="w-12 h-12 rounded-full bg-neon-purple text-white font-black flex items-center justify-center text-xl mb-6 shadow-[0_0_20px_rgba(112,0,255,0.5)]">2</div>
                <h3 className="text-2xl font-bold mb-4">Assign Tasks</h3>
                <p className="text-gray-400">Select the marketing functions you need. Feed them your playbooks and SOPs via natural language.</p>
              </GlowCard>

              <GlowCard glowColor="pink" className="bg-[#0A0D14] z-10">
                <div className="w-12 h-12 rounded-full bg-neon-pink text-white font-black flex items-center justify-center text-xl mb-6 shadow-[0_0_20px_rgba(255,0,229,0.5)]">3</div>
                <h3 className="text-2xl font-bold mb-4">Watch Execution</h3>
                <p className="text-gray-400">Step back. Watch as they execute workflows, log data, and generate revenue 24/7.</p>
              </GlowCard>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505] to-[#0A0D14]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink blur-[150px] opacity-20 pointer-events-none" />
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h2 className="text-5xl md:text-7xl font-black mb-8">
              Ready to fire your software?
            </h2>
            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Join the elite teams using Co-Agents to scale without the headcount.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/auth">
                <button className="px-10 py-5 bg-white text-black font-black text-xl rounded-full transition-transform hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.3)]">
                  Deploy Agents Now
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
};

export default Index;
