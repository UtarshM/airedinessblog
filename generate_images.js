// Direct image generation script - bypasses edge function entirely
// Run: node generate_images.js <contentId> <userId>
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const FIREWORKS_API_KEY = process.env.FIREWORKS_API_KEY || 'fw_DAu8WgrRtTALPZbJvyPAXD';
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY);

const CONTENT_ID = process.argv[2] || '819c254b-012b-4c7d-beb2-0356a02c699b';
const USER_ID = process.argv[3] || '980cf1ab-3a35-49e3-8cb8-e4b7e2c2437f';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function generatePrompt(topic, context) {
    if (!GROQ_API_KEY) return `Professional photo of ${topic}, photorealistic, high resolution, no text`;
    try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { Authorization: `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [
                    { role: "system", content: "Create short vivid image prompts in 25 words max. End with: photorealistic, high resolution, no text." },
                    { role: "user", content: `Image for: "${topic}" about "${context}"` }
                ],
                max_tokens: 80,
            }),
        });
        const data = await res.json();
        return data.choices?.[0]?.message?.content?.trim() || `${topic}, photorealistic, high resolution, no text`;
    } catch (e) {
        return `${topic}, photorealistic, high resolution, no text`;
    }
}

async function generateAndUpload(prompt, fileName, width, height) {
    console.log(`  Generating: "${prompt.substring(0, 60)}..."`);
    try {
        const res = await fetch(
            "https://api.fireworks.ai/inference/v1/image_generation/accounts/fireworks/models/stable-diffusion-xl-1024-v1-0",
            {
                method: "POST",
                headers: { Authorization: `Bearer ${FIREWORKS_API_KEY}`, "Content-Type": "application/json", Accept: "image/jpeg" },
                body: JSON.stringify({
                    prompt,
                    negative_prompt: "text, watermark, logo, ugly, blurry, low quality",
                    height: 768,
                    width: 1344,
                    num_inference_steps: 25,
                    guidance_scale: 7,
                    samples: 1,
                }),
            }
        );

        if (!res.ok) {
            console.error(`  Fireworks error ${res.status}:`, await res.text());
            return null;
        }

        const buffer = Buffer.from(await res.arrayBuffer());
        console.log(`  Got image: ${buffer.byteLength} bytes`);

        const { data, error } = await supabase.storage
            .from("blog-images")
            .upload(fileName, buffer, { contentType: "image/jpeg", upsert: true });

        if (error) {
            console.error("  Storage error:", JSON.stringify(error));
            return null;
        }

        const { data: { publicUrl } } = supabase.storage.from("blog-images").getPublicUrl(data.path);
        console.log(`  ✅ Uploaded: ${publicUrl}`);
        return publicUrl;
    } catch (e) {
        console.error("  Error:", e.message);
        return null;
    }
}

async function main() {
    console.log(`\n🎨 Generating images for content: ${CONTENT_ID}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    // Fetch content
    const { data: content, error } = await supabase
        .from("content_items")
        .select("main_keyword, h2_list, generated_content")
        .eq("id", CONTENT_ID)
        .single();

    if (error || !content) {
        console.error("Content not found:", error);
        process.exit(1);
    }

    const { main_keyword, h2_list, generated_content } = content;
    let headings = h2_list || [];
    if (headings.length === 0 && generated_content) {
        const matches = generated_content.match(/^## (.+)$/gm);
        if (matches) headings = matches.map(m => m.replace("## ", ""));
    }

    console.log(`Topic: "${main_keyword}"`);
    console.log(`Sections: ${headings.length}\n`);

    // Delete existing images for this content
    await supabase.from("blog_images").delete().eq("content_id", CONTENT_ID);
    console.log("🗑️  Cleared old images\n");

    // Featured image
    console.log("📸 Featured Image:");
    const featuredPrompt = await generatePrompt(`${main_keyword} hero image`, main_keyword);
    const featuredUrl = await generateAndUpload(featuredPrompt, `${CONTENT_ID}/featured_${Date.now()}.jpg`, 1024, 576);

    if (featuredUrl) {
        await supabase.from("blog_images").insert({
            content_id: CONTENT_ID, user_id: USER_ID,
            image_url: featuredUrl, prompt: featuredPrompt,
            image_type: "featured", section_heading: null, status: "completed",
        });
        await supabase.from("content_items").update({ featured_image_url: featuredUrl }).eq("id", CONTENT_ID);
        console.log("  Saved to DB ✅\n");
    }

    // Section images
    for (const heading of headings) {
        const h = heading.toLowerCase();
        if (h.includes("conclusion") || h.includes("faq") || h.includes("frequently")) continue;

        console.log(`📸 Section: "${heading}"`);
        await sleep(3000);

        const prompt = await generatePrompt(heading, main_keyword);
        const slug = heading.replace(/\s+/g, "_").replace(/[^a-z0-9_]/gi, "").slice(0, 40);
        const url = await generateAndUpload(prompt, `${CONTENT_ID}/section_${slug}_${Date.now()}.jpg`, 1024, 576);

        if (url) {
            await supabase.from("blog_images").insert({
                content_id: CONTENT_ID, user_id: USER_ID,
                image_url: url, prompt: prompt,
                image_type: "section", section_heading: heading, status: "completed",
            });
            console.log("  Saved to DB ✅\n");
        }
    }

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ Done! Refresh the BlogForge UI to see images.");
}

main().catch(console.error);
