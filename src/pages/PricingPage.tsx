import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { Check, X, Shield, Zap, TrendingUp, Clock, Globe, ArrowRight } from "lucide-react";

const PricingPage = () => {

    return (
        <div className="min-h-screen bg-mesh text-white font-sans selection:bg-[#00FF66]/30 selection:text-[#00FF66] overflow-x-hidden">
            {/* Navbar must adapt to dark mode manually if it doesn't support it out of the box. 
          Assuming LandingNavbar respects the current context, or we just force the dark styling. */}
            <div className="dark">
                <LandingNavbar />
            </div>

            <main className="py-20 px-4 md:px-8 max-w-7xl mx-auto space-y-32">
                {/* === HEADER & PRICING CARDS === */}
                <section className="text-center space-y-16">
                    <div className="space-y-4 max-w-2xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                            Choose Your <span className="text-[#00FF66]">Agent</span> <br /> Team Size
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Deploy autonomous marketing agents that build your brand 24/7. Choose the plan that fits your growth velocity.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
                        {/* Free Plan */}
                        <div className="p-8 rounded-2xl glass-card hover-glow transition-all duration-500 flex flex-col h-full text-left">
                            <div className="mb-8">
                                <span className="text-gray-400 font-medium tracking-widest text-sm uppercase">Starter</span>
                                <h3 className="text-3xl font-bold mt-2">Free</h3>
                                <p className="text-gray-400 mt-2 text-sm">$0/month</p>
                                <div className="h-px w-full bg-[#1F2937] my-6"></div>
                                <p className="text-sm text-gray-400">Perfect to test the waters. Generates up to 5 articles.</p>
                            </div>
                            <ul className="space-y-4 flex-1 mb-8">
                                {["5 AI Articles / Month", "Standard AI Research", "Standard Post Types", "Standard Image Gen", "1 Brand Kits"].map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                        <Check className="h-5 w-5 text-[#00FF66] shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link to="/auth">
                                <Button variant="outline" className="w-full text-white border-white/20 hover:bg-white hover:text-black">
                                    Get Started Free
                                </Button>
                            </Link>
                        </div>

                        {/* Pro Plan */}
                        <div className="p-8 rounded-2xl glass-card border-2 border-[#00FF66] shadow-[0_0_30px_rgba(0,255,102,0.15)] hover-glow transition-all duration-500 relative flex flex-col h-full text-left">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#00FF66] text-black font-bold uppercase tracking-wider text-[10px] px-3 py-1 rounded-full">
                                Most Popular
                            </div>
                            <div className="mb-8">
                                <span className="text-[#00FF66] font-medium tracking-widest text-sm uppercase">Pro</span>
                                <h3 className="text-4xl font-bold mt-2">$49<span className="text-xl text-gray-400 font-medium">/mo</span></h3>
                                <p className="text-gray-400 mt-2 text-sm">~ $1.63 per article</p>
                                <div className="h-px w-full bg-[#1F2937] my-6"></div>
                                <p className="text-sm font-semibold text-white">Generates up to 30 highly optimized articles.</p>
                            </div>
                            <ul className="space-y-4 flex-1 mb-8">
                                {[
                                    "30 AI Articles / Month",
                                    "In-Depth SERP Intelligence",
                                    "Internal Link Building",
                                    "Premium Image Generation",
                                    "Auto-Publish to WordPress",
                                    "Custom Structure Controls",
                                    "Unlimited Brand Kits",
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-gray-200 font-medium">
                                        <Check className="h-5 w-5 text-[#00FF66] shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <a href="mailto:scalezix@gmail.com?subject=Upgrade%20to%20Pro%20Plan">
                                <Button className="w-full bg-[#00FF66] text-black hover:bg-[#00CC52] font-semibold text-lg py-6 shadow-[0_0_20px_rgba(0,255,102,0.3)]">
                                    Contact to Upgrade
                                </Button>
                            </a>
                        </div>

                        {/* Custom Plan */}
                        <div className="p-8 rounded-2xl glass-card hover-glow transition-all duration-500 flex flex-col h-full text-left">
                            <div className="mb-8">
                                <span className="text-gray-400 font-medium tracking-widest text-sm uppercase">Scale</span>
                                <h3 className="text-3xl font-bold mt-2">$99<span className="text-xl text-gray-400 font-medium">/mo</span></h3>
                                <p className="text-gray-400 mt-2 text-sm">~ $0.99 per article</p>
                                <div className="h-px w-full bg-[#1F2937] my-6"></div>
                                <p className="text-sm text-gray-400">For agencies and high-volume niche site builders.</p>
                            </div>
                            <ul className="space-y-4 flex-1 mb-8">
                                {[
                                    "100 AI Articles / Month",
                                    "Everything in Pro",
                                    "Priority Email Support",
                                    "Multiple WordPress Sites",
                                    "Bulk Generation (Up to 50 at once)",
                                    "Custom Formatting Templates",
                                    "AEO Analytics Module (Coming Soon)"
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                        <Check className="h-5 w-5 text-[#00FF66] shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <a href="mailto:scalezix@gmail.com?subject=Upgrade%20to%20Scale%20Plan">
                                <Button variant="outline" className="w-full text-white border-white/20 hover:bg-white hover:text-black">
                                    Contact to Upgrade
                                </Button>
                            </a>
                        </div>
                    </div>
                </section>

                {/* === BUILT FOR FOUNDERS === */}
                <section className="max-w-4xl mx-auto text-center space-y-10">
                    <p className="text-[#00FF66] font-semibold tracking-widest text-sm uppercase">Use Cases</p>
                    <h2 className="text-3xl md:text-4xl font-bold">Built For <span className="text-[#00FF66]">Founders Who Move Fast</span></h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-[#111827] p-6 rounded-xl border border-[#1F2937] text-left">
                            <h3 className="font-bold text-lg mb-2">Solopreneurs</h3>
                            <p className="text-sm text-gray-400">Building multiple side-projects while working a 9-5. Let FUPilot handle the organic marketing so you can focus on building the product.</p>
                        </div>
                        <div className="bg-[#111827] p-6 rounded-xl border border-[#1F2937] text-left">
                            <h3 className="font-bold text-lg mb-2">Content Marketers</h3>
                            <p className="text-sm text-gray-400">Scaling B2B SaaS traffic. Publish well-researched, high-quality, long-form content consistently without the massive agency retainer.</p>
                        </div>
                        <div className="bg-[#111827] p-6 rounded-xl border border-[#1F2937] text-left">
                            <h3 className="font-bold text-lg mb-2">Agencies</h3>
                            <p className="text-sm text-gray-400">Managing SEO for 10+ clients. Instantly deliver a month's worth of optimized content, expanding your margins substantially.</p>
                        </div>
                        <div className="bg-[#111827] p-6 rounded-xl border border-[#1F2937] text-left">
                            <h3 className="font-bold text-lg mb-2">Niche Site Owners</h3>
                            <p className="text-sm text-gray-400">Building a portfolio of monetized websites. Crank out 100s of informational guides per month, completely hands-off.</p>
                        </div>
                    </div>
                </section>

                {/* === FIVE AI AGENTS === */}
                <section className="max-w-3xl mx-auto space-y-10">
                    <div className="text-center space-y-2">
                        <p className="text-[#00FF66] font-semibold tracking-widest text-sm uppercase">The Workflow</p>
                        <h2 className="text-3xl md:text-4xl font-bold">Five AI Agents Working <span className="text-[#00FF66]">24/7 for You</span></h2>
                        <p className="text-gray-400 text-sm">Our deeply integrated multi-agent architecture runs like a top-tier editorial team.</p>
                    </div>

                    <div className="space-y-4">
                        {[
                            { title: "Research Agent", desc: "Scrapes the top 20 Google SERP results for your keyword to extract LSI keywords, search intent, and structural patterns." },
                            { title: "Writer Agent", desc: "Crafts engaging, bursty, and unpredictable paragraphs designed specifically to bypass AI detection and sound deeply human." },
                            { title: "SEO Agent", desc: "Ensures optimal keyword density, naturally weaves internal links, and generates Schema markup (FAQ & BlogPosting)." },
                            { title: "Visuals Agent", desc: "Customizes highly contextual featured images via Pollinations AI specifically suited to the article's core topic." },
                            { title: "Publishing Agent", desc: "Formats perfect Markdown and automatically pushes the finished draft to your WordPress site with meta tags intact." }
                        ].map((agent, i) => (
                            <div key={i} className="flex gap-4 p-5 rounded-xl border border-[#1F2937] bg-gradient-to-r from-[#111827] to-[#0A0D14] items-start">
                                <div className="bg-[#00FF66]/20 p-2 rounded-full border border-[#00FF66]/50">
                                    <Check className="h-4 w-4 text-[#00FF66]" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg text-white group-hover:text-[#00FF66] transition-colors">{agent.title} <span className="text-[#00FF66] text-sm font-medium ml-2 border border-[#00FF66]/30 bg-[#00FF66]/10 px-2 py-0.5 rounded-full">v2.0</span></h4>
                                    <p className="text-sm text-gray-400 mt-1">{agent.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* === COST COMPARISON === */}
                <section className="max-w-5xl mx-auto space-y-16 text-center">
                    <div className="space-y-4">
                        <p className="text-[#00FF66] font-semibold tracking-widest text-sm uppercase">The Comparison</p>
                        <h2 className="text-3xl md:text-5xl font-bold">Why <span className="text-[#00FF66]">Choose Agents?</span></h2>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-[#1F2937] bg-[#111827] shadow-2xl">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-[#1F2937]/50 border-b border-[#1F2937]">
                                <tr>
                                    <th className="p-6 font-semibold text-gray-400">Feature / Capability</th>
                                    <th className="p-6 font-bold text-white bg-[#00FF66]/10 border-x border-[#00FF66]/20 relative">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-[#00FF66]"></div>
                                        FUPilot AI
                                    </th>
                                    <th className="p-6 font-semibold text-gray-400">Other AI Tools</th>
                                    <th className="p-6 font-semibold text-gray-400">Marketing Agencies</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1F2937]">
                                {[
                                    { f: "Marketing Strategy + Execution", c1: true, c2: "X (just content generation)", c3: true },
                                    { f: "Multi-Channel Campaigns (SEO, Paid, UGC, Email, etc.)", c1: true, c2: "X (usually single channel)", c3: true },
                                    { f: "Specialized Roles (Agents)", c1: true, c2: false, c3: "✔ (human)" },
                                    { f: "Instant Onboarding / No Setup", c1: true, c2: "! (needs prompts/workflows)", c3: "X (takes time/contracts)" },
                                    { f: "Ongoing competitor & market research to identify gaps", c1: true, c2: false, c3: "X (takes time/research needed)" },
                                    { f: "Affordable & Scalable", c1: true, c2: true, c3: "X (high retainers)" },
                                    { f: "Always Available / No Delays", c1: true, c2: true, c3: "X (limited hours)" },
                                    { f: "Built for All Team Sizes", c1: true, c2: true, c3: "! (mostly mid/large biz)" }
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="p-6 text-gray-300 font-medium">{row.f}</td>
                                        <td className="p-6 bg-[#00FF66]/5 border-x border-[#00FF66]/10 text-center">
                                            <div className="flex justify-center">
                                                <div className="bg-[#00FF66] rounded-sm p-0.5">
                                                    <Check className="h-4 w-4 text-black stroke-[3]" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 text-gray-400 text-center">
                                            {typeof row.c2 === "string" ? (
                                                <span className={row.c2.startsWith("X") ? "text-red-500" : "text-amber-500"}>{row.c2}</span>
                                            ) : row.c2 === true ? (
                                                <div className="flex justify-center"><Check className="h-4 w-4 text-[#00FF66]" /></div>
                                            ) : (
                                                <div className="flex justify-center"><X className="h-4 w-4 text-red-500" /></div>
                                            )}
                                        </td>
                                        <td className="p-6 text-gray-400 text-center">
                                            {typeof row.c3 === "string" ? (
                                                <span className={row.c3.startsWith("X") ? "text-red-500" : "text-emerald-500"}>{row.c3}</span>
                                            ) : row.c3 === true ? (
                                                <div className="flex justify-center"><Check className="h-4 w-4 text-[#00FF66]" /></div>
                                            ) : (
                                                <div className="flex justify-center"><X className="h-4 w-4 text-red-500" /></div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* === COMING SOON: AEO ANALYTICS === */}
                <section className="max-w-4xl mx-auto rounded-3xl border-2 border-dashed border-[#00FF66]/30 bg-[#111827]/50 p-10 text-center relative overflow-hidden backdrop-blur-sm">
                    <div className="inline-block bg-[#00FF66]/10 text-[#00FF66] px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4 border border-[#00FF66]/20">
                        Coming Soon to All Paid Plans
                    </div>
                    <h2 className="text-3xl font-bold mb-3">AEO Analytics Dashboard</h2>
                    <p className="text-gray-400 max-w-xl mx-auto mb-6">Track <span className="text-white font-medium">Answer Engine Optimization (AEO)</span> performance. Monitor your visibility on Perplexity, ChatGPT Search, and Google AI Overviews in real-time.</p>

                    <div className="flex justify-center flex-wrap gap-4 text-sm text-gray-300">
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#00FF66] animate-pulse"></div> LLM Citation Tracking</div>
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#00FF66] animate-pulse"></div> AI Overview Ranking</div>
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#00FF66] animate-pulse"></div> Conversational Queries</div>
                    </div>
                </section>

                {/* === TESTIMONIALS === */}
                <section className="max-w-5xl mx-auto space-y-10 text-center">
                    <p className="text-[#00FF66] font-semibold tracking-widest text-sm uppercase">Social Proof</p>
                    <h2 className="text-3xl md:text-4xl font-bold">Real Results from <span className="text-[#00FF66]">Real Founders</span></h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                        <div className="bg-[#111827] p-6 rounded-xl border border-[#1F2937]">
                            <div className="flex text-[#00FF66] mb-4">
                                {[...Array(5)].map((_, i) => <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                            </div>
                            <p className="text-gray-300 text-sm italic mb-4">"I completely fired my expensive content agency out of nowhere. FUPilot is outputting 30 articles a month that genuinely sound like I wrote them. Traffic is up 240% since last quarter."</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center font-bold text-gray-400">MK</div>
                                <div>
                                    <h4 className="font-bold text-white text-sm">Marcus K.</h4>
                                    <p className="text-xs text-gray-500">SaaS Founder</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#111827] p-6 rounded-xl border border-[#1F2937]">
                            <div className="flex text-[#00FF66] mb-4">
                                {[...Array(5)].map((_, i) => <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                            </div>
                            <p className="text-gray-300 text-sm italic mb-4">"The auto-publish to WordPress feature is insane. I just map out the keywords, come back an hour later, and my niche site is populated with fully formatted, perfectly internal-linked drafts."</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center font-bold text-gray-400">SP</div>
                                <div>
                                    <h4 className="font-bold text-white text-sm">Sarah P.</h4>
                                    <p className="text-xs text-gray-500">Niche Site Investor</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* === STATS BOARD === */}
                <section className="max-w-4xl mx-auto space-y-10 text-center">
                    <p className="text-[#00FF66] font-semibold tracking-widest text-sm uppercase">Deliverability</p>
                    <h2 className="text-3xl md:text-4xl font-bold">Publication-Ready <span className="text-[#00FF66]">Every Single Time</span></h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-[#111827] p-6 rounded-xl border border-[#1F2937]">
                            <h3 className="text-2xl font-bold text-[#00FF66]">1,200 - 2,000</h3>
                            <p className="text-xs text-gray-400 uppercase tracking-widest mt-2">Words Per Article</p>
                        </div>
                        <div className="bg-[#111827] p-6 rounded-xl border border-[#1F2937]">
                            <h3 className="text-2xl font-bold text-[#00FF66]">90+</h3>
                            <p className="text-xs text-gray-400 uppercase tracking-widest mt-2">SEO Score</p>
                        </div>
                        <div className="bg-[#111827] p-6 rounded-xl border border-[#1F2937]">
                            <h3 className="text-2xl font-bold text-[#00FF66]">100%</h3>
                            <p className="text-xs text-gray-400 uppercase tracking-widest mt-2">Undetectable</p>
                        </div>
                        <div className="bg-[#111827] p-6 rounded-xl border border-[#1F2937]">
                            <h3 className="text-2xl font-bold text-[#00FF66]">0%</h3>
                            <p className="text-xs text-gray-400 uppercase tracking-widest mt-2">Plagiarism</p>
                        </div>
                    </div>
                </section>

                {/* === ENTERPRISE CTA === */}
                <section className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-[#111827] to-[#0A0D14] border-2 border-[#1F2937] p-10 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 h-full shadow-[0_0_150px_rgba(0,255,102,0.1)] rounded-full -z-10 blur-3xl mix-blend-screen overflow-visible"></div>
                    <h2 className="text-3xl font-bold mb-3">Need <span className="text-[#00FF66]">500+ Articles</span>/Month?</h2>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto">We offer dedicated clusters, customized edge functions, and bulk API access for large-scale operations.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto mb-8">
                        <div className="space-y-2">
                            <li className="flex items-center gap-2 text-sm text-gray-300"><Check className="h-4 w-4 text-[#00FF66]" /> Dedicated Server Architecture</li>
                            <li className="flex items-center gap-2 text-sm text-gray-300"><Check className="h-4 w-4 text-[#00FF66]" /> Dedicated Account Manager</li>
                        </div>
                        <div className="space-y-2">
                            <li className="flex items-center gap-2 text-sm text-gray-300"><Check className="h-4 w-4 text-[#00FF66]" /> Volume Discount Pricing</li>
                            <li className="flex items-center gap-2 text-sm text-gray-300"><Check className="h-4 w-4 text-[#00FF66]" /> Priority API Access</li>
                        </div>
                    </div>

                    <div className="flex justify-center mb-8">
                        <a href="mailto:scalezix@gmail.com?subject=Enterprise%20Inquiry%20-%20FUPilot">
                            <Button className="bg-[#00FF66] text-black hover:bg-[#00CC52] font-semibold px-8 py-6 text-lg shadow-[0_0_20px_rgba(0,255,102,0.3)]">
                                Contact Us
                            </Button>
                        </a>
                    </div>

                    <Button variant="outline" className="border-[#00FF66] text-[#00FF66] hover:bg-[#00FF66] hover:text-black">
                        Contact Enterprise Sales
                    </Button>
                </section>

                {/* === FAQ === */}
                <section className="max-w-2xl mx-auto space-y-10">
                    <div className="text-center">
                        <p className="text-[#00FF66] font-semibold tracking-widest text-sm uppercase">FAQ</p>
                        <h2 className="text-3xl font-bold mt-2">Questions? <span className="text-[#00FF66]">We've Got You Covered</span></h2>
                    </div>

                    <Accordion type="single" collapsible className="w-full text-left bg-[#111827] rounded-xl border border-[#1F2937] px-6">
                        <AccordionItem value="item-1" className="border-b-[#1F2937]">
                            <AccordionTrigger className="text-white hover:text-[#00FF66]">Do I need my own OpenAI / Groq API Keys?</AccordionTrigger>
                            <AccordionContent className="text-gray-400">
                                No! The subscription cost completely covers the intensive LLM processing, SERP research scraping, and image generation. It works out of the box.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2" className="border-b-[#1F2937]">
                            <AccordionTrigger className="text-white hover:text-[#00FF66]">Does it really auto-publish to WordPress?</AccordionTrigger>
                            <AccordionContent className="text-gray-400">
                                Yes. You connect your WordPress site securely via Application Passwords. Once an article finishes generating, it will automatically push a perfectly formatted draft (or published post) directly into your WP admin screen with images and SEO metadata intact.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3" className="border-b-[#1F2937]">
                            <AccordionTrigger className="text-white hover:text-[#00FF66]">Will this bypass AI detectors?</AccordionTrigger>
                            <AccordionContent className="text-gray-400">
                                FUPilot utilizes complex prompt engineering targeting "perplexity" and "burstiness", mimicking human neuro-divergent writing patterns. It regularly scores 95%+ human on strict detectors like Originality.ai.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4" className="border-none">
                            <AccordionTrigger className="text-white hover:text-[#00FF66]">What if I don't use all my credits?</AccordionTrigger>
                            <AccordionContent className="text-gray-400">
                                Your credits reset on your billing date every month. We highly recommend utilizing the Bulk Generate tool to ensure you get the absolute maximum ROI from your subscription limit each month!
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </section>

                {/* === FINAL CTA === */}
                <section className="max-w-3xl mx-auto text-center space-y-8 bg-[#00FF66] text-black rounded-3xl p-12">
                    <div className="space-y-4">
                        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Ready to Reclaim <span className="underline decoration-4 underline-offset-4 decoration-black/20">120+ Hours</span> Per Month?</h2>
                        <p className="font-medium text-black/70 max-w-xl mx-auto text-lg">
                            Join the hundreds of founders automating their growth marketing safely and optimally.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link to="/auth">
                            <Button className="bg-black text-white hover:bg-gray-800 font-bold px-8 py-6 text-lg w-full sm:w-auto shadow-2xl">
                                Get Started Now
                            </Button>
                        </Link>
                    </div>
                    <p className="text-xs text-black/50 font-semibold tracking-wider uppercase">Cancel Anytime. No Long-term Contracts.</p>
                </section>

            </main>

            <div className="dark">
                <Footer />
            </div>
        </div>
    );
};

export default PricingPage;
