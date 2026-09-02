import Head from "next/head";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { SITE } from "@/lib/site";

export async function getServerSideProps(context) {
  return { props: { lang: ["zh", "en"].includes(context.params.lang) ? context.params.lang : "zh" } };
}

export default function About({ lang }) {
  const site = SITE[lang];
  return (
    <>
      <Head>
        <title>{site.name} · {lang === "zh" ? "关于" : "About"}</title>
      </Head>
      <SiteNav lang={lang} active="about" />
      <main className="page-main">
        <section className="page-head about-head">
          <img className="avatar" src={`/assets/img/seal-${lang}.svg`} alt={site.penName} width="112" height="112" />
          <p className="eyebrow">{lang === "zh" ? "关于" : "About"}</p>
          <h1 className="display page-title">{lang === "zh" ? "写作者" : "The Writer"}</h1>
          <p className="lede">{site.tagline}</p>
        </section>
        <section className="section about-body">
          <div className="prose about-prose">
            <p>
              {lang === "zh"
                ? "你好，我是「占位笔名」，一名法学出身的写作者。这里收录随笔与法律文本解析；网站仍在成长，署名与自我介绍会在发布前替换。"
                : "Hello — the placeholder pen name. I am a writer with a background in law; this archive holds essays and close readings. Details will be personalised before launch."}
            </p>
          </div>
          <h2 className="about-subtitle display">{lang === "zh" ? "联系我" : "Contact"}</h2>
          <div className="contact-actions">
            <a className="btn btn-gold" href={`mailto:${site.email}`}>Email</a>
            <a className="btn" href={`https://github.com/${site.github}`} rel="me">GitHub</a>
          </div>
        </section>
      </main>
      <SiteFooter lang={lang} />
    </>
  );
}
