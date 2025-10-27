"use client";

import { useState } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { signoutUser } from "@/redux/user/userSlice";
import { Menu, X } from "lucide-react";
import styles from "./Header.module.css";

export default function Header() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(signoutUser());
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        {/* Logo */}
        <Link href="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
          AI Poetry Generator
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className={styles.mobileMenu}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Nav Links & Profile Section */}
        <div className={styles.navLinks}>
          <Link href="/generate" className={styles.link} onClick={() => setMenuOpen(false)}>
            Generate Poetry
          </Link>
          <Link href="/explore" className={styles.link} onClick={() => setMenuOpen(false)}>
            Explore Feed
          </Link>
          <Link href="/history" className={styles.link} onClick={() => setMenuOpen(false)}>
            History
          </Link>
          <Link href="/saved" className={styles.link} onClick={() => setMenuOpen(false)}>
            Saved
          </Link>
        </div>

        {/* Desktop Profile Section (Sign In / Sign Out) */}
        <div className={styles.profileSection}>
          {currentUser ? (
            <>
              <Link href="/profile" className={styles.profileLink} onClick={() => setMenuOpen(false)}>
                {currentUser.fullName || currentUser.email}
              </Link>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <Link href="/signin" className={styles.loginBtn} onClick={() => setMenuOpen(false)}>
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Wrapper */}
        <div className={`${styles.mobileMenuWrapper} ${menuOpen ? styles.mobileMenuOpen : styles.mobileMenuClosed}`}>
          <div className={styles.navLinksMobile}>
            <Link href="/generate" className={styles.linkMobile}>
              Generate Poetry
            </Link>
            <Link href="/explore" className={styles.linkMobile}>
              Explore Feed
            </Link>
            <Link href="/history" className={styles.linkMobile}>
              History
            </Link>
            <Link href="/saved" className={styles.linkMobile}>
              Saved
            </Link>
          </div>

          <div className={styles.profileSectionMobile}>
            {currentUser ? (
              <>
                <Link href="/profile" className={styles.profileLink} onClick={() => setMenuOpen(false)}>
                  {currentUser.fullName || currentUser.email}
                </Link>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                  Logout
                </button>
              </>
            ) : (
              <Link href="/signin" className={styles.loginBtn} onClick={() => setMenuOpen(false)}>
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
