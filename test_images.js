import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

async function checkImages() {
    const { data, error } = await supabase
        .from('blog_images')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Latest 5 images:', JSON.stringify(data, null, 2));
    }
}

checkImages();
