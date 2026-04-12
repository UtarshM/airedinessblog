import { Link } from "react-router-dom";
import { Check, X, ArrowRight, Zap, Info, Shield, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { Footer } from "@/components/landing/Footer";
import { PricingCalculator } from "@/components/landing/PricingCalculator";

const PricingPage = () => {
    return (
        <div className="min-h-screen bg-mesh text-white font-sans selection:bg-[#00FF66]/30 selection:text-[#00FF66] overflow-x-hidden">
            <LandingNavbar />

            <main className="py-20 px-4 md:px-8 max-w-7xl mx-auto space-y-32">
                {/* === HEADER === */}
                <section className="text-center space-y-8">
                    <div className="space-y-4 max-w-3xl mx-auto">
                        <p className="text-[#00FF66] font-semibold tracking-widest text-sm uppercase">The Future of Efficiency</p>
                        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight leading-tight">
                            Build Your <span className="text-[#00FF66]">Autonomous</span> <br /> Marketing Team
                        </h1>
                        <p className="text-gray-400 text-xl max-w-2xl mx-auto">
                            Deploy world-class agents that handle research, code, design, and analytics with zero management required.
                        </p>
                    </div>
                </section>

                {/* === PRICING TIERS === */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* FREE TIER */}
                    <div className="glass-card p-10 rounded-3xl border-white/5 flex flex-col justify-between">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-2xl font-bold text-white">Free</h3>
                                <p className="text-sm text-gray-400 mt-2 italic font-medium">"Get a taste of our agents' capabilities to help you clearly define what your business needs for growth"</p>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl font-black">$0</span>
                                <span className="text-gray-500 font-semibold">/ month</span>
                            </div>
                            <div className="space-y-4 pt-6 border-t border-white/5">
                                <p className="text-xs text-gray-300">Get a limited first look at a full-stack marketing team in action.</p>
                                {[
                                    { n: "Lyra", d: "Organic social media to grow your audience and engagement." },
                                    { n: "Aris", d: "Content marketing, SEO, and AEO to boost your visibility." },
                                    { n: "Kash", d: "Performance marketing for high-impact campaigns." },
                                    { n: "Veda", d: "Brand analytics, competitor tracking, and market research." }
                                ].map((agent, i) => (
                                    <div key={i} className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-[#00FF66]" />
                                            <span className="font-bold text-sm text-white">{agent.n}</span>
                                        </div>
                                        <p className="text-[11px] text-gray-500 pl-6 leading-relaxed">{agent.d}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="pt-10">
                            <Link to="/auth" className="w-full">
                                <Button variant="outline" className="w-full h-14 rounded-2xl font-bold border-white/10 hover:bg-white/5 bg-transparent text-white">
                                    Start Free Trial
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* GROWTH TIER */}
                    <div className="glass-card p-10 rounded-3xl border-[#00FF66]/30 relative transform lg:scale-105 shadow-2xl shadow-[#00FF66]/10 flex flex-col justify-between overflow-hidden">
                        <div className="absolute top-0 right-0 bg-[#00FF66] text-black text-[10px] font-black px-4 py-1 rounded-bl-xl uppercase tracking-widest">
                            Most Popular
                        </div>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-2xl font-bold text-white">Growth</h3>
                                <p className="text-sm text-gray-300 mt-2 font-medium">Unlock advanced capabilities across organic and paid, enabling you to become your own expert marketing agency.</p>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl font-black">$600</span>
                                <span className="text-gray-400 font-semibold text-xs leading-none">/ month <br/> per agent</span>
                            </div>
                            <div className="space-y-4 pt-6 border-t border-[#00FF66]/20">
                                <p className="text-xs text-[#00FF66] font-bold">Unlock full access to all agents with advanced tools, unlimited content creation, BI integration, and automated campaign management.</p>
                                {[
                                    { n: "Lyra", d: "Organic social media to grow your audience and engagement." },
                                    { n: "Aris", d: "Content marketing, SEO, and AEO to boost your visibility." },
                                    { n: "Kash", d: "Performance marketing for high-impact campaigns." },
                                    { n: "Veda", d: "Brand analytics, competitor tracking, and market research." }
                                ].map((agent, i) => (
                                    <div key={i} className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-[#00FF66]" />
                                            <span className="font-bold text-sm text-white">{agent.n}</span>
                                        </div>
                                        <p className="text-[11px] text-gray-400 pl-6 leading-relaxed">{agent.d}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="pt-10">
                            <Link to="/auth" className="w-full">
                                <Button className="w-full h-14 bg-[#00FF66] text-black hover:bg-[#00CC52] font-black rounded-2xl shadow-lg shadow-[#00FF66]/20">
                                    Contact Us
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* ENTERPRISE TIER */}
                    <div className="glass-card p-10 rounded-3xl border-white/5 flex flex-col justify-between">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-2xl font-bold text-white">Enterprise Edge</h3>
                                <p className="text-xs text-[#00FF66] font-black mt-1 uppercase tracking-widest">(Powered by custom AI models)</p>
                                <p className="text-sm text-gray-400 mt-3 font-medium">The Complete AI Marketing Powerhouse for businesses ready to lead the future.</p>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black">Custom</span>
                            </div>
                            <div className="space-y-4 pt-6 border-t border-white/5">
                                <p className="text-xs text-gray-300">For enterprises looking to redefine their marketing operations:</p>
                                {[
                                    "Dedicated account management for tailored support.",
                                    "Enterprise-grade security with SSO and advanced controls.",
                                    "Custom integrations for your specific workflows.",
                                    "Full-scale AI agents to handle research, strategy, execution, and optimization.",
                                    "Tailored model training on your brand data."
                                ].map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <Shield className="h-4 w-4 text-blue-400 mt-1 shrink-0" />
                                        <span className="text-xs font-medium text-gray-300 leading-relaxed">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="pt-10">
                            <Link to="/auth" className="w-full">
                                <Button variant="outline" className="w-full h-14 rounded-2xl font-bold border-white/10 hover:bg-white/5 bg-transparent text-white">
                                    Contact Sales
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* === CALCULATOR === */}
                <PricingCalculator />

                {/* === BOLD DIFFERENTIATION === */}
                <section className="max-w-5xl mx-auto space-y-16 text-center">
                    <div className="space-y-4">
                        <p className="text-[#00FF66] font-semibold tracking-widest text-sm uppercase">Boldly Superior</p>
                        <h2 className="text-3xl md:text-5xl font-bold">Why <span className="text-[#00FF66]">AI Agents</span> Win</h2>
                    </div>

                    <div className="overflow-x-auto rounded-[32px] border border-white/10 bg-black/40 backdrop-blur-3xl shadow-2xl">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr>
                                    <th className="p-8 font-semibold text-gray-400">Capability</th>
                                    <th className="p-8 font-bold text-white bg-[#00FF66]/10 border-x border-[#00FF66]/20 relative">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-[#00FF66]"></div>
                                        FUPilot AI Agents
                                    </th>
                                    <th className="p-8 font-semibold text-gray-400">Traditional Tools</th>
                                    <th className="p-8 font-semibold text-gray-400">AI Co-pilots</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {[
                                    { f: "Effort Required", c1: "0 Man-hours", c2: "High (Manual)", c3: "Medium (Prompting)" },
                                    { f: "Execution Logic", c1: "Autonomous", c2: "Manual Input", c3: "Suggestion-based" },
                                    { f: "Availability", c1: "24/7/365", c2: "User-dependent", c3: "User-dependent" },
                                    { f: "Core Outcome", c1: "Results", c2: "Features", c3: "Advice" },
                                    { f: "Scalability", c1: "Infinite", c2: "Linear", c3: "Linear" },
                                    { f: "Management", c1: "None", c2: "Full-time", c3: "Assisted" }
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="p-8 text-gray-300 font-medium">{row.f}</td>
                                        <td className="p-8 bg-[#00FF66]/5 border-x border-[#00FF66]/10 text-[#00FF66] font-bold text-center">{row.c1}</td>
                                        <td className="p-8 text-gray-400 text-center">{row.c2}</td>
                                        <td className="p-8 text-gray-400 text-center">{row.c3}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* === FINAL CTA === */}
                <section className="glass-card p-16 rounded-[40px] text-center space-y-8 max-w-5xl mx-auto overflow-hidden relative border-white/5">
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#00FF66]/20 blur-[100px] rounded-full"></div>
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full"></div>
                    
                    <div className="relative z-10 space-y-6">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight italic">
                            Stop Hiring Helpers. <br />
                            <span className="text-[#00FF66] not-italic underline decoration-blue-500/50">Start Deploying Executors.</span>
                        </h2>
                        <p className="text-gray-400 text-xl max-w-2xl mx-auto font-medium">
                            Join the next generation of founders who have replaced their manual workflows with autonomous agents.
                        </p>
                    </div>

                    <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                        <Link to="/auth">
                            <Button className="bg-[#00FF66] text-black hover:bg-[#00CC52] font-black h-20 px-16 text-2xl rounded-3xl shadow-2xl shadow-[#00FF66]/30 transition-transform hover:scale-105 active:scale-95">
                                Deploy Your Agents Now
                            </Button>
                        </Link>
                    </div>
                    <p className="relative z-10 text-[10px] text-gray-500 font-extrabold uppercase tracking-[0.4em]">Autonomous Workforce Platform v2.0</p>
                </section>

            </main>

            <Footer />
        </div>
    );
};

export default PricingPage;
