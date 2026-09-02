import Head from "next/head";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import ArticleCard from "@/components/ArticleCard";
import SetupNotice from "@/components/SetupNotice";
import { anonClient, HAS_ENV } from "@/lib/supabase";
import { formatDate, sortedArticles } from "@/lib/article";
import { SITE, UI } from "@/lib/site";

export async function getServerSideProps(context) {
  const lang = ["zh", "en"].includes(context.params.lang) ? context.params.lang : "zh";
  if (!HAS_ENV) return { props: { lang, setup: true } };
  const { data } = await anonClient()
    .from("articles")
    .select("*")
    .eq("lang", lang)
    .eq("published", true)
    .order("updated_at", { ascending: false });
  return { props: { lang, setup: false, articles: sortedArticles(data || []) } };
}

export default function Home({ lang, setup, articles = [] }) {
  const site = SITE[lang];
  const ui = UI[lang];
  if (setup) {
    return (
      <main className="page-main">
        <SetupNotice isZh={lang === "zh"} />
      </main>
    );
  }
  const featured = articles.slice(0, 3);
  return (
    <>
      <Head>
        <title>{site.name}</title>
        <meta name="description" content={site.tagline} />
      </Head>
      <SiteNav lang={lang} active="home" />
      <main className="page-main">
        <section className="hero zone-hero">
          <p className="eyebrow">{site.zoneLabel} · {site.penName}</p>
          <h1 className="display hero-title">{site.name}</h1>
          <p className="lede">{site.tagline}</p>
          <p className="hero-intro">{site.intro}</p>
          <div className="hero-actions">
            <Link className="btn btn-gold" href={`/${lang}/articles`}>{ui.readArticles}</Link>
            <Link className="btn" href={`/${lang}/about`}>{ui.about}</Link>
          </div>
        </section>
        {featured.length ? (
          <section className="section section-featured">
            <header className="section-head">
              <p className="eyebrow">{ui.featured}</p>
              <h2 className="section-title display">{ui.featuredTitle}</h2>
            </header>
            <div className="card-grid">
              {featured.map((article) => (
                <ArticleCard key={article.slug} lang={lang} article={article} />
              ))}
            </div>
            <p className="section-more">
              <Link className="text-link" href={`/${lang}/articles`}>{ui.viewAll}<span aria-hidden="true"> →</span></Link>
            </p>
          </section>
        ) : null}
        <section className="section section-timeline">
          <header className="section-head">
            <p className="eyebrow">{lang === "zh" ? "更新" : "Updates"}</p>
            <h2 className="section-title display">{ui.latestTitle}</h2>
          </header>
          {articles.length ? (
            <ol className="timeline">
              {articles.slice(0, 5).map((article) => (
                <li className="timeline-item" key={article.slug}>
                  <time dateTime={article.updated_at || article.created_at}>{formatDate(lang, article.updated_at || article.created_at)}</time>
                  <Link href={`/${lang}/articles/${encodeURIComponent(article.slug)}`}>{article.title}</Link>
                </li>
              ))}
            </ol>
          ) : (
            <p className="list-empty">{ui.empty}</p>
          )}
        </section>
      </main>
      <SiteFooter lang={lang} />
    </>
  );
}
