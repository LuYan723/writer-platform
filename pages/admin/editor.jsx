import Head from "next/head";
import Link from "next/link";
import ThemePalette from "@/components/ThemePalette";
import EditorForm from "@/components/EditorForm";
import SetupNotice from "@/components/SetupNotice";
import { adminClient, authUserFromRequest, HAS_ENV, isOwner } from "@/lib/supabase";

export async function getServerSideProps(context) {
  if (!HAS_ENV) return { props: { setup: true, lang: "zh" } };
  const user = await authUserFromRequest(context.req);
  if (!isOwner(user)) return { redirect: { destination: "/login", permanent: false } };
  const lang = context.query.lang === "en" ? "en" : "zh";
  const slug = context.query.slug;
  let initial = null;
  if (slug) {
    const { data } = await adminClient()
      .from("articles")
      .select("*")
      .eq("slug", String(slug))
      .eq("lang", lang)
      .maybeSingle();
    initial = data;
  }
  return { props: { setup: false, lang, initial } };
}

export default function Editor({ setup, lang = "zh", initial }) {
  const isZh = lang === "zh";
  if (setup) return <SetupNotice isZh={isZh} />;
  return (
    <>
      <Head>
        <title>{isZh ? "写作台 · 编辑" : "Studio · Editor"}</title>
      </Head>
      <main className="page-main">
        <div className="admin-layout">
          <p>
            <Link className="text-link" href={`/admin?lang=${lang}`}>← {isZh ? "写作台" : "Studio"}</Link>
          </p>
          <h1 className="display page-title" style={{ marginTop: 8 }}>
            {initial ? (isZh ? "编辑文章" : "Edit article") : (isZh ? "写新文章" : "New article")}
          </h1>
          <EditorForm lang={lang} isZh={isZh} initial={initial} backUrl={`/admin?lang=${lang}`} />
        </div>
      </main>
      <ThemePalette isZh={isZh} />
    </>
  );
}
