import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/* =========================================================
   SETTINGS
========================================================= */

const TEST_LIMIT = 10;

const MODEL = "gemini-3.6-flash";

const DELAY_BETWEEN_REQUESTS = 1200;


/* =========================================================
   FILE PATHS
========================================================= */

const DATA_DIR = path.resolve("src/data");

const VERSE_FILE = path.join(
  DATA_DIR,
  "verse.json"
);

const TRANSLATION_FILE = path.join(
  DATA_DIR,
  "translation.json"
);

const OUTPUT_FILE = path.join(
  DATA_DIR,
  "gitaWisdom.json"
);


/* =========================================================
   LOAD JSON
========================================================= */

function loadJSON(filePath) {
  return JSON.parse(
    fs.readFileSync(
      filePath,
      "utf8"
    )
  );
}


/* =========================================================
   NORMALIZE DATA
========================================================= */

function normalizeArray(data, name) {

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data.data)) {
    return data.data;
  }

  if (Array.isArray(data.verses)) {
    return data.verses;
  }

  if (Array.isArray(data.translations)) {
    return data.translations;
  }

  throw new Error(
    `Could not find an array inside ${name}.`
  );
}


/* =========================================================
   SOURCE DATA
========================================================= */

const verseData =
  normalizeArray(
    loadJSON(VERSE_FILE),
    "verse.json"
  );

const translationData =
  normalizeArray(
    loadJSON(TRANSLATION_FILE),
    "translation.json"
  );


console.log("");
console.log("==========================================");
console.log(" WisdomScroll Gita Generator");
console.log("==========================================");
console.log("");

console.log(
  `Verses found: ${verseData.length}`
);

console.log(
  `Translations found: ${translationData.length}`
);

console.log(
  `Test limit: ${TEST_LIMIT}`
);

console.log("");



/* =========================================================
   TRANSLATION MAP
========================================================= */

const translationMap = new Map();

for (
  const translation of translationData
) {

  const language =
    String(
      translation.lang || ""
    ).trim().toLowerCase();

  if (
    language &&
    language !== "english"
  ) {
    continue;
  }


  const verseId =
    translation.verse_id ??
    translation.verseId ??
    translation.verse_order ??
    translation.verseOrder;


  if (
    verseId === undefined ||
    verseId === null
  ) {
    continue;
  }


  const key =
    String(verseId);


  if (
    !translationMap.has(key)
  ) {
    translationMap.set(
      key,
      []
    );
  }


  translationMap
    .get(key)
    .push(translation);
}


/* =========================================================
   TRANSLATION SELECTION
========================================================= */

function getTranslation(verse) {

  const verseId =
    verse.verse_order ??
    verse.verseOrder;


  const options =
    translationMap.get(
      String(verseId)
    ) || [];


  const preferredAuthors = [
    "Swami Sivananda",
    "Swami Adidevananda",
    "Swami Gambirananda",
    "Shri Purohit Swami",
  ];


  for (
    const author of preferredAuthors
  ) {

    const match =
      options.find(
        (item) =>
          String(
            item.authorName || ""
          )
            .trim()
            .toLowerCase() ===
          author.toLowerCase()
      );


    if (match) {
      return match;
    }
  }


  return options[0] || null;
}


/* =========================================================
   EXISTING OUTPUT
========================================================= */

let existing = [];

if (
  fs.existsSync(OUTPUT_FILE)
) {

  try {

    existing =
      JSON.parse(
        fs.readFileSync(
          OUTPUT_FILE,
          "utf8"
        )
      );


    if (
      !Array.isArray(existing)
    ) {
      existing = [];
    }

  } catch {

    existing = [];
  }
}


/* =========================================================
   GENERATED MAP
========================================================= */

const generatedMap =
  new Map();

for (
  const item of existing
) {

  if (
    item.verse_order !== undefined
  ) {

    generatedMap.set(
      String(
        item.verse_order
      ),
      item
    );

  }
}


console.log(
  `Already generated: ${generatedMap.size}`
);

console.log("");



/* =========================================================
   SAVE
========================================================= */

function saveProgress() {

  const output =
    Array.from(
      generatedMap.values()
    ).sort(
      (a, b) =>
        Number(
          a.verse_order
        ) -
        Number(
          b.verse_order
        )
    );


  fs.writeFileSync(
    OUTPUT_FILE,
    JSON.stringify(
      output,
      null,
      2
    ),
    "utf8"
  );
}



/* =========================================================
   PROMPT
========================================================= */

