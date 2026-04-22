import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { GlowCard } from "@/components/marketing/GlowCard";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const PricingPage = () => {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <MarketingNavbar />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-5xl font-black mb-6">
              Hire <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Autonomy.</span> Not a team.
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              A fraction of the cost of a human employee. 10x the output. Zero onboarding time.
            </p>

            <div className="inline-flex items-center gap-2 p-1 bg-white/5 border border-white/10 rounded-full">
              <button 
                onClick={() => setAnnual(false)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${!annual ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setAnnual(true)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${annual ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Annually <span className="text-neon-blue text-xs ml-1">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter */}
            <GlowCard glowColor="blue" className="border-white/10 flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Starter Free Plan</h3>
              <p className="text-gray-400 mb-6 min-h-[48px]">Perfect for solopreneurs looking to automate the basics.</p>
              <div className="mb-8">
                <span className="text-5xl font-black">Free</span>
              </div>
              <ul className="flex flex-col gap-4 mb-8 flex-grow">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-neon-blue shrink-0" /><span className="text-gray-300">5 Free Blogs</span></li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-neon-blue shrink-0" /><span className="text-gray-300">5 Social Media Posts</span></li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-neon-blue shrink-0" /><span className="text-gray-300">Comprehensive Site Audit</span></li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-neon-blue shrink-0" /><span className="text-gray-300">Blog & Social Media Scheduling</span></li>
              </ul>
              <Link to="/auth">
                <button className="w-full py-3 rounded-xl border border-white/20 hover:bg-white/5 transition-colors font-semibold">Start Free Trial</button>
              </Link>
            </GlowCard>

            {/* Growth (Highlighted) */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-neon-blue to-neon-purple rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity" />
              <GlowCard glowColor="purple" className="border-neon-purple/50 bg-[#0A0D14] h-full flex flex-col transform md:-translate-y-4">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full text-xs font-bold uppercase tracking-wider">
                  Most Popular
                </div>
                <h3 className="text-2xl font-bold mb-2">Pro Plan</h3>
                <p className="text-gray-400 mb-6 min-h-[48px]">A full autonomous team for growing startups and agencies.</p>
                <div className="mb-8">
                  <span className="text-5xl font-black">${annual ? '129' : '149'}</span>
                  <span className="text-gray-400">/mo</span>
                </div>
                <ul className="flex flex-col gap-4 mb-8 flex-grow">
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-neon-purple shrink-0" /><span className="text-white font-medium">Everything in Starter Free</span></li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-neon-purple shrink-0" /><span className="text-gray-300">AEO (Answer Engine Optimization)</span></li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-neon-purple shrink-0" /><span className="text-gray-300">GEO (Generative Engine Optimization)</span></li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-neon-purple shrink-0" /><span className="text-gray-300">Full Site Optimization</span></li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-neon-purple shrink-0" /><span className="text-gray-300">Comprehensive SEO Suite</span></li>
                </ul>
                <Link to="/auth">
                  <button className="w-full py-3 rounded-xl bg-white text-black hover:bg-gray-200 transition-colors font-bold text-lg">Deploy Now</button>
                </Link>
              </GlowCard>
            </div>

            {/* Scale */}
            <GlowCard glowColor="pink" className="border-white/10 flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Enterprise Custom</h3>
              <p className="text-gray-400 mb-6 min-h-[48px]">Unlimited autonomous execution for enterprise operations.</p>
              <div className="mb-8">
                <span className="text-5xl font-black">Custom</span>
              </div>
              <ul className="flex flex-col gap-4 mb-8 flex-grow">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-neon-pink shrink-0" /><span className="text-white font-medium">All Pro Plan Features</span></li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-neon-pink shrink-0" /><span className="text-gray-300">Meta & Google Ads Optimization</span></li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-neon-pink shrink-0" /><span className="text-gray-300">Social Media Images & Video Generation</span></li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-neon-pink shrink-0" /><span className="text-gray-300">Brand Analytics & Competitor Tracking</span></li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-neon-pink shrink-0" /><span className="text-gray-300">Deep Market Research</span></li>
              </ul>
              <Link to="/contact">
                <button className="w-full py-3 rounded-xl border border-white/20 hover:bg-white/5 transition-colors font-semibold flex items-center justify-center gap-2">Contact Sales <ArrowRight className="w-4 h-4" /></button>
              </Link>
            </GlowCard>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
};

export default PricingPage;
