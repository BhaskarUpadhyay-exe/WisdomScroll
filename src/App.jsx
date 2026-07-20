import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
function App() {
   const quotes = [
  {
    text: "The obstacle is the way.",
    author: "Marcus Aurelius",
    category: "Stoicism",
  },
  {
    text: "Discipline equals freedom.",
    author: "Jocko Willink",
    category: "Discipline",
  },
  {
    text: "Stay hungry. Stay foolish.",
    author: "Steve Jobs",
    category: "Success",
  },
  {
    text: "He who has a why can bear almost any how.",
    author: "Friedrich Nietzsche",
    category: "Philosophy",
  },
];
 const [quote, setQuote] = useState(quotes[0]);
 const [quoteCount, setQuoteCount] = useState(1);

const [favorites, setFavorites] = useState(() => {
  const savedFavorites = localStorage.getItem("favorites");
  return savedFavorites ? JSON.parse(savedFavorites) : [];
});

const favorite = favorites.some(
  (item) => item.text === quote.text
);

const [copied, setCopied] = useState(false);

const [search, setSearch] = useState("");
const [question, setQuestion] = useState("");
const [aiResponse, setAiResponse] = useState("");
const [loading, setLoading] = useState(false);
const [selectedCategory, setSelectedCategory] = useState("All");
const [visitorName, setVisitorName] = useState("");
const [visitors, setVisitors] = useState([]);
const [darkMode, setDarkMode] = useState(true);

const [entered, setEntered] = useState(
  localStorage.getItem("entered") === "true"
);
;
const filteredQuotes = quotes.filter((item) => {
  const matchesSearch =
    item.text.toLowerCase().includes(search.toLowerCase()) ||
    item.author.toLowerCase().includes(search.toLowerCase());

  const matchesCategory =
    selectedCategory === "All" ||
    item.category === selectedCategory;

  return matchesSearch && matchesCategory;
});
useEffect(() => {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}, [favorites]);
  const getRandomQuote = () => {
   
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
    setQuoteCount((prev) => prev + 1);
  };
  const getQuoteFromAPI = async () => {
  setLoading(true);
  console.log(
  "FETCH URL:",
  `https://wisdomscroll.onrender.com?question=${question}`
);
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
setLoading(false);
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
 useEffect(() => {
  const fetchVisitors = async () => {
   const querySnapshot = await getDocs(
  collection(db, "visitors")
);

    console.log(querySnapshot.docs.length);

    const names = querySnapshot.docs.map(
      (doc) => doc.data()
    );

    console.log(names);

    setVisitors(names);
  };

  fetchVisitors();
}, []);
if (!entered) {
  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "100px",
      }}
    >
      <h1>WELCOME TO WISDOMSCROLL</h1>

      <p>
        Before entering, leave your name in the
        Scroll.
      </p>

<input
  type="text"
  placeholder="Enter your name..."
  value={visitorName}
  onChange={(e) =>
    setVisitorName(e.target.value)
  }
/>

<p>Question: {question}</p>

      <br />
      <br />

<button
  onClick={async () => {
    localStorage.setItem(
      "visitorName",
      visitorName
    );

    localStorage.setItem(
      "entered",
      "true"
    );

    await addDoc(
      collection(db, "visitors"),
      {
        name: visitorName,
        joinedAt: new Date().toLocaleDateString(),
        createdAt: Date.now(),
      }
    );

    setEntered(true);
  }}
>
  ENTER THE SCROLL
</button>
    </div>
  );
}
  return (
 <>
  <button
    onClick={() =>
      setDarkMode(!darkMode)
    }
    style={{
      position: "fixed",
      top: "20px",
      right: "20px",
      padding: "10px",
      borderRadius: "10px",
      cursor: "pointer",
      zIndex: 1000,
    }}
  >
    {darkMode ? "☀️" : "🌙"}
  </button>

<div
  style={{
    backgroundColor: darkMode
      ? "#111827"
      : "#FFFFFF",
    color: darkMode
      ? "white"
      : "black",
    minHeight: "100vh",
  }}
>
  <Navbar />
      <div
  style={{
    textAlign: "center",
    marginTop: "30px",
    padding: "30px",
    backgroundColor: "#111827",
    color: "white",
    borderRadius: "20px",
  }}
>
  <h1>WISDOMSCROLL AI</h1>

<p>Ask anything.</p>

<input
  type="text"
  placeholder="Ask WisdomScroll AI..."
  value={question}
  onChange={(e) => setQuestion(e.target.value)}
  style={{
    padding: "10px",
    width: "300px",
    borderRadius: "10px",
  }}
/>

<p>Question State: {question}</p>

<br />
<br />

<button
  onClick={async () => {
    console.log("BUTTON CLICKED");
    console.log(question);

    const response = await fetch(
      `https://wisdomscroll.onrender.com?question=${encodeURIComponent(
        question
      )}`
    );

    const data = await response.text();

    console.log(data);

    setAiResponse(data);
  }}
  style={{
    padding: "10px 20px",
    borderRadius: "10px",
    cursor: "pointer",
  }}
>
  ASK
</button>

  <p style={{ marginTop: "20px" }}>
  {aiResponse}
</p>
</div>
      <Hero
      getQuoteFromAPI={getQuoteFromAPI}
      loading={loading}
  quote={quote}
  quoteCount={quoteCount}
  getRandomQuote={getRandomQuote}
  copyQuote={copyQuote}
  favorite={favorite}
  copied={copied}
  addFavorite={addFavorite}
  removeFavorite={removeFavorite}
/>  
<div style={{ textAlign: "center", marginTop: "20px" }}>
  <button
  onClick={() => setSelectedCategory("All")}
  style={{
    backgroundColor: "#0071E3",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "12px",
    cursor: "pointer",
    margin: "5px",
  }}
>
  All
</button>

  <button
  onClick={() => setSelectedCategory("Stoicism")}
  style={{
    backgroundColor: "#0071E3",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "12px",
    cursor: "pointer",
    margin: "5px",
  }}
>
  Stoicism
</button>

  <button
  onClick={() => setSelectedCategory("Success")}
  style={{
    backgroundColor: "#0071E3",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "12px",
    cursor: "pointer",
    margin: "5px",
  }}
>
  Success
</button>

  <button
  onClick={() => setSelectedCategory("Discipline")}
  style={{
    backgroundColor: "#0071E3",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "12px",
    cursor: "pointer",
    margin: "5px",
  }}
>
  DIscipline
</button>
<button
  onClick={() => setSelectedCategory("Philosophy")}
  style={{
    backgroundColor: "#0071E3",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "12px",
    cursor: "pointer",
    margin: "5px",
  }}
>
  Philosophy
</button>
</div>
<div style={{ textAlign: "center", marginTop: "30px" }}>
  <input
    type="text"
    placeholder="Search quotes or authors..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    style={{
      padding: "10px",
      width: "300px",
    }}
  />
  <div style={{ marginTop: "20px" }}>
  {filteredQuotes.length > 0 ? (
    filteredQuotes.map((item, index) => (
     <p key={index}>
  {item.text} — {item.author}
</p>
    ))
  ) : (
    <p
      style={{
        color: "#A1A1AA",
        fontStyle: "italic",
      }}
    >
      No quotes found.
    </p>
  )}