function createPrompt(
  verse,
  translation
) {

  const chapter =
    verse.chapter_number ??
    verse.chapterNumber ??
    verse.chapter ??
    "";


  const verseNumber =
    verse.verse_number ??
    verse.verseNumber ??
    verse.verse ??
    "";


  const sanskrit =
    verse.text ||
    verse.sanskrit ||
    "";


  const transliteration =
    verse.transliteration ||
    "";


  const englishTranslation =
    translation?.description ||
    translation?.translation ||
    translation?.text ||
    "";


  const translator =
    translation?.authorName ||
    "Unknown";


  return `
You are a careful wisdom editor for WisdomScroll.

You are given ONE specific, verified Bhagavad Gita verse.

Your job is to make THIS EXACT VERSE understandable to a modern
reader without changing, exaggerating, or inventing its meaning.

The supplied Sanskrit and English translation are your ONLY source
for the meaning of the verse.

==================================================
SOURCE VERSE
==================================================

Bhagavad Gita ${chapter}.${verseNumber}

Sanskrit:
${sanskrit}

Transliteration:
${transliteration}

English translation:
${englishTranslation}

Translator:
${translator}

==================================================
MOST IMPORTANT RULE
==================================================

DO NOT try to make every verse sound profound.

DO NOT try to make every verse motivational.

DO NOT invent a life lesson just because the output has a
lifeLesson field.

DO NOT turn descriptions into philosophy.

DO NOT turn narrative into self-help.

DO NOT add psychological explanations unless they are directly
supported by the supplied verse.

DO NOT add moral conclusions that are not present in the verse.

If the verse simply describes people, events, places, armies,
dialogue, or actions, explain what is happening.

That is a VALID and GOOD answer.

Accuracy is more important than sounding inspirational.

==================================================
STEP 1 — IDENTIFY THE VERSE TYPE
==================================================

Choose ONE:

"narrative"
"descriptive"
"teaching"
"instruction"
"philosophical"
"question"

Use the type that BEST describes what the verse actually does.

Examples:

A verse describing warriors:
"descriptive"

A verse where a character says what happened:
"narrative"

A verse directly explaining a principle:
"teaching"

A verse telling someone what to do:
"instruction"

A verse explaining the nature of self, reality, mind, etc.:
"philosophical"

A verse whose main purpose is a question:
"question"

Do NOT classify something as "teaching" merely because it can
be turned into a modern life lesson.

==================================================
STEP 2 — SIMPLE VERSION
==================================================

Write ONE short statement that makes the verse easy to understand.

Maximum 25 words.

This must describe the actual meaning or content of THIS verse.

If the verse is descriptive, simply describe what it is saying.

If the verse is philosophical, simplify the philosophical idea.

If the verse is narrative, explain what is happening.

DO NOT make it inspirational unless the verse itself is inspirational.

DO NOT copy the translation word-for-word.

==================================================
STEP 3 — EXPLANATION
==================================================

Explain the exact meaning in 2–3 short sentences.

Maximum 70 words.

Imagine explaining it to a smart 12-year-old.

Use simple words.

The reader should understand:

"What is actually happening or being taught here?"

Stay very close to the supplied translation.

Do NOT add information from your general knowledge.

Do NOT explain the entire Bhagavad Gita.

Explain THIS verse only.

==================================================
STEP 4 — HOOK
==================================================

A hook is OPTIONAL.

Ask yourself:

"Does this specific verse naturally contain a thought that would
make someone stop scrolling?"

If YES:

Create a short hook.

If NO:

Return:

"hook": null

"hookType": "none"

NEVER manufacture a dramatic hook.

Do NOT use generic social-media clickbait.

Do NOT force a philosophical question onto a descriptive verse.

Maximum 18 words.

Allowed hook types:

"statement"
"question"
"paradox"
"practical"
"none"

==================================================
STEP 5 — LIFE LESSON
==================================================

A practical lesson is OPTIONAL.

This is extremely important.

If the verse itself naturally supports a practical application,
give ONE.

If it does NOT naturally support one, return:

"lifeLesson": null

Do NOT manufacture advice.

For example:

A verse simply naming warriors may have:

"lifeLesson": null

That is completely acceptable.

A verse teaching detachment may have:

"lifeLesson": "Do your responsibility today without obsessing over
how others will respond."

The lesson must follow directly from the verse.

Maximum 30 words.

==================================================
STEP 6 — THEMES
==================================================

Choose 1–3 themes only if genuinely supported.

Possible themes:

duty
action
attachment
desire
anger
ego
discipline
self-control
mind
peace
fear
courage
knowledge
devotion
faith
suffering
purpose
identity
relationships
death
impermanence
freedom
detachment
wisdom
compassion
conflict
leadership
battle
dharma

For a descriptive verse, themes such as:

"battle"
"conflict"
"leadership"

may be appropriate.

Do NOT force psychological themes onto every verse.

==================================================
STEP 7 — TONE
==================================================

Choose ONE:

grounding
confronting
calm
hopeful
questioning
paradoxical
practical
reflective
powerful
compassionate
descriptive

Use "descriptive" when the verse is primarily describing
events, people, places, or actions.

==================================================
STEP 8 — CONFIDENCE
==================================================

Choose:

"high"

when the meaning is clear from the supplied material.

"medium"

when some interpretation is necessary.

"low"

when the meaning cannot be confidently determined from the
supplied material.

==================================================
FINAL QUALITY CHECK
==================================================

Before returning the JSON, silently check:

1. Did I describe THIS verse rather than the entire Gita?

2. Did I add anything that isn't supported by the supplied source?

3. Did I turn a descriptive verse into fake life advice?

4. Did I force a hook?

5. Did I force a life lesson?

6. Is the explanation understandable to a 12-year-old?

7. Is the simpleVersion actually simple?

8. If this verse is merely narrative or descriptive, did I allow
it to simply remain narrative or descriptive?

If there is no natural hook, use null.

If there is no natural life lesson, use null.

==================================================
OUTPUT
==================================================

Return ONLY valid JSON.

No markdown.

No code fences.

No comments.

No text before or after the JSON.

Use EXACTLY:

{
  "verseType": "",
  "hook": null,
  "hookType": "none",
  "simpleVersion": "",
  "explanation": "",
  "lifeLesson": null,
  "themes": [],
  "tone": "",
  "confidence": "high"
}
`;
}


