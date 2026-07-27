function AIChat({
  question,
  setQuestion,
  aiResponse,
  loading,
  loadingMessage,
  loadingMessages,
  setLoading,
  setLoadingMessage,
  setAiResponse,
  messages,
setMessages,
}) {
const askAI = async () => {
  console.log("askAI called");
  if (!question.trim() || loading) return;
  try {
    const randomMessage =
      loadingMessages[Math.floor(Math.random() * loadingMessages.length)];

    setLoading(true);
    setLoadingMessage(randomMessage);

    const response = await fetch(
      `https://wisdomscroll.onrender.com?question=${encodeURIComponent(question)}`
    );

    const data = await response.text();

    setAiResponse(data);

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", content: question },
      { id: Date.now() + 1, role: "assistant", content: data },
    ]);

    setQuestion("");
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "30px",
        padding: "30px",
        backgroundColor: "#111827",
        color: "white",
        borderRadius: "20px",
      }}
    >
      <h1>WISDOMSCROLL AI</h1>
      <div
  style={{
    maxWidth: "700px",
    margin: "20px auto",
    textAlign: "left",
  }}
>
  {messages.map((message) => (
    <div
      key={message.id}
      style={{
        background:
          message.role === "user"
            ? "#2563EB"
            : "#374151",
        padding: "12px",
        borderRadius: "12px",
        marginBottom: "10px",
      }}
    >
      <strong>
        {message.role === "user"
          ? "👤 You"
          : "🤖 Wisdom"}
      </strong>

      <p>{message.content}</p>
    </div>
  ))}
</div>

<form
  onSubmit={(e) => {
    e.preventDefault();
    askAI();
  }}
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    marginTop: "20px",
  }}
>
<input
  type="text"
  placeholder="Ask WisdomScroll AI..."
  value={question}
  onChange={(e) => setQuestion(e.target.value)}
  style={{
    flex: 1,
    maxWidth: "600px",
    padding: "14px 18px",
    borderRadius: "14px",
    border: "1px solid #4B5563",
    backgroundColor: "#1F2937",
    color: "white",
    fontSize: "16px",
    outline: "none",
  }}
/>
<button type="submit">
  ASK
</button>
</form>

     {loading ? (
  <p
    style={{
      marginTop: "20px",
      color: "#22C55E",
      fontWeight: "bold",
    }}
  >
    {loadingMessage}
  </p>
) : (
  <p
    style={{
      marginTop: "20px",
      maxWidth: "700px",
      margin: "20px auto",
      lineHeight: "1.8",
    }}
  >
    {aiResponse}
  </p>
)}
    </div>
  );
}

export default AIChat;    