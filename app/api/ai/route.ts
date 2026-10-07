// import { NextRequest, NextResponse } from "next/server";

// type AiAction =
//   | "improve"
//   | "summarize"
//   | "continue"
//   | "tone"
//   | "generate"
//   | "fix_grammar"
//   | "make_shorter"
//   | "make_longer"
//   | "explain"
//   | "translate"
//   | "bullet_points";

// function buildPrompt(action: AiAction, text: string, options?: { tone?: string; language?: string }) {
//   const prompts: Record<AiAction, string> = {
//     improve: `You are a professional writing assistant. Improve the following text for clarity, readability, and correctness. Keep the same meaning and intent. Return ONLY the improved text, no explanations.\n\nText: "${text}"`,

//     fix_grammar: `You are a professional grammar checker. Fix all grammar, spelling, and punctuation errors in the following text. Keep the meaning and style the same. Return ONLY the corrected text, no explanations.\n\nText: "${text}"`,

//     summarize: `You are a concise summarizer. Summarize the following text into a brief, clear summary. The summary should capture the key points and be significantly shorter than the original. Return ONLY the summary, no explanations.\n\nText: "${text}"`,

//     continue: `You are a creative writing assistant. Continue writing the following text naturally. Write 2-3 more sentences that flow naturally from what was written. Match the existing tone and style. Return ONLY the continuation text (do NOT repeat the original), no explanations.\n\nText: "${text}"`,

//     tone: `You are a professional writing assistant. Rewrite the following text in a ${options?.tone || "formal"} tone. Keep the same meaning but adjust the language, word choice, and style to match the requested tone. Return ONLY the rewritten text, no explanations.\n\nText: "${text}"`,

//     generate: `You are a professional content writer. Generate well-structured, engaging content based on the following prompt. Use proper paragraphs, clear language, and a professional tone. Return ONLY the generated content, no explanations or meta-commentary.\n\nPrompt: "${text}"`,

//     make_shorter: `You are a concise editor. Make the following text shorter while keeping the key meaning intact. Remove unnecessary words and simplify. Return ONLY the shortened text, no explanations.\n\nText: "${text}"`,

//     make_longer: `You are a detailed writer. Expand the following text with more detail, examples, and elaboration while keeping the same tone and meaning. Return ONLY the expanded text, no explanations.\n\nText: "${text}"`,

//     explain: `You are a helpful explainer. Explain the following text in simple, easy-to-understand language. Break down complex ideas. Return ONLY the explanation, no meta-commentary.\n\nText: "${text}"`,

//     translate: `You are a professional translator. Translate the following text into ${options?.language || "Spanish"}. Return ONLY the translated text, no explanations.\n\nText: "${text}"`,

//     bullet_points: `You are a content organizer. Convert the following text into clear, well-organized bullet points. Each bullet point should capture a key idea. Return ONLY the bullet points (use "• " prefix), no explanations.\n\nText: "${text}"`,
//   };

//   return prompts[action] || prompts.improve;
// }

// // Models to try in order (fallback chain)
// const MODELS = [
//   "gemini-2.0-flash",
//   "gemini-1.5-flash",
//   "gemini-1.5-flash-8b",
// ];

// async function callGemini(
//   apiKey: string,
//   prompt: string,
//   temperature: number,
//   maxTokens: number
// ): Promise<{ result?: string; error?: string }> {
//   // Try each model until one succeeds
//   for (const model of MODELS) {
//     const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

//     for (let attempt = 0; attempt < 2; attempt++) {
//       try {
//         // Wait before retry
//         if (attempt > 0) {
//           await new Promise((r) => setTimeout(r, 2000));
//         }

//         const response = await fetch(url, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             contents: [{ parts: [{ text: prompt }] }],
//             generationConfig: {
//               temperature,
//               maxOutputTokens: maxTokens,
//             },
//           }),
//         });

//         if (response.ok) {
//           const data = await response.json();
//           const text =
//             data?.candidates?.[0]?.content?.parts?.[0]?.text;
//           if (text) {
//             return { result: text.trim() };
//           }
//           return { error: "No response generated." };
//         }

//         // If rate limited, try next model or retry
//         if (response.status === 429) {
//           console.log(`Rate limited on ${model}, attempt ${attempt + 1}`);
//           if (attempt === 0) continue; // retry same model once
//           break; // try next model
//         }

