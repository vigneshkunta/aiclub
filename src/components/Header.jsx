"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { signoutUser } from "@/redux/user/userSlice";
import { Menu, X, User } from "lucide-react";
import styles from "./Header.module.css";

export default function Header() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(signoutUser());
    setMenuOpen(false);
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  // Close mobile menu automatically if screen width exceeds 768px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [menuOpen]);

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
          AI Poetry Generator
        </Link>

        <button onClick={toggleMenu} className={styles.mobileMenu}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={styles.navLinks}>
          <Link href="/generate" className={styles.link}>Generate Poetry</Link>
          <Link href="/explore" className={styles.link}>Explore Feed</Link>
          <Link href="/history" className={styles.link}>History</Link>
          <Link href="/saved" className={styles.link}>Saved</Link>
        </div>

        <div className={styles.profileSection}>
          {currentUser ? (
            <>
              <Link href="/profile" className={styles.profileLink}>
                <User /> {currentUser.fullName || currentUser.email}
              </Link>
              <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
            </>
          ) : (
            <Link href="/signin" className={styles.loginBtn}>Login</Link>
          )}
        </div>

        {/* Mobile Menu */}
        <div className={`${styles.mobileMenuWrapper} ${menuOpen ? styles.mobileMenuOpen : styles.mobileMenuClosed}`}>
          <div className={styles.navLinksMobile}>
            <Link href="/generate" className={styles.linkMobile}>Generate Poetry</Link>
            <Link href="/explore" className={styles.linkMobile}>Explore Feed</Link>
            <Link href="/history" className={styles.linkMobile}>History</Link>
            <Link href="/saved" className={styles.linkMobile}>Saved</Link>
          </div>
          <div className={styles.profileSectionMobile}>
            {currentUser ? (
              <>
                <Link href="/profile" className={styles.profileLink}>
                  <User /> {currentUser.fullName || currentUser.email}
                </Link>
                <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
              </>
            ) : (
              <Link href="/signin" className={styles.loginBtn}>Login</Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
