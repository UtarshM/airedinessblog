import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { GlowCard } from "@/components/marketing/GlowCard";
import { Bot, Network, Workflow, Zap, Database, MessageSquare } from "lucide-react";

const FeaturesPage = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <MarketingNavbar />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h1 className="text-5xl font-black mb-6">
              Features that <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">execute.</span>
            </h1>
            <p className="text-xl text-gray-400">
              Stop looking for software that makes your team 10% more efficient. Look for agents that replace the work entirely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <GlowCard glowColor="blue">
              <Database className="w-10 h-10 text-neon-blue mb-6" />
              <h3 className="text-2xl font-bold mb-4">Autonomous CRM</h3>
              <p className="text-gray-400">
                Your CRM updates itself. Agents listen to calls, read emails, and automatically log notes, update deal stages, and score leads.
              </p>
            </GlowCard>

            <GlowCard glowColor="purple">
              <MessageSquare className="w-10 h-10 text-neon-purple mb-6" />
              <h3 className="text-2xl font-bold mb-4">Omnichannel Outreach</h3>
              <p className="text-gray-400">
                Email, LinkedIn, WhatsApp, and SMS—handled simultaneously. Agents nurture leads across platforms with context-aware responses.
              </p>
            </GlowCard>

            <GlowCard glowColor="pink">
              <Workflow className="w-10 h-10 text-neon-pink mb-6" />
              <h3 className="text-2xl font-bold mb-4">Self-Healing Workflows</h3>
              <p className="text-gray-400">
                If a Zapier integration breaks, it's a nightmare. If an agent hits an error, it problem-solves and finds an alternative route.
              </p>
            </GlowCard>

            <GlowCard glowColor="green">
              <Zap className="w-10 h-10 text-[#00FF66] mb-6" />
              <h3 className="text-2xl font-bold mb-4">Real-time Execution</h3>
              <p className="text-gray-400">
                Inbound lead hits the form? Within 30 seconds, they've been researched, scored, and texted by a Sales Agent to book a call.
              </p>
            </GlowCard>

            <GlowCard glowColor="blue">
              <Network className="w-10 h-10 text-neon-blue mb-6" />
              <h3 className="text-2xl font-bold mb-4">Cross-Agent Memory</h3>
              <p className="text-gray-400">
                The Marketing Agent learns what messaging works and instantly updates the Sales Agent's playbook. A unified intelligence.
              </p>
            </GlowCard>

            <GlowCard glowColor="purple">
              <Bot className="w-10 h-10 text-neon-purple mb-6" />
              <h3 className="text-2xl font-bold mb-4">Custom Agent Builder</h3>
              <p className="text-gray-400">
                Need an agent specifically for managing your unique supply chain? Train a new Co-Agent in hours using natural language.
              </p>
            </GlowCard>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
};

export default FeaturesPage;
