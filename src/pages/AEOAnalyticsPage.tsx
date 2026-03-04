import { Activity } from "lucide-react";

const AEOAnalyticsPage = () => {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6 max-w-7xl mx-auto h-[80vh] flex flex-col items-center justify-center text-center">
            <div className="bg-primary/10 p-6 rounded-full mb-6">
                <Activity className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">AEO Analytics</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mt-4">
                The Answer Engine Optimization (AEO) tracking module is currently in development.
                Soon, you'll be able to track your content's citations and ranking across Perplexity, ChatGPT Search, and Google AI Overviews.
            </p>
            <div className="mt-8 px-6 py-2 bg-primary/20 text-primary rounded-full font-bold uppercase tracking-widest text-sm border border-primary/30">
                Coming Soon
            </div>
        </div>
    );
};

export default AEOAnalyticsPage;
