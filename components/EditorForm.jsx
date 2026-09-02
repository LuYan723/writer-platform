"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { renderMarkdown } from "@/lib/markdown";

export default function EditorForm({ lang, isZh, initial, backUrl }) {
  const router = useRouter();
  const [form, setForm] = useState({
    slug: initial?.slug || "",
    lang: initial?.lang || lang,
    type: initial?.type || "essay",
    title: initial?.title || "",
    summary: initial?.summary || "",
    tags: initial?.tags || "",
    body: initial?.body || "",
    published: initial ? initial.published : true
  });
  const [preview, setPreview] = useState(initial ? initial.body_html : "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    if (field === "body") setPreview(renderMarkdown(value));
  }

  function insertBlock(sample) {
    set("body", (form.body ? form.body + "\n\n" : "") + sample);
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(data.error || "保存失败");
      return;
    }
    router.push("/admin?lang=" + form.lang);
  }

  return (
    <form className="editor-form" onSubmit={save}>
      <div className="editor-grid">
        <label className="field">
          <span>{isZh ? "网址标识 slug（英文小写，用于链接，保存后不要随便改）" : "Slug (lowercase, used in the URL)"}</span>
          <input value={form.slug} required pattern="[a-z0-9_-]+" onChange={(e) => set("slug", e.target.value)} />
        </label>
        <label className="field">
          <span>{isZh ? "语言" : "Language"}</span>
          <select value={form.lang} onChange={(e) => set("lang", e.target.value)} disabled={Boolean(initial)}>
            <option value="zh">中文</option>
            <option value="en">English</option>
          </select>
        </label>
      </div>
      <div className="editor-grid">
        <label className="field">
          <span>{isZh ? "标题" : "Title"}</span>
          <input value={form.title} required maxLength={120} onChange={(e) => set("title", e.target.value)} />
        </label>
        <label className="field">
          <span>{isZh ? "类型" : "Type"}</span>
          <select value={form.type} onChange={(e) => set("type", e.target.value)}>
            <option value="essay">{isZh ? "随笔" : "Essay"}</option>
            <option value="analysis">{isZh ? "解析" : "Analysis"}</option>
          </select>
        </label>
      </div>
      <label className="field">
        <span>{isZh ? "摘要（显示在卡片和文章开头）" : "Summary (shown on cards and article head)"}</span>
        <textarea value={form.summary} rows={2} maxLength={300} onChange={(e) => set("summary", e.target.value)} />
      </label>
      <label className="field">
        <span>{isZh ? "标签（用逗号分隔，例如：法律, 随笔）" : "Tags (comma separated)"}</span>
        <input value={form.tags} onChange={(e) => set("tags", e.target.value)} />
      </label>
      <div className="field">
        <span>
          {isZh ? "正文（Markdown 富内容块）" : "Body (Markdown rich blocks)"}
          <span className="block-hints">
            <button type="button" className="text-btn" onClick={() => insertBlock('::: quote 原文 · 法条\n在这里粘贴引用原文\n:::')}>＋ 引用卡</button>
            <button type="button" className="text-btn" onClick={() => insertBlock('::: point 观点\n在这里写下你的看法\n:::')}>＋ 观点框</button>
            <button type="button" className="text-btn" onClick={() => insertBlock('::: gallery\n/assets/img/ink-mountain.svg|远山\n:::')}>＋ 画廊</button>
            <button type="button" className="text-btn" onClick={() => insertBlock('::: pdf PDF 标题\nhttps://example.com/paper.pdf\n一句话说明（可选）\n:::')}>＋ PDF</button>
          </span>
        </span>
        <textarea value={form.body} required rows={22} onChange={(e) => set("body", e.target.value)} />
      </div>
      <label className="field" style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} style={{ width: "auto" }} />
        <span>{isZh ? "立即发布（取消则保存为草稿）" : "Publish now (unchecked = draft)"}</span>
      </label>
      {error ? <p className="form-error">{error}</p> : null}
      <div className="toolbar">
        <button type="submit" className="btn btn-gold" disabled={saving}>
          {saving ? "…" : isZh ? "保存文章" : "Save article"}
        </button>
        <Link className="btn" href={backUrl}>{isZh ? "返回" : "Cancel"}</Link>
      </div>
      <div className="editor-preview">
        <h3>{isZh ? "实时预览" : "Live preview"}</h3>
        <div className="prose" dangerouslySetInnerHTML={{ __html: preview || "<p>…</p>" }} />
      </div>
    </form>
  );
}
