import { useState, useEffect } from "react";

function useChat() {
  const [question, setQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("wisdomscroll-chat");
    return saved ? JSON.parse(saved) : [];
  });

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
        id: Date.now(),
        role: "assistant",
        content:
          "👋 Bhaskar welcomes you to WisdomScroll AI. Ask me anything.",
      },
    ];

    setMessages(firstMessage);

    localStorage.setItem(
      "wisdomscroll-chat",
      JSON.stringify(firstMessage)
    );

    setQuestion("");
    setAiResponse("");
  };

  useEffect(() => {
    localStorage.setItem(
      "wisdomscroll-chat",
      JSON.stringify(messages)
    );
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
  };
}

export default useChat;