import { useEffect, useRef, useState } from "react";
import wisdomData from "../data/gitaWisdom.json";
import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import { auth, db } from "../firebase";
import "./Explore.css";

const INITIAL_CARDS = 6;
const REFILL_AMOUNT = 4;

function Explore() {
  const [cards, setCards] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [user, setUser] = useState(null);

  const usedVerses = useRef(new Set());
  const loadMoreRef = useRef(null);
  const loadingMoreRef = useRef(false);

  // =========================
  // FIREBASE USER
  // =========================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
      }
    );

    return () => unsubscribe();
  }, []);

  // =========================
  // LOAD USER'S SAVED WISDOM
  // =========================

  useEffect(() => {
    if (!user) {
      setSavedIds(new Set());
      return;
    }

    const loadSavedWisdom = async () => {
      try {
        const savedRef = collection(
          db,
          "users",
          user.uid,
          "savedWisdom"
        );

        const snapshot = await getDocs(savedRef);

        const ids = new Set();

        snapshot.forEach((document) => {
          ids.add(document.id);
        });

        setSavedIds(ids);

      } catch (error) {
        console.error(
          "Failed to load saved wisdom:",
          error
        );
      }
    };

    loadSavedWisdom();
  }, [user]);

  // =========================
  // GET NEXT VERSE
  // =========================

  const getNextVerse = () => {
    let available = wisdomData.filter(
      (verse) =>
        !usedVerses.current.has(
          verse.verse_order
        )
    );

    if (available.length === 0) {
      usedVerses.current.clear();
      available = [...wisdomData];
    }

    const randomIndex = Math.floor(
      Math.random() * available.length
    );

    const verse = available[randomIndex];

    usedVerses.current.add(
      verse.verse_order
    );

    return verse;
  };

  // =========================
  // ADD CARDS
  // =========================

  const addLocalCards = (amount) => {
    const newCards = [];

    for (let i = 0; i < amount; i += 1) {
      newCards.push(getNextVerse());
    }

    setCards((previous) => [
      ...previous,
      ...newCards,
    ]);
  };

  // =========================
  // INITIAL CARDS
  // =========================

  useEffect(() => {
    if (wisdomData.length > 0) {
      addLocalCards(
        Math.min(
          INITIAL_CARDS,
          wisdomData.length
        )
      );
    }
  }, []);

  // =========================
  // INFINITE SCROLL
  // =========================

  useEffect(() => {
    const sentinel =
      loadMoreRef.current;

    if (!sentinel) return;

    const observer =
      new IntersectionObserver(
        (entries) => {
          if (
            !entries[0].isIntersecting ||
            loadingMoreRef.current
          ) {
            return;
          }

          loadingMoreRef.current = true;

          addLocalCards(
            REFILL_AMOUNT
          );

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              loadingMoreRef.current = false;
            });
          });
        },
        {
          root: null,
          rootMargin: "1500px 0px",
          threshold: 0,
        }
      );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, []);

  // =========================
  // COPY
  // =========================

  const copyCard = async (card) => {
    try {
      await navigator.clipboard.writeText(
        `${card.simpleVersion}\n\n— Bhagavad Gita ${card.chapter}.${card.verse}`
      );
    } catch (error) {
      console.error(
        "Copy failed:",
        error
      );
    }
  };

  // =========================
  // SAVE / UNSAVE
  // =========================

  const saveCard = async (card) => {
    if (!user) {
      alert(
        "Please log in to save wisdom."
      );
      return;
    }

    const verseId =
      String(card.verse_order);

    const savedRef = doc(
      db,
      "users",
      user.uid,
      "savedWisdom",
      verseId
    );

    const alreadySaved =
      savedIds.has(verseId);

    try {
      if (alreadySaved) {

        // =========================
        // REMOVE
        // =========================

        await deleteDoc(savedRef);

        setSavedIds((previous) => {
          const updated =
            new Set(previous);

          updated.delete(verseId);

          return updated;
        });

      } else {

        // =========================
        // SAVE
        // =========================

        await setDoc(savedRef, {
          ...card,
          savedAt:
            new Date().toISOString(),
        });

        setSavedIds((previous) => {
          const updated =
            new Set(previous);

          updated.add(verseId);

          return updated;
        });
      }

    } catch (error) {
      console.error(
        "Failed to save wisdom:",
        error
      );

      alert(
        "Could not save this wisdom. Please try again."
      );
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="gita-feed">

      {/* INTRO */}

      <section className="gita-intro">

        <p className="gita-label">
          ✦ WISDOMSCROLL
        </p>

        <h1>
          Bhagavad Gita
        </h1>

        <p>
          Ancient wisdom.
          <br />
          Made simple for today.
        </p>

        <span className="scroll-hint">
          ↓ Scroll for wisdom
        </span>

      </section>

      {/* CARDS */}

      {cards.map((card) => (

        <section
          className="gita-card"
          key={card.verse_order}
        >

          <div className="gita-card-inner">

            {/* REFERENCE */}

            <div className="gita-reference">
              BHAGAVAD GITA{" "}
              {card.chapter}.
              {card.verse}
            </div>

            {/* MAIN WISDOM */}

            <div className="gita-main">

              {card.hook &&
                card.hookType &&
                card.hookType !==
                  "none" && (

                <p className="gita-hook">
                  {card.hook}
                </p>

              )}

              <p className="gita-simple">
                “{card.simpleVersion}”
              </p>

            </div>

            {/* EXPLANATION */}

            <div className="gita-explanation">

              <p className="gita-section-label">
                WHAT THIS MEANS
              </p>

              <p>
                {card.explanation}
              </p>

            </div>

            {/* LIFE LESSON */}

            {card.lifeLesson && (

              <div className="gita-lesson">

                <p className="gita-section-label">
                  ✦ TODAY'S LESSON
                </p>

                <p>
                  {card.lifeLesson}
                </p>

              </div>

            )}

            {/* THEMES */}

            {card.themes?.length >
              0 && (

              <div className="gita-themes">

                {card.themes.map(
                  (theme) => (

                    <span key={theme}>
                      #{theme}
                    </span>

                  )
                )}

              </div>

            )}

            {/* ORIGINAL */}

            {card.source
              ?.translation && (

              <details className="gita-original">

                <summary>
                  Read the original translation
                </summary>

                <p>
                  {
                    card.source
                      .translation
                  }
                </p>

                {card.source
                  .translator && (

                  <small>
                    Translation:{" "}
                    {
                      card.source
                        .translator
                    }
                  </small>

                )}

              </details>

            )}

            {/* ACTIONS */}

            <div className="gita-actions">

              <button
                type="button"
                onClick={() =>
                  copyCard(card)
                }
              >
                📋 Copy
              </button>

              <button
                type="button"
                onClick={() =>
                  saveCard(card)
                }
              >
                {savedIds.has(
                  String(
                    card.verse_order
                  )
                )
                  ? "❤️ Saved"
                  : "🤍 Save"}
              </button>

            </div>

          </div>

        </section>

      ))}

      {/* INFINITE SCROLL SENTINEL */}

      <div
        ref={loadMoreRef}
        className="gita-scroll-sentinel"
        aria-hidden="true"
      />

    </div>
  );
}

export default Explore;