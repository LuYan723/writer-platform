"use client";

import Link from "next/link";
import { formatDate, typeLabel } from "@/lib/article";

export default function AdminPanel({ lang, articles, comments, isZh }) {
  async function removeArticle(slug, title) {
    if (!window.confirm(isZh ? `删除《${title}》？此操作不可恢复。` : `Delete "${title}"? This cannot be undone.`)) return;
    const res = await fetch("/api/articles", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, lang })
    });
    if (res.ok) window.location.reload();
  }

  async function removeComment(id) {
    if (!window.confirm(isZh ? "删除这条留言？" : "Delete this comment?")) return;
    await fetch("/api/comments", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    window.location.reload();
  }

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = `/${lang}`;
  }

  return (
    <>
      <div className="admin-topbar">
        <div>
          <h1>{isZh ? "写作台" : "Writer Studio"}</h1>
          <p className="theme-hint">{isZh ? "这里只有你能进。写、改、发布、管理留言都在此完成。" : "Private studio: write, publish and moderate."}</p>
        </div>
        <div className="row-actions">
          <Link href={`/${lang}`}>{isZh ? "查看网站" : "View site"}</Link>
          <button type="button" onClick={signOut}>{isZh ? "退出登录" : "Sign out"}</button>
        </div>
      </div>

      <h2 className="about-subtitle display">{isZh ? "文章" : "Articles"}</h2>
      <Link className="btn btn-gold" href={`/admin/editor?lang=${lang}`}>+ {isZh ? "写新文章" : "New article"}</Link>
      <div className="table-wrap" style={{ marginTop: 18 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>{isZh ? "标题" : "Title"}</th>
              <th>{isZh ? "类型" : "Type"}</th>
              <th>{isZh ? "语言" : "Lang"}</th>
              <th>{isZh ? "更新时间" : "Updated"}</th>
              <th>{isZh ? "状态" : "Status"}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {articles.length ? (
              articles.map((article) => (
                <tr key={article.slug + article.lang}>
                  <td>{article.title}</td>
                  <td>{typeLabel(article.lang, article.type)}</td>
                  <td>{article.lang === "zh" ? "中文" : "EN"}</td>
                  <td>{formatDate(lang, article.updated_at || article.created_at)}</td>
                  <td>
                    <span className={article.published ? "status-dot" : "status-dot off"} aria-hidden="true" />
                    {article.published ? (isZh ? "已发布" : "Live") : (isZh ? "草稿" : "Draft")}
                  </td>
                  <td>
                    <span className="row-actions">
                      <Link href={`/admin/editor?slug=${encodeURIComponent(article.slug)}&lang=${article.lang}`}>{isZh ? "编辑" : "Edit"}</Link>
                      <button type="button" className="danger" onClick={() => removeArticle(article.slug, article.title)}>{isZh ? "删除" : "Delete"}</button>
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>{isZh ? "还没有文章。" : "No articles yet."}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <h2 className="about-subtitle display" style={{ marginTop: 56 }}>{isZh ? "最近留言" : "Recent comments"}</h2>
      {comments.length ? (
        <ul className="comment-list">
          {comments.map((comment) => (
            <li className="comment-item" key={comment.id}>
              <p className="comment-meta">
                <strong>{comment.author_name}</strong>
                <span>
                  <Link href={`/${comment.article_lang}/articles/${encodeURIComponent(comment.article_slug)}`}>{comment.article_slug}</Link>
                  <span style={{ margin: "0 8px" }}>·</span>
                  <time>{new Date(comment.created_at).toLocaleString()}</time>
                </span>
              </p>
              <p className="comment-body">{comment.body}</p>
              <button type="button" className="danger" style={{ marginTop: 8 }} onClick={() => removeComment(comment.id)}>
                {isZh ? "删除留言" : "Delete"}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="comment-empty">{isZh ? "还没有读者留言。" : "No reader comments yet."}</p>
      )}
    </>
  );
}
