import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import { auth, db } from "../firebase";
import "./Saved.css";

function Saved() {
  const [savedCards, setSavedCards] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FIREBASE SAVED WISDOM
  // =========================

  useEffect(() => {
    let unsubscribeSaved = null;

    const unsubscribeAuth = onAuthStateChanged(
      auth,
      (user) => {
        // No logged-in user
        if (!user) {
          setSavedCards([]);
          setLoading(false);
          return;
        }

        setLoading(true);

        const savedRef = collection(
          db,
          "users",
          user.uid,
          "savedWisdom"
        );

        // Listen for changes in real time
        unsubscribeSaved = onSnapshot(
          savedRef,
          (snapshot) => {
            const cards = snapshot.docs.map(
              (document) => ({
                ...document.data(),
                verse_order: Number(
                  document.id
                ),
              })
            );

            setSavedCards(cards);
            setLoading(false);
          },
          (error) => {
            console.error(
              "Failed to load saved wisdom:",
              error
            );

            setSavedCards([]);
            setLoading(false);
          }
        );
      }
    );

    return () => {
      unsubscribeAuth();

      if (unsubscribeSaved) {
        unsubscribeSaved();
      }
    };
  }, []);

  // =========================
  // REMOVE SAVED WISDOM
  // =========================

  const removeCard = async (
    verseOrder
  ) => {
    const user = auth.currentUser;

    if (!user) {
      return;
    }

    try {
      const savedRef = doc(
        db,
        "users",
        user.uid,
        "savedWisdom",
        String(verseOrder)
      );

      await deleteDoc(savedRef);

      // onSnapshot will automatically
      // update the Saved page.
    } catch (error) {
      console.error(
        "Failed to remove saved wisdom:",
        error
      );

      alert(
        "Could not remove this wisdom. Please try again."
      );
    }
  };

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
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="saved-page">
        <section className="saved-header">
          <p className="saved-label">
            ✦ WISDOMSCROLL
          </p>

          <h1>Saved Wisdom</h1>

          <p>
            Loading your wisdom...
          </p>
        </section>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="saved-page">

      <section className="saved-header">

        <p className="saved-label">
          ✦ WISDOMSCROLL
        </p>

        <h1>
          Saved Wisdom
        </h1>

        <p>
          The wisdom you chose to keep.
        </p>

      </section>

      {savedCards.length === 0 ? (

        <section className="saved-empty">

          <div className="saved-empty-icon">
            ♡
          </div>

          <h2>
            No saved wisdom yet
          </h2>

          <p>
            When something speaks to you,
            save it here.
          </p>

        </section>

      ) : (

        <div className="saved-list">

          {savedCards.map((card) => (

            <section
              className="saved-card"
              key={card.verse_order}
            >

              <div className="saved-card-inner">

                {/* REFERENCE */}

                <div className="saved-reference">
                  BHAGAVAD GITA{" "}
                  {card.chapter}.
                  {card.verse}
                </div>

                {/* HOOK */}

                {card.hook &&
                  card.hookType &&
                  card.hookType !== "none" && (

                    <p className="saved-hook">
                      {card.hook}
                    </p>

                  )}

                {/* MAIN WISDOM */}

                <p className="saved-simple">
                  “{card.simpleVersion}”
                </p>

                {/* EXPLANATION */}

                <div className="saved-explanation">

                  <p className="saved-section-label">
                    WHAT THIS MEANS
                  </p>

                  <p>
                    {card.explanation}
                  </p>

                </div>

                {/* LIFE LESSON */}

                {card.lifeLesson && (

                  <div className="saved-lesson">

                    <p className="saved-section-label">
                      ✦ TODAY'S LESSON
                    </p>

                    <p>
                      {card.lifeLesson}
                    </p>

                  </div>

                )}

                {/* THEMES */}

                {card.themes?.length > 0 && (

                  <div className="saved-themes">

                    {card.themes.map(
                      (theme) => (

                        <span key={theme}>
                          #{theme}
                        </span>

                      )
                    )}

                  </div>

                )}

                {/* ORIGINAL TRANSLATION */}

                {card.source?.translation && (

                  <details className="saved-original">

                    <summary>
                      Read the original translation
                    </summary>

                    <p>
                      {card.source.translation}
                    </p>

                    {card.source.translator && (

                      <small>
                        Translation:{" "}
                        {card.source.translator}
                      </small>

                    )}

                  </details>

                )}

                {/* ACTIONS */}

                <div className="saved-actions">

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
                      removeCard(
                        card.verse_order
                      )
                    }
                  >
                    ❤️ Saved
                  </button>

                </div>

              </div>

            </section>

          ))}

        </div>

      )}

    </div>
  );
}

export default Saved;