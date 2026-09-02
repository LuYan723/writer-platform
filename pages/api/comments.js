import { adminClient, anonClient, authUserFromRequest, HAS_ENV, isOwner } from "@/lib/supabase";

export default async function handler(req, res) {
  if (!HAS_ENV) return res.status(503).json({ error: "Database not configured" });
  const slug = String(req.query.slug || req.body?.slug || "");
  const lang = req.query.lang === "en" || req.body?.lang === "en" ? "en" : "zh";

  if (req.method === "GET") {
    const { data } = await anonClient()
      .from("comments")
      .select("*")
      .eq("article_slug", slug)
      .eq("article_lang", lang)
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(200);
    return res.json({ comments: data || [] });
  }

  if (req.method === "POST") {
    const author_name = String(req.body?.author_name || "").trim().slice(0, 40);
    const body = String(req.body?.body || "").trim().slice(0, 1000);
    if (!author_name || !body || !slug) return res.status(400).json({ error: "称呼和内容不能为空" });
    const { data: article } = await anonClient()
      .from("articles")
      .select("slug")
      .eq("slug", slug)
      .eq("lang", lang)
      .eq("published", true)
      .maybeSingle();
    if (!article) return res.status(404).json({ error: "文章不存在或未发布" });
    const { data, error } = await adminClient()
      .from("comments")
      .insert({ article_slug: slug, article_lang: lang, author_name, body, approved: true })
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ comment: data });
  }

  if (req.method === "DELETE") {
    const user = await authUserFromRequest(req);
    if (!isOwner(user)) return res.status(401).json({ error: "无权限" });
    const { id } = req.body || {};
    if (!id) return res.status(400).json({ error: "缺少 id" });
    const { error } = await adminClient().from("comments").delete().eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
