import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

async function testGenerationAndUpload() {
    console.log("1. Testing Fireworks Image Gen...");
    const key = process.env.FIREWORKS_API_KEY;
    if (!key) {
        console.log("No FIREWORKS_API_KEY found in .env. Remember the edge function needs it configured via supabase secrets.");
        return;
    }

    let blob;
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
                    prompt: "A beautiful solar panel house testing the api",
                    negative_prompt: "ugly, blurry",
                    height: 1024,
                    width: 1024,
                    num_inference_steps: 10,
                    guidance_scale: 7,
                    samples: 1,
                }),
            }
        );

        if (!res.ok) {
            const text = await res.text();
            console.error(`💥 Fireworks Error (${res.status}): ${text}`);
            return;
        }

        blob = await res.blob();
        console.log(`✅ Fireworks success! Got image blob of size: ${blob.size}`);
    } catch (e) {
        console.error("💥 Fireworks fetch exception:", e);
        return;
    }

    console.log("\n2. Testing Supabase Storage Upload to 'blog-images'...");
    try {
        const { data, error } = await supabase.storage
            .from("blog-images")
            .upload(`test_upload_${Date.now()}.jpg`, blob, { contentType: "image/jpeg", upsert: true });

        if (error) {
            console.error("💥 Storage Upload Error:", error);
            return;
        }

        const { data: { publicUrl } } = supabase.storage.from("blog-images").getPublicUrl(data.path);
        console.log(`✅ Storage success! Uploaded to: ${publicUrl}`);
    } catch (e) {
        console.error("💥 Storage upload exception:", e);
    }
}

testGenerationAndUpload();
