import "./Hero.css";
import { useNavigate } from "react-router-dom";

function Hero({
  quote,
  loading,
  copied,
  favorite,
  addFavorite,
  removeFavorite,
  getRandomQuote,
  getQuoteFromAPI,
  copyQuote,
  quoteCount,
}) {
  const navigate = useNavigate();

  const hasQuote = quote && quote.text;

  return (
    <section className="hero">

      {/* =========================
          BRAND INTRO
      ========================= */}

      <div className="hero-card">

        <h1 className="hero-title">
          WisdomScroll
        </h1>

        <p className="hero-tagline">
          Remember your promises.
          <br />
          Become who you said you'd become.
        </p>

        <button
          className="hero-main-btn"
          onClick={() => navigate("/chat")}
        >
          Continue with Wisdom →
        </button>

        {/* =========================
            REFLECTION
        ========================= */}

        <div className="reflection-card">

          <div className="reflection-top">

            <span className="reflection-badge">
              ✦ TODAY'S REFLECTION
            </span>

            {quoteCount !== undefined && (
              <span className="quote-count">
                {quoteCount} wisdoms
              </span>
            )}

          </div>

          {/* =========================
              QUOTE
          ========================= */}

          {loading ? (
            <div className="quote-loading">
              <p className="quote">
                Loading wisdom...
              </p>
            </div>
          ) : hasQuote ? (
            <>
              <p className="quote">
                "{quote.text}"
              </p>

              {quote.author && (
                <p className="author">
                  — {quote.author}
                </p>
              )}

              {quote.category && (
                <p className="category">
                  {quote.category}
                </p>
              )}
            </>
          ) : (
            <p className="quote">
              Your wisdom is waiting.
            </p>
          )}

          {/* =========================
              ACTIONS
          ========================= */}

          <div className="hero-actions">

            <button
              className="primary-btn"
              onClick={getRandomQuote}
              disabled={loading}
            >
              ✨ New
            </button>

            <button
              className="secondary-btn"
              onClick={getQuoteFromAPI}
              disabled={loading}
            >
              🌍 Explore
            </button>

            <button
              className="secondary-btn"
              onClick={copyQuote}
              disabled={!hasQuote || loading}
            >
              {copied
                ? "✓ Copied"
                : "📋 Copy"}
            </button>

            <button
              className="saved-btn"
              onClick={() => {
                if (!hasQuote) return;

                if (favorite) {
                  removeFavorite(quote);
                } else {
                  addFavorite();
                }
              }}
              disabled={!hasQuote || loading}
            >
              {favorite
                ? "❤️ Saved"
                : "🤍 Save"}
            </button>

          </div>

          {/* =========================
              PHILOSOPHY
          ========================= */}

          <p className="wisdom-hint">
            Read it. Remember it. Live it.
          </p>

        </div>

      </div>

    </section>
  );
}

export default Hero;