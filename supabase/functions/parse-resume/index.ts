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

    const { filePath } = await req.json();

    if (!filePath) {
      throw new Error("File path is required");
    }

    console.log("Downloading file:", filePath);

    // Download file from storage
    const { data: fileData, error: downloadError } = await supabaseClient.storage
      .from("resumes")
      .download(filePath);

    if (downloadError) {
      console.error("Error downloading file:", downloadError);
      throw downloadError;
    }

    console.log("File downloaded, reading content...");

    // Read file as text (for simple text extraction)
    const text = await fileData.text();

    console.log(`File content length: ${text.length} characters`);

    // Use AI to extract structured information from the resume
    const prompt = `You are an AI assistant that extracts key information from resumes. Analyze the following resume text and extract:

1. Work Experience: List each job/role with company, title, duration, and key achievements
2. Projects: Notable projects mentioned
3. Skills & Technologies: Technical skills and tools mentioned
4. Education: Degrees and certifications

Resume Text:
${text.substring(0, 5000)} ${text.length > 5000 ? "... (truncated)" : ""}

Create 3-5 journal entries based on this resume. Each entry should focus on a significant role, project, or achievement. Return ONLY a valid JSON array with this structure:
[
  {
    "title": "string (e.g., 'Senior Developer at TechCorp')",
    "content": "string (detailed description of role, achievements, learnings)",
    "category": "string (e.g., 'Experience', 'Project', 'Achievement')",
    "tags": ["string", "string"] (relevant technologies and skills)
  }
]`;

    console.log("Calling Lovable AI to parse resume...");

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
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    console.log("AI response received");

    const content = aiData.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error("Could not extract JSON array from response:", content);
      throw new Error("Invalid JSON response from AI");
    }

    const entries = JSON.parse(jsonMatch[0]);

    console.log(`Parsed ${entries.length} entries from resume`);

    // Insert entries into database
    const { error: insertError } = await supabaseClient
      .from("journal_entries")
      .insert(
        entries.map((entry: any) => ({
          ...entry,
          user_id: user.id,
        }))
      );

    if (insertError) {
      console.error("Error inserting entries:", insertError);
      throw insertError;
    }

    console.log("Entries successfully created");

    return new Response(
      JSON.stringify({
        message: "Resume parsed successfully",
        entriesCreated: entries.length,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in parse-resume:", error);
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
