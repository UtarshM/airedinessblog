import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// OpenRouter call using nvidia/llama-nemotron-super-49b-v1:free for image prompt generation
async function callOpenRouter(messages: any[], maxTokens: number = 120): Promise<string> {
    const openRouterKey = Deno.env.get("OPENROUTER_API_KEY");
    if (!openRouterKey) throw new Error("OPENROUTER_API_KEY not configured");

    const model = "nvidia/llama-nemotron-super-49b-v1:free";

    for (let attempt = 0; attempt < 3; attempt++) {
        if (attempt > 0) await new Promise(r => setTimeout(r, 3000 * attempt));

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${openRouterKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://blogforge.app",
                "X-Title": "BlogForge Image Generator",
            },
            body: JSON.stringify({
                model,
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
            // Fall back to Groq if OpenRouter fails
            return await callGroqFallback(messages, maxTokens);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || "";
        if (content) {
            return content.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
        }
        throw new Error("Empty response from OpenRouter");
    }
    // Fall back to Groq after exhausting retries
    return await callGroqFallback(messages, maxTokens);
}

// Groq fallback in case OpenRouter is unavailable
async function callGroqFallback(messages: any[], maxTokens: number = 120): Promise<string> {
    const groqKey = Deno.env.get("GROQ_API_KEY");
    if (!groqKey) throw new Error("No LLM keys configured (OpenRouter + Groq both unavailable)");

    console.warn("Falling back to Groq for image prompt generation");
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
        throw new Error(`Groq fallback error ${response.status}: ${text}`);
    }

    const data = await response.json();
    return (data.choices?.[0]?.message?.content || "").replace(/<think>[\s\S]*?<\/think>/g, "").trim();
}

const IMAGE_SYSTEM_PROMPT = "You generate short, vivid image descriptions for AI image generators. Return ONLY the description, no quotes, no explanation, no additional commentary. Maximum 30 words. Focus on visual elements, colors, composition, lighting, and mood. Always end with: photorealistic, high resolution, no text overlay.";

async function generateImagesForContent(supabase: any, contentId: string, userId: string) {
    try {
        // Fetch content item
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
        const h2s: string[] = h2_list || [];

        // Extract H2 headings from generated content if h2_list is empty
        let sectionHeadings = h2s;
        if (sectionHeadings.length === 0 && generated_content) {
            const matches = generated_content.match(/^## (.+)$/gm);
            if (matches) {
                sectionHeadings = matches.map((m: string) => m.replace("## ", ""));
            }
        }

        // 1. Generate featured image prompt via OpenRouter
        console.log(`Generating featured image for: ${main_keyword}`);
        const featuredPromptText = await callOpenRouter([
            { role: "system", content: IMAGE_SYSTEM_PROMPT },
            {
                role: "user",
                content: `Describe a professional blog header image for an article about "${main_keyword}". The image should feel modern, clean, and editorial.`
            },
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

        // Also update the content_items featured_image_url
        await supabase.from("content_items").update({
            featured_image_url: featuredImageUrl,
        }).eq("id", contentId);

        console.log(`Featured image created: ${featuredImageUrl}`);

        // 2. Generate section images for each H2
        for (const heading of sectionHeadings) {
            // Skip conclusion and FAQ sections
            if (
                heading.toLowerCase().includes("conclusion") ||
                heading.toLowerCase().includes("faq") ||
                heading.toLowerCase().includes("frequently asked")
            ) {
                continue;
            }

            // Delay between calls to respect rate limits
            await new Promise(r => setTimeout(r, 2500));

            console.log(`Generating image for section: ${heading}`);
            const sectionPromptText = await callOpenRouter([
                { role: "system", content: IMAGE_SYSTEM_PROMPT },
                {
                    role: "user",
                    content: `Describe a single compelling image that visually represents this blog section: "${heading}" in the context of "${main_keyword}". Professional and editorial.`
                },
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

            console.log(`Section image created for: ${heading}`);
        }

        console.log(`All images generated for content ${contentId}`);
    } catch (e) {
        console.error("generateImages error:", e);
    }
}

serve(async (req) => {
    if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    try {
        const authHeader = req.headers.get("Authorization");
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

        const supabase = createClient(supabaseUrl, supabaseKey);
        const { contentId } = await req.json();

        if (!contentId) {
            return new Response(JSON.stringify({ error: "contentId is required" }), {
                status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

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
            .from("content_items").select("id, user_id")
            .eq("id", contentId).eq("user_id", user.id).single();

        if (fetchError || !content) {
            return new Response(JSON.stringify({ error: "Content not found" }), {
                status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // Start background image generation using EdgeRuntime.waitUntil
        const generationPromise = generateImagesForContent(supabase, contentId, user.id);

        const edgeRuntime = (globalThis as any).EdgeRuntime;
        if (edgeRuntime && edgeRuntime.waitUntil) {
            edgeRuntime.waitUntil(generationPromise);
        } else {
            generateImagesForContent(supabase, contentId, user.id).catch(err =>
                console.error("Background image generation failed:", err)
            );
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
