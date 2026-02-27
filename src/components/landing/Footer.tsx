import { Link } from "react-router-dom";
import { BrainCircuit, Twitter, Github, Linkedin } from "lucide-react";

export const Footer = () => {
    return (
        <footer className="border-t bg-background pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center space-x-2 mb-6">
                            <div className="bg-primary/10 p-2 rounded-xl">
                                <BrainCircuit className="h-6 w-6 text-primary" />
                            </div>
                            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                                Rank.Scalezix
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-sm mb-6 max-w-xs">
                            Grow organic traffic on auto-pilot. Generate SEO-optimized content and outrank your competitors while you sleep.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Github className="h-5 w-5" />
                                <span className="sr-only">GitHub</span>
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Linkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Product</h3>
                        <ul className="space-y-3">
                            <li><a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
                            <li><a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
                            <li><a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it Works</a></li>
                            <li><Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Log In</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Resources</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Help Center</a></li>
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Documentation</a></li>
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">SEO Guide</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Company</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</a></li>
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-border/40 text-center">
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} Rank.Scalezix. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};
