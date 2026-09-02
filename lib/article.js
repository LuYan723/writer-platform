import { TYPE_LABELS } from "./site";

export function typeLabel(lang, type) {
  return TYPE_LABELS[lang]?.[type] || type;
}

export function formatDate(lang, value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  if (lang === "zh") {
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  }
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function readingMinutes(body) {
  const zh = String(body || "").match(/[\u4e00-\u9fff]/g)?.length || 0;
  const words = String(body || "").match(/[A-Za-z0-9]+/g)?.length || 0;
  return Math.max(1, Math.round(zh / 340 + words / 200));
}

export function sortedArticles(rows) {
  return (rows || []).sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at));
}

export function tagList(tags) {
  return String(tags || "")
    .split(/[,，]/)
    .map((t) => t.trim())
    .filter(Boolean);
}
