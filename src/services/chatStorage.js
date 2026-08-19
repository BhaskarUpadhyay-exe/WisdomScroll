const STORAGE_KEY = "wisdomscroll-conversations";

export function loadChats() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return [];
  }

  return JSON.parse(saved);
}

export function saveChats(chats) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(chats)
  );
}

export function clearChats() {
  localStorage.removeItem(STORAGE_KEY);
}