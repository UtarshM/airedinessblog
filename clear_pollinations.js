import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

// Use the service role key to bypass RLS
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;

if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.log("⚠️  No SUPABASE_SERVICE_ROLE_KEY found. Trying anon key (may fail due to RLS)...");
}

const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

async function clearPollinationsImages() {
    console.log("🔍 Finding all Pollinations images...");
    const { data, error } = await supabase
        .from('blog_images')
        .select('id, image_url, section_heading, image_type')
        .like('image_url', '%pollinations%');

    if (error) {
        console.error('Error fetching:', error);
        return;
    }

    console.log(`Found ${data.length} Pollinations images.`);

    if (data.length === 0) {
        console.log("✅ No pollinations images to delete!");
        return;
    }

    const ids = data.map(d => d.id);

    const { error: deleteError, count } = await supabase
        .from('blog_images')
        .delete({ count: 'exact' })
        .in('id', ids);

    if (deleteError) {
        console.error("Error deleting:", deleteError);
    } else {
        console.log(`✅ Deleted ${count} broken Pollinations images from DB!`);
        console.log("Now click 'Regenerate All' in the BlogForge UI to generate fresh images.");
    }
}

clearPollinationsImages();
