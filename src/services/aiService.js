// =====================================================
// WISDOMSCROLL AI SERVICE
// =====================================================

const getDateKey = (value) => {
  const date = new Date(value);

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
};


// =====================================================
// START OF TODAY
// =====================================================

const getStartOfToday = () => {
  const date = new Date();

  date.setHours(0, 0, 0, 0);

  return date;
};


// =====================================================
// DAYS AGO
// =====================================================

const getDaysAgoDate = (daysAgo) => {
  const date = getStartOfToday();

  date.setDate(
    date.getDate() - daysAgo
  );

  return date;
};


// =====================================================
// BUILD FOCUS CONTEXT
// =====================================================

const getFocusContext = () => {
  try {
    const stored =
      localStorage.getItem("focuses");

    if (!stored) {
      return {
        hasFocusData: false,
        text: "",
      };
    }

    const focuses =
      JSON.parse(stored);

    if (
      !Array.isArray(focuses) ||
      focuses.length === 0
    ) {
      return {
        hasFocusData: false,
        text: "",
      };
    }

    // ---------------------------------------------
    // SORT
    // ---------------------------------------------

    const sorted = [...focuses].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );


    // ---------------------------------------------
    // TODAY
    // ---------------------------------------------

    const todayKey =
      getDateKey(new Date());

    const todayFocus =
      sorted.find(
        (item) =>
          getDateKey(item.createdAt) ===
          todayKey
      ) || null;


    // ---------------------------------------------
    // COMPLETED DAYS
    // ---------------------------------------------

    const completedDateKeys =
      new Set(
        sorted
          .filter(
            (item) => item.completed
          )
          .map((item) =>
            getDateKey(
              item.createdAt
            )
          )
      );


    // ---------------------------------------------
    // CURRENT STREAK
    // ---------------------------------------------

    let currentStreak = 0;

    const cursor =
      getStartOfToday();

    if (
      !completedDateKeys.has(
        getDateKey(cursor)
      )
    ) {
      cursor.setDate(
        cursor.getDate() - 1
      );
    }

    while (
      completedDateKeys.has(
        getDateKey(cursor)
      )
    ) {
      currentStreak++;

      cursor.setDate(
        cursor.getDate() - 1
      );
    }


    // ---------------------------------------------
    // LONGEST STREAK
    // ---------------------------------------------

    const completedDates = [
      ...completedDateKeys,
    ].sort();

    let longestStreak = 0;
    let runningStreak = 0;

    if (completedDates.length > 0) {
      runningStreak = 1;
      longestStreak = 1;

      for (
        let i = 1;
        i < completedDates.length;
        i++
      ) {
        const previous =
          new Date(
            `${completedDates[i - 1]}T00:00:00`
          );

        const current =
          new Date(
            `${completedDates[i]}T00:00:00`
          );

        const difference =
          Math.round(
            (
              current.getTime() -
              previous.getTime()
            ) /
              (1000 * 60 * 60 * 24)
          );

        if (difference === 1) {
          runningStreak++;

          longestStreak =
            Math.max(
              longestStreak,
              runningStreak
            );
        } else {
          runningStreak = 1;
        }
      }
    }


    // ---------------------------------------------
    // BASIC STATS
    // ---------------------------------------------

    const totalFocuses =
      sorted.length;

    const completedFocuses =
      sorted.filter(
        (item) => item.completed
      ).length;

    const missedFocuses =
      sorted.filter(
        (item) => !item.completed
      ).length;

    const completionRate =
      totalFocuses === 0
        ? 0
        : Math.round(
            (completedFocuses /
              totalFocuses) *
              100
          );


    // ---------------------------------------------
    // RECENT HISTORY
    // ---------------------------------------------

    const recentHistory =
      sorted
        .filter(
          (item) =>
            !todayFocus ||
            item.id !== todayFocus.id
        )
        .slice(0, 7)
        .map((item) => {
          const date =
            new Date(
              item.createdAt
            );

          return {
            date:
              date.toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }
              ),

            text: item.text,

            status:
              item.completed
                ? "completed"
                : "not completed",
          };
        });


    // ---------------------------------------------
    // BUILD COMPACT CONTEXT
    // ---------------------------------------------

    const context = {
      today: todayFocus
        ? {
            focus: todayFocus.text,
            status:
              todayFocus.completed
                ? "completed"
                : "in progress",
          }
        : null,

      streak: {
        current: currentStreak,
        longest: longestStreak,
      },

      statistics: {
        total: totalFocuses,
        completed:
          completedFocuses,
        notCompleted:
          missedFocuses,
        completionRate:
          completionRate,
      },

      recentHistory,
    };


    return {
      hasFocusData: true,
      text: JSON.stringify(
        context
      ),
    };

  } catch (error) {
    console.error(
      "Could not build focus context:",
      error
    );

    return {
      hasFocusData: false,
      text: "",
    };
  }
};


// =====================================================
// ASK AI
// =====================================================

export async function askAI(question) {

  const focusContext =
    getFocusContext();


  // ===================================================
  // COACH INSTRUCTIONS
  // ===================================================

  const coachInstructions = `
You are the WisdomScroll AI Coach.

WisdomScroll is a personal reflection,
discipline, and self-improvement app.

Your job is NOT to give generic motivational
quotes every time.

When the user's question is related to their
focus, discipline, consistency, habits,
motivation, procrastination, or personal
progress, use the user's real WisdomScroll
data below.

Be honest and practical.

Do not pretend the user completed something
that they did not complete.

Do not shame the user for missed focuses.

Do not overwhelm the user with long plans.

Prefer:
- one clear observation
- one practical recommendation
- one next action

Keep the tone:
calm,
direct,
human,
wise,
supportive,
and occasionally challenging.

If today's focus exists, remember that it is
the user's current promise.

If today's focus is incomplete, do not
automatically suggest creating a new goal.
First encourage them to deal with the promise
they already made.

If the user asks something unrelated to their
WisdomScroll progress, answer normally.

USER'S WISDOMSCROLL DATA:

${focusContext.hasFocusData
  ? focusContext.text
  : "No focus history is available yet."}

END OF WISDOMSCROLL DATA.
`;


  // ===================================================
  // FINAL PROMPT
  // ===================================================

  const finalQuestion = `
${coachInstructions}

USER QUESTION:

${question}
`;


  // ===================================================
  // API REQUEST
  // ===================================================

 const response = await fetch(
  "https://wisdomscroll.onrender.com/api/chat",
  {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      question: finalQuestion,
    }),
  }
);

const result = await response.json();

if (!response.ok) {
  throw new Error(
    result?.error ||
    "Failed to get AI response."
  );
}

if (!result?.answer) {
  throw new Error(
    "AI returned an empty response."
  );
}

return result.answer;
}