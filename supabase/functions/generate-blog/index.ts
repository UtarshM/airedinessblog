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

const SYSTEM_PROMPT = `You are an expert SEO blog writer. Write SHORT paragraphs (2-3 sentences max). Use **bold** for key terms. Use numbered lists with bold titles where appropriate. Include specific facts and details. No generic filler. Do NOT include any headings in your response.`;

// Ordered by preference — if one is rate-limited, try the next
const FREE_MODELS = [
  "nvidia/nemotron-nano-9b-v2:free",
  "google/gemma-3-27b-it:free",
  "mistralai/mistral-small-3.1-24b-instruct:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "qwen/qwen3-next-80b-a3b-instruct:free",
];

async function callAI(messages: any[], apiKey: string): Promise<string> {
  let lastError = "";

  for (const model of FREE_MODELS) {
    // Try each model, retry once on 429
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "HTTP-Referer": "https://blogforge.app",
            "X-Title": "BlogForge",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ model, messages, max_tokens: 1500 }),
        });

        if (response.status === 429) {
          lastError = `Rate limited on ${model}`;
          console.warn(`429 on ${model}, attempt ${attempt + 1}`);
          // Wait 3 seconds before retry/next model
          await new Promise(r => setTimeout(r, 3000));
          continue;
        }

        if (!response.ok) {
          const text = await response.text();
          lastError = `AI error ${response.status}: ${text}`;
          console.error(`Error on ${model}:`, response.status, text);
          break; // Try next model on non-429 errors
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || "";
        if (content) {
          console.log(`Generated with ${model}`);
          return content;
        }
        break; // Empty response, try next model
      } catch (e) {
        lastError = e instanceof Error ? e.message : String(e);
        console.error(`Exception on ${model}:`, lastError);
        break;
      }
    }
  }

  throw new Error(`All models failed. Last error: ${lastError}`);
}

function calculateWordDistribution(totalWords: number, h2Count: number, h3Count: number) {
  const introWords = Math.round(totalWords * 0.1);
  const conclusionWords = Math.round(totalWords * 0.1);
  const faqWords = Math.round(totalWords * 0.15);
  const remainingWords = totalWords - introWords - conclusionWords - faqWords;
  const h2Words = h2Count > 0
    ? (h3Count > 0 ? Math.round(remainingWords * 0.7 / h2Count) : Math.round(remainingWords / h2Count))
    : 0;
  const h3Words = h3Count > 0 ? Math.round(remainingWords * 0.3 / h3Count) : 0;
  return { introWords, h2Words, h3Words, conclusionWords, faqWords };
}

async function updateProgress(supabase: any, contentId: string, updates: any) {
  await supabase.from("content_items").update(updates).eq("id", contentId);
}

