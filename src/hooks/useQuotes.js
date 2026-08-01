import { useState, useEffect } from "react";
import quotes from "../data/quotes";

function useQuotes() {
  const [quote, setQuote] = useState(quotes[0]);
  const [quoteCount, setQuoteCount] = useState(1);

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
const [favorites, setFavorites] = useState(() => {
  const saved = localStorage.getItem("favorites");
  return saved ? JSON.parse(saved) : [];
});
  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);

    setQuote(quotes[randomIndex]);
    setQuoteCount((prev) => prev + 1);
  };
const getQuoteFromAPI = async () => {
  try {
    setLoading(true);

    const response = await fetch(
      "https://dummyjson.com/quotes/random"
    );

    const data = await response.json();

    setQuote({
      text: data.quote,
      author: data.author,
      category: "Internet",
    });

    setQuoteCount((prev) => prev + 1);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
const copyQuote = () => {
  navigator.clipboard.writeText(
    `${quote.text} — ${quote.author}`
  );

  setCopied(true);

  setTimeout(() => {
    setCopied(false);
  }, 2000);
};
const addFavorite = () => {
  if (!favorites.some((item) => item.text === quote.text)) {
    setFavorites([...favorites, quote]);
  }
};

const removeFavorite = (quoteToRemove) => {
  setFavorites(
    favorites.filter(
      (item) => item.text !== quoteToRemove.text
    )
  );
};

const favorite = favorites.some(
  (item) => item.text === quote.text
);
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