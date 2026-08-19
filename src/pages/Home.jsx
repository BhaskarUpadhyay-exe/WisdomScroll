import HistoryPreview from "../components/HistoryPreview";
import YesterdayCard from "../components/YesterdayCard";
import FocusHistory from "../components/FocusHistory";
import useFocus from "../hooks/useFocus";
import FocusCard from "../components/FocusCard";
import FavoriteList from "../components/FavoriteList";
import useQuotes from "../hooks/useQuotes";
import Layout from "../components/Layout";
import Hero from "../components/Hero";

function Home() {
  const {
    quote,
    quoteCount,
    loading,
    copied,
    favorite,
    favorites,
    addFavorite,
    removeFavorite,
    getRandomQuote,
    getQuoteFromAPI,
    copyQuote,
  } = useQuotes();

  const {
    yesterdayFocus,
    focuses,
    currentStreak,
    totalFocuses,
    completedFocuses,
    completionRate,
    deleteHistoryFocus,
  } = useFocus();

  return (
    <Layout>
      <Hero
        quote={quote}
        loading={loading}
        quoteCount={quoteCount}
        getRandomQuote={getRandomQuote}
        getQuoteFromAPI={getQuoteFromAPI}
        copyQuote={copyQuote}
        copied={copied}
        favorite={favorite}
        addFavorite={addFavorite}
        removeFavorite={removeFavorite}
      />

      {yesterdayFocus && (
        <YesterdayCard
          yesterday={yesterdayFocus}
        />
      )}

      <FocusCard />

    <HistoryPreview
  focuses={focuses}
  currentStreak={currentStreak}
/>

      <FavoriteList
        favorites={favorites}
        removeFavorite={removeFavorite}
      />
    </Layout>
  );
}

export default Home;