import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    const { data, error } = await supabase.from('content_items').select('id, generated_title, meta_description, status').order('created_at', { ascending: false }).limit(5);
    console.log("Recent items:", data);
    console.log("Error:", error);
}

test();
