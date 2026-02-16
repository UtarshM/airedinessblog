import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { marked } from "https://esm.sh/marked@11.0.0";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
    if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    try {
        const authHeader = req.headers.get("Authorization");
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const apiKey = Deno.env.get("LOVABLE_API_KEY");

        // if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Verify user
        const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
            global: { headers: { Authorization: authHeader || "" } },
        });
        const { data: { user }, error: userError } = await anonClient.auth.getUser();
        if (userError || !user) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const { contentId, integrationId } = await req.json();

        if (!contentId) {
            return new Response(JSON.stringify({ error: "Content ID required" }), {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // 1. Fetch Content
        const { data: content, error: contentError } = await supabase
            .from("content_items")
            .select("*")
            .eq("id", contentId)
            .eq("user_id", user.id)
            .single();

        if (contentError || !content) {
            return new Response(JSON.stringify({ error: "Content not found" }), {
                status: 404,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // 2. Fetch Integrations
        let query = supabase
            .from("workspace_integrations")
            .select("*")
            .eq("user_id", user.id)
            .eq("platform", "wordpress")
            .eq("is_active", true);

        if (integrationId) {
            query = query.eq("id", integrationId);
        }

        // Explicitly type the response or just handle the data
        const { data: integrations, error: integrationError } = await query;

        if (integrationError || !integrations || integrations.length === 0) {
            return new Response(JSON.stringify({ error: "No active WordPress integration found" }), {
                status: 404,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // Use the first integration found (or specific one)
        const integration = integrations[0];
        const creds = integration.credentials as { url?: string; username?: string; app_password?: string };
        const { url: wpUrl, username, app_password } = creds;

        if (!wpUrl || !username || !app_password) {
            return new Response(JSON.stringify({ error: "Invalid integration credentials" }), {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // 3. Prepare Content (Markdown -> HTML)
        const title = content.generated_title || content.h1;
        const markdownContent = content.generated_content || "";
        // marked.parse returns string | Promise<string> depending on options. Default is string.
        const htmlContent = marked.parse(markdownContent);

        // 4. Publish to WordPress
        // Clean URL: remove trailing slash
        let cleanUrl = wpUrl.trim();
        if (cleanUrl.endsWith("/")) cleanUrl = cleanUrl.slice(0, -1);

        const endpoint = `${cleanUrl}/wp-json/wp/v2/posts`;
        const authString = btoa(`${username}:${app_password}`);

        console.log(`Publishing to ${endpoint}...`);

        const wpResponse = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${authString}`,
            },
            body: JSON.stringify({
                title: title,
                content: htmlContent,
                status: "draft", // Publish as draft
            }),
        });

        if (!wpResponse.ok) {
            const errorText = await wpResponse.text();
            console.error("WordPress API Error:", wpResponse.status, errorText);
            throw new Error(`WordPress API failed: ${wpResponse.status} - ${errorText.substring(0, 200)}`);
        }

        const wpData = await wpResponse.json();
        const publishedUrl = wpData.link;

        // 5. Update Content Item
        await supabase.from("content_items").update({
            status: "published", // Make sure this status helps
            published_url: publishedUrl
        }).eq("id", contentId);

        return new Response(JSON.stringify({ success: true, publishedUrl, wpId: wpData.id }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (e) {
        console.error("publish-to-wordpress error:", e);
        return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
