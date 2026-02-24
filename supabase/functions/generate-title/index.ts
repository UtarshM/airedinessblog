import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { keyword } = await req.json();
    if (!keyword) {
      return new Response(JSON.stringify({ error: "Missing keyword" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const groqKey = Deno.env.get("GROQ_API_KEY");
    if (!groqKey) throw new Error("GROQ_API_KEY not configured");

    const prompt = `Create an SEO title for the keyword: "${keyword}".
STRICT RULES:
- MUST contain the exact keyword "${keyword}" once
- Length: 50-70 characters maximum
- Word count: 6-12 words
- Use simple, everyday words only
- Make it specific and valuable (e.g. "How to...", "Why...", "Best...")
- No clickbait, no all-caps, no complex words
- Return ONLY the title text, nothing else, no quotes.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 100,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq error: ${errorText}`);
    }

    const data = await response.json();
    let title = data.choices?.[0]?.message?.content || "";
    title = title.replace(/<think>[\s\S]*?<\/think>/g, "").replace(/^["']|["']$/g, "").trim();

    return new Response(JSON.stringify({ title }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Generate title error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
