import {
  createMessage,
} from "../../models/ChatModel";
import { typeWriter } from "../../utils/typewriter";
import EmptyState from "./EmptyState";
import TypingIndicator from "./TypingIndicator";
import "./AIChat.css";
import ChatHeader from "./ChatHeader";
import ChatHistory from "./ChatHistory";
import ChatInput from "./ChatInput";
import ChatBubble from "./ChatBubble";
import { useChatContext } from "../../context/ChatContext";
import { askAI } from "../../services/aiService";
function AIChat() {const {
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
} = useChatContext();
const handleAskAI = async () => {
  console.log("askAI called");
  if (!question.trim() || loading) return;
  try {
    const randomMessage =
      loadingMessages[Math.floor(Math.random() * loadingMessages.length)];

    setLoading(true);
    setLoadingMessage(randomMessage);

  const data = await askAI(question);

setAiResponse(data);

const userId = crypto.randomUUID();
const assistantId = crypto.randomUUID();

setMessages((prev) => [
  ...prev,
  {
    id: userId,
    role: "user",
    content: question,
  },
  {
    id: assistantId,
    role: "assistant",
    content: "",
  },
]);

setQuestion("");

await typeWriter(
  data,
  (currentText) => {
    setMessages((prev) =>
      prev.map((message) =>
        message.id === assistantId
          ? {
              ...message,
              content: currentText,
            }
          : message
      )
    );
  },
  20
);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

return (
 <div className="chat-container">
    <ChatHeader
  startNewChat={startNewChat}
/>

    {messages.length <= 1 ? (
  <EmptyState
    onSuggestionClick={(text) => setQuestion(text)}
  />
) : (
 <ChatHistory
  messages={messages}
  loading={loading}
/>
)}
    {loading && <TypingIndicator />}

    <ChatInput
      question={question}
      setQuestion={setQuestion}
      handleAskAI={handleAskAI}
    />
  </div>
);
}
export default AIChat;
  