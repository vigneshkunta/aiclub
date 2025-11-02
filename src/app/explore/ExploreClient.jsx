"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react"; // Lucide icons
import styles from "./explore.module.css";

export default function ExplorePage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [savedPosts, setSavedPosts] = useState({});
  const [toast, setToast] = useState(null);

  const observer = useRef();

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/explore?page=${page}&limit=6`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch posts");

      if (data.posts.length === 0) setHasMore(false);
      else {
        setPosts(prev => {
          const allPosts = [...prev, ...data.posts];
          return Array.from(new Map(allPosts.map(p => [p._id, p])).values());
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const lastPostRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) setPage(prev => prev + 1);
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const handleSave = async (postId) => {
    try {
      const res = await fetch("/api/savePost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ postId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save post");

      setSavedPosts(prev => ({ ...prev, [postId]: true }));
      setToast("Post saved successfully!");
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setToast(`Error: ${err.message}`);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (error) return <p className={styles.loader}>Error: {error}</p>;

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Explore Public Poems</h1>

      <div className={styles.grid}>
        {posts.map((post, index) => {
          const isLast = index === posts.length - 1;
          const showScenario = post.showScenarioPublic;
          const scenarioText = showScenario
            ? post.scenario
            : "The scenario for this poem is hidden.";

          const truncated =
            scenarioText.length > 120 && !expanded[post._id]
              ? `${scenarioText.slice(0, 120)}...`
              : scenarioText;

          return (
            <div
              key={post._id}
              ref={isLast ? lastPostRef : null}
              className={styles.card}
            >
              <p className={styles.author}>@{post.user?.fullName || "Anonymous"}</p>

              <p className={styles.scenario}>
                {truncated}
                {scenarioText.length > 120 && (
                  <span
                    className={styles.readMore}
                    onClick={() => toggleExpand(post._id)}
                  >
                    {expanded[post._id] ? " Show Less" : " Read More"}
                  </span>
                )}
              </p>

              <pre className={styles.poem}>{post.poem}</pre>

              <div className={styles.actions}>
                <button
                  className={styles.saveButton}
                  onClick={() => handleSave(post._id)}
                >
                  {savedPosts[post._id] ? (
                    <BookmarkCheck size={20} color="#fbbf24" />
                  ) : (
                    <Bookmark size={20} color="#f0f4f8" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {loading && <p className={styles.loader}>Loading more posts…</p>}
      {!hasMore && !loading && <p className={styles.loader}>No more poems to show.</p>}

      {toast && <div className={styles.toast}>{toast}</div>}
    </main>
  );
}
