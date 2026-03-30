import { Sparkles, MessageSquare, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function GenieAssistant() {
    const [genieOpen, setGenieOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {genieOpen && (
                <div className="mb-4 w-72 bg-card border shadow-xl rounded-xl overflow-hidden animate-slide-in">
                    <div className="bg-primary/10 p-3 border-b flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span className="font-semibold text-sm">Genie Assistant</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setGenieOpen(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="p-4 bg-background">
                        <div className="bg-muted p-3 rounded-lg text-sm mb-3">
                            Hi there! I'm Genie 🧞‍♂️. I can help answer questions and navigate the site. How can I assist you today?
                        </div>
                        <div className="space-y-2">
                            <Button className="w-full text-xs" variant="outline" size="sm">
                                What can FUPilot do?
                            </Button>
                            <Button className="w-full text-xs" variant="outline" size="sm">
                                View Pricing
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            
            <button 
                onClick={() => setGenieOpen(!genieOpen)}
                className="group relative h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.5)] flex items-center justify-center hover:scale-110 transition-all duration-300"
            >
                <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20"></div>
                <Sparkles className="h-6 w-6 relative z-10 group-hover:rotate-12 transition-transform" />
            </button>
        </div>
    );
}
