import FocusHistory from "../components/FocusHistory";
import useFocus from "../hooks/useFocus";
import Layout from "../components/Layout";

function History() {
  const {
    historyFocuses,
    currentStreak,
    totalFocuses,
    completedFocuses,
    completionRate,
    deleteHistoryFocus,
  } = useFocus();

  return (
    <Layout>
      <section className="history-page">

        <FocusHistory
          focuses={historyFocuses}
          currentStreak={currentStreak}
          totalFocuses={totalFocuses}
          completedFocuses={completedFocuses}
          completionRate={completionRate}
          deleteHistoryFocus={
            deleteHistoryFocus
          }
        />

      </section>
    </Layout>
  );
}

export default History;