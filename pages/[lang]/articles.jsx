import Head from "next/head";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import ArticleCard from "@/components/ArticleCard";
import SetupNotice from "@/components/SetupNotice";
import { anonClient, HAS_ENV } from "@/lib/supabase";
import { sortedArticles } from "@/lib/article";
import { SITE, UI, TYPE_LABELS } from "@/lib/site";

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
  return (
    <>
      <Head>
        <title>{ui.articles} · {site.name}</title>
      </Head>
      <SiteNav lang={lang} active="articles" />
      <main className="page-main">
        <section className="page-head">
          <p className="eyebrow">{lang === "zh" ? "文集" : "Archive"}</p>
          <h1 className="display page-title">{ui.articles}</h1>
          <p className="page-lede">{lang === "zh" ? "随笔与解析都收在这里。" : "Essays and analyses, filed together."}</p>
        </section>
        <section className="section article-list">
          {articles.length ? (
            <div className="card-grid list-grid">
              {articles.map((article) => (
                <ArticleCard key={article.slug} lang={lang} article={article} />
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
