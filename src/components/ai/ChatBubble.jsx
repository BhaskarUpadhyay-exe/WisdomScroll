import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import "./ChatBubble.css";

function ChatBubble({
  message,
  loading,
}) {

  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);
  const copyMessage = async () => {
  try {
    await navigator.clipboard.writeText(message.content);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  } catch (err) {
    console.error(err);
  }
};
  return (

    <div
      className={`chat-row ${isUser ? "user" : "ai"}`}
    >

      <div className="chat-bubble">

        <div className="chat-name">

        {isUser ? "👤 You" : "📜 Wisdom"}

        </div>

        <>
  <ReactMarkdown
  components={{
    code({
      inline,
      className,
      children,
      ...props
    }) {
      const match = /language-(\w+)/.exec(
        className || ""
      );

     return !inline && match ? (
  <div className="code-block">

    <div className="code-header">

      <span>{match[1]}</span>

      <button
        className="copy-code-btn"
        onClick={() =>
          navigator.clipboard.writeText(
            String(children)
          )
        }
      >
        📋 Copy
      </button>

    </div>

    <SyntaxHighlighter
      style={oneDark}
      language={match[1]}
      PreTag="div"
      {...props}
    >
      {String(children).replace(/\n$/, "")}
    </SyntaxHighlighter>

  </div>
) : (
        <code
          className={className}
          {...props}
        >
          {children}
        </code>
      );
    },
  }}
>
  {loading
    ? message.content + "▌"
    : message.content}
</ReactMarkdown>

  {!isUser && (
    <button
  className="copy-btn"
  onClick={copyMessage}
>
  {copied ? "✅ Copied!" : "📋 Copy"}
</button>
  )}
</>

      </div>

    </div>

  );

}

export default ChatBubble;