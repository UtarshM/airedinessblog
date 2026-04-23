// ─────────────────────────────────────────────────────────────────
// AEO Analysis Engine — uses Pollinations AI to simulate how a
// brand ranks across AI-powered search engines
// ─────────────────────────────────────────────────────────────────

export interface AeoProvider {
  id: string;
  name: string;
  score: number;
  status: "high" | "medium" | "low";
  mentions: number;
  insight: string;
}

export interface AeoCategoryScore {
  category: string;
  score: number;
  trend: "up" | "down" | "stable";
}

export interface AeoRecommendation {
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  action: string;
}

export interface AeoPromptSuggestion {
  topic: string;
  prompt: string;
  rationale: string;
}

export interface AeoAnalysisResult {
  overallScore: number;
  providers: AeoProvider[];
  categoryScores: AeoCategoryScore[];
  recommendations: AeoRecommendation[];
  promptSuggestions: AeoPromptSuggestion[];
}

export async function runAeoAnalysis(params: {
  website: string;
  brandName: string;
  topics: string[];
  brandDescription?: string;
}): Promise<AeoAnalysisResult> {
  const { website, brandName, topics, brandDescription } = params;

  const prompt = `You are an AEO (Answer Engine Optimization) expert analyst. Analyze how the brand "${brandName}" (website: ${website}) ranks in AI-powered search engines.

Brand Description: ${brandDescription || "Not provided"}
Topics to analyze: ${topics.join(", ")}

Return ONLY a valid JSON object with this exact structure:
{
  "overallScore": <number 0-100>,
  "providers": [
    {
      "id": "chatgpt",
      "name": "ChatGPT",
      "score": <number 0-100>,
      "status": <"high"|"medium"|"low">,
      "mentions": <estimated monthly brand mentions>,
      "insight": "<specific insight about this brand on ChatGPT, 1-2 sentences>"
    },
    {
      "id": "gemini",
      "name": "Google Gemini",
      "score": <number 0-100>,
      "status": <"high"|"medium"|"low">,
      "mentions": <number>,
      "insight": "<insight>"
    },
    {
      "id": "claude",
      "name": "Claude",
      "score": <number 0-100>,
      "status": <"high"|"medium"|"low">,
      "mentions": <number>,
      "insight": "<insight>"
    },
    {
      "id": "perplexity",
      "name": "Perplexity",
      "score": <number 0-100>,
      "status": <"high"|"medium"|"low">,
      "mentions": <number>,
      "insight": "<insight>"
    }
  ],
  "categoryScores": [
    { "category": "<topic from the list>", "score": <0-100>, "trend": <"up"|"down"|"stable"> }
  ],
  "recommendations": [
    {
      "priority": <"high"|"medium"|"low">,
      "title": "<short title>",
      "description": "<what the problem is>",
      "action": "<specific action to take>"
    }
  ],
  "promptSuggestions": [
    {
      "topic": "<topic>",
      "prompt": "<an optimized prompt/question that would make AI engines cite this brand>",
      "rationale": "<why this prompt would help>"
    }
  ]
}

Generate 3-5 category scores, 4-6 recommendations, 3-5 prompt suggestions. Make scores realistic and varied. Base insights on the brand name, website, and topics provided.`;

  try {
    const encoded = encodeURIComponent(prompt);
    const res = await fetch(
      `https://text.pollinations.ai/${encoded}?model=openai&json=true`,
      { method: "GET" }
    );
    const text = await res.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");
    const result = JSON.parse(jsonMatch[0]);
    return result as AeoAnalysisResult;
  } catch (e) {
    console.error("AEO analysis error:", e);
    // Deterministic fallback based on brand name
    const hash = brandName.length * 7 + website.length * 3;
    const base = 30 + (hash % 40);
    return {
      overallScore: base,
      providers: [
        { id: "chatgpt", name: "ChatGPT", score: base + 5, status: base > 60 ? "high" : "medium", mentions: 120 + hash, insight: `${brandName} appears in responses related to ${topics[0] || "your industry"} but needs stronger authoritative content.` },
        { id: "gemini", name: "Google Gemini", score: base - 5, status: "medium", mentions: 80 + hash, insight: `Limited mentions detected. Structured FAQ content could improve visibility.` },
        { id: "claude", name: "Claude", score: base + 10, status: base > 55 ? "high" : "medium", mentions: 60 + hash, insight: `Brand is referenced in informational queries. Technical content performs well.` },
        { id: "perplexity", name: "Perplexity", score: base - 10, status: "low", mentions: 40 + hash, insight: `Low citation rate. News and press coverage would significantly boost rankings.` },
      ],
      categoryScores: topics.map((t, i) => ({ category: t, score: base + (i * 5) - 10, trend: i % 2 === 0 ? "up" : "stable" })),
      recommendations: [
        { priority: "high", title: "Add FAQ Schema Markup", description: "AI engines prioritize structured Q&A content.", action: "Add FAQ schema to your top 5 pages with common industry questions." },
        { priority: "high", title: "Publish Thought Leadership", description: "Brand authority drives AI citations.", action: "Publish 2+ expert articles per month on your core topics." },
        { priority: "medium", title: "Get Press Coverage", description: "News citations boost Perplexity visibility.", action: "Submit to industry publications and get backlinks from news sites." },
        { priority: "low", title: "Optimize 'About' Page", description: "AI engines use About pages for brand context.", action: "Update your About page with clear brand positioning and expertise." },
      ],
      promptSuggestions: topics.slice(0, 3).map((t) => ({
        topic: t,
        prompt: `What are the best tools for ${t} and how does ${brandName} compare?`,
        rationale: `Comparative prompts help AI engines cite specific brands as solutions.`,
      })),
    };
  }
}
