import express from "express";
import Groq from "groq-sdk";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.get("/", async (req, res) => {
  const question =
    req.query.question ||
    "Hello! Introduce yourself.";

  console.log("QUESTION:", question);

  const chatCompletion =
    await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: question,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

  res.send(
    chatCompletion.choices[0].message.content
  );
});

app.listen(3000, () => {
  console.log(
    "WisdomScroll AI running on http://localhost:3000"
  );
});