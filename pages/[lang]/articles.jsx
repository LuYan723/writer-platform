import Head from "next/head";
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

export default function Articles({ lang, setup, articles = [] }) {
  const site = SITE[lang];
  const ui = UI[lang];
  if (setup) return <SetupNotice isZh={lang === "zh"} />;
  const count = lang === "zh" ? `共收录 ${articles.length} 篇` : `${articles.length} entries`;
  return (
    <>
      <Head>
        <title>{ui.articles} · {site.name}</title>
      </Head>
      <SiteNav lang={lang} active="articles" />
      <main className="page-main">
        <section className="masthead">
          <div className="mast-meta">
            <span>{lang === "zh" ? "文集 / Archive" : "Archive"}</span>
            <span>{count}</span>
            <span>{lang === "zh" ? "随笔 · 解析" : "Essays · Analyses"}</span>
          </div>
          <Reveal>
            <h1 className="display mast-title">{ui.articles}</h1>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mast-copy" style={{ maxWidth: 560, marginTop: 26 }}>
              {lang === "zh" ? "随笔与解析都收在这里，按时间排列，慢慢读。" : "Essays and analyses, filed in order."}
            </p>
          </Reveal>
        </section>
        <section className="shelf" style={{ paddingTop: 10 }}>
          {articles.length ? (
            <div className="ed-list">
              {articles.map((article, index) => (
                <Reveal key={article.slug} delay={Math.min(index * 0.035, 0.18)}>
                  <a className="ed-row" href={`/${lang}/articles/${encodeURIComponent(article.slug)}`}>
                    <span className="ed-index">{String(index + 1).padStart(2, "0")}</span>
                    <span>
                      <span className="ed-title" style={{ display: "block" }}>{article.title}</span>
                      <span className="ed-sub">
                        <span className={article.type === "analysis" ? "ed-type-analysis" : ""}>{typeLabel(lang, article.type)}</span>
                        <span>{formatDate(lang, article.updated_at || article.created_at)}</span>
                      </span>
                    </span>
                    <span className="ed-arrow">→</span>
                  </a>
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="list-empty">{ui.empty}</p>
          )}
        </section>
      </main>
      <SiteFooter lang={lang} />
    </>
  );
}
