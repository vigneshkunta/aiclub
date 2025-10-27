"use client";

import { useState } from "react";
import styles from "./generate.module.css";
import { useDispatch, useSelector } from "react-redux";

export default function Generate() {
  const [inputScenario, setInputScenario] = useState("");
  const [generatedPoem, setGeneratedPoem] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showScenarioPublic, setShowScenarioPublic] = useState(false);

  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const handleGenerate = async () => {
    if(!currentUser) {
      setError("You must be signed in to generate poetry.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // Simulate generation delay, replace with actual API call
      await new Promise((r) => setTimeout(r, 1500));
      setGeneratedPoem(
        `Whispers of dawn, a soft, new light,
Dreams take their flight through morning's sight.
Ink on a page, a silent song,
Where words weave and dreams belong.`
      );
    } catch (err) {
      setError("Failed to generate poetry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    setGeneratedPoem("");
    setInputScenario("");
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
        <label htmlFor="showPublic" className={styles.checkboxLabel}>
          <input
            id="showPublic"
            type="checkbox"
            checked={showScenarioPublic}
            onChange={() => setShowScenarioPublic(!showScenarioPublic)}
            className={styles.checkboxInput}
          />
          Show my input scenario publicly?
        </label>

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
            <button
              className={`${styles.actionButton} ${styles.actionButtonSave}`}
              onClick={() => alert("Poem saved! (Placeholder)")}
            >
              Save
            </button>
            <button
              className={`${styles.actionButton} ${styles.actionButtonPublish}`}
              onClick={() => alert("Poem published! (Placeholder)")}
            >
              Publish
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
