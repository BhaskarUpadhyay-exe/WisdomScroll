import "./FavoriteList.css";

function FavoriteList({ favorites, removeFavorite }) {
  if (favorites.length === 0) {
    return (
      <section className="saved-section">

        <h2 className="saved-title">
          Saved Wisdom
        </h2>

        <p className="saved-subtitle">
          Save reflections that inspire you.
          They'll appear here.
        </p>

      </section>
    );
  }

  return (
    <section className="saved-section">

      <h2 className="saved-title">
        Saved Wisdom
      </h2>

      <p className="saved-subtitle">
        Your personal collection of timeless reflections.
      </p>

      <div className="saved-grid">

        {favorites.map((item) => (

          <div
            key={item.text}
            className="saved-card"
          >

            <h3 className="saved-author">
              {item.author}
            </h3>

            <p className="saved-text">
              "{item.text}"
            </p>

            <p className="saved-category">
              {item.category}
            </p>

            <button
              className="remove-btn"
              onClick={() => removeFavorite(item)}
            >
              Remove
            </button>

          </div>

        ))}

      </div>

    </section>
  );
}

export default FavoriteList;