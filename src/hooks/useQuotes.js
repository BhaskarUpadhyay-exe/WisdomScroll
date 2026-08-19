import { useState, useEffect } from "react";

function useQuotes() {
  const [quote, setQuote] = useState({
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
    category: "Wisdom",
  });

  const [quoteCount, setQuoteCount] = useState(1);

  const [loading, setLoading] = useState(false);

  const [copied, setCopied] = useState(false);

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");

    return saved
      ? JSON.parse(saved)
      : [];
  });


  // =====================================================
  // NEW RANDOM QUOTE
  // =====================================================

  const getRandomQuote = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "https://dummyjson.com/quotes/random"
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch quote."
        );
      }

      const data =
        await response.json();

      setQuote({
        text: data.quote,
        author: data.author,
        category: "Wisdom",
      });

      setQuoteCount(
        (prev) => prev + 1
      );

    } catch (error) {
      console.error(
        "New quote error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // EXPLORE
  // =====================================================

  const getQuoteFromAPI = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "https://dummyjson.com/quotes/random"
      );

      if (!response.ok) {
        throw new Error(
          "Failed to explore quote."
        );
      }

      const data =
        await response.json();

      setQuote({
        text: data.quote,
        author: data.author,
        category: "Explore",
      });

      setQuoteCount(
        (prev) => prev + 1
      );

    } catch (error) {
      console.error(
        "Explore quote error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // COPY
  // =====================================================

  const copyQuote = () => {
    if (!quote) return;

    navigator.clipboard.writeText(
      `${quote.text} — ${quote.author}`
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };


  // =====================================================
  // FAVORITE
  // =====================================================

  const addFavorite = () => {
    if (!quote) return;

    if (
      !favorites.some(
        (item) =>
          item.text === quote.text
      )
    ) {
      setFavorites([
        ...favorites,
        quote,
      ]);
    }
  };


  const removeFavorite = (
    quoteToRemove
  ) => {
    setFavorites(
      favorites.filter(
        (item) =>
          item.text !==
          quoteToRemove.text
      )
    );
  };


  const favorite =
    favorites.some(
      (item) =>
        item.text === quote.text
    );


  // =====================================================
  // SAVE FAVORITES
  // =====================================================

  useEffect(() => {
    localStorage.setItem(
      "favorites",
      JSON.stringify(favorites)
    );
  }, [favorites]);


  return {
    quote,
    quoteCount,
    getRandomQuote,
    setQuote,
    loading,
    copied,
    favorite,
    favorites,
    addFavorite,
    removeFavorite,
    getQuoteFromAPI,
    copyQuote,
  };
}

export default useQuotes;