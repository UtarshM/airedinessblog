import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// OpenRouter call for image prompt generation
async function callOpenRouter(messages: any[], maxTokens: number = 120): Promise<string> {
    const openRouterKey = Deno.env.get("OPENROUTER_API_KEY");
    if (!openRouterKey) {
        console.warn("OPENROUTER_API_KEY not set, falling back to Groq");
        return await callGroqFallback(messages, maxTokens);
    }

    for (let attempt = 0; attempt < 3; attempt++) {
        if (attempt > 0) await new Promise(r => setTimeout(r, 3000 * attempt));

        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${openRouterKey}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://blogforge.app",
                    "X-Title": "BlogForge Image Generator",
                },
                body: JSON.stringify({
                    model: "nvidia/llama-nemotron-super-49b-v1:free",
                    messages,
                    max_tokens: maxTokens,
                    temperature: 0.7,
                }),
            });

            if (response.status === 429) {
                console.warn(`OpenRouter rate limited, attempt ${attempt + 1}`);
                await new Promise(r => setTimeout(r, 5000 * (attempt + 1)));
                continue;
            }

            if (!response.ok) {
                const text = await response.text();
                console.error(`OpenRouter error ${response.status}: ${text}`);
                return await callGroqFallback(messages, maxTokens);
            }

            const data = await response.json();
            const content = data.choices?.[0]?.message?.content || "";
            if (content) {
                return content.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
            }
        } catch (err) {
            console.error("OpenRouter fetch error:", err);
        }
    }

    return await callGroqFallback(messages, maxTokens);
}

// Groq fallback
async function callGroqFallback(messages: any[], maxTokens: number = 120): Promise<string> {
    const groqKey = Deno.env.get("GROQ_API_KEY");
    if (!groqKey) throw new Error("No LLM keys configured");

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${groqKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages,
            max_tokens: maxTokens,
            temperature: 0.7,
        }),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Groq error ${response.status}: ${text}`);
    }

    const data = await response.json();
    return (data.choices?.[0]?.message?.content || "").replace(/<think>[\s\S]*?<\/think>/g, "").trim();
}

const IMAGE_SYSTEM_PROMPT = "You generate short, vivid image descriptions for AI image generators. Return ONLY the description, no quotes, no explanation. Maximum 30 words. Focus on visual elements, colors, composition, lighting and mood. Always end with: photorealistic, high resolution, no text overlay.";

async function generateImagesForContent(supabase: any, contentId: string, userId: string) {
    try {
        const { data: content, error: fetchError } = await supabase
            .from("content_items")
            .select("*")
            .eq("id", contentId)
            .eq("user_id", userId)
            .single();

        if (fetchError || !content) {
            console.error("Content not found:", fetchError);
            return;
        }

        const { main_keyword, h2_list, generated_content } = content;
        let sectionHeadings: string[] = h2_list || [];

        if (sectionHeadings.length === 0 && generated_content) {
            const matches = generated_content.match(/^## (.+)$/gm);
            if (matches) {
                sectionHeadings = matches.map((m: string) => m.replace("## ", ""));
            }
        }

        // 1. Featured image
        console.log(`Generating featured image for: ${main_keyword}`);
        const featuredPromptText = await callOpenRouter([
            { role: "system", content: IMAGE_SYSTEM_PROMPT },
            { role: "user", content: `Describe a professional blog header image for an article about "${main_keyword}". Modern, clean, editorial.` },
        ], 80);

        const cleanFeaturedPrompt = featuredPromptText.replace(/"/g, '').replace(/\n/g, ' ').trim();
        const featuredImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanFeaturedPrompt)}?width=1200&height=630&nologo=true`;

        await supabase.from("blog_images").insert({
            content_id: contentId,
            user_id: userId,
            image_url: featuredImageUrl,
            prompt: cleanFeaturedPrompt,
            image_type: "featured",
            section_heading: null,
            status: "completed",
        });

        await supabase.from("content_items").update({ featured_image_url: featuredImageUrl }).eq("id", contentId);
        console.log(`Featured image done: ${featuredImageUrl}`);

        // 2. Section images
        for (const heading of sectionHeadings) {
            if (
                heading.toLowerCase().includes("conclusion") ||
                heading.toLowerCase().includes("faq") ||
                heading.toLowerCase().includes("frequently asked")
            ) continue;

            await new Promise(r => setTimeout(r, 2500));

            console.log(`Generating image for section: ${heading}`);
            const sectionPromptText = await callOpenRouter([
                { role: "system", content: IMAGE_SYSTEM_PROMPT },
                { role: "user", content: `Describe a compelling image for blog section: "${heading}" about "${main_keyword}". Professional and editorial.` },
            ], 80);

            const cleanPrompt = sectionPromptText.replace(/"/g, '').replace(/\n/g, ' ').trim();
            const sectionImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=800&height=533&nologo=true`;

            await supabase.from("blog_images").insert({
                content_id: contentId,
                user_id: userId,
                image_url: sectionImageUrl,
                prompt: cleanPrompt,
                image_type: "section",
                section_heading: heading,
                status: "completed",
            });
        }

        console.log(`All images generated for content ${contentId}`);
    } catch (e) {
        console.error("generateImages error:", e);
    }
}

serve(async (req) => {
    if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    try {
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        const body = await req.json();
        const { contentId, userId } = body;

        if (!contentId || !userId) {
            return new Response(JSON.stringify({ error: "contentId and userId are required" }), {
                status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // Verify content belongs to this user using service role (no JWT needed)
        const { data: content, error: fetchError } = await supabase
            .from("content_items").select("id, user_id")
            .eq("id", contentId).eq("user_id", userId).single();

        if (fetchError || !content) {
            return new Response(JSON.stringify({ error: "Content not found or access denied" }), {
                status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // Background generation
        const generationPromise = generateImagesForContent(supabase, contentId, userId);
        const edgeRuntime = (globalThis as any).EdgeRuntime;
        if (edgeRuntime?.waitUntil) {
            edgeRuntime.waitUntil(generationPromise);
        } else {
            generationPromise.catch(err => console.error("Background generation failed:", err));
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
