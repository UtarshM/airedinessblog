import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// Generate an image prompt via Groq
async function generatePrompt(topic: string, context: string): Promise<string> {
    const key = Deno.env.get("GROQ_API_KEY");
    if (!key) return `Professional photo of ${topic}, photorealistic, high resolution`;

    try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [
                    { role: "system", content: "You create short, vivid image prompts for AI image generators. Return ONLY the description in 25 words max. End with: photorealistic, high resolution, no text." },
                    { role: "user", content: `Create an image prompt for: "${topic}" in the context of "${context}"` }
                ],
                max_tokens: 80,
                temperature: 0.7,
            }),
        });
        if (!res.ok) throw new Error(`Groq ${res.status}`);
        const data = await res.json();
        return data.choices?.[0]?.message?.content?.trim() || `Professional photo of ${topic}, photorealistic, high resolution`;
    } catch (e) {
        console.error("Prompt gen error:", e);
        return `Professional photo of ${topic}, photorealistic, high resolution, no text`;
    }
}

// Generate image via Fireworks AI and upload to Supabase Storage
async function generateAndUpload(
    supabase: any, prompt: string, fileName: string, width: number, height: number
): Promise<string | null> {
    const key = Deno.env.get("FIREWORKS_API_KEY");
    if (!key) {
        console.error("FIREWORKS_API_KEY not set");
        return null;
    }

    console.log(`Generating image: ${prompt.substring(0, 60)}...`);

    try {
        const res = await fetch(
            "https://api.fireworks.ai/inference/v1/image_generation/accounts/fireworks/models/stable-diffusion-xl-1024-v1-0",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${key}`,
                    "Content-Type": "application/json",
                    Accept: "image/jpeg",
                },
                body: JSON.stringify({
                    prompt,
                    negative_prompt: "text, watermark, logo, signature, ugly, blurry, low quality, distorted",
                    height: Math.min(height, 1024),
                    width: Math.min(width, 1024),
                    num_inference_steps: 25,
                    guidance_scale: 7,
                    samples: 1,
                }),
            }
        );

        if (!res.ok) {
            const t = await res.text();
            console.error(`Fireworks error ${res.status}: ${t}`);
            return null;
        }

        const imageData = await res.arrayBuffer();
        const uint8Array = new Uint8Array(imageData);
        console.log(`Got image blob: ${uint8Array.byteLength} bytes`);

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from("blog-images")
            .upload(fileName, uint8Array, {
                contentType: "image/jpeg",
                upsert: true,
            });

        if (error) {
            console.error("Storage upload error:", JSON.stringify(error));
            return null;
        }

        const { data: { publicUrl } } = supabase.storage.from("blog-images").getPublicUrl(data.path);
        console.log(`Uploaded: ${publicUrl}`);
        return publicUrl;
    } catch (e) {
        console.error("generateAndUpload error:", e);
        return null;
    }
}

// Main generation logic
async function generateImagesForContent(supabase: any, contentId: string, userId: string) {
    console.log(`Starting image generation for content: ${contentId}`);

    const { data: content, error: fetchError } = await supabase
        .from("content_items")
        .select("main_keyword, h2_list, generated_content")
        .eq("id", contentId)
        .eq("user_id", userId)
        .single();

    if (fetchError || !content) {
        console.error("Content not found:", fetchError);
        return;
    }

    const { main_keyword, h2_list, generated_content } = content;
    let sectionHeadings: string[] = h2_list || [];

    // Extract headings from generated content if h2_list is empty
    if (sectionHeadings.length === 0 && generated_content) {
        const matches = generated_content.match(/^## (.+)$/gm);
        if (matches) sectionHeadings = matches.map((m: string) => m.replace("## ", ""));
    }

    console.log(`Found ${sectionHeadings.length} sections for: ${main_keyword}`);

    // ── Featured image ────────────────────────────────────────────────────────
    const featuredPrompt = await generatePrompt(`${main_keyword} hero image`, main_keyword);
    const featuredUrl = await generateAndUpload(
        supabase,
        featuredPrompt,
        `${contentId}/featured_${Date.now()}.jpg`,
        1024,
        576
    );

    if (featuredUrl) {
        await supabase.from("blog_images").insert({
            content_id: contentId, user_id: userId,
            image_url: featuredUrl, prompt: featuredPrompt,
            image_type: "featured", section_heading: null, status: "completed",
        });
        await supabase.from("content_items").update({ featured_image_url: featuredUrl }).eq("id", contentId);
        console.log("Featured image saved:", featuredUrl);
    } else {
        console.error("Featured image generation failed");
    }

    // ── Section images ────────────────────────────────────────────────────────
    for (const heading of sectionHeadings) {
        const h = heading.toLowerCase();
        if (h.includes("conclusion") || h.includes("faq") || h.includes("frequently")) continue;

        await sleep(3000); // rate limiting

        const sectionPrompt = await generatePrompt(heading, main_keyword);
        const slug = heading.replace(/\s+/g, "_").replace(/[^a-z0-9_]/gi, "").slice(0, 40);
        const sectionUrl = await generateAndUpload(
            supabase,
            sectionPrompt,
            `${contentId}/section_${slug}_${Date.now()}.jpg`,
            1024,
            576
        );

        if (sectionUrl) {
            await supabase.from("blog_images").insert({
                content_id: contentId, user_id: userId,
                image_url: sectionUrl, prompt: sectionPrompt,
                image_type: "section", section_heading: heading, status: "completed",
            });
            console.log(`Section image saved for "${heading}":`, sectionUrl);
        } else {
            console.error(`Section image failed for: ${heading}`);
        }
    }

    console.log("Image generation complete for:", contentId);
}

// HTTP Handler
serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

        if (!supabaseUrl || !supabaseKey) {
            return new Response(
                JSON.stringify({ error: "Missing Supabase credentials" }),
                { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const supabase = createClient(supabaseUrl, supabaseKey);
        const body = await req.json();
        const { contentId, userId } = body;

        if (!contentId || !userId) {
            return new Response(
                JSON.stringify({ error: "contentId and userId are required" }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Verify content exists
        const { data: content, error: fetchError } = await supabase
            .from("content_items").select("id").eq("id", contentId).eq("user_id", userId).single();

        if (fetchError || !content) {
            return new Response(
                JSON.stringify({ error: "Content not found or access denied" }),
                { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Respond immediately, generate in background
        const generationPromise = generateImagesForContent(supabase, contentId, userId);
        const edgeRuntime = (globalThis as any).EdgeRuntime;
        if (edgeRuntime?.waitUntil) {
            edgeRuntime.waitUntil(generationPromise);
        } else {
            generationPromise.catch(err => console.error("Background generation failed:", err));
        }

        return new Response(
            JSON.stringify({ success: true, message: "Image generation started", contentId }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    } catch (e) {
        console.error("Edge function error:", e);
        return new Response(
            JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
