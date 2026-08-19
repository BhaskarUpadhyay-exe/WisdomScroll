export function createMessage(role, content) {
  return {
    id: crypto.randomUUID(),
    role,
    content,
  };
}

export function createConversation(
  title = "New Chat"
) {
  return {
    id: crypto.randomUUID(),
    title,
    createdAt: Date.now(),
    messages: [],
  };
}