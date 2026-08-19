import "./ChatInput.css";

function ChatInput({
  question,
  setQuestion,
  handleAskAI,
}) {
  return (
    <div className="chat-input-container">

      <form
        className="chat-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleAskAI();
        }}
      >

        <input
          className="chat-input"
          value={question}
          onChange={(e)=>setQuestion(e.target.value)}
          placeholder="Message WisdomScroll..."
        />

        <button
          className="send-btn"
          type="submit"
        >
          ➜
        </button>

      </form>

    </div>
  );
}

export default ChatInput;