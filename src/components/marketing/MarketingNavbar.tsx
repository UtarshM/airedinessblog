import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Sparkles, ArrowRight } from "lucide-react";

export const MarketingNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#050505]/80 backdrop-blur-md border-b border-white/5 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-neon-blue/10 p-2 rounded-lg border border-neon-blue/20 group-hover:border-neon-blue/50 transition-colors">
              <Sparkles className="w-5 h-5 text-neon-blue" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-neon-blue group-hover:to-neon-purple transition-all duration-300">
              CoAgent<span className="text-neon-purple">.ai</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6 bg-white/5 px-6 py-2 rounded-full border border-white/10 backdrop-blur-sm">
              <Link to="/features" className="text-sm text-gray-300 hover:text-white transition-colors">
                Features
              </Link>
              <Link to="/use-cases" className="text-sm text-gray-300 hover:text-white transition-colors">
                Use Cases
              </Link>
              <Link to="/pricing" className="text-sm text-gray-300 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link to="/about" className="text-sm text-gray-300 hover:text-white transition-colors">
                About
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              <Link to="/auth" className="text-sm text-gray-300 hover:text-white font-medium transition-colors">
                Login
              </Link>
              <Link to="/auth">
                <button className="group relative px-5 py-2.5 bg-white text-black font-semibold rounded-full overflow-hidden transition-transform active:scale-95">
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-neon-blue to-neon-purple opacity-0 group-hover:opacity-20 transition-opacity" />
                  <span className="relative flex items-center gap-2">
                    Book Demo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-gray-300 hover:text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#050505] border-b border-white/10 py-6 px-4 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-top-2">
            <Link to="/features" className="text-lg text-gray-300 py-2 border-b border-white/5" onClick={() => setMobileMenuOpen(false)}>
              Features
            </Link>
            <Link to="/use-cases" className="text-lg text-gray-300 py-2 border-b border-white/5" onClick={() => setMobileMenuOpen(false)}>
              Use Cases
            </Link>
            <Link to="/pricing" className="text-lg text-gray-300 py-2 border-b border-white/5" onClick={() => setMobileMenuOpen(false)}>
              Pricing
            </Link>
            <Link to="/about" className="text-lg text-gray-300 py-2 border-b border-white/5" onClick={() => setMobileMenuOpen(false)}>
              About
            </Link>
            <div className="flex flex-col gap-3 mt-4">
              <Link to="/auth" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full py-3 rounded-xl border border-white/10 text-white font-medium">
                  Login
                </button>
              </Link>
              <Link to="/auth" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-medium flex items-center justify-center gap-2">
                  Book Demo <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
