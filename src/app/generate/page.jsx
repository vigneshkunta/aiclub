"use client";

import { useState } from "react";
import styles from "./generate.module.css";
import { useDispatch, useSelector } from "react-redux";

export default function Generate() {
  const [inputScenario, setInputScenario] = useState("");
  const [generatedPoem, setGeneratedPoem] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [showScenarioPublic, setShowScenarioPublic] = useState(false);

  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const handleGenerate = async () => {
    if (!currentUser) return setError("You must be signed in.");
    if (!inputScenario.trim())
      return setError("Please describe your scenario.");

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario: inputScenario,
          credentials: "include",
          userId: currentUser._id,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate poem");

      setGeneratedPoem(data.generatedPoem);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    setGeneratedPoem("");
    setError(null);
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Generate Poetry</h1>

      <label htmlFor="scenario" className={styles.label}>
        Describe your scenario
      </label>
      <textarea
        id="scenario"
        value={inputScenario}
        onChange={(e) => setInputScenario(e.target.value)}
        placeholder="A quiet forest path at dawn, mist rising, birds chirping softly, a sense of new beginnings."
        rows={5}
        className={styles.textarea}
      />

      <div className={styles.controls}>
        {/* <label htmlFor="showPublic" className={styles.checkboxLabel}>
          <input
            id="showPublic"
            type="checkbox"
            checked={showScenarioPublic}
            onChange={() => setShowScenarioPublic(!showScenarioPublic)}
            className={styles.checkboxInput}
          />
          Show my input scenario publicly?
        </label> */}

        <button
          className={styles.generateButton}
          onClick={handleGenerate}
          disabled={loading || !inputScenario.trim()}
        >
          {loading ? "Generating…" : "Generate"}
        </button>
      </div>

      {error && <p className={styles.errorText}>{error}</p>}

      {generatedPoem && (
        <section className={styles.generatedSection}>
          <h2 className={styles.generatedTitle}>Your AI-Generated Poem</h2>
          <pre className={styles.generatedPoem}>{generatedPoem}</pre>

          <div className={styles.actionButtons}>
            <button
              className={`${styles.actionButton} ${styles.actionButtonRegenerate}`}
              onClick={handleRegenerate}
            >
              Regenerate
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
