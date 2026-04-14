import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';

const PERSONA_PROMPTS: Record<string, string> = {
  vc: `You are "The Silicon Valley VC" — a ruthless, sarcastic venture capitalist who has seen 10,000 pitches and is deeply unimpressed. You roast resumes and profiles by focusing on vague buzzwords, lack of quantifiable achievements, poor positioning, and anything that screams "I Googled 'how to write a resume'." Your humor is dry, cutting, and very specific. You reference startup culture, tech jargon abuse, and corporate clichés.`,
  fashionista: `You are "The Mean Fashionista" — a brutally honest style critic who judges people's professional photos, headshots, and overall visual presentation. You roast bad lighting, forced smiles, outdated outfits, cluttered backgrounds, and anything that doesn't scream "I take myself seriously." Your humor is sharp, visual, and dramatic. You reference fashion, personal branding, and first impressions.`,
  mom: `You are "The Disappointed Mom" — a passive-aggressive mother who is not angry, just disappointed. You roast resumes and profiles with guilt-tripping, backhanded compliments, and maternal disappointment. You compare the person to their more successful siblings/cousins. Your humor is warm but devastating. You reference family expectations, potential, and "what we talked about."`,
};

const app = new Elysia()
  .use(cors())
  .post('/api/roast', async ({ body, set }) => {
    try {
      const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
      if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured in environment variables");

      const persona = body.persona;
      const file = body.file as File;

      if (!persona || !PERSONA_PROMPTS[persona]) {
        set.status = 400;
        return { error: "Invalid persona" };
      }

      if (!file) {
        set.status = 400;
        return { error: "No file provided" };
      }

      const isImage = file.type.startsWith("image/");
      const isPdf = file.type === "application/pdf";

      // Build messages for the AI
      const systemPrompt = `${PERSONA_PROMPTS[persona]}

IMPORTANT: You MUST respond with valid JSON only. No markdown, no code fences, no extra text.

Analyze the uploaded ${isImage ? "profile photo/image" : "resume/document"} and generate a personalized roast.

Your response must be this exact JSON structure:
{
  "overallScore": <number 1-10, be harsh but fair>,
  "scores": [
    {"label": "Hireability", "score": <1-10>, "icon": "hire"},
    {"label": "Vibe Check", "score": <1-10>, "icon": "vibe"},
    {"label": "Confidence", "score": <1-10>, "icon": "confidence"}
  ],
  "roastLines": [
    "<specific roast about something you actually see in their upload>",
    "<another specific, non-generic roast>",
    "<a roast that's actually helpful criticism disguised as humor>",
    "<the 'real talk' moment where you explain WHY this matters, with a stat or fact>"
  ],
  "quickWins": [
    "<specific actionable fix #1>",
    "<specific actionable fix #2>",
    "<specific actionable fix #3>"
  ]
}

Rules:
- Every roast MUST reference something specific you can see/read in the upload
- Never be generic — if you can't find something specific, make it about the FORMAT or PRESENTATION
- Each roastLine should be 1-2 sentences max
- quickWins must be actionable and specific
- Scores should be harsh but fair (most people score 3-6)
- The last roastLine should always include a real statistic or fact about hiring/branding`;

      const messages: any[] = [
        { role: "system", content: systemPrompt },
      ];

      const toBase64 = (buffer: ArrayBuffer): string => {
        return Buffer.from(buffer).toString('base64');
      };

      if (isImage) {
        const arrayBuffer = await file.arrayBuffer();
        const base64 = toBase64(arrayBuffer);
        const mimeType = file.type;

        messages.push({
          role: "user",
          content: [
            {
              type: "text",
              text: "Roast this profile photo / image. Be specific about what you see — the lighting, expression, background, outfit, everything.",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64}`,
              },
            },
          ],
        });
      } else if (isPdf) {
        const arrayBuffer = await file.arrayBuffer();
        const base64 = toBase64(arrayBuffer);

        messages.push({
          role: "user",
          content: [
            {
              type: "text",
              text: "Roast this resume/LinkedIn PDF. Be specific about the buzzwords, formatting, achievements (or lack thereof), and overall presentation.",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:application/pdf;base64,${base64}`,
              },
            },
          ],
        });
      } else {
        // Fallback: try to read as text
        const text = await file.text();
        messages.push({
          role: "user",
          content: `Roast this resume/profile text. Be specific about the buzzwords, achievements (or lack thereof), and overall presentation:\n\n${text}`,
        });
      }

      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GEMINI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gemini-flash-latest",
          messages,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          set.status = 429;
          return { error: "Rate limited — try again in a moment" };
        }
        if (response.status === 402) {
          set.status = 402;
          return { error: "AI credits exhausted — please add credits" };
        }
        const errorText = await response.text();
        console.error("AI gateway error:", response.status, errorText);
        set.status = response.status;
        return { error: `AI gateway error: ${response.status}`, details: errorText };
      }

      const aiData = await response.json();
      const content = aiData.choices?.[0]?.message?.content;

      if (!content) {
        set.status = 500;
        return { error: "No response from AI" };
      }

      let roastData;
      try {
        const cleaned = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
        roastData = JSON.parse(cleaned);
      } catch {
        console.error("Failed to parse AI response:", content);
        set.status = 500;
        return { error: "Failed to parse AI response", raw: content };
      }

      return roastData;
    } catch (e) {
      console.error("Roast function error:", e);
      set.status = 500;
      return { error: e instanceof Error ? e.message : "Unknown error" };
    }
  }, {
    body: t.Object({
      persona: t.String(),
      file: t.File()
    })
  });

if (import.meta.main) {
  app.listen(3000);
  console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
}

export default app;
