import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// --- CREDIT HELPERS ---
async function lockCredits(supabase: any, userId: string, contentId: string, amount: number) {
  const { data, error } = await supabase.rpc('lock_credits', {
    p_user_id: userId, p_content_id: contentId, p_amount: amount
  });
  if (error) throw error;
  if (data === false) throw new Error("Insufficient credits");
  return true;
}

async function finalizeCredits(supabase: any, userId: string, contentId: string, actualAmount: number) {
  const { error } = await supabase.rpc('finalize_credits', {
    p_user_id: userId, p_content_id: contentId, p_actual_amount: actualAmount
  });
  if (error) console.error("Error finalizing credits:", error);
}

async function refundCredits(supabase: any, userId: string, contentId: string) {
  const { error } = await supabase.rpc('refund_credits', {
    p_user_id: userId, p_content_id: contentId
  });
  if (error) console.error("Error refunding credits:", error);
}

function calculateEstimatedCredits(wordCount: number, hasH3: boolean, hasFAQ: boolean): number {
  let credits = 1;
  if (wordCount >= 800) credits = 2;
  if (wordCount >= 1500) credits = 3;
  if (wordCount >= 2500) credits = 4;
  if (hasH3) credits += 1;
  if (hasFAQ) credits += 1;
  return credits;
}

const SYSTEM_PROMPT = `You are a strategic domain expert who explains topics as business realities, not academic concepts. Focus on performance impact, hidden costs, structural problems, and real consequences. Write for decision-makers who care about outcomes.

STRICT RULES:

1. PARAGRAPHS: 2-4 sentences each. Never 1 sentence alone. Never 5+ sentences.

2. SENTENCES: 15-20 words each. Short, clear, direct.

3. SIMPLE WORDS: Use everyday, common language. 7th-grade reading level. If a simpler word exists, always use it. No complex or academic vocabulary.

4. KEYWORD CONTROL: Total keyword density must NOT exceed 1.05%. Use the exact main keyword only 1-2 times per section (7-8 times total in the full article). For all other mentions, use natural variations, synonyms, and related phrases. NEVER repeat the same keyword phrase 3+ times in one section.

5. TRANSITION WORDS: Use a VARIETY of transitions. NEVER use the same transition word more than 2 times in the entire article. Choose from: However, Therefore, Additionally, Moreover, Furthermore, As a result, In contrast, Meanwhile, Consequently, For this reason, On the other hand, Because of this, Still, Yet, At the same time, Even so, That said. Spread them out — no two consecutive paragraphs should start with the same word.

6. ACTIVE VOICE ONLY: No passive voice. Say "Teams build this" not "This is built by teams."

7. BOLD: Use **bold** for key terms and important concepts.

8. LISTS: Use dashes (-) for bullet points. NEVER use asterisks (*). Format: - Item one - Item two

9. NO HEADINGS in body content. No h1, h2, h3, or ### in your output.

10. DATA-BACKED REASONING: Support claims with logical cause-effect reasoning. Explain HOW things work, not just WHAT they are. Use the pattern: Observation → Mechanism → Business impact.

11. NO FAKE DATA: Never invent statistics, percentages, or citations. Instead, explain logical consequences and observable patterns.

12. STRUCTURAL THINKING: Treat every topic as either an operational foundation, performance constraint, structural bottleneck, or scalability limiter. Explain WHY.

13. BANNED PHRASES: Never use: "In today's", "It's important", "In conclusion", "Let's dive", "When it comes to", "At the end of the day", "studies show", "research indicates".

14. RHETORICAL PATTERNS to use naturally:
- "Small friction at scale becomes massive cost."
- "Surface improvement vs structural change."
- "The real question is not ___ but ___."
- Explain hidden costs that compound over time.
- Show why surface fixes fail and structural fixes succeed.
- Connect systems → behavior → results.`;

// Groq model mapping per task
const GROQ_MODELS = {
  title: "llama-3.1-8b-instant",
  outline: "llama-3.3-70b-versatile",
  section: "llama-3.3-70b-versatile",
  faq: "llama-3.1-8b-instant",
} as const;

