import "./HistoryPreview.css";
import { Link } from "react-router-dom";

function HistoryPreview({
  focuses = [],
  currentStreak = 0,
}) {
  const history = focuses
    .filter((item) => item.createdAt)
    .filter(
      (item) =>
        new Date(item.createdAt).toDateString() !==
        new Date().toDateString()
    )
    .slice(0, 3);

  return (
    <section className="history-preview">

      <div className="history-preview-header">

        <div>
          <p className="history-preview-label">
            ✦ YOUR JOURNEY
          </p>

          <h2 className="history-preview-title">
            Recent Focus
          </h2>
        </div>

        <div className="history-preview-streak">
          🔥 {currentStreak}
        </div>

      </div>

      {history.length === 0 ? (
        <p className="history-preview-empty">
          Your journey starts here.
        </p>
      ) : (
        <div className="history-preview-list">

          {history.map((item) => (
            <div
              className="history-preview-item"
              key={item.id}
            >

              <div
                className={
                  item.completed
                    ? "history-preview-dot completed"
                    : "history-preview-dot missed"
                }
              >
                {item.completed ? "✓" : "–"}
              </div>

              <div className="history-preview-content">

                <p className="history-preview-text">
                  {item.text}
                </p>

                <span>
                  {item.completed
                    ? "Promise kept"
                    : "Not completed"}
                </span>

              </div>

            </div>
          ))}

        </div>
      )}

      <Link
        to="/history"
        className="history-preview-link"
      >
        View Full History →
      </Link>

    </section>
  );
}

export default HistoryPreview;