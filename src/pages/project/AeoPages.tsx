import { ComingSoonPage } from "./ComingSoonPage";
import { Bot, BarChart2, Eye, Lightbulb } from "lucide-react";

export function AeoPromptGenerationPage() {
  return (
    <ComingSoonPage
      title="AI Prompt Generation"
      icon={Bot}
      description="Generate optimized prompts designed to make your brand visible in AI-powered search engines like ChatGPT, Perplexity, and Google Gemini."
      features={[
        "Branded AI Prompt Templates",
        "Prompt Performance Testing",
        "Citation Opportunity Finder",
        "AI Response Monitoring",
        "Prompt Library Management",
      ]}
    />
  );
}

export function AeoAnalyticsPage() {
  return (
    <ComingSoonPage
      title="AEO Analytics"
      icon={BarChart2}
      description="Track how often and how accurately AI models cite and reference your brand content."
      features={[
        "AI Citation Tracking",
        "Brand Mention Monitoring in LLMs",
        "Answer Engine Coverage Report",
        "Query Response Analysis",
        "Competitor Mention Comparison",
      ]}
    />
  );
}

export function AeoVisibilityScorePage() {
  return (
    <ComingSoonPage
      title="AI Visibility Score"
      icon={Eye}
      description="Measure how visible your brand is across AI-powered answer engines with a comprehensive scoring system."
      features={[
        "Overall AI Visibility Score",
        "Category-level Breakdown",
        "Historical Score Trends",
        "Improvement Recommendations",
        "Benchmark vs Competitors",
      ]}
    />
  );
}

export function AeoOpportunitiesPage() {
  return (
    <ComingSoonPage
      title="AEO Opportunities"
      icon={Lightbulb}
      description="Discover untapped opportunities to improve your brand's presence in AI-generated answers and featured snippets."
      features={[
        "Unclaimed Query Opportunities",
        "Content Gap for AI Answers",
        "Featured Snippet Targeting",
        "Schema Markup Recommendations",
        "Question & Answer Optimization",
      ]}
    />
  );
}