async function callGroq(messages: any[], model: string): Promise<string> {
  const groqKey = Deno.env.get("GROQ_API_KEY");
  if (!groqKey) throw new Error("GROQ_API_KEY not configured");

  for (let attempt = 0; attempt < 3; attempt++) {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model, messages, max_tokens: 2000, temperature: 0.7 }),
    });

    if (response.status === 429) {
      console.warn(`Rate limited on ${model}, attempt ${attempt + 1}`);
      await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
      continue;
    }

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Groq error ${response.status}: ${text}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    if (content) {
      console.log(`Generated with ${model}`);
      // DeepSeek R1 and thinking models wrap output in <think> tags — strip them
      return content.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
    }
    throw new Error("Empty response from Groq");
  }
  throw new Error(`Rate limited on ${model} after 3 attempts`);
}

function calculateWordDistribution(totalWords: number, h2Count: number, h3Count: number) {
  const introWords = Math.round(totalWords * 0.12);
  const conclusionWords = Math.round(totalWords * 0.08);
  const faqWords = Math.round(totalWords * 0.12);
  const remainingWords = totalWords - introWords - conclusionWords - faqWords;
  const h2Words = h2Count > 0
    ? (h3Count > 0 ? Math.round(remainingWords * 0.75 / h2Count) : Math.round(remainingWords / h2Count))
    : 0;
  const h3Words = h3Count > 0 ? Math.round(remainingWords * 0.25 / h3Count) : 0;
  return { introWords, h2Words, h3Words, conclusionWords, faqWords };
}

async function updateProgress(supabase: any, contentId: string, updates: any) {
  await supabase.from("content_items").update(updates).eq("id", contentId);
}