// Background generation — runs after response is sent
async function generateBlog(supabase: any, contentId: string, userId: string, apiKey: string) {
  try {
    const { data: content, error: fetchError } = await supabase
      .from("content_items").select("*")
      .eq("id", contentId).eq("user_id", userId).single();

    if (fetchError || !content) {
      console.error("Content not found:", fetchError);
      return;
    }

    const { main_keyword, secondary_keywords, word_count_target, tone, h1, h2_list, h3_list } = content;
    const h2s = h2_list || [];
    const h3s = h3_list || [];
    const secondaryKw = (secondary_keywords || []).join(", ");
    const dist = calculateWordDistribution(word_count_target, h2s.length, h3s.length);
    const totalSections = 1 + 1 + h2s.length + h3s.length + 1 + 1;

    // Credit lock
    const estimatedCredits = calculateEstimatedCredits(word_count_target, h3s.length > 0, true);
    await lockCredits(supabase, userId, contentId, estimatedCredits);

    await updateProgress(supabase, contentId, {
      status: "generating", total_sections: totalSections,
      sections_completed: 0, current_section: "Title", generated_content: "",
    });

    let markdown = "";
    let completed = 0;

    // 1. TITLE
    const title = await callAI([
      { role: "system", content: "Generate a single SEO blog title. Return ONLY the title, nothing else." },
      { role: "user", content: `Create a clickable, SEO-friendly title (55-65 chars) for: "${main_keyword}". Use power words. Return only the title.` },
    ], apiKey);

    completed = 1;
    markdown = `# ${title.trim()}\n\n`;
    await updateProgress(supabase, contentId, {
      generated_title: title.trim(), generated_content: markdown,
      sections_completed: completed, current_section: "Introduction",
    });

    // 2. INTRODUCTION
    const intro = await callAI([
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Write an introduction for "${title.trim()}" about "${main_keyword}".${secondaryKw ? ` Include: ${secondaryKw}.` : ""} Tone: ${tone}. ~${dist.introWords} words. Hook the reader, explain why this matters, preview the article. Short paragraphs only.` },
    ], apiKey);

    completed++;
    markdown += `${intro.trim()}\n\n`;
    await updateProgress(supabase, contentId, {
      generated_content: markdown, sections_completed: completed,
      current_section: h2s.length > 0 ? h2s[0] : "Conclusion",
    });

    // 3. H2 SECTIONS
    for (let i = 0; i < h2s.length; i++) {
      const h2Content = await callAI([
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Write content for section "${h2s[i]}" about "${main_keyword}".${secondaryKw ? ` Include: ${secondaryKw}.` : ""} Tone: ${tone}. ~${dist.h2Words} words. Use short paragraphs, bold key terms, lists where helpful. No heading.` },
      ], apiKey);

      completed++;
      markdown += `## ${h2s[i]}\n\n${h2Content.trim()}\n\n`;
      const nextSection = i < h2s.length - 1 ? h2s[i + 1] : (h3s.length > 0 ? h3s[0] : "Conclusion");
      await updateProgress(supabase, contentId, {
        generated_content: markdown, sections_completed: completed, current_section: nextSection,
      });
    }

    // 4. H3 SECTIONS
    for (let i = 0; i < h3s.length; i++) {
      const h3Content = await callAI([
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Write content for subsection "${h3s[i]}" about "${main_keyword}".${secondaryKw ? ` Include: ${secondaryKw}.` : ""} Tone: ${tone}. ~${dist.h3Words} words. Short paragraphs, specific details, bold terms. No heading.` },
      ], apiKey);

      completed++;
      markdown += `### ${h3s[i]}\n\n${h3Content.trim()}\n\n`;
      const nextSection = i < h3s.length - 1 ? h3s[i + 1] : "Conclusion";
      await updateProgress(supabase, contentId, {
        generated_content: markdown, sections_completed: completed, current_section: nextSection,
      });
    }

    // 5. CONCLUSION
    const conclusion = await callAI([
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Write a conclusion for "${title.trim()}" about "${main_keyword}". Tone: ${tone}. ~${dist.conclusionWords} words. Summarize takeaways, add a call to action. Short paragraphs. No heading.` },
    ], apiKey);

    completed++;
    markdown += `## Conclusion\n\n${conclusion.trim()}\n\n`;
    await updateProgress(supabase, contentId, {
      generated_content: markdown, sections_completed: completed, current_section: "FAQs",
    });

    // 6. FAQS
    const faqs = await callAI([
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Write 4-5 FAQs about "${main_keyword}". ~${dist.faqWords} words. Format: ### 1. Question?\nAnswer (2-3 sentences). Specific, practical questions.` },
    ], apiKey);

    completed++;
    markdown += `## Frequently Asked Questions\n\n${faqs.trim()}\n`;

    await updateProgress(supabase, contentId, {
      generated_content: markdown, sections_completed: completed,
      current_section: null, status: "completed",
    });

    // Finalize credits
    const finalCredits = calculateEstimatedCredits(word_count_target, h3s.length > 0, true);
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
    const apiKey = Deno.env.get("LOVABLE_API_KEY");

    if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

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
    const generationPromise = generateBlog(supabase, contentId, user.id, apiKey);

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
      generateBlog(supabase, contentId, user.id, apiKey).catch(err => console.error("Background generation failed without waitUntil:", err));
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
