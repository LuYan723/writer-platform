"use client";

import { useState } from "react";
import Link from "next/link";
import ThemePalette from "@/components/ThemePalette";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "登录失败");
      return;
    }
    window.location.href = "/admin?lang=zh";
  }

  return (
    <main className="page-main">
      <div className="auth-card">
        <p className="eyebrow">Developer Mode</p>
        <h1>写作台登录</h1>
        <p className="theme-hint">仅站长邮箱可登录；访客不需要也不会看到此页。</p>
        <form onSubmit={submit}>
          <label className="field">
            <span>站长邮箱</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
          </label>
          <label className="field">
            <span>密码</span>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <button type="submit" className="btn btn-gold" disabled={busy}>{busy ? "…" : "登录"}</button>
        </form>
        <p style={{ marginTop: 22 }}>
          <Link className="text-link" href="/">← 返回网站</Link>
        </p>
      </div>
      <ThemePalette isZh />
    </main>
  );
}
