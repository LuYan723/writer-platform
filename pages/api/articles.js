import { renderMarkdown } from "@/lib/markdown";
import { adminClient, authUserFromRequest, isOwner } from "@/lib/supabase";

function cleanSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export default async function handler(req, res) {
  const user = await authUserFromRequest(req);
  if (!isOwner(user)) return res.status(401).json({ error: "请先登录站长账号" });
  const db = adminClient();

  if (req.method === "POST") {
    const p = req.body || {};
    const slug = cleanSlug(p.slug);
    const title = String(p.title || "").trim();
    if (!slug || !title) return res.status(400).json({ error: "slug 和标题不能为空" });
    const body = String(p.body || "");
    const record = {
      slug,
      lang: p.lang === "en" ? "en" : "zh",
      type: p.type === "analysis" ? "analysis" : "essay",
      title,
      summary: String(p.summary || "").trim(),
      body,
      body_html: renderMarkdown(body),
      tags: String(p.tags || "").trim(),
      published: Boolean(p.published),
      updated_at: new Date().toISOString()
    };
    const { error } = await db.from("articles").upsert(record, { onConflict: "slug,lang" });
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true, article: record });
  }

  if (req.method === "DELETE") {
    const { slug, lang } = req.body || {};
    if (!slug) return res.status(400).json({ error: "缺少 slug" });
    const { error } = await db
      .from("articles")
      .delete()
      .eq("slug", slug)
      .eq("lang", lang === "en" ? "en" : "zh");
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
