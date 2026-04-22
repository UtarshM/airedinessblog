import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { GlowCard } from "@/components/marketing/GlowCard";
import { Mail, MessageSquare, Phone } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <MarketingNavbar />
      
      <main className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-neon-blue/10 blur-[150px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-neon-purple/10 blur-[150px] rounded-full pointer-events-none -translate-x-1/2 translate-y-1/2" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-black mb-6">
                Let's talk <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Execution.</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Ready to replace manual workflows with autonomous agents? Book a demo or reach out to our team.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Contact Info */}
              <div className="space-y-8">
                <GlowCard glowColor="blue" className="border-white/10 flex items-start gap-6">
                  <div className="w-12 h-12 rounded-xl bg-neon-blue/20 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-6 h-6 text-neon-blue" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Sales Demo</h3>
                    <p className="text-gray-400 mb-4">See how Co-Agents can specifically solve your operational bottlenecks.</p>
                    <a href="mailto:sales@coagent.ai" className="text-neon-blue hover:text-white transition-colors font-medium">sales@coagent.ai</a>
                  </div>
                </GlowCard>

                <GlowCard glowColor="purple" className="border-white/10 flex items-start gap-6">
                  <div className="w-12 h-12 rounded-xl bg-neon-purple/20 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-neon-purple" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Support</h3>
                    <p className="text-gray-400 mb-4">Already a customer? Our dedicated success team is here to help you scale.</p>
                    <a href="mailto:support@coagent.ai" className="text-neon-purple hover:text-white transition-colors font-medium">support@coagent.ai</a>
                  </div>
                </GlowCard>

                <GlowCard glowColor="pink" className="border-white/10 flex items-start gap-6">
                  <div className="w-12 h-12 rounded-xl bg-neon-pink/20 flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-neon-pink" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Enterprise Inquiries</h3>
                    <p className="text-gray-400 mb-4">Looking for custom deployments, on-prem solutions, or high-volume execution?</p>
                    <a href="#" className="text-neon-pink hover:text-white transition-colors font-medium">Book Enterprise Consultation &rarr;</a>
                  </div>
                </GlowCard>
              </div>

              {/* Contact Form / Calendly Placeholder */}
              <div className="glass-card rounded-3xl p-8 border border-white/10 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-3xl pointer-events-none" />
                <h3 className="text-2xl font-bold mb-8 relative z-10">Send us a message</h3>
                
                <form className="relative z-10 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">First Name</label>
                      <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">Last Name</label>
                      <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors" placeholder="Doe" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Work Email</label>
                    <input type="email" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors" placeholder="john@company.com" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">How can we help?</label>
                    <textarea rows={4} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors resize-none" placeholder="Tell us about your current workflow..." />
                  </div>

                  <button type="button" className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
};

export default ContactPage;