</div>
</div>
{favorites.length > 0 && (
  <div style={{ marginTop: "40px", textAlign: "center" }}>
    <h2>Your Favorite Quotes ❤️</h2>

    {favorites.map((item, index) => (
  <div key={index}>
    <p>{item.text}</p>
    <small>— {item.author}</small>

    <br />

    <button
      onClick={() => removeFavorite(item)}
      style={{
        marginTop: "10px",
        padding: "8px 12px",
      }}
    >

      Remove
    </button>
  </div>
))}
  </div>
)}

<div
  style={{
    textAlign: "center",
    marginTop: "50px",
  }}
>
  <h2>THE SCROLL KEEPERS</h2>
  <h3>Total Visitors: {visitors.length}</h3>

  {visitors.map((person, index) => (
  <div
    key={index}
    style={{
      marginBottom: "15px",
    }}
  >
    <span>
      #{index + 1}
    </span>

    <span
      style={{
        color: "#22C55E",
        fontWeight: "bold",
        marginLeft: "10px",
      }}
    >
      {person.name}
    </span>

    <span
      style={{
        marginLeft: "15px",
        color: "#D1D5DB",
      }}
    >
      — Joined on{" "}
      {person.joinedAt ||
        "Before dates existed"}
    </span>
  </div>
))}
</div>
<div
  style={{
    textAlign: "center",
    marginTop: "50px",
    padding: "30px",
    backgroundColor: "#111827",
    color: "white",
    borderRadius: "20px",
    marginBottom: "30px",
  }}
>
  <h2>WISDOMSCROLL AI</h2>

  <p>
    <strong>Builder:</strong>
    <br />
    Bhaskar Upadhyay
  </p>

  <p>
    <strong>Project:</strong>
    <br />
    WisdomScroll AI
  </p>

  <p>
    <strong>Version:</strong>
    <br />
    v1.0
  </p>

  <p>
    <strong>Status:</strong>
    <br />
    <span
      style={{
        color: "#22C55E",
        fontWeight: "bold",
        fontSize: "20px",
      }}
    >
      ● ONLINE
    </span>
  </p>
</div>
<p>
  <strong>Powered By:</strong>
  <br />
  Llama 3.3 70B + Groq
</p>

<div
  style={{
    textAlign: "center",
    marginTop: "50px",
    padding: "30px",
    borderRadius: "20px",
    backgroundColor: "#111827",
    color: "white",
  }}
>
  <p>You have used WisdomScroll.</p>

  <p>But you've never met the person who built it.</p>

  <p>Click below.</p>

  <p>I dare you.</p>

  <a
    href="https://www.instagram.com/upadhyay_exe"
    target="_blank"
    rel="noreferrer"
    style={{
      display: "inline-block",
      marginTop: "20px",
      padding: "15px 30px",
      backgroundColor: "#E1306C",
      color: "white",
      textDecoration: "none",
      borderRadius: "12px",
      fontWeight: "bold",
      fontSize: "18px",
    }}
  >
    👀 WHO AM I?
  </a>
</div>

<Footer />
</div>
</>
);
}

export default App;