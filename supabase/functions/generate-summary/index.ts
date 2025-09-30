import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Get user from auth header
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    console.log("Fetching entries for user:", user.id);

    // Fetch all user's journal entries
    const { data: entries, error: entriesError } = await supabaseClient
      .from("journal_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (entriesError) {
      console.error("Error fetching entries:", entriesError);
      throw entriesError;
    }

    if (!entries || entries.length === 0) {
      return new Response(
        JSON.stringify({
          error: "No entries found. Create some journal entries first!",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Found ${entries.length} entries, generating summary...`);

    // Prepare entries summary for AI
    const entriesSummary = entries
      .map(
        (entry, idx) =>
          `Entry ${idx + 1} (${new Date(entry.created_at).toLocaleDateString()}):\nTitle: ${entry.title}\nCategory: ${entry.category || "None"}\nTags: ${entry.tags.join(", ") || "None"}\nContent: ${entry.content}\n`
      )
      .join("\n---\n");

    const prompt = `You are an AI assistant analyzing a developer's journal entries. Based on the following ${entries.length} journal entries, provide a comprehensive analysis in JSON format.

Journal Entries:
${entriesSummary}

Please analyze these entries and provide:
1. A concise overview (2-3 sentences) of their development journey and progress
2. 3-4 key insights about their learning patterns, work style, or growth areas
3. 2-3 recent achievements or milestones
4. A list of technologies/topics they're focusing on (extract from categories, tags, and content)
5. 3-4 actionable recommendations for their continued growth

Return ONLY a valid JSON object with this exact structure:
{
  "overview": "string",
  "insights": ["string", "string", "string"],
  "achievements": ["string", "string", "string"],
  "technologies": ["string", "string", ...],
  "recommendations": ["string", "string", "string"]
}`;

    console.log("Calling Lovable AI...");

    // Call Lovable AI
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI API error:", aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status} - ${errorText}`);
    }

    const aiData = await aiResponse.json();
    console.log("AI response received");

    const content = aiData.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Could not extract JSON from response:", content);
      throw new Error("Invalid JSON response from AI");
    }

    const summary = JSON.parse(jsonMatch[0]);

    console.log("Summary generated successfully");

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-summary:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