//         // If 400 / invalid key — no point trying other models
//         if (response.status === 400 || response.status === 403) {
//           const errorData = await response.text();
//           console.error(`Gemini (${model}) error ${response.status}:`, errorData);

//           try {
//             const parsed = JSON.parse(errorData);
//             const msg = parsed?.error?.message || "";
//             if (msg.includes("API key not valid")) {
//               return { error: "Invalid Gemini API key. Please check your GEMINI_API_KEY in .env.local" };
//             }
//             if (response.status === 403) {
//               return { error: "API key doesn't have permission for this model." };
//             }
//           } catch (_e) {
//             // ignore parse errors
//           }
//           return { error: "AI service error. Please check your API key." };
//         }

//         // Other errors — try next model
//         console.error(`Gemini (${model}) error ${response.status}`);
//         break;
//       } catch (fetchError) {
//         console.error(`Fetch error for ${model}:`, fetchError);
//         break; // try next model
//       }
//     }
//   }

//   return { error: "AI service is temporarily unavailable. Please wait a moment and try again." };
// }

// export async function POST(req: NextRequest) {
//   try {
//     const apiKey = process.env.GEMINI_API_KEY;

//     if (!apiKey || apiKey === "your_gemini_api_key_here") {
//       return NextResponse.json(
//         { error: "GEMINI_API_KEY is not set. Please add your Gemini API key to .env.local and restart the server. Get a free key at https://aistudio.google.com/apikey" },
//         { status: 500 }
//       );
//     }

//     const body = await req.json();
//     const { action, text, options } = body as {
//       action: AiAction;
//       text: string;
//       options?: { tone?: string; language?: string };
//     };

//     if (!action || !text) {
//       return NextResponse.json(
//         { error: "Both 'action' and 'text' fields are required." },
//         { status: 400 }
//       );
//     }

//     const prompt = buildPrompt(action, text, options);
//     const temperature = action === "fix_grammar" ? 0.1 : 0.7;
//     const maxTokens = action === "generate" || action === "make_longer" ? 2048 : 1024;

//     const { result, error } = await callGemini(apiKey, prompt, temperature, maxTokens);

//     if (error) {
//       return NextResponse.json({ error }, { status: 502 });
//     }

//     return NextResponse.json({ result });
//   } catch (error) {
//     console.error("AI API route error:", error);
//     return NextResponse.json(
//       { error: "Internal server error. Check the server console for details." },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";

type AiAction =
  | "improve"
  | "summarize"
  | "continue"
  | "tone"
  | "generate"
  | "fix_grammar"
  | "make_shorter"
  | "make_longer"
  | "explain"
  | "translate"
  | "bullet_points";

function buildPrompt(
  action: AiAction,
  text: string,
  options?: { tone?: string; language?: string }
) {
  const prompts: Record<AiAction, string> = {
    improve: `Improve the following text for clarity and readability:\n\n${text}`,

    fix_grammar: `Fix grammar and spelling:\n\n${text}`,

    summarize: `Summarize this text:\n\n${text}`,

    continue: `Continue writing this naturally:\n\n${text}`,

    tone: `Rewrite this text in a ${options?.tone || "formal"} tone:\n\n${text}`,

    generate: `Generate high-quality content based on:\n\n${text}`,

    make_shorter: `Make this text shorter:\n\n${text}`,

    make_longer: `Expand this text with more details:\n\n${text}`,

    explain: `Explain this in simple terms:\n\n${text}`,

    translate: `Translate this into ${options?.language || "Spanish"}:\n\n${text}`,

    bullet_points: `Convert into bullet points:\n\n${text}`,
  };

  return prompts[action];
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENROUTER_API_KEY is missing in .env.local" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { action, text, options } = body;

    if (!action || !text) {
      return NextResponse.json(
        { error: "Action and text are required" },
        { status: 400 }
      );
    }

    const prompt = buildPrompt(action, text, options);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000", // required by OpenRouter
        "X-Title": "AI Docs App", // your app name
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini", // fast + cheap model
        messages: [
          {
            role: "system",
            content: "You are a professional AI writing assistant.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter Error:", data);
      return NextResponse.json(
        { error: data?.error?.message || "OpenRouter API failed" },
        { status: 502 }
      );
    }

    const result = data?.choices?.[0]?.message?.content;

    if (!result) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 502 }
      );
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}