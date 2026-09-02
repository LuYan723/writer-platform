import Link from "next/link";
import { formatDate, tagList, typeLabel } from "@/lib/article";

export default function ArticleCard({ lang, article }) {
  const tags = tagList(article.tags);
  return (
    <article className="post-card" data-type={article.type}>
      <Link className="post-card-link" href={`/${lang}/articles/${encodeURIComponent(article.slug)}`}>
        <div className="post-meta">
          <time dateTime={article.updated_at || article.created_at}>{formatDate(lang, article.updated_at || article.created_at)}</time>
          <span className={`type-chip chip-${article.type}`}>{typeLabel(lang, article.type)}</span>
        </div>
        <h3 className="post-title display">{article.title}</h3>
        <p className="post-summary">{article.summary}</p>
        {tags.length ? <p className="post-tags">{tags.join(" · ")}</p> : null}
        <span className="post-more">{lang === "zh" ? "阅读" : "Read"}<span aria-hidden="true"> →</span></span>
      </Link>
    </article>
  );
}
