"use client";

import { useEffect, useState } from "react";
import styles from "./saved.module.css"; 
import { Bookmark, Copy } from "lucide-react"; 

export default function SavedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchSavedPosts = async () => {
    try {
      const res = await fetch("/api/saved", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch saved posts");
      setPosts(data.saved || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  const handleUnsave = async (postId) => {
    try {
      const res = await fetch("/api/unsavePost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ postId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to unsave post");
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCopy = (poem) => {
    navigator.clipboard.writeText(poem);
    setToast("Poem copied to clipboard!");
    setTimeout(() => setToast(null), 2000);
  };

  if (loading) return <p className={styles.loader}>Loading saved posts…</p>;
  if (error) return <p className={styles.loader}>Error: {error}</p>;

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Saved Poems</h1>
      {posts.length === 0 && <p className={styles.noPosts}>No saved posts yet.</p>}

      <div className={styles.grid}>
        {posts.map((post) => (
          <div key={post._id} className={styles.card}>
            <div className={styles.header}>
              <p className={styles.user}>@{post.user?.fullName || "Anonymous"}</p>
              <div className={styles.actions}>
                <button
                  className={styles.copyButton}
                  onClick={() => handleCopy(post.poem)}
                >
                  <Copy size={16} /> Copy
                </button>
                <button
                  className={styles.saveButton}
                  onClick={() => handleUnsave(post._id)}
                  title="Unsave Post"
                >
                  <Bookmark size={20} />
                </button>
              </div>
            </div>

            <pre className={styles.poem}>{post.poem}</pre>

            {post.showScenarioPublic ? (
              <p className={styles.scenario}>{post.scenario}</p>
            ) : (
              <p className={styles.scenarioHidden}>Scenario hidden</p>
            )}
          </div>
        ))}
      </div>

      {toast && <div className={styles.toast}>{toast}</div>}
    </main>
  );
}
