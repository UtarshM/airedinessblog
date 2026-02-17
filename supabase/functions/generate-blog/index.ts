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

const SYSTEM_PROMPT = `You are a strategic domain expert and industry architect.

You write for decision-makers and professionals who care about impact and structure.

FOLLOW THESE RULES STRICTLY:

1. PARAGRAPH LENGTH: Each paragraph must be 2-4 sentences. Not 1 sentence. Not 5+. Always 2 to 4 sentences per paragraph.

2. SENTENCE LENGTH: Keep sentences between 15-20 words. Short, clear, direct. No long complex sentences.

3. SIMPLE LANGUAGE: Use simple, common, everyday words. Write at a 7th-grade reading level. Avoid complex or academic words. If a simpler word exists, use it.

4. TRANSITION WORDS: Use transitions between paragraphs: However, Therefore, Additionally, Moreover, Furthermore, As a result, In contrast, Meanwhile, Consequently.

5. ACTIVE VOICE: Write in active voice. Avoid passive voice completely. Say "Companies use this" not "This is used by companies."

6. KEYWORD DENSITY: Naturally include the main keyword in 0.5-3% of total words. Spread it evenly across sections. Do not stuff keywords.

7. BOLD: Use **bold** for key terms, product names, and important concepts.

8. NO HEADINGS: Do NOT include any headings (h1, h2, h3, ###) in your output. Write only body content.

9. NO FAKE DATA: Never invent statistics, percentages, dollar figures, or study citations.

10. NARRATIVE FLOW: Follow cause → effect explanations. Explain how things work, not just what they are. Show the problem, then the solution, then the impact.

11. BANNED PHRASES: Never use: "In today's world", "It's important to note", "In conclusion", "Let's dive in", "When it comes to", "At the end of the day", "studies show", "research indicates", "it goes without saying".`;

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
      { role: "system", content: "You generate SEO-optimized blog titles. Return ONLY the title text. No quotes, no explanation, nothing else." },
      {
        role: "user", content: `Create an SEO title for the keyword: "${main_keyword}".

RULES:
- MUST contain the exact keyword "${main_keyword}"
- Length: 50-70 characters (STRICT)
- Word count: 6-12 words
- Use simple, clear words
- Make it specific and valuable (e.g. "How to...", "Why...", "Best...")
- No clickbait, no all-caps
- Return ONLY the title text` },
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
        role: "user", content: `Write the introduction for a blog titled "${title.trim()}" about "${main_keyword}".${secondaryKw ? ` Include these keywords naturally: ${secondaryKw}.` : ""} Tone: ${tone}. ~${dist.introWords} words.

Follow this structure:
1. Start with the current reality — state the problem or situation clearly in 2-3 sentences.
2. Explain why existing approaches fall short. What is the gap?
3. Introduce what this article will cover as the structural solution.

Remember:
- Use the keyword "${main_keyword}" at least 2 times naturally.
- Paragraphs must be 2-4 sentences each.
- Sentences must be 15-20 words each.
- Use simple, everyday words.
- Use transition words between paragraphs.
- Active voice only. No passive voice.
- Do NOT include any headings.` },
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
          role: "user", content: `Write the section "${h2s[i]}" for a blog about "${main_keyword}".${secondaryKw ? ` Include: ${secondaryKw}.` : ""} Tone: ${tone}. ~${dist.h2Words} words.

Follow this narrative flow:
1. State the core point of this section clearly.
2. Explain the mechanism — how it works, why it matters.
3. Show real-world application or practical impact.
4. Include a bullet list with **bold titles** followed by a short explanation.
5. End with the consequence or outcome.

Remember:
- Use the keyword "${main_keyword}" at least once naturally.
- Paragraphs: 2-4 sentences each.
- Sentences: 15-20 words each.
- Simple, common words only.
- Use transition words (However, Therefore, Additionally, Moreover).
- Active voice only.
- Use **bold** for key terms.
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
- Summarize the structural shift or key insight in 2-3 paragraphs (2-4 sentences each).
- Explain what changes going forward.
- End with a clear, forward-looking statement.
- Use the keyword "${main_keyword}" at least once.
- Do NOT write "In conclusion" or "To sum up".

Then write the FAQs:

## Frequently Asked Questions

### 1. [Practical question about ${main_keyword}]?
[2-3 sentence answer. Use simple words. Include **bold** key terms.]

### 2. [Another practical question]?
[Answer.]

### 3. [Another question]?
[Answer.]

Remember:
- Paragraphs: 2-4 sentences. Sentences: 15-20 words.
- Simple words. Active voice. Transition words.
- No fake statistics.` },
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
