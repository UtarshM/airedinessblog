import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useReveal } from "@/hooks/useReveal";

const PricingPage = () => {
  const [annual, setAnnual] = useState(true);
  useReveal();

  return (
    <div className="min-h-screen bg-bg-2 text-ink">
      <MarketingNavbar />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-[1240px]">
          <div className="text-center max-w-3xl mx-auto mb-16 reveal">
            <div className="mono text-primary mb-4">— Pricing</div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
              Hire <span className="grad-text">Autonomy.</span> Not a team.
            </h1>
            <p className="text-xl text-ink-2 mb-8">
              A fraction of the cost of a human employee. 10x the output. Zero onboarding time.
            </p>

            <div className="inline-flex items-center gap-2 p-1.5 bg-white border border-line rounded-full shadow-sm">
              <button 
                onClick={() => setAnnual(false)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${!annual ? 'bg-primary text-white shadow-md' : 'text-ink-2 hover:text-ink'}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setAnnual(true)}
                className={`px-6 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${annual ? 'bg-primary text-white shadow-md' : 'text-ink-2 hover:text-ink'}`}
              >
                Annually <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${annual ? 'bg-white/20 text-white' : 'bg-primary-soft text-primary'}`}>Save 20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Starter */}
            <div className="bg-white border border-line rounded-3xl p-8 lg:p-9 flex flex-col gap-5 transition-all duration-250 hover:border-primary/30 hover:-translate-y-1 hover:shadow-[0_26px_50px_-22px_rgba(144,37,242,0.18)] shadow-[0_14px_40px_-28px_rgba(14,12,26,0.1)] reveal relative">
              <h3 className="font-display text-[22px] font-bold tracking-tight text-ink">Starter Free Plan</h3>
              <p className="text-[14px] text-ink-2 mb-6 min-h-[48px]">Perfect for solopreneurs looking to automate the basics.</p>
              <div className="mb-4">
                <span className="font-display font-black text-[54px] leading-none tracking-tight text-ink">Free</span>
              </div>
              <ul className="flex flex-col gap-3 mb-8 flex-grow text-[14px] text-ink-2 border-t border-line pt-5">
                <li className="flex items-start gap-2.5"><CheckCircle2 className="w-[18px] h-[18px] text-primary shrink-0 mt-0.5" /><span>5 Free Blogs</span></li>
                <li className="flex items-start gap-2.5"><CheckCircle2 className="w-[18px] h-[18px] text-primary shrink-0 mt-0.5" /><span>5 Social Media Posts</span></li>
                <li className="flex items-start gap-2.5"><CheckCircle2 className="w-[18px] h-[18px] text-primary shrink-0 mt-0.5" /><span>Comprehensive Site Audit</span></li>
                <li className="flex items-start gap-2.5"><CheckCircle2 className="w-[18px] h-[18px] text-primary shrink-0 mt-0.5" /><span>Blog & Social Media Scheduling</span></li>
              </ul>
              <Link to="/auth" className="btn btn-ghost w-full justify-center">Start Free Trial</Link>
            </div>

            {/* Growth (Highlighted) */}
            <div className="bg-gradient-to-b from-white to-primary-tint rounded-3xl p-8 lg:p-9 flex flex-col gap-5 transition-all duration-250 hover:-translate-y-1 shadow-[0_30px_60px_-22px_rgba(144,37,242,0.3)] reveal d1 relative md:-translate-y-4">
              <div className="absolute inset-0 rounded-3xl p-[1.5px] bg-grad [mask-image:linear-gradient(#fff_0_0)] [mask-composite:exclude] pointer-events-none"></div>
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-white font-display font-extrabold text-[11px] tracking-widest uppercase px-3.5 py-1.5 rounded-lg z-10">Most Popular</span>
              
              <h3 className="font-display text-[22px] font-bold tracking-tight text-ink relative z-10">Pro Plan</h3>
              <p className="text-[14px] text-ink-2 mb-6 min-h-[48px] relative z-10">A full autonomous team for growing startups and agencies.</p>
              <div className="mb-4 relative z-10">
                <span className="font-display font-black text-[54px] leading-none tracking-tight text-primary">${annual ? '119' : '149'}</span>
                <span className="text-[14px] font-medium text-muted tracking-normal ml-1.5 font-sans">/mo</span>
              </div>
              <ul className="flex flex-col gap-3 mb-8 flex-grow text-[14px] text-ink-2 border-t border-line pt-5 relative z-10">
                <li className="flex items-start gap-2.5"><CheckCircle2 className="w-[18px] h-[18px] text-primary shrink-0 mt-0.5" /><span className="font-semibold text-ink">Everything in Starter Free</span></li>
                <li className="flex items-start gap-2.5"><CheckCircle2 className="w-[18px] h-[18px] text-primary shrink-0 mt-0.5" /><span>AEO (Answer Engine Optimization)</span></li>
                <li className="flex items-start gap-2.5"><CheckCircle2 className="w-[18px] h-[18px] text-primary shrink-0 mt-0.5" /><span>GEO (Generative Engine Optimization)</span></li>
                <li className="flex items-start gap-2.5"><CheckCircle2 className="w-[18px] h-[18px] text-primary shrink-0 mt-0.5" /><span>Full Site Optimization</span></li>
                <li className="flex items-start gap-2.5"><CheckCircle2 className="w-[18px] h-[18px] text-primary shrink-0 mt-0.5" /><span>Comprehensive SEO Suite</span></li>
              </ul>
              <Link to="/auth" className="btn btn-grad w-full justify-center relative z-10">Deploy Now</Link>
            </div>

            {/* Scale */}
            <div className="bg-white border border-line rounded-3xl p-8 lg:p-9 flex flex-col gap-5 transition-all duration-250 hover:border-primary/30 hover:-translate-y-1 hover:shadow-[0_26px_50px_-22px_rgba(144,37,242,0.18)] shadow-[0_14px_40px_-28px_rgba(14,12,26,0.1)] reveal d2 relative">
              <h3 className="font-display text-[22px] font-bold tracking-tight text-ink">Enterprise Custom</h3>
              <p className="text-[14px] text-ink-2 mb-6 min-h-[48px]">Unlimited autonomous execution for enterprise operations.</p>
              <div className="mb-4">
                <span className="font-display font-black text-[54px] leading-none tracking-tight text-ink">Custom</span>
              </div>
              <ul className="flex flex-col gap-3 mb-8 flex-grow text-[14px] text-ink-2 border-t border-line pt-5">
                <li className="flex items-start gap-2.5"><CheckCircle2 className="w-[18px] h-[18px] text-pink shrink-0 mt-0.5" /><span className="font-semibold text-ink">All Pro Plan Features</span></li>
                <li className="flex items-start gap-2.5"><CheckCircle2 className="w-[18px] h-[18px] text-pink shrink-0 mt-0.5" /><span>Meta & Google Ads Optimization</span></li>
                <li className="flex items-start gap-2.5"><CheckCircle2 className="w-[18px] h-[18px] text-pink shrink-0 mt-0.5" /><span>Social Media Images & Video Generation</span></li>
                <li className="flex items-start gap-2.5"><CheckCircle2 className="w-[18px] h-[18px] text-pink shrink-0 mt-0.5" /><span>Brand Analytics & Competitor Tracking</span></li>
                <li className="flex items-start gap-2.5"><CheckCircle2 className="w-[18px] h-[18px] text-pink shrink-0 mt-0.5" /><span>Deep Market Research</span></li>
              </ul>
              <Link to="/contact" className="btn btn-ghost w-full justify-center flex items-center gap-2">Contact Sales <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </div>

          {/* Feature Comparison Table */}
          <div className="mt-32 max-w-5xl mx-auto reveal">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Compare Features</h2>
              <p className="text-ink-2">A detailed breakdown of what's included in each plan.</p>
            </div>
            
            <div className="bg-white border border-line rounded-3xl overflow-hidden shadow-[0_14px_40px_-28px_rgba(14,12,26,0.1)]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-bg-2 border-b border-line">
                    <th className="py-5 px-6 text-ink-2 font-medium">Features</th>
                    <th className="py-5 px-6 text-ink font-bold text-center border-l border-line">Starter Free</th>
                    <th className="py-5 px-6 text-primary font-bold text-center border-l border-line bg-primary-tint">Pro Plan</th>
                    <th className="py-5 px-6 text-pink font-bold text-center border-l border-line">Enterprise Custom</th>
                  </tr>
                </thead>
                <tbody className="text-[14.5px] text-ink-2">
                  <tr className="border-b border-line">
                    <td className="py-4 px-6 font-medium text-ink">Projects</td>
                    <td className="py-4 px-6 text-center border-l border-line">1 Project</td>
                    <td className="py-4 px-6 text-center border-l border-line bg-primary-tint font-bold text-primary">5 Projects</td>
                    <td className="py-4 px-6 text-center border-l border-line font-bold text-pink">Unlimited</td>
                  </tr>
                  <tr className="border-b border-line bg-bg-2">
                    <td className="py-4 px-6 font-medium text-ink">AI Blog Generation</td>
                    <td className="py-4 px-6 text-center border-l border-line">5 / month</td>
                    <td className="py-4 px-6 text-center border-l border-line bg-primary-tint font-bold text-primary">Unlimited</td>
                    <td className="py-4 px-6 text-center border-l border-line font-bold text-pink">Unlimited</td>
                  </tr>
                  <tr className="border-b border-line">
                    <td className="py-4 px-6 font-medium text-ink">Social Media Posts</td>
                    <td className="py-4 px-6 text-center border-l border-line">5 / month</td>
                    <td className="py-4 px-6 text-center border-l border-line bg-primary-tint font-bold text-primary">Unlimited</td>
                    <td className="py-4 px-6 text-center border-l border-line font-bold text-pink">Unlimited</td>
                  </tr>
                  <tr className="border-b border-line bg-bg-2">
                    <td className="py-4 px-6 font-medium text-ink">Site Audit & Scheduling</td>
                    <td className="py-4 px-6 text-center border-l border-line"><span className="text-primary font-bold">✓</span></td>
                    <td className="py-4 px-6 text-center border-l border-line bg-primary-tint"><span className="text-primary font-bold">✓</span></td>
                    <td className="py-4 px-6 text-center border-l border-line"><span className="text-pink font-bold">✓</span></td>
                  </tr>
                  <tr className="border-b border-line">
                    <td className="py-4 px-6 font-medium text-ink">AEO & GEO Optimization</td>
                    <td className="py-4 px-6 text-center border-l border-line text-muted">—</td>
                    <td className="py-4 px-6 text-center border-l border-line bg-primary-tint"><span className="text-primary font-bold">✓</span></td>
                    <td className="py-4 px-6 text-center border-l border-line"><span className="text-pink font-bold">✓</span></td>
                  </tr>
                  <tr className="border-b border-line bg-bg-2">
                    <td className="py-4 px-6 font-medium text-ink">Meta & Google Ads Optimization</td>
                    <td className="py-4 px-6 text-center border-l border-line text-muted">—</td>
                    <td className="py-4 px-6 text-center border-l border-line bg-primary-tint text-muted">—</td>
                    <td className="py-4 px-6 text-center border-l border-line"><span className="text-pink font-bold">✓</span></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium text-ink">Brand Analytics & Competitor Tracking</td>
                    <td className="py-4 px-6 text-center border-l border-line text-muted">—</td>
                    <td className="py-4 px-6 text-center border-l border-line bg-primary-tint text-muted">—</td>
                    <td className="py-4 px-6 text-center border-l border-line"><span className="text-pink font-bold">✓</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQs */}
          <div className="mt-32 max-w-3xl mx-auto reveal">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-ink-2">Everything you need to know about our billing and plans.</p>
            </div>
            
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-white border border-line shadow-sm">
                <h4 className="text-lg font-bold mb-2 text-ink">Can I upgrade or downgrade my plan at any time?</h4>
                <p className="text-ink-2 leading-relaxed text-[15px]">Yes! You can switch plans at any point. If you upgrade, you'll be prorated for the remainder of your billing cycle. If you downgrade, the new rate will apply at the start of your next billing cycle.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white border border-line shadow-sm">
                <h4 className="text-lg font-bold mb-2 text-ink">What is AEO and GEO?</h4>
                <p className="text-ink-2 leading-relaxed text-[15px]">AEO (Answer Engine Optimization) and GEO (Generative Engine Optimization) are the next evolution of SEO. Our AI optimizes your content specifically so it gets sourced and cited by AI models like ChatGPT, Perplexity, and Google Gemini.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white border border-line shadow-sm">
                <h4 className="text-lg font-bold mb-2 text-ink">Do I need a credit card for the Starter Free plan?</h4>
                <p className="text-ink-2 leading-relaxed text-[15px]">No credit card is required for the Starter Free plan. You can use your 5 free blogs, 5 social media posts, and run a site audit completely free to test the waters.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
};

export default PricingPage;
