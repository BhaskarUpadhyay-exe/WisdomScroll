import "./FocusHistory.css";
import { isToday } from "../utils/date";
import { useMemo, useState } from "react";

function FocusHistory({
  focuses,
  currentStreak,
  totalFocuses,
  completedFocuses,
  completionRate,
  deleteHistoryFocus,
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const history = useMemo(() => {
  return focuses;
}, [focuses]);

  const filteredHistory = history.filter(
    (item) => {
      const matchesSearch =
        item.text
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesFilter =
        filter === "all" ||
        (filter === "completed" &&
          item.completed) ||
        (filter === "incomplete" &&
          !item.completed);

      return (
        matchesSearch &&
        matchesFilter
      );
    }
  );

  if (history.length === 0) {
    return null;
  }

  const groupedHistory =
    filteredHistory.reduce(
      (groups, item) => {
        const date = new Date(
          item.createdAt
        );

        const key =
          date.toLocaleDateString(
            "en-GB",
            {
              day: "numeric",
              month: "short",
              year: "numeric",
            }
          );

        if (!groups[key]) {
          groups[key] = [];
        }

        groups[key].push(item);

        return groups;
      },
      {}
    );

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Delete this focus from your history?"
    );

    if (!confirmed) return;

    deleteHistoryFocus(id);
  };

  return (
    <section className="focus-history">

      {/* HEADER */}

      <div className="history-header">

        <div>
          <p className="history-label">
            ✦ YOUR JOURNEY
          </p>

          <h2 className="history-title">
            Focus History
          </h2>

          <p className="history-subtitle">
            Every promise tells a story.
          </p>
        </div>

        <div className="streak-badge">
          🔥 {currentStreak}
          <span>day streak</span>
        </div>

      </div>

      {/* STATS */}

      <div className="history-stats">

        <div className="stat-card">
          <span className="stat-number">
            {totalFocuses}
          </span>

          <span className="stat-label">
            Focuses
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-number">
            {completedFocuses}
          </span>

          <span className="stat-label">
            Kept
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-number">
            {completionRate}%
          </span>

          <span className="stat-label">
            Completion
          </span>
        </div>

      </div>

      {/* SEARCH */}

      <div className="history-tools">

        <input
          className="history-search"
          type="text"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search your focuses..."
        />

        <div className="history-filters">

          <button
            className={
              filter === "all"
                ? "filter-btn active"
                : "filter-btn"
            }
            onClick={() =>
              setFilter("all")
            }
          >
            All
          </button>

          <button
            className={
              filter === "completed"
                ? "filter-btn active"
                : "filter-btn"
            }
            onClick={() =>
              setFilter("completed")
            }
          >
            Kept
          </button>

          <button
            className={
              filter === "incomplete"
                ? "filter-btn active"
                : "filter-btn"
            }
            onClick={() =>
              setFilter("incomplete")
            }
          >
            Missed
          </button>

        </div>

      </div>

      {/* TIMELINE */}

      <div className="history-timeline">

        {Object.keys(groupedHistory)
          .length === 0 ? (
          <p className="empty-history">
            No focuses match your search.
          </p>
        ) : (
          Object.entries(
            groupedHistory
          ).map(
            ([date, items]) => (
              <div
                className="history-day"
                key={date}
              >

                <div className="history-date">
                  {date}
                </div>

                <div className="timeline-items">

                  {items.map(
                    (item) => (
                      <div
                        className="timeline-item"
                        key={item.id}
                      >

                        <div
                          className={
                            item.completed
                              ? "timeline-dot completed"
                              : "timeline-dot missed"
                          }
                        >
                          {item.completed
                            ? "✓"
                            : "–"}
                        </div>

                        <div className="timeline-line"></div>

                        <div className="timeline-content">

                          <h3>
                            {item.text}
                          </h3>

                          <p>
                            {item.completed
                              ? "✓ Promise kept"
                              : "○ Not completed"}
                          </p>

                          <button
                            className="history-delete"
                            onClick={() =>
                              handleDelete(
                                item.id
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </div>
                    )
                  )}

                </div>

              </div>
            )
          )
        )}

      </div>

    </section>
  );
}

export default FocusHistory;