function Hero({
  quote,
  loading,
  quoteCount,
  getRandomQuote,
  getQuoteFromAPI,
  copyQuote,
  favorite,
  copied,
  addFavorite,
  removeFavorite,
}) {

  const buttonStyle = {
  backgroundColor: "#0071E3",
  color: "white",
  border: "none",
 padding: "14px 24px",
  borderRadius: "12px",
  cursor: "pointer",
  margin: "5px",
  fontWeight: "bold",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 10px rgba(0,113,227,0.3)",
};
  return (
  <div
    style={{
      textAlign: "center",
      maxWidth: "700px",
      margin: "120px auto",
      padding: "30px",
      borderRadius: "24px",
      boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
      backgroundColor: "#18181B",
    }}
  >
       {copied && (
  <p style={{ color: "lightgreen", fontWeight: "bold" }}>
    ✅ Quote Copied!
  </p>
)}
        <h1>📜 WisdomScroll</h1>
        <p
  style={{
    color: "#A1A1AA",
    fontSize: "14px",
  }}
>
  Quote #{quoteCount}
</p>
  
        <h2 style={{ color: "#60A5FA" }}>
          Daily Wisdom for Daily Life
        </h2>
  
        <p
  style={{
    color: "white",
    fontSize: "24px",
    lineHeight: "1.6",
  }}
>
  {loading ? "Loading wisdom..." : quote.text}
</p>
<p
  style={{
    fontStyle: "italic",
    color: "#A1A1AA",
    fontSize: "18px",
  }}
>
  — {quote.author}
</p>
<p
  style={{
    color: "#3b82f6",
    fontWeight: "bold",
  }}
>
  {quote.category}
</p>
  <button
  style={buttonStyle}
  onClick={getRandomQuote}
>
  Explore Quotes
</button>
<button
  style={buttonStyle}
  onClick={getQuoteFromAPI}
>
  🌐 Internet Quote
</button>
<button
  style={buttonStyle}
  onClick={copyQuote}
>
  📋 Copy Quote
</button>
<button
  style={buttonStyle}
  onClick={() =>
    favorite ? removeFavorite(quote) : addFavorite()
  }
>
  {favorite ? "❌ Remove Favorite" : "🤍 Favorite"}
</button>
      </div>
    );
  }
  
  export default Hero;