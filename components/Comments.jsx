"use client";

import { useEffect, useState } from "react";

export default function Comments({ slug, lang, isZh }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/comments?slug=${encodeURIComponent(slug)}&lang=${lang}`)
      .then((r) => r.json())
      .then((data) => setItems(data.comments || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [slug, lang]);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setSending(true);
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, lang, author_name: name.trim(), body: body.trim() })
    });
    const data = await res.json().catch(() => ({}));
    setSending(false);
    if (!res.ok) {
      setError(data.error || (isZh ? "留言失败，请稍后再试" : "Failed to post."));
      return;
    }
    setBody("");
    setItems((list) => [data.comment, ...list]);
  }

  return (
    <section className="comments" aria-label={isZh ? "留言" : "Comments"}>
      <h2 className="about-subtitle display">
        {isZh ? "留言" : "Comments"}
        <span className="comment-count">{items.length}</span>
      </h2>
      <form className="comment-form" data-title={isZh ? "写下回应" : "Join the conversation"} onSubmit={submit}>
        <label>
          <span>{isZh ? "你的称呼" : "Your name"}</span>
          <input required maxLength={40} value={name} onChange={(e) => setName(e.target.value)} placeholder={isZh ? "怎么称呼你" : "What should we call you"} />
        </label>
        <label>
          <span>{isZh ? "内容" : "Message"}</span>
          <textarea required maxLength={1000} rows={4} value={body} onChange={(e) => setBody(e.target.value)} placeholder={isZh ? "写下你的想法…" : "Leave a thought…"} />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <button type="submit" className="btn btn-gold" disabled={sending}>
          {sending ? "…" : isZh ? "发布留言" : "Post comment"}
        </button>
      </form>
      {loading ? null : items.length === 0 ? (
        <p className="comment-empty">{isZh ? "还没有留言，做第一个读者。" : "No comments yet."}</p>
      ) : (
        <ul className="comment-list">
          {items.map((c) => (
            <li key={c.id} className="comment-item">
              <span className="comment-avatar" aria-hidden="true">{(c.author_name || "?").slice(0, 1).toUpperCase()}</span>
              <div>
                <p className="comment-meta">
                  <strong>{c.author_name}</strong>
                  <time dateTime={c.created_at}>{new Date(c.created_at).toLocaleString()}</time>
                </p>
              </div>
              <p className="comment-body">{c.body}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
