import Head from "next/head";
import ThemePalette from "@/components/ThemePalette";
import AdminPanel from "@/components/AdminPanel";
import SetupNotice from "@/components/SetupNotice";
import { adminClient, authUserFromRequest, HAS_ENV, isOwner } from "@/lib/supabase";
import { sortedArticles } from "@/lib/article";

export async function getServerSideProps(context) {
  if (!HAS_ENV) return { props: { setup: true } };
  const user = await authUserFromRequest(context.req);
  if (!isOwner(user)) {
    return { redirect: { destination: "/login", permanent: false } };
  }
  const lang = context.query.lang === "en" ? "en" : "zh";
  const db = adminClient();
  const { data: articles } = await db.from("articles").select("*").order("updated_at", { ascending: false });
  const { data: comments } = await db.from("comments").select("*").order("created_at", { ascending: false }).limit(100);
  return { props: { setup: false, lang, articles: sortedArticles(articles || []), comments: comments || [] } };
}

export default function Admin({ setup, lang = "zh", articles = [], comments = [] }) {
  const isZh = lang === "zh";
  if (setup) return <SetupNotice isZh={isZh} />;
  return (
    <>
      <Head>
        <title>{isZh ? "写作台" : "Studio"}</title>
      </Head>
      <main className="page-main">
        <div className="admin-layout">
          <AdminPanel lang={lang} articles={articles} comments={comments} isZh={isZh} />
        </div>
      </main>
      <ThemePalette isZh={isZh} />
    </>
  );
}
