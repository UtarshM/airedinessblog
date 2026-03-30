import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { GenieSection } from "@/components/landing/GenieSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
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
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 selection:text-primary overflow-x-hidden relative">
      <LandingNavbar />
      <main>
        <HeroSection />
        <GenieSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection />
      </main>
      <Footer />
      {/* Animated Genie floating at bottom right */}
      <GenieAssistant />
    </div>
  );
};

export default Index;
