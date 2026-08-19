import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/* =========================
   TEST SERVER
========================= */

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "WisdomScroll Gemini server is running.",
  });
});

/* =========================
   GITA AI
========================= */

app.post("/api/gita", async (req, res) => {
  try {
    const { verse } = req.body;

    if (!verse) {
      return res.status(400).json({
        success: false,
        error: "No verse provided.",
      });
    }

    const prompt = `
You are the wisdom writer for WisdomScroll.

You are given ONE specific Bhagavad Gita verse and its English
translation.

Your job is to make THAT EXACT TEACHING understandable to a modern
person in simple, powerful English.

IMPORTANT:

The supplied Sanskrit and English translation are the source of truth.

Do NOT invent scripture.
Do NOT change the meaning.
Do NOT add philosophical claims that are not supported by the supplied verse.
Do NOT create a generic motivational quote.
Do NOT turn the verse into unrelated productivity advice.
Do NOT pretend your simplified wording is the original verse.

Your output should feel like:

"The Gita said something profound.
Here is what it means in language I can understand today."

STEP 1 — UNDERSTAND THE VERSE

First understand the actual teaching contained in the supplied verse.

Pay attention to:

- What Krishna is teaching
- What problem or situation the verse addresses
- What attitude, action, warning, or principle it presents
- The important distinction or contrast in the verse

Use the English translation to understand the meaning.

Do not rely on the chapter number alone.

STEP 2 — SIMPLE VERSION

Write ONE short, memorable statement expressing the CORE meaning
of this specific verse.

It must:

- Be extremely easy to understand
- Preserve the meaning of the verse
- Sound natural in modern English
- Feel worth remembering
- Be powerful without exaggeration

Maximum 25 words.

It should NOT simply repeat the translation.

It should be a clear modern expression of the teaching.

Example style:

"Do your duty fully, but don't let the outcome decide whether you have peace."

STEP 3 — WHAT THIS MEANS

Explain the exact teaching in 2–3 short sentences.

A person who has never studied the Bhagavad Gita should understand
the verse immediately.

Stay close to the supplied translation.

Do NOT introduce unrelated psychology, neuroscience, productivity
theories, modern scientific claims, or personal opinions.

Maximum 70 words.

STEP 4 — TODAY'S LESSON

Give ONE practical way the specific teaching can be applied today.

It MUST logically follow from the verse.

Do not force every verse into a productivity lesson.

If the verse concerns devotion, explain a practical form of devotion.

If it concerns discipline, give a discipline-related lesson.

If it concerns desire, give a desire-related lesson.

If it concerns knowledge, give a knowledge-related lesson.

The lesson must be specific to THIS verse.

Maximum 30 words.

STYLE

WisdomScroll should feel:

Deep.
Calm.
Clear.
Human.
Memorable.
Timeless.
Modern without changing the ancient meaning.

Write for someone scrolling on their phone.

They should understand the main idea within 5 seconds.

Avoid:

- Academic language
- Long explanations
- Generic motivational quotes
- Clichés
- Unnecessary Sanskrit terminology
- Modern claims not present in the verse
- Overdramatic language
- Preaching
- Repeating the same idea three times

SOURCE VERSE

${verse}

OUTPUT

Return ONLY valid JSON.

Use exactly this structure:

{
  "simpleVersion": "",
  "explanation": "",
  "lifeLesson": ""
}

Do not include markdown.
Do not include code fences.
Do not include any text before or after the JSON.
`;

    const interaction = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: prompt,
    });

    const text = interaction.output_text;

    let result;

    try {
      result = JSON.parse(text);
    } catch (parseError) {
      console.error(
        "Gemini returned invalid JSON:",
        text
      );

      return res.status(500).json({
        success: false,
        error: "Gemini returned an invalid response.",
      });
    }

    res.json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error("Gemini error:", error);

    res.status(500).json({
      success: false,
      error:
        error?.message ||
        "Failed to generate Gita wisdom.",
    });
  }
});
/* =========================
   WISDOM AI CHAT
========================= */

app.post("/api/chat", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        error: "No question provided.",
      });
    }

    const interaction = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: question,
    });

    const text = interaction.output_text;

    if (!text) {
      return res.status(500).json({
        success: false,
        error: "Gemini returned an empty response.",
      });
    }

    res.json({
      success: true,
      answer: text,
    });

  } catch (error) {
    console.error("Wisdom AI error:", error);

    res.status(500).json({
      success: false,
      error:
        error?.message ||
        "Failed to generate AI response.",
    });
  }
});

/* =========================
   SERVER
========================= */

const PORT = 3001;

app.listen(PORT, () => {
  console.log(
    `WisdomScroll Gemini server running on http://localhost:${PORT}`
  );
});