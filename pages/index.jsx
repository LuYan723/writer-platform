import Link from "next/link";
import Head from "next/head";
import ThemePalette from "@/components/ThemePalette";
import { SITE } from "@/lib/site";

export default function Landing() {
  const zh = SITE.zh;
  const today = new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });
  return (
    <>
      <Head>
        <title>未名集 · Anonymous Archive</title>
        <meta name="description" content="一名法学出身写作者的写作档案：随笔与法律解析。" />
      </Head>
      <main className="cover" id="main">
        <div className="cover-main">
          <p className="cover-meta">
            <span>A WRITER'S ARCHIVE</span>
            <span>{today}</span>
            <span>VOL. 01</span>
          </p>
          <h1 className="cover-title display">
            <span>{zh.name}</span>
            <span>纸上法学</span>
          </h1>
          <p className="cover-lede">{zh.tagline}</p>
          <p className="landing-login">
            <Link className="text-link" href="/login">站长登录</Link>
          </p>
        </div>
        <div className="cover-side">
          <Link className="door-card" href="/zh" lang="zh-CN">
            <span className="door-index">01 — ZH</span>
            <span className="door-name">进入中文区</span>
            <span className="door-caption">随笔 · 法律解析 · 留言</span>
          </Link>
          <Link className="door-card" href="/en" lang="en">
            <span className="door-index">02 — EN</span>
            <span className="door-name">English</span>
            <span className="door-caption">Essays · Analyses</span>
          </Link>
        </div>
      </main>
      <ThemePalette isZh />
    </>
  );
}
