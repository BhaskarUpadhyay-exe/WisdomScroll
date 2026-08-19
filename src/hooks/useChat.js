import {
  loadChats,
  saveChats,
} from "../services/chatStorage";
import { useState, useEffect } from "react";

function useChat() {
  const [question, setQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const [messages, setMessages] = useState(loadChats);
 const [conversations, setConversations] = useState(() => {
  const saved = localStorage.getItem(
    "wisdomscroll-conversations"
  );

  return saved ? JSON.parse(saved) : [];
});

const [currentConversationId, setCurrentConversationId] =
  useState(null);
  useEffect(() => {
  localStorage.setItem(
    "wisdomscroll-conversations",
    JSON.stringify(conversations)
  );
}, [conversations]);

  const loadingMessages = [
    "Consulting Marcus Aurelius...",
    "Checking if Socrates is online...",
    "Bribing the AI with electricity...",
    "Teaching the AI not to overthrow humanity...",
    "Opening the ancient scroll...",
    "Pretending to be ChatGPT...",
    "Negotiating with the wisdom gods...",
    "Summoning ancient wisdom...",
    "The Scroll Keeper is thinking...",
  ];

const startNewChat = () => {
  const firstMessage = [
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content:
        "👋 Bhaskar welcomes you to WisdomScroll AI. Ask me anything.",
    },
  ];

  const conversation = {
    id: crypto.randomUUID(),
    title: "New Chat",
    messages: firstMessage,
    createdAt: Date.now(),
  };

  setConversations((prev) => [
    conversation,
    ...prev,
  ]);

  setCurrentConversationId(conversation.id);

  setMessages(firstMessage);

  setQuestion("");
  setAiResponse("");
};

useEffect(() => {
  saveChats(messages);
}, [messages]);

  return {
    question,
    setQuestion,
    aiResponse,
    setAiResponse,
    loading,
    setLoading,
    loadingMessage,
    setLoadingMessage,
    messages,
    setMessages,
    loadingMessages,
    startNewChat,
    conversations,
setConversations,

currentConversationId,
setCurrentConversationId,
  };
}

export default useChat;