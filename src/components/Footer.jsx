// Footer.jsx
import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <h2>PoemVerse</h2>
        </div>
        <div className={styles.links}>
          <a href="/explore">Explore</a>
          <a href="/generate">Create</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </div>
        <p className={styles.copy}>© 2025 PoemVerse. All rights reserved.</p>
      </div>
    </footer>
  );
}
