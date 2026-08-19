import "./TestHistory.css";

function TestHistory({
  generateTestHistory,
  addTestFocus,
  cleanDuplicateTestHistory,
}) {
  const handleGenerate = () => {
    generateTestHistory();
  };

  const handleCustom = () => {
    const text = window.prompt(
      "Enter a test focus:"
    );

    if (!text || !text.trim()) {
      return;
    }

    const daysAgo = Number(
      window.prompt(
        "How many days ago? Example: 3"
      )
    );

    if (
      Number.isNaN(daysAgo) ||
      daysAgo < 1
    ) {
      return;
    }

    const completed =
      window.confirm(
        "Should this focus be completed?"
      );

    addTestFocus(
      text.trim(),
      daysAgo,
      completed
    );
  };

  const handleCleanup = () => {
    const confirmed =
      window.confirm(
        "Remove duplicate test history?"
      );

    if (!confirmed) {
      return;
    }

    cleanDuplicateTestHistory();
  };

  return (
    <section className="test-history">

      <div className="test-history-header">
        <div>
          <p className="test-history-label">
            🧪 DEVELOPMENT TOOL
          </p>

          <h2>
            Test History
          </h2>

          <p>
            Generate old focuses to test
            your History system.
          </p>
        </div>
      </div>

      <div className="test-history-actions">

        <button
          className="test-generate-btn"
          onClick={handleGenerate}
        >
          🧪 Generate 7 Test Days
        </button>

        <button
          className="test-custom-btn"
          onClick={handleCustom}
        >
          ＋ Add Custom History
        </button>

        <button
          className="test-clean-btn"
          onClick={handleCleanup}
        >
          🧹 Clean Duplicates
        </button>

      </div>

      <p className="test-warning">
        Development tool only — remove before
        launching WisdomScroll.
      </p>

    </section>
  );
}

export default TestHistory;