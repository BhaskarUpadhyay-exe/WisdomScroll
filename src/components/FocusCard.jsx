import "./FocusCard.css";
import useFocus from "../hooks/useFocus";

function FocusCard() {
  const {
    focus,
    setFocus,
    todayFocus,
    saveFocus,
    completeFocus,
    deleteFocus,
    editFocus,
  } = useFocus();

  const hasFocus = todayFocus != null;

  return (
    <div className="promise-card">

      {!hasFocus ? (
        <>
          <p className="promise-label">
            ✦ TODAY'S FOCUS
          </p>

          <h2 className="promise-title">
            What is your one focus today?
          </h2>

          <p className="promise-subtitle">
            One focus. One step closer to your future self.
          </p>

          <textarea
            className="promise-input"
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
            placeholder="Example: Finish WisdomScroll MVP..."
          />

          <button
            className="promise-btn"
            onClick={saveFocus}
          >
            Begin Today
          </button>
        </>
      ) : (
        <>
          <p className="focus-label">
            ✦ TODAY'S FOCUS
          </p>

          <div className="focus-box">
            <h2 className="focus-title">
              {todayFocus.text}
            </h2>

            <p className="focus-quote">
              One promise. One step closer.
            </p>
          </div>

          <div className="focus-divider"></div>

          <div className="focus-status">

            <div>
              <p className="status-heading">
                STATUS
              </p>

              <p className="status-value">
                {todayFocus.completed
                  ? "🟢 Completed"
                  : "🟡 In Progress"}
              </p>
            </div>

            <div>
              <p className="status-heading">
                DATE
              </p>

              <p className="status-value">
                {new Date(
                  todayFocus.createdAt
                ).toLocaleDateString()}
              </p>
            </div>

          </div>

          <div className="focus-divider"></div>

          {!todayFocus.completed ? (
            <button
              className="complete-btn"
              onClick={completeFocus}
            >
              ✔ I Did It
            </button>
          ) : (
            <button
              className="complete-btn completed"
              disabled
            >
              🎉 Promise Kept
            </button>
          )}

          <div className="secondary-actions">

            <button
              className="ghost-btn"
              onClick={editFocus}
            >
              ✏ Edit
            </button>

            <button
              className="danger-btn"
              onClick={deleteFocus}
            >
              🗑 Start Over
            </button>

          </div>
        </>
      )}

    </div>
  );
}

export default FocusCard;