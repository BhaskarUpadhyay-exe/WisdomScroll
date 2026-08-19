export function todayString() {
  return new Date().toDateString();
}

export function isToday(date) {
  return (
    new Date(date).toDateString() ===
    new Date().toDateString()
  );
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString(
    "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}