function FavoriteList({ favorites, removeFavorite }) {
  if (favorites.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "50px",
          color: "#9CA3AF",
        }}
      >
        <h2>❤️ Your Favorite Quotes</h2>

        <p>No favorite quotes yet.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "60px auto",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "white",
        }}
      >
        ❤️ Your Favorite Quotes
      </h2>

      {favorites.map((item) => (
        <div
          key={item.text}
          style={{
            background: "#1F2937",
            padding: "20px",
            borderRadius: "15px",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ color: "#60A5FA" }}>
            {item.author}
          </h3>

          <p style={{ color: "white" }}>
            {item.text}
          </p>

          <p style={{ color: "#9CA3AF" }}>
            {item.category}
          </p>

          <button
            onClick={() => removeFavorite(item)}
          >
            🗑 Remove
          </button>
        </div>
      ))}
    </div>
  );
}

export default FavoriteList;