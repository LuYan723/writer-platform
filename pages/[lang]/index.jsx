import Head from "next/head";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import SetupNotice from "@/components/SetupNotice";
import { Reveal } from "@/components/MotionKit";
import { anonClient, HAS_ENV } from "@/lib/supabase";
import { formatDate, sortedArticles, typeLabel } from "@/lib/article";
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
  const now = new Date();
  const today = now.toLocaleDateString(lang === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: lang === "zh" ? "long" : "long",
    day: "numeric"
  });
  const lead = articles[0];
  const secondary = articles.slice(1, 3);
  const timeline = articles.slice(0, 6);
  return (
    <>
      <Head>
        <title>{site.name}</title>
        <meta name="description" content={site.tagline} />
      </Head>
      <SiteNav lang={lang} active="home" />
      <main className="page-main">
        <section className="masthead">
          <div className="mast-meta">
            <span>{site.zoneLabel} · {site.penName}</span>
            <span>{today}</span>
            <span>{lang === "zh" ? `第 ${String(articles.length).padStart(2, "0")} 篇` : `VOL ${String(articles.length).padStart(2, "0")}`}</span>
          </div>
          <Reveal>
            <h1 className="display mast-title">{site.name}</h1>
          </Reveal>
          <div className="mast-grid">
            <Reveal delay={0.08}>
              <p className="mast-copy">
                {site.tagline ? <span>{site.tagline} </span> : null}
                <strong>{site.intro}</strong>
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="mast-actions">
                <Link className="btn btn-gold" href={`/${lang}/articles`}>{ui.readArticles}</Link>
                <Link className="btn" href={`/${lang}/about`}>{ui.about}</Link>
              </div>
            </Reveal>
          </div>
        </section>
        {articles.length ? (
          <section className="shelf">
            <Reveal>
              <header className="shelf-head">
                <div>
                  <p className="rule">{lang === "zh" ? "本期推荐" : "This Issue"}</p>
                  <h2 className="shelf-title display">{ui.featuredTitle}</h2>
                </div>
                <Link className="text-link" href={`/${lang}/articles`}>{ui.viewAll} →</Link>
              </header>
            </Reveal>
            <Reveal delay={0.06}>
              <div className="feature-wrap">
                <Link className="feature" href={`/${lang}/articles/${encodeURIComponent(lead.slug)}`}>
                  <div className="feature-copy">
                    <p className="feature-kicker">
                      <span>{typeLabel(lang, lead.type)}</span>
                      <span>{formatDate(lang, lead.updated_at || lead.created_at)}</span>
                    </p>
                    <h2 className="feature-title display">{lead.title}</h2>
                    <p className="feature-summary">{lead.summary}</p>
                    <span className="feature-read">{ui.readMore ? "阅读全文" : "Read"} →</span>
                  </div>
                  <div className="feature-panel" aria-hidden="true">
                    <span className="feature-seal">{(lang === "zh" ? lead.title : lead.title).slice(0, 1)}</span>
                    <span className="feature-seal-sub">{site.name}</span>
                  </div>
                </Link>
              </div>
            </Reveal>
            {secondary.length ? (
              <div className="feature-sub" style={{ marginTop: 18 }}>
                {secondary.map((article, index) => (
                  <Reveal key={article.slug} delay={0.08 * (index + 1)}>
                    <Link className="ed-row" style={{ border: "1px solid var(--line)", padding: 18 }} href={`/${lang}/articles/${encodeURIComponent(article.slug)}`}>
                      <span className="ed-index">0{index + 2}</span>
                      <span>
                        <span className="ed-title" style={{ display: "block" }}>{article.title}</span>
                        <span className="ed-sub">
                          <span>{typeLabel(lang, article.type)}</span>
                          <span>{formatDate(lang, article.updated_at || article.created_at)}</span>
                        </span>
                      </span>
                      <span className="ed-arrow">→</span>
                    </Link>
                  </Reveal>
                ))}
              </div>
            ) : null}
          </section>
        ) : (
          <section className="shelf"><p className="list-empty">{ui.empty}</p></section>
        )}
        {timeline.length ? (
          <section className="shelf" style={{ paddingTop: 20 }}>
            <Reveal>
              <header className="shelf-head">
                <div>
                  <p className="rule">{lang === "zh" ? "归档索引" : "Archive Index"}</p>
                  <h2 className="shelf-title display">{ui.latestTitle}</h2>
                </div>
              </header>
            </Reveal>
            <div className="ed-list">
              {timeline.map((article, index) => (
                <Reveal key={article.slug} delay={Math.min(index * 0.04, 0.2)}>
                  <Link className="ed-row" href={`/${lang}/articles/${encodeURIComponent(article.slug)}`}>
                    <span className="ed-index">{String(index + 1).padStart(2, "0")}</span>
                    <span>
                      <span className="ed-title" style={{ display: "block" }}>{article.title}</span>
                      <span className="ed-sub">
                        <span className={article.type === "analysis" ? "ed-type-analysis" : ""}>{typeLabel(lang, article.type)}</span>
                        <span>{formatDate(lang, article.updated_at || article.created_at)}</span>
                      </span>
                    </span>
                    <span className="ed-arrow">→</span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>
        ) : null}
        <section className="quote-band">
          <Reveal>
            <blockquote>“{lang === "zh" ? "写作是缓慢的自我审判" : "Writing is a slow self-examination"}。”</blockquote>
            <footer>— {site.penName}</footer>
          </Reveal>
        </section>
      </main>
      <SiteFooter lang={lang} />
    </>
  );
}