/* =========================================================
   GEMINI
========================================================= */

async function generateWisdom(
  verse,
  translation
) {

  const prompt =
    createPrompt(
      verse,
      translation
    );


  const interaction =
    await ai.interactions.create({
      model: MODEL,
      input: prompt,
    });


  const text =
    interaction.output_text;


  if (!text) {
    throw new Error(
      "Gemini returned an empty response."
    );
  }


  let result;


  try {

    result =
      JSON.parse(text);

  } catch {

    console.error(
      "Invalid JSON from Gemini:"
    );

    console.error(text);

    throw new Error(
      "Gemini returned invalid JSON."
    );
  }


  /* =======================================================
     VALIDATION
  ======================================================= */

  const validVerseTypes = [
    "narrative",
    "descriptive",
    "teaching",
    "instruction",
    "philosophical",
    "question",
  ];


  const validHookTypes = [
    "statement",
    "question",
    "paradox",
    "practical",
    "none",
  ];


  const validTones = [
    "grounding",
    "confronting",
    "calm",
    "hopeful",
    "questioning",
    "paradoxical",
    "practical",
    "reflective",
    "powerful",
    "compassionate",
    "descriptive",
  ];


  const validConfidence = [
    "high",
    "medium",
    "low",
  ];


  if (
    !validVerseTypes.includes(
      result.verseType
    )
  ) {
    throw new Error(
      `Invalid verseType: ${result.verseType}`
    );
  }


  if (
    !validHookTypes.includes(
      result.hookType
    )
  ) {
    throw new Error(
      `Invalid hookType: ${result.hookType}`
    );
  }


  if (
    !validTones.includes(
      result.tone
    )
  ) {
    throw new Error(
      `Invalid tone: ${result.tone}`
    );
  }


  if (
    !validConfidence.includes(
      result.confidence
    )
  ) {
    throw new Error(
      `Invalid confidence: ${result.confidence}`
    );
  }


  if (
    !result.simpleVersion
  ) {
    throw new Error(
      "Missing simpleVersion."
    );
  }


  if (
    !result.explanation
  ) {
    throw new Error(
      "Missing explanation."
    );
  }


  if (
    !Array.isArray(
      result.themes
    )
  ) {
    throw new Error(
      "themes must be an array."
    );
  }


  /*
   * Enforce hook rules.
   */

  if (
    result.hookType === "none"
  ) {
    result.hook = null;
  }


  /*
   * Enforce optional life lesson.
   */

  if (
    result.lifeLesson === "" ||
    result.lifeLesson === undefined
  ) {
    result.lifeLesson = null;
  }


  return result;
}


