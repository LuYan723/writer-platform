/* 把 ../personal-site/content 里的示例文章导入 Supabase。
   运行前先配置 .env.local，然后：npm run seed */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { renderMarkdown } from "../lib/markdown.js";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const source = resolve(root, "../personal-site/content");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("缺少环境变量。请先复制 .env.example 为 .env.local 并填好 Supabase 配置。");
  process.exit(1);
}
if (!existsSync(source)) {
  console.log("没有找到 ../personal-site/content，跳过导入。");
  process.exit(0);
}

function parseFrontmatter(raw) {
  if (!raw.startsWith("---")) return [{}, raw];
  const end = raw.indexOf("\n---", 3);
  if (end === -1) return [{}, raw];
  const head = raw.slice(3, end).trim();
  const body = raw.slice(end + 4).trim();
  const meta = {};
  for (const line of head.split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (value.startsWith("[") && value.endsWith("]")) {
      value = value.slice(1, -1).split(",").map((v) => v.trim().replace(/^['"]|['"]$/g, "")).join(", ");
    } else {
      value = value.replace(/^["']|["']$/g, "");
    }
    meta[key] = value;
  }
  return [meta, body];
}

const client = createClient(url, key, { auth: { persistSession: false } });
const rows = [];
for (const lang of ["zh", "en"]) {
  const folder = resolve(source, lang, "articles");
  if (!existsSync(folder)) continue;
  for (const file of readdirSync(folder).filter((f) => f.endsWith(".md"))) {
    const raw = readFileSync(resolve(folder, file), "utf-8");
    const [meta, body] = parseFrontmatter(raw);
    if (!meta.title) continue;
    rows.push({
      slug: file.replace(/\.md$/, ""),
      lang,
      type: meta.type === "analysis" ? "analysis" : "essay",
      title: meta.title,
      summary: meta.summary || "",
      body,
      body_html: renderMarkdown(body),
      tags: meta.tags || "",
      published: true,
      updated_at: new Date(`${meta.date}T12:00:00`).toISOString()
    });
  }
}
if (!rows.length) {
  console.log("没有可导入的文章。");
  process.exit(0);
}
const { error } = await client.from("articles").upsert(rows, { onConflict: "slug,lang" });
if (error) {
  console.error("导入失败：", error.message);
  process.exit(1);
}
console.log(`已导入 ${rows.length} 篇文章。`);