// Background generation — runs after response is sent
async function generateBlog(supabase: any, contentId: string, userId: string) {
  try {
    const { data: content, error: fetchError } = await supabase
      .from("content_items").select("*")
      .eq("id", contentId).eq("user_id", userId).single();

    if (fetchError || !content) {
      console.error("Content not found:", fetchError);
      return;
    }

    const { main_keyword, secondary_keywords, word_count_target, tone, h1, h2_list, h3_list } = content;
    let h2s: string[] = h2_list || [];
    const h3s = h3_list || [];
    const secondaryKw = (secondary_keywords || []).join(", ");

    // Auto-generate 4 H2 headings if empty, placeholder, or too many
    const hasPlaceholders = h2s.length === 0 || h2s.some((h: string) =>
      /Top Pick #|\[Item|^Step \d|^\d+\. \[/.test(h)
    );
    if (hasPlaceholders) {
      const targetCount = Math.min(h2s.length || 4, 4);
      const generatedHeadings = await callGroq([
        { role: "system", content: "Generate SEO blog section headings. Return ONLY headings, one per line. No numbering, no explanation, no quotes." },
        { role: "user", content: `Generate exactly ${targetCount} H2 headings for a blog about "${main_keyword}". Short, specific, SEO-friendly. One per line.` },
      ], GROQ_MODELS.outline);
      const newH2s = generatedHeadings.split("\n").map((h: string) => h.replace(/^#+\s*/, "").replace(/^\d+\.?\s*/, "").trim()).filter(Boolean);
      if (newH2s.length >= targetCount) {
        h2s = newH2s.slice(0, targetCount);
      }
      await supabase.from("content_items").update({ h2_list: h2s }).eq("id", contentId);
    }
    // Cap at 4 H2s max for speed
    if (h2s.length > 4) h2s = h2s.slice(0, 4);

    const dist = calculateWordDistribution(word_count_target, h2s.length, 0);
    // Total: Title + Intro + H2s + Conclusion/FAQs = fewer calls
    const totalSections = 1 + 1 + h2s.length + 1;

    // Credit lock
    const estimatedCredits = calculateEstimatedCredits(word_count_target, false, true);
    await lockCredits(supabase, userId, contentId, estimatedCredits);

    await updateProgress(supabase, contentId, {
      status: "generating", total_sections: totalSections,
      sections_completed: 0, current_section: "Title", generated_content: "",
    });

    let markdown = "";
    let completed = 0;

    // 1. TITLE
    const title = await callGroq([
      { role: "system", content: "You generate SEO blog titles. Return ONLY the title text. No quotes, no explanation." },
      {
        role: "user", content: `Create an SEO title for the keyword: "${main_keyword}".

STRICT RULES:
- MUST contain the exact keyword "${main_keyword}" once
- Length: 50-70 characters maximum (STRICT - count carefully)
- Word count: 6-12 words
- Use simple, everyday words only
- Make it specific and valuable (e.g. "How to...", "Why...", "Best...")
- No clickbait, no all-caps, no complex words
- Return ONLY the title text, nothing else` },
    ], GROQ_MODELS.title);

    completed = 1;
    markdown = `# ${title.trim()}\n\n`;
    await updateProgress(supabase, contentId, {
      generated_title: title.trim(), generated_content: markdown,
      sections_completed: completed, current_section: "Introduction",
    });

    // 2. INTRODUCTION
    const intro = await callGroq([
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user", content: `Write the introduction for a blog titled "${title.trim()}" about "${main_keyword}".${secondaryKw ? ` Also reference: ${secondaryKw}.` : ""} Tone: ${tone}. ~${dist.introWords} words.

STRUCTURE (follow this order):
1. REALITY DISRUPTION: Break the reader's assumption. Show why what seems fine is actually harmful or inefficient. Use a concrete operational example.
2. HIDDEN COST: Explain how small inefficiencies compound into real business cost. Show the gap between current approach and what actually works.
3. BRIDGE: Introduce what this article covers as the structural fix — not a surface tip.

KEYWORD RULES:
- Use the exact phrase "${main_keyword}" only 1-2 times in this section.
- For other mentions, use natural variations like "this tool", "this approach", "the platform", or related synonyms.
- NEVER repeat the exact keyword phrase in back-to-back sentences.

FORMAT RULES:
- Paragraphs: 2-4 sentences each.
- Sentences: 15-20 words. Simple everyday words.
- Use transition words between paragraphs.
- Active voice only. No passive.
- If using a list, use dashes (-) never asterisks (*).
- No headings in output.` },
    ], GROQ_MODELS.section);

    completed++;
    markdown += `${intro.trim()}\n\n`;
    await updateProgress(supabase, contentId, {
      generated_content: markdown, sections_completed: completed,
      current_section: h2s.length > 0 ? h2s[0] : "Conclusion",
    });

    // 3. H2 SECTIONS
    for (let i = 0; i < h2s.length; i++) {
      const h2Content = await callGroq([
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user", content: `Write the section "${h2s[i]}" for a blog about "${main_keyword}".${secondaryKw ? ` Reference: ${secondaryKw}.` : ""} Tone: ${tone}. ~${dist.h2Words} words.

STRUCTURE (follow this order):
1. CORE POINT: State what this section is about in plain terms. Challenge a common assumption if possible.
2. ROOT CAUSE: Explain the underlying mechanism — how it works, why problems persist, what most people miss.
3. REAL-WORLD IMPACT: Show practical consequences. Connect to cost, speed, quality, or risk using cause → effect logic.
4. ACTION LIST: Include a short list (3-5 items) using dashes (-) with **bold labels** followed by a brief explanation.
5. OUTCOME: End with the business consequence — what changes when this is done right vs wrong.

KEYWORD RULES:
- Use the exact phrase "${main_keyword}" only ONCE in this entire section.
- Use natural variations everywhere else: "this solution", "the platform", "this approach", synonyms, or pronouns.
- NEVER repeat the exact keyword in consecutive sentences.

FORMAT RULES:
- Paragraphs: 2-4 sentences. Sentences: 15-20 words.
- Simple, everyday words only. No complex vocabulary.
- Start paragraphs with transition words (However, Therefore, Additionally, Moreover).
- Active voice only.
- Use **bold** for key terms.
- Use dashes (-) for lists. NEVER use asterisks (*).
- Do NOT include the section heading.` },
      ], GROQ_MODELS.section);

      completed++;
      markdown += `## ${h2s[i]}\n\n${h2Content.trim()}\n\n`;
      const nextSection = i < h2s.length - 1 ? h2s[i + 1] : "Conclusion";
      await updateProgress(supabase, contentId, {
        generated_content: markdown, sections_completed: completed, current_section: nextSection,
      });
    }

    // 4. H3 SECTIONS (removed as per instruction)

    // 5. CONCLUSION + FAQs (combined into one call for speed)
    const closingContent = await callGroq([
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user", content: `Write the conclusion AND FAQs for the blog "${title.trim()}" about "${main_keyword}". Tone: ${tone}. ~${dist.conclusionWords + dist.faqWords} words.

CONCLUSION (write first):
- Frame the topic as a strategic choice: maintain current approach OR build future capability. No neutral option.
- Explain the cost of delay — what happens if organizations wait. Show compounding difficulty and widening gaps.
- End with an irreversible truth: frame the topic as a structural competitiveness issue, not an optional improvement.
- 2-3 paragraphs, 2-4 sentences each.
- Use the exact keyword "${main_keyword}" only once. Use variations for other mentions.
- Do NOT start with "In conclusion" or "To sum up" or "To summarize".

Then write FAQs:

## Frequently Asked Questions

### 1. [Practical question about ${main_keyword}]?
[2-3 sentence answer. Data-backed reasoning. Simple words. Use **bold** for key terms.]

### 2. [How/Why question about the topic]?
[Answer with cause → effect logic.]

### 3. [Common concern or misconception]?
[Answer that addresses the root issue.]

FORMAT RULES:
- Paragraphs: 2-4 sentences. Sentences: 15-20 words.
- Simple words. Active voice. Transition words.
- Use dashes (-) for any lists. NEVER use asterisks (*).
- No fake statistics. Use logical reasoning instead.` },
    ], GROQ_MODELS.faq);

    completed++;
    markdown += `## Conclusion\n\n${closingContent.trim()}\n\n`;
    await updateProgress(supabase, contentId, {
      generated_content: markdown, sections_completed: completed, current_section: "Done",
      status: "completed",
    });

    // Finalize credits
    const finalCredits = calculateEstimatedCredits(word_count_target, false, true); // h3s.length > 0 is now false
    await finalizeCredits(supabase, userId, contentId, finalCredits);

    console.log(`Blog generation completed for ${contentId}`);

  } catch (e) {
    console.error("generateBlog error:", e);
    await supabase.from("content_items").update({ status: "failed" }).eq("id", contentId);
    try { await refundCredits(supabase, userId, contentId); } catch (_) { }
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const groqKey = Deno.env.get("GROQ_API_KEY");

    if (!groqKey) throw new Error("GROQ_API_KEY not configured");

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { contentId } = await req.json();

    // Verify user authentication
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader || "" } },
    });
    const { data: { user }, error: userError } = await anonClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify content exists and belongs to user
    const { data: content, error: fetchError } = await supabase
      .from("content_items").select("*")
      .eq("id", contentId).eq("user_id", user.id).single();

    if (fetchError || !content) {
      return new Response(JSON.stringify({ error: "Content not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Start background generation
    const generationPromise = generateBlog(supabase, contentId, user.id);

    // Use EdgeRuntime.waitUntil to prevent the function from shutting down
    // immediately after the response is sent.
    // Use globalThis to avoid TypeScript "Cannot find name" errors.
    const edgeRuntime = (globalThis as any).EdgeRuntime;
    if (edgeRuntime && edgeRuntime.waitUntil) {
      edgeRuntime.waitUntil(generationPromise);
    } else {
      console.error("EdgeRuntime.waitUntil is not defined!");
      // If EdgeRuntime is missing, we must await to ensure completion,
      // but this risks timeout.
      generateBlog(supabase, contentId, user.id).catch(err => console.error("Background generation failed without waitUntil:", err));
    }

    return new Response(JSON.stringify({ success: true, contentId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error("Edge function error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