/* =========================================================
   SLEEP
========================================================= */

function sleep(ms) {

  return new Promise(
    (resolve) =>
      setTimeout(
        resolve,
        ms
      )
  );
}


/* =========================================================
   MAIN
========================================================= */

async function main() {

  let generated = 0;

  let skipped = 0;

  let failed = 0;


  const versesToProcess =
    verseData.slice(
      0,
      TEST_LIMIT
    );


  console.log(
    `Testing with ${versesToProcess.length} verses.`
  );

  console.log("");


  for (
    let index = 0;
    index <
    versesToProcess.length;
    index++
  ) {

    const verse =
      versesToProcess[index];


    const verseId =
      verse.verse_order ??
      verse.verseOrder;


    if (
      verseId === undefined ||
      verseId === null
    ) {

      skipped++;

      continue;
    }


    const key =
      String(verseId);


    /*
     * Resume support.
     */

    if (
      generatedMap.has(key)
    ) {

      console.log(
        `Skipping BG ${key} — already generated.`
      );

      skipped++;

      continue;
    }


    const chapter =
      verse.chapter_number ??
      verse.chapterNumber ??
      verse.chapter ??
      "?";


    const verseNumber =
      verse.verse_number ??
      verse.verseNumber ??
      verse.verse ??
      "?";


    console.log(
      `Generating BG ${chapter}.${verseNumber} (${index + 1}/${versesToProcess.length})...`
    );


    const translation =
      getTranslation(verse);


    if (!translation) {

      console.log(
        "  ⚠ No English translation found."
      );

      skipped++;

      continue;
    }


    try {

      const wisdom =
        await generateWisdom(
          verse,
          translation
        );


      const item = {

        verse_order:
          Number(verseId),

        chapter:
          Number(chapter),

        verse:
          Number(verseNumber),

        verseType:
          wisdom.verseType,

        hook:
          wisdom.hook,

        hookType:
          wisdom.hookType,

        simpleVersion:
          wisdom.simpleVersion,

        explanation:
          wisdom.explanation,

        lifeLesson:
          wisdom.lifeLesson,

        themes:
          wisdom.themes,

        tone:
          wisdom.tone,

        confidence:
          wisdom.confidence,

        source: {

          sanskrit:
            verse.text ||
            verse.sanskrit ||
            "",

          transliteration:
            verse.transliteration ||
            "",

          translation:
            translation.description ||
            translation.translation ||
            translation.text ||
            "",

          translator:
            translation.authorName ||
            "",
        },

        aiGenerated:
          true,

        reviewed:
          false,

        generatedAt:
          new Date().toISOString(),
      };


      generatedMap.set(
        key,
        item
      );


      saveProgress();


      generated++;


      console.log(
        `  ✓ Saved BG ${chapter}.${verseNumber}`
      );

      console.log(
        `  Type: ${wisdom.verseType}`
      );

      console.log(
        `  Hook: ${wisdom.hook || "NONE"}`
      );

      console.log(
        `  Lesson: ${wisdom.lifeLesson || "NONE"}`
      );

      console.log(
        `  Confidence: ${wisdom.confidence}`
      );

      console.log("");


      await sleep(
        DELAY_BETWEEN_REQUESTS
      );


    } catch (error) {

      failed++;

      console.error("");

      console.error(
        `  ✗ Failed BG ${chapter}.${verseNumber}`
      );

      console.error(
        error?.message ||
        error
      );

      console.error("");


      saveProgress();


      console.log(
        "Generation stopped."
      );

      console.log(
        "Run the same command again to resume."
      );

      break;
    }
  }


  saveProgress();


  console.log("");
  console.log("==========================================");
  console.log(" Test generation finished");
  console.log("==========================================");
  console.log("");

  console.log(
    `Newly generated: ${generated}`
  );

  console.log(
    `Skipped: ${skipped}`
  );

  console.log(
    `Failed: ${failed}`
  );

  console.log(
    `Total in gitaWisdom.json: ${generatedMap.size}`
  );

  console.log("");

  console.log(
    `Output file: ${OUTPUT_FILE}`
  );

  console.log("");
}


/* =========================================================
   START
========================================================= */

main().catch(
  (error) => {

    console.error("");
    console.error(
      "FATAL ERROR:"
    );
    console.error(
      error?.message ||
      error
    );
    console.error("");

    try {
      saveProgress();
    } catch {}

    process.exit(1);
  }
);