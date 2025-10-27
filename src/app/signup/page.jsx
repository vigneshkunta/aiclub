"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "@/redux/user/userSlice";
import styles from "./signup.module.css";

export default function SignUpPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.user);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(signupUser({ fullName, email, password }));
    if (result.meta.requestStatus === "fulfilled") {
      router.push("/");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Create your account</h2>
        <p className={styles.subtitle}>
          Or <a href="/signin">sign in to existing account</a>
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={styles.input}
              required
            />
          </div>

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
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
