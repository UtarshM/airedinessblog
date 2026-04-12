import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { SolutionSection } from "@/components/landing/SolutionSection";
import { GenieSection } from "@/components/landing/GenieSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { FeatureDeepDive } from "@/components/landing/FeatureDeepDive";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { SocialProof } from "@/components/landing/SocialProof";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";
import { GenieAssistant } from "@/components/GenieAssistant";
import { useEffect } from "react";

const Index = () => {
  // Add smooth scrolling for anchor links
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-[#00FF66]/30 selection:text-[#00FF66] overflow-x-hidden relative">
      <LandingNavbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <GenieSection />
        <FeaturesSection />
        <FeatureDeepDive />
        <HowItWorksSection />
        <SocialProof />
        <CTASection />
      </main>
      
      {/* Sticky Mobile CTA - Matches User Screenshot conversion style */}
      <div className="md:hidden fixed bottom-10 left-4 right-4 z-[100] animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <Link to="/auth">
          <button className="w-full h-16 bg-[#00FF66] text-black font-black text-lg rounded-2xl shadow-2xl shadow-[#00FF66]/30 flex items-center justify-between px-8 border border-white/20 active:scale-95 transition-transform group">
            <span>GO AUTONOMOUS</span>
            <div className="bg-black/10 rounded-full p-2 group-hover:translate-x-1 transition-transform">
              <Sparkles className="h-5 w-5" />
            </div>
          </button>
        </Link>
      </div>

      <Footer />
      {/* Animated Genie floating at bottom right - Shifted up for mobile CTA */}
      <div className="mb-20 md:mb-0">
        <GenieAssistant />
      </div>
    </div>
  );
};

export default Index;
