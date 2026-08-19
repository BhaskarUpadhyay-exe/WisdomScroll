import { isToday } from "../utils/date";
import { useEffect, useMemo, useState } from "react";

function useFocus() {
  const [focus, setFocus] = useState("");
  const [focuses, setFocuses] = useState([]);

  // =====================================================
  // LOAD
  // =====================================================

  useEffect(() => {
    const stored = localStorage.getItem("focuses");

    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);

      if (Array.isArray(parsed)) {
        setFocuses(parsed);
      }
    } catch (error) {
      console.error(
        "Could not load focus history:",
        error
      );
    }
  }, []);

  // =====================================================
  // SAVE
  // =====================================================

  const saveData = (data) => {
    const sorted = [...data].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );

    setFocuses(sorted);

    localStorage.setItem(
      "focuses",
      JSON.stringify(sorted)
    );
  };

  // =====================================================
  // SORTED FOCUSES
  // =====================================================

  const sortedFocuses = useMemo(() => {
    return [...focuses].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );
  }, [focuses]);

  // =====================================================
  // DATE HELPERS
  // =====================================================

  const getDateKey = (value) => {
    const date = new Date(value);

    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
  };

  const getStartOfToday = () => {
    const date = new Date();

    date.setHours(0, 0, 0, 0);

    return date;
  };

  const getDaysAgoDate = (daysAgo) => {
    const date = getStartOfToday();

    date.setDate(
      date.getDate() - daysAgo
    );

    return date;
  };

  // =====================================================
  // TODAY
  // =====================================================

  const todayFocus =
    sortedFocuses.find((item) =>
      isToday(item.createdAt)
    ) || null;

  // =====================================================
  // YESTERDAY
  // =====================================================

  const yesterdayDate =
    getDaysAgoDate(1);

  const yesterdayKey =
    getDateKey(yesterdayDate);

  const yesterdayFocus =
    sortedFocuses.find(
      (item) =>
        getDateKey(item.createdAt) ===
        yesterdayKey
    ) || null;

  // =====================================================
  // PREVIOUS FOCUS
  // =====================================================

  const previousFocus =
    sortedFocuses.find(
      (item) =>
        !isToday(item.createdAt)
    ) || null;

  // =====================================================
  // SAVE TODAY'S FOCUS
  // =====================================================

  const saveFocus = () => {
    const cleanedFocus = focus.trim();

    if (!cleanedFocus) return;

    // One focus per calendar day.
    if (todayFocus) return;

    const newFocus = {
      id: Date.now(),

      text: cleanedFocus,

      completed: false,

      createdAt:
        new Date().toISOString(),

      completedAt: null,

      isTestData: false,
    };

    saveData([
      newFocus,
      ...sortedFocuses,
    ]);

    setFocus("");
  };

  // =====================================================
  // COMPLETE TODAY'S FOCUS
  // =====================================================

  const completeFocus = () => {
    if (!todayFocus) return;

    const updated =
      sortedFocuses.map((item) => {
        if (
          item.id !== todayFocus.id
        ) {
          return item;
        }

        return {
          ...item,

          completed: true,

          completedAt:
            new Date().toISOString(),
        };
      });

    saveData(updated);
  };

  // =====================================================
  // EDIT TODAY'S FOCUS
  // =====================================================

  const editFocus = () => {
    if (!todayFocus) return;

    setFocus(todayFocus.text);

    const updated =
      sortedFocuses.filter(
        (item) =>
          item.id !== todayFocus.id
      );

    saveData(updated);
  };

  // =====================================================
  // DELETE TODAY'S FOCUS
  // =====================================================

  const deleteFocus = () => {
    if (!todayFocus) return;

    const updated =
      sortedFocuses.filter(
        (item) =>
          item.id !== todayFocus.id
      );

    saveData(updated);
  };

  // =====================================================
  // DELETE HISTORY ITEM
  // =====================================================

  const deleteHistoryFocus = (id) => {
    const updated =
      sortedFocuses.filter(
        (item) => item.id !== id
      );

    saveData(updated);
  };

  // =====================================================
  // COMPLETED DAYS
  // =====================================================

  const completedDateKeys = useMemo(() => {
    return new Set(
      sortedFocuses
        .filter(
          (item) => item.completed
        )
        .map((item) =>
          getDateKey(item.createdAt)
        )
    );
  }, [sortedFocuses]);

  // =====================================================
  // CURRENT STREAK
  // =====================================================

  const calculateCurrentStreak = () => {
    let streak = 0;

    const cursor =
      getStartOfToday();

    /*
      If today's promise isn't kept,
      the active streak can still continue
      from yesterday.

      Example:

      Yesterday ✅
      Today     ⏳

      Current streak = 1
    */

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
      streak++;

      cursor.setDate(
        cursor.getDate() - 1
      );
    }

    return streak;
  };

  const currentStreak =
    calculateCurrentStreak();

  // =====================================================
  // LONGEST STREAK
  // =====================================================

  const calculateLongestStreak = () => {
    const dates = [
      ...completedDateKeys,
    ].sort();

    if (dates.length === 0) {
      return 0;
    }

    let longest = 1;
    let current = 1;

    for (
      let i = 1;
      i < dates.length;
      i++
    ) {
      const previous =
        new Date(
          `${dates[i - 1]}T00:00:00`
        );

      const currentDate =
        new Date(
          `${dates[i]}T00:00:00`
        );

      const difference =
        Math.round(
          (currentDate.getTime() -
            previous.getTime()) /
            (1000 * 60 * 60 * 24)
        );

      if (difference === 1) {
        current++;

        longest = Math.max(
          longest,
          current
        );
      } else {
        current = 1;
      }
    }

    return longest;
  };

  const longestStreak =
    calculateLongestStreak();

  // =====================================================
  // BASIC STATISTICS
  // =====================================================

  const totalFocuses =
    sortedFocuses.length;

  const completedFocuses =
    sortedFocuses.filter(
      (item) => item.completed
    ).length;

  const incompleteFocuses =
    totalFocuses -
    completedFocuses;

  const completionRate =
    totalFocuses === 0
      ? 0
      : Math.round(
          (completedFocuses /
            totalFocuses) *
            100
        );

  // =====================================================
  // WEEK START
  // =====================================================

  const getWeekStart = () => {
    const date =
      getStartOfToday();

    const day =
      date.getDay();

    const daysFromMonday =
      day === 0
        ? 6
        : day - 1;

    date.setDate(
      date.getDate() -
        daysFromMonday
    );

    return date;
  };

  // =====================================================
  // WEEKLY DATA
  // =====================================================

  const weekStart =
    getWeekStart();

  const weeklyFocuses =
    sortedFocuses.filter(
      (item) =>
        new Date(item.createdAt) >=
        weekStart
    );

  const weeklyCompleted =
    weeklyFocuses.filter(
      (item) => item.completed
    ).length;

  const weeklyCompletionRate =
    weeklyFocuses.length === 0
      ? 0
      : Math.round(
          (weeklyCompleted /
            weeklyFocuses.length) *
            100
        );

  // =====================================================
  // BEST WEEKDAY
  // =====================================================

  const weekdayStats = {};

  weeklyFocuses.forEach((item) => {
    if (!item.completed) return;

    const weekday =
      new Date(
        item.createdAt
      ).toLocaleDateString(
        "en-US",
        {
          weekday: "long",
        }
      );

    weekdayStats[weekday] =
      (weekdayStats[weekday] || 0) +
      1;
  });

  let strongestDay = null;

  Object.entries(
    weekdayStats
  ).forEach(
    ([day, count]) => {
      if (
        !strongestDay ||
        count >
          strongestDay.count
      ) {
        strongestDay = {
          day,
          count,
        };
      }
    }
  );

  // =====================================================
  // HISTORY GROUPING
  // =====================================================

 const historyFocuses = sortedFocuses;

  const groupedHistory =
    historyFocuses.reduce(
      (groups, item) => {
        const key =
          getDateKey(
            item.createdAt
          );

        if (!groups[key]) {
          groups[key] = [];
        }

        groups[key].push(item);

        return groups;
      },
      {}
    );

  // =====================================================
  // DEVELOPMENT TEST DATA
  // =====================================================

  const generateTestHistory = () => {
    const testFocuses = [
      {
        text: "Finish WisdomScroll",
        daysAgo: 1,
        completed: true,
      },
      {
        text:
          "Complete 20 Quant questions",
        daysAgo: 2,
        completed: true,
      },
      {
        text: "Study Science",
        daysAgo: 3,
        completed: false,
      },
      {
        text:
          "Work on app design",
        daysAgo: 4,
        completed: true,
      },
      {
        text:
          "Read for 30 minutes",
        daysAgo: 5,
        completed: true,
      },
      {
        text: "Go to the gym",
        daysAgo: 6,
        completed: false,
      },
      {
        text: "Plan tomorrow",
        daysAgo: 7,
        completed: true,
      },
    ];

    const testNames = new Set(
      testFocuses.map(
        (item) => item.text
      )
    );

    const generated =
      testFocuses.map(
        (item, index) => {
          const date =
            getDaysAgoDate(
              item.daysAgo
            );

          date.setHours(
            12,
            0,
            0,
            0
          );

          return {
            id:
              Date.now() +
              index +
              Math.random(),

            text: item.text,

            completed:
              item.completed,

            createdAt:
              date.toISOString(),

            completedAt:
              item.completed
                ? new Date(
                    date.getTime() +
                      60 *
                        60 *
                        1000
                  ).toISOString()
                : null,

            isTestData: true,
          };
        }
      );

    const realFocuses =
      sortedFocuses.filter(
        (item) => {
          if (item.isTestData) {
            return false;
          }

          if (
            testNames.has(
              item.text
            )
          ) {
            return false;
          }

          return true;
        }
      );

    saveData([
      ...generated,
      ...realFocuses,
    ]);
  };

  // =====================================================
  // CUSTOM TEST FOCUS
  // =====================================================

  const addTestFocus = (
    text,
    daysAgo,
    completed = true
  ) => {
    const date =
      getDaysAgoDate(
        daysAgo
      );

    date.setHours(
      12,
      0,
      0,
      0
    );

    const newFocus = {
      id:
        Date.now() +
        Math.random(),

      text,

      completed,

      createdAt:
        date.toISOString(),

      completedAt: completed
        ? new Date(
            date.getTime() +
              60 *
                60 *
                1000
          ).toISOString()
        : null,

      isTestData: true,
    };

    saveData([
      newFocus,
      ...sortedFocuses,
    ]);
  };

  // =====================================================
  // CLEAN DUPLICATES
  // =====================================================

  const cleanDuplicateTestHistory =
    () => {
      const seen = new Set();

      const cleaned =
        sortedFocuses.filter(
          (item) => {
            const key =
              `${item.text}|${getDateKey(
                item.createdAt
              )}`;

            if (
              seen.has(key)
            ) {
              return false;
            }

            seen.add(key);

            return true;
          }
        );

      saveData(cleaned);
    };

  // =====================================================
  // PUBLIC API
  // =====================================================

  return {
    // Focus
    focus,
    setFocus,

    todayFocus,
    yesterdayFocus,
    previousFocus,

    focuses: sortedFocuses,
    historyFocuses,
    groupedHistory,

    setFocuses,
    saveFocus,
    completeFocus,
    editFocus,
    deleteFocus,
    deleteHistoryFocus,

    // Streak
    currentStreak,
    longestStreak,

    // Statistics
    totalFocuses,
    completedFocuses,
    incompleteFocuses,
    completionRate,

    // Weekly
    weeklyFocuses,
    weeklyCompleted,
    weeklyCompletionRate,
    strongestDay,

    // Development
    addTestFocus,
    generateTestHistory,
    cleanDuplicateTestHistory,
  };
}

export default useFocus;