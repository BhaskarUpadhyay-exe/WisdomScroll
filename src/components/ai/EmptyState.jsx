import "./EmptyState.css";

function EmptyState({ onSuggestionClick }) {
  const suggestions = [
    "💡 Explain Artificial Intelligence",
    "📜 Give me today's wisdom",
    "🧠 Summarize this article",
    "🚀 Help me learn React",
  ];

  return (
    <div className="empty-state">
      <h1>📜 WisdomScroll AI</h1>

      <p>Think Better. Live Better.</p>

      <div className="suggestion-grid">
        {suggestions.map((item) => (
          <button
            key={item}
            className="suggestion-card"
            onClick={() => onSuggestionClick(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

export default EmptyState;