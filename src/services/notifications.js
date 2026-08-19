import {
  LocalNotifications,
} from "@capacitor/local-notifications";

import wisdomData from "../data/gitaWisdom.json";

const NOTIFICATION_IDS = [
  1001,
  1002,
  1003,
  1004,
  1005,
];

// Five notification times
const NOTIFICATION_TIMES = [
  {
    id: 1001,
    hour: 8,
    minute: 0,
  },
  {
    id: 1002,
    hour: 11,
    minute: 0,
  },
  {
    id: 1003,
    hour: 14,
    minute: 0,
  },
  {
    id: 1004,
    hour: 18,
    minute: 0,
  },
  {
    id: 1005,
    hour: 21,
    minute: 0,
  },
];

// ================================
// REQUEST PERMISSION
// ================================

export async function requestNotificationPermission() {
  try {
    const permission =
      await LocalNotifications.checkPermissions();

    if (
      permission.display !==
      "granted"
    ) {
      const requested =
        await LocalNotifications.requestPermissions();

      return (
        requested.display ===
        "granted"
      );
    }

    return true;

  } catch (error) {
    console.error(
      "Notification permission error:",
      error
    );

    return false;
  }
}

// ================================
// GET RANDOM QUOTES
// ================================

function getRandomQuotes(count) {
  const available =
    wisdomData.filter(
      (quote) =>
        quote.simpleVersion &&
        quote.simpleVersion.trim()
    );

  const shuffled = [
    ...available,
  ].sort(
    () => Math.random() - 0.5
  );

  return shuffled.slice(
    0,
    Math.min(
      count,
      shuffled.length
    )
  );
}

// ================================
// SCHEDULE DAILY QUOTES
// ================================

export async function scheduleDailyWisdom() {
  try {
    const hasPermission =
      await requestNotificationPermission();

    if (!hasPermission) {
      console.log(
        "Notification permission denied."
      );

      return false;
    }

    // Remove our previous five
    // scheduled notifications.
    await LocalNotifications.cancel({
      notifications:
        NOTIFICATION_IDS.map(
          (id) => ({
            id,
          })
        ),
    });

    const quotes =
      getRandomQuotes(5);

    if (quotes.length === 0) {
      console.error(
        "No wisdom quotes available."
      );

      return false;
    }

    const notifications =
      NOTIFICATION_TIMES.map(
        (time, index) => {
          const quote =
            quotes[index];

          return {
            id: time.id,

            title:
              "📜 WisdomScroll",

            body:
              quote.simpleVersion,

            schedule: {
              on: {
                hour: time.hour,
                minute: time.minute,
              },

              repeats: true,

              allowWhileIdle:
                true,
            },

            extra: {
              verseOrder:
                quote.verse_order,

              chapter:
                quote.chapter,

              verse:
                quote.verse,
            },

            sound:
              undefined,
          };
        }
      );

    await LocalNotifications.schedule({
      notifications,
    });

    console.log(
      "5 daily wisdom notifications scheduled."
    );

    return true;

  } catch (error) {
    console.error(
      "Could not schedule notifications:",
      error
    );

    return false;
  }
}

// ================================
// CANCEL DAILY WISDOM
// ================================

export async function cancelDailyWisdom() {
  try {
    await LocalNotifications.cancel({
      notifications:
        NOTIFICATION_IDS.map(
          (id) => ({
            id,
          })
        ),
    });

    console.log(
      "Daily wisdom notifications cancelled."
    );

    return true;

  } catch (error) {
    console.error(
      "Could not cancel notifications:",
      error
    );

    return false;
  }
}

// ================================
// CHECK SCHEDULED NOTIFICATIONS
// ================================

export async function getScheduledWisdom() {
  try {
    const result =
      await LocalNotifications.getPending();

    return result.notifications;

  } catch (error) {
    console.error(
      "Could not get scheduled notifications:",
      error
    );

    return [];
  }
}