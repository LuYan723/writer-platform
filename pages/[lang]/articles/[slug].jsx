import Head from "next/head";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import MarkdownView from "@/components/MarkdownView";
import Comments from "@/components/Comments";
import SetupNotice from "@/components/SetupNotice";
import { anonClient, HAS_ENV } from "@/lib/supabase";
import { formatDate, readingMinutes, typeLabel } from "@/lib/article";
import { SITE, UI } from "@/lib/site";

export async function getServerSideProps(context) {
  const lang = ["zh", "en"].includes(context.params.lang) ? context.params.lang : "zh";
  if (!HAS_ENV) return { props: { lang, setup: true } };
  const slug = decodeURIComponent(context.params.slug);
  const { data } = await anonClient()
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("lang", lang)
    .eq("published", true)
    .maybeSingle();
  if (!data) return { notFound: true };
  return { props: { lang, setup: false, article: data } };
}

export default function ArticlePage({ lang, setup, article }) {
  const site = SITE[lang];
  const ui = UI[lang];
  if (setup) return <SetupNotice isZh={lang === "zh"} />;
  return (
    <>
      <Head>
        <title>{article.title} · {site.name}</title>
        <meta name="description" content={article.summary} />
      </Head>
      <SiteNav lang={lang} active="articles" />
      <div className="read-progress" id="readProgress" aria-hidden="true" />
      <main className="page-main">
        <article className="article-page">
          <header className="article-head">
            <nav className="crumbs" aria-label={ui.articles}>
              <Link href={`/${lang}/articles`}>{ui.articles}</Link>
              <span aria-hidden="true">/</span>
              <span>{typeLabel(lang, article.type)}</span>
            </nav>
            <div className="article-meta">
              <span className={`type-chip chip-${article.type}`}>{typeLabel(lang, article.type)}</span>
              <time dateTime={article.updated_at || article.created_at}>{formatDate(lang, article.updated_at || article.created_at)}</time>
              <span aria-hidden="true">·</span>
              <span>{lang === "zh" ? `约 ${readingMinutes(article.body)} 分钟阅读` : `${readingMinutes(article.body)} min read`}</span>
            </div>
            <h1 className="display article-title">{article.title}</h1>
            {article.summary ? <p className="article-lead">{article.summary}</p> : null}
          </header>
          <MarkdownView html={article.body_html} />
          <footer className="article-foot">
            <p className="section-more">
              <Link className="text-link" href={`/${lang}/articles`}>← {ui.backArticles}</Link>
            </p>
          </footer>
          <Comments slug={article.slug} lang={lang} isZh={lang === "zh"} />
        </article>
      </main>
      <SiteFooter lang={lang} />
    </>
  );
}
