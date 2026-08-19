import "./YesterdayCard.css";

function YesterdayCard({ yesterday }) {
  if (!yesterday) {
    return null;
  }

  return (
    <div className="yesterday-card">

      <p className="yesterday-label">
        ✦ YESTERDAY
      </p>

      <div className="yesterday-content">

        <div className="yesterday-check">
          {yesterday.completed ? "✓" : "!"}
        </div>

        <div className="yesterday-info">

          <h3 className="yesterday-title">
            {yesterday.text}
          </h3>

          <p className="yesterday-status">
            {yesterday.completed
              ? "Promise kept"
              : "Not completed"}
          </p>

        </div>

      </div>

    </div>
  );
}

export default YesterdayCard;