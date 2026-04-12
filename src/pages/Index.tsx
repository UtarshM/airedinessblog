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
      <Footer />
      {/* Animated Genie floating at bottom right */}
      <GenieAssistant />
    </div>
  );
};

export default Index;
