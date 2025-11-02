"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchHistory, updatePost, deletePost } from "@/redux/history/historySlice";
import styles from "./history.module.css";

export default function HistoryPage() {
  const { currentUser } = useSelector((state) => state.user);
  const { items, loading, error, updating } = useSelector((state) => state.history);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push("/signin");
    }
  }, [currentUser, router]);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchHistory());
    }
  }, [dispatch, currentUser]);

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Your Poetry History</h1>
      <p className={styles.subtitle}>
        Manage your previously generated poems and visibility options.
      </p>

      {loading && <p className={styles.loading}>Loading your history…</p>}
      {error && <p className={styles.errorText}>{error}</p>}
      {!loading && !error && items.length === 0 && (
        <p className={styles.empty}>You haven’t generated any poems yet.</p>
      )}

      <div className={styles.historyList}>
        {items.map((post) => (
          <div key={post._id} className={styles.historyItem}>
            <div className={styles.historyHeader}>
              <h2 className={styles.scenarioTitle}>Scenario</h2>
              <p className={styles.scenarioText}>{post.scenario}</p>
              <p className={styles.date}>{new Date(post.createdAt).toLocaleString()}</p>
            </div>

            <div className={styles.poemSection}>
              <h3 className={styles.poemTitle}>Generated Poem</h3>
              <pre className={styles.generatedPoem}>{post.poem}</pre>
            </div>

            <div className={styles.toggles}>
              <div className={styles.toggleGroup}>
                <span
                  className={`${styles.toggleSwitch} ${post.isPublic ? styles.active : ""}`}
                  onClick={() =>
                    dispatch(
                      updatePost({ postId: post._id, field: "isPublic", value: !post.isPublic })
                    )
                  }
                ></span>
                <span className={styles.toggleLabel}>Post Publicly</span>
              </div>

              <div className={styles.toggleGroup}>
                <span
                  className={`${styles.toggleSwitch} ${
                    post.showScenarioPublic ? styles.active : ""
                  }`}
                  onClick={() =>
                    dispatch(
                      updatePost({
                        postId: post._id,
                        field: "showScenarioPublic",
                        value: !post.showScenarioPublic,
                      })
                    )
                  }
                ></span>
                <span className={styles.toggleLabel}>Show Scenario Publicly</span>
              </div>

              <button
                className={styles.deleteButton}
                disabled={updating === post._id}
                onClick={() => dispatch(deletePost(post._id))}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
