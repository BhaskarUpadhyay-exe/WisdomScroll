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
<FavoriteList
  favorites={favorites}
  removeFavorite={removeFavorite}
/>
    </Layout>
  );
}

export default Home;