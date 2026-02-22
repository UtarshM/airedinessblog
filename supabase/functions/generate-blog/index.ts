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

const SYSTEM_PROMPT = `Act as a senior SEO content strategist with 20+ years of hands-on experience in Google algorithms, EEAT, topical authority, NLP, and conversion-focused content. You write fully SEO-optimized, high-ranking, human-friendly blog posts that can rank on Google Page 1 for competitive keywords.

STRICT RULES:

1. PARAGRAPHS: Max 2 sentences per paragraph. Keep them punchy and scannable. Never 3+ sentences.

2. SENTENCES: 15-20 words each. Short, clear, direct.

3. SIMPLE WORDS: Everyday common language. 7th-grade reading level. No complex or academic words.

4. KEYWORD CONTROL: Total keyword density must NOT exceed 1.05%. Use the exact main keyword only 1-2 times per section (7-8 times total). Use natural variations, synonyms, and related phrases for all other mentions. NEVER repeat the exact keyword 3+ times in one section.

5. TRANSITION CONTROL: AVOID overuse of "However", "Additionally", "Moreover", "Therefore". Use each MAX 1 time in the entire article. Prefer natural segues or no transition word at all. Use variety: Still, Yet, For this reason, On the other hand, Because of this, At the same time, Even so, That said, As a result, In contrast, Meanwhile.

6. ACTIVE VOICE ONLY: No passive voice.

7. BOLD: Use **bold** for key terms, product names, and data points.

8. LISTS: Use dashes (-) for bullet points. NEVER use asterisks (*). NEVER use emoji or special symbols in lists.

9. NO HEADINGS in body content. No h1, h2, h3, or ### in your output.

10. DATA REQUIREMENT: Every section MUST include at least one of these:
- Real user numbers or market size (use widely known public data)
- Growth percentages or adoption rates
- Cost comparisons or pricing benchmarks
- Performance metrics (speed, engagement, conversion rates)
- Regional or industry-specific data points
Use REAL publicly known data. If exact numbers are uncertain, use reasonable ranges like "over 2 billion users" or "growth rates between 15-25% annually."

11. EVALUATION CRITERIA: Judge every tool, platform, or approach using measurable criteria: performance, cost, growth rate, engagement, ease of use, ROI, risk level. Without criteria, there is no authority.

12. BLOCKING RULES (content MUST NOT contain):
- No repetition of the same idea in different words
- No vague statements like "it is very useful" or "it helps a lot"
- No motivational or inspirational language
- No theory without a practical example
- No academic or corporate tone
- No claims without a reason or data to support them

13. DECISION OUTPUT: Content must help the reader make a decision within 5 minutes of reading. Every section should move toward: what is best, who should choose it, why it wins, and when not to use it.

14. BANNED PHRASES: Never use: "In today's", "It's important", "In conclusion", "Let's dive", "When it comes to", "At the end of the day", "studies show", "research indicates", "game-changer", "revolutionary".`;

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

    // Auto-generate 6 H2 headings if empty, placeholder, or too many
    const hasPlaceholders = h2s.length === 0 || h2s.some((h: string) =>
      /Top Pick #|\[Item|^Step \d|^\d+\. \[/.test(h)
    );
    if (hasPlaceholders) {
      const targetCount = 6; // User requested 5-6 headings
      const generatedHeadings = await callGroq([
        { role: "system", content: "Generate SEO blog section headings. Return ONLY headings, one per line. No numbering, no explanation, no quotes." },
        { role: "user", content: `Generate exactly ${targetCount} H2 headings for a blog about "${main_keyword}". Short, specific, SEO-friendly. One per line.` },
      ], GROQ_MODELS.outline);
      const newH2s = generatedHeadings.split("\n").map((h: string) => h.replace(/^#+\s*/, "").replace(/^\d+\.?\s*/, "").trim()).filter(Boolean);
      if (newH2s.length >= 4) { // Accept if we got at least 4, but aim for 6
        h2s = newH2s.slice(0, targetCount);
      }
      await supabase.from("content_items").update({ h2_list: h2s }).eq("id", contentId);
    }
    // Cap at 6 H2s max for speed
    if (h2s.length > 6) h2s = h2s.slice(0, 6);

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

STRUCTURE:
1. PROBLEM STATEMENT: State the real problem the reader faces. Use a specific number or data point to anchor it (e.g. user counts, market size, adoption rate).
2. GAP: Show why current approaches fail. Name the specific gap — cost, speed, quality, or scale.
3. WHAT THIS ARTICLE DELIVERS: Tell the reader exactly what they will get — a comparison, a ranking, a strategy, or a clear answer.

DATA RULE: Include at least 1 real data point (user count, market stat, growth rate). Use publicly known numbers.

KEYWORD RULES:
- Use "${main_keyword}" only 1-2 times. Use synonyms and variations for other mentions.
- NEVER repeat the keyword in back-to-back sentences.

FORMAT: Paragraphs 2-4 sentences. Sentences 15-20 words. Simple words. Active voice. Dashes (-) for lists, never asterisks. No headings.` },
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

STRUCTURE:
1. CORE CLAIM: State the main point with a supporting data point (user number, market stat, growth rate, cost figure).
2. HOW IT WORKS: Explain the mechanism in plain terms. Why does this matter? What changes because of it?
3. COMPARISON OR EVIDENCE: Compare options, show before/after, or provide a real-world example. Use measurable criteria (cost, speed, engagement, ROI).
4. PRACTICAL LIST: Include 3-5 items using dashes (-) with **bold labels** and short explanations. Each item must be specific, not generic.
5. BOTTOM LINE: End with a clear verdict — what works, what does not, and for whom.

DATA RULE: Include at least 1 real number in this section (user count, percentage, pricing, performance metric). Use publicly known data.

KEYWORD RULES:
- Use "${main_keyword}" only ONCE. Use variations everywhere else.
- NEVER repeat the keyword in consecutive sentences.

BLOCKING RULES:
- No vague claims like "it is useful" or "it helps a lot"
- No repeating the same idea in different words
- No theory without a practical example
- Every claim must have a reason or data behind it

FORMAT: Paragraphs 2-4 sentences. Sentences 15-20 words. Simple words. Active voice. Dashes (-) for lists, never asterisks. No section heading in output.` },
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
- SENTENCE QUALITY: Write full, proper sentences. No fragments. AVOID "However", "Additionally", "Moreover", "Therefore". Use natural language.
- DECISION SUMMARY: State clearly what is the best option, who should choose it, and why it wins.
- WHEN NOT TO USE: Mention one scenario where a different approach is better. This builds trust.
- FINAL VERDICT: End with a clear, actionable statement. The reader must know exactly what to do next.
- Max 2 sentences per paragraph.
- Use "${main_keyword}" only once. Variations for other mentions.
- Do NOT start with "In conclusion" or "To sum up".

Then write FAQs:

## Frequently Asked Questions

### 1. [Specific question about ${main_keyword} with a data angle]?
[2-3 sentence answer with a real number or benchmark. Write full sentences. Use **bold** for key terms.]

### 2. [How/Why comparison question]?
[Answer with clear comparison and measurable criteria. Full sentences.]

### 3. [Common misconception or concern]?
[Answer that corrects the misconception with evidence or logic. Full sentences.]

FORMAT: Max 2 sentences per paragraph. Sentences 15-20 words. Simple words. Active voice. Dashes (-) for lists, never asterisks. No fake stats — use real public data or logical reasoning.` },
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

    // Auto-Publish Logic
    try {
      const { data: integrations, error: integrationError } = await supabase
        .from("workspace_integrations")
        .select("*")
        .eq("user_id", userId)
        .eq("platform", "wordpress")
        .eq("is_active", true);

      if (!integrationError && integrations && integrations.length > 0) {
        const autoPublishIntegration = integrations.find(
          (int: any) => int.credentials && int.credentials.auto_publish === true
        );

        if (autoPublishIntegration) {
          console.log(`Auto-publishing content ${contentId} to WordPress using integration ${autoPublishIntegration.id}...`);

          const { error: invokeError } = await supabase.functions.invoke("publish-to-wordpress", {
            body: { contentId: contentId, integrationId: autoPublishIntegration.id },
          });

          if (invokeError) {
            console.error("Auto-publish invoke failed:", invokeError);
          } else {
            console.log("Auto-publish invoked successfully");
          }
        }
      }
    } catch (publishErr) {
      console.error("Auto-publish logic failed:", publishErr);
    }

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
