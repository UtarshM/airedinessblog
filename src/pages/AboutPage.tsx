import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { Sparkles, Brain, Cpu, Globe2 } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <MarketingNavbar />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto mb-24">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-neon-purple/30 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-neon-purple animate-pulse"></span>
              <span className="text-sm font-medium text-neon-purple uppercase tracking-wider">Our Mission</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1]">
              We are replacing the <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">software</span> with the <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-pink">worker.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 leading-relaxed">
              Software used to make human workers faster. Now, software is the worker. Our vision is to build an autonomous execution layer for every business on earth.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-32 max-w-5xl mx-auto">
            <div className="p-8 rounded-3xl border border-white/10 bg-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Brain className="w-10 h-10 text-neon-blue mb-6" />
              <h3 className="text-2xl font-bold mb-4">Intelligence First</h3>
              <p className="text-gray-400">We don't build dumb if/then workflows. We build intelligent agents that can reason, solve problems, and adapt to edge cases.</p>
            </div>
            
            <div className="p-8 rounded-3xl border border-white/10 bg-white/5 relative overflow-hidden group md:-translate-y-6">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Cpu className="w-10 h-10 text-neon-purple mb-6" />
              <h3 className="text-2xl font-bold mb-4">Autonomous Execution</h3>
              <p className="text-gray-400">Assistants wait for your command. Co-Agents proactively identify work, execute it, and report back the results.</p>
            </div>

            <div className="p-8 rounded-3xl border border-white/10 bg-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Globe2 className="w-10 h-10 text-neon-pink mb-6" />
              <h3 className="text-2xl font-bold mb-4">Infinite Scale</h3>
              <p className="text-gray-400">By removing the human bottleneck in operations, we enable companies of any size to operate with the throughput of an enterprise.</p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto p-1 border border-white/10 rounded-[2.5rem] bg-gradient-to-b from-white/5 to-transparent relative">
            <div className="absolute top-0 right-10 w-32 h-32 bg-neon-purple/20 blur-[50px] rounded-full pointer-events-none" />
            <div className="p-10 md:p-16 rounded-[2.4rem] bg-[#0A0D14] text-center">
              <Sparkles className="w-12 h-12 text-neon-blue mx-auto mb-8" />
              <h2 className="text-4xl font-bold mb-6">The Future is Autonomous</h2>
              <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                "In 5 years, the most successful companies won't be the ones with the largest headcount. They will be the ones with the smartest orchestration of AI agents."
              </p>

            </div>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
};

export default AboutPage;
