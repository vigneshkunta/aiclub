"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signinUser } from "@/redux/user/userSlice";
import { useRouter } from "next/navigation";
import styles from "./signin.module.css";

export default function SigninPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (currentUser) {
      router.replace("/");
    }
  }, [currentUser, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(signinUser({ email, password }));
    if (result.meta.requestStatus === "fulfilled") {
      router.push("/");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Welcome Back</h2>
        <p className={styles.subtitle}>
          Log in to continue your poetic journey. <a href="/signup">Sign Up</a>
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? "Signing in…" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
