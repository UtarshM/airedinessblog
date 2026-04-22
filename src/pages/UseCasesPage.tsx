import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { GlowCard } from "@/components/marketing/GlowCard";
import { Briefcase, Building2, Store, Rocket } from "lucide-react";

const UseCasesPage = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <MarketingNavbar />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h1 className="text-5xl font-black mb-6">
              Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Scale.</span>
            </h1>
            <p className="text-xl text-gray-400">
              See how different industries are using Co-Agents to replace headcount and scale infinitely.
            </p>
          </div>

          <div className="flex flex-col gap-12">
            {/* Agencies */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <GlowCard glowColor="purple" className="order-2 md:order-1">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-neon-purple font-semibold mb-2 uppercase tracking-wide">The Problem</h4>
                    <p className="text-gray-300">High client churn due to slow execution. Scaling means hiring more account managers, cutting into margins.</p>
                  </div>
                  <div>
                    <h4 className="text-neon-blue font-semibold mb-2 uppercase tracking-wide">The Solution</h4>
                    <p className="text-gray-300">Deploy dedicated AI marketing functions for each client. Automate reporting, social posting, and ad optimizations.</p>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <h4 className="text-[#00FF66] font-semibold mb-2 uppercase tracking-wide">The Result</h4>
                    <p className="text-3xl font-bold">85% Higher Margin</p>
                  </div>
                </div>
              </GlowCard>
              <div className="order-1 md:order-2 px-4 md:px-12">
                <div className="w-16 h-16 bg-neon-purple/20 rounded-2xl flex items-center justify-center mb-6">
                  <Briefcase className="w-8 h-8 text-neon-purple" />
                </div>
                <h2 className="text-4xl font-bold mb-4">Marketing Agencies</h2>
                <p className="text-xl text-gray-400">Transform your agency into an AI-powered powerhouse. Take on 10x more clients without hiring a single new account manager.</p>
              </div>
            </div>

            {/* SaaS Startups */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="px-4 md:px-12">
                <div className="w-16 h-16 bg-neon-blue/20 rounded-2xl flex items-center justify-center mb-6">
                  <Rocket className="w-8 h-8 text-neon-blue" />
                </div>
                <h2 className="text-4xl font-bold mb-4">SaaS Startups</h2>
                <p className="text-xl text-gray-400">Don't waste funding on massive marketing teams. Let our AI handle inbound and outbound content at a fraction of the cost.</p>
              </div>
              <GlowCard glowColor="blue">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-neon-purple font-semibold mb-2 uppercase tracking-wide">The Problem</h4>
                    <p className="text-gray-300">Burning runway on marketing hires that take 3 months to ramp up and quit after 6 months.</p>
                  </div>
                  <div>
                    <h4 className="text-neon-blue font-semibold mb-2 uppercase tracking-wide">The Solution</h4>
                    <p className="text-gray-300">Instantly deploy AI marketing functions trained on your brand guidelines. They generate content 24/7 and drive traffic for your founders.</p>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <h4 className="text-[#00FF66] font-semibold mb-2 uppercase tracking-wide">The Result</h4>
                    <p className="text-3xl font-bold">3x Traffic Velocity</p>
                  </div>
                </div>
              </GlowCard>
            </div>

            {/* Enterprise-lite */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <GlowCard glowColor="pink" className="order-2 md:order-1">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-neon-purple font-semibold mb-2 uppercase tracking-wide">The Problem</h4>
                    <p className="text-gray-300">Siloed data across HubSpot, Google Analytics, ad platforms, and internal tools creating massive operational drag.</p>
                  </div>
                  <div>
                    <h4 className="text-neon-blue font-semibold mb-2 uppercase tracking-wide">The Solution</h4>
                    <p className="text-gray-300">AI acts as the central nervous system, identifying discrepancies, optimizing ad spend, and alerting on anomalies.</p>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <h4 className="text-[#00FF66] font-semibold mb-2 uppercase tracking-wide">The Result</h4>
                    <p className="text-3xl font-bold">Zero Data Drift</p>
                  </div>
                </div>
              </GlowCard>
              <div className="order-1 md:order-2 px-4 md:px-12">
                <div className="w-16 h-16 bg-neon-pink/20 rounded-2xl flex items-center justify-center mb-6">
                  <Building2 className="w-8 h-8 text-neon-pink" />
                </div>
                <h2 className="text-4xl font-bold mb-4">Enterprise-Lite</h2>
                <p className="text-xl text-gray-400">Connect the dots in your tech stack. Automated SEO and Analytics ensure your marketing data is perfect so leadership can make real decisions.</p>
              </div>
            </div>

          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
};

export default UseCasesPage;
