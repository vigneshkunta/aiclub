"use client";

import { useEffect, useState } from "react";
import styles from "./explore.module.css";

export default function ExplorePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/explore", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load posts");
        setPosts(data.posts || []);
      } catch (err) {
        console.error("Error fetching explore posts:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSave = async (postId) => {
    try {
      setSaving(postId);
      const res = await fetch("/api/savePost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ postId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save post");
      alert("Post saved successfully!");
    } catch (err) {
      console.error("Error saving post:", err);
      alert(err.message);
    } finally {
      setSaving(null);
    }
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Explore Public Poems</h1>

      {loading && <p className={styles.loader}>Loading posts...</p>}
      {error && <p className={styles.loader}>Error: {error}</p>}
      {!loading && !error && posts.length === 0 && (
        <p className={styles.loader}>No public posts available yet.</p>
      )}

      <div className={styles.grid}>
        {posts.map((post) => (
          <div key={post._id} className={styles.card}>
            {post.showScenarioPublic && (
              <div className={styles.scenario}>{post.scenario}</div>
            )}

            <div className={styles.poem}>{post.poem}</div>

            <div className={styles.actions}>
              <button
                onClick={() => handleSave(post._id)}
                disabled={saving === post._id}
                className={styles.saveButton}
              >
                {saving === post._id ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
