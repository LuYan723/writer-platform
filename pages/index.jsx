import Link from "next/link";
import Head from "next/head";
import ThemePalette from "@/components/ThemePalette";
import { SITE } from "@/lib/site";

export default function Landing() {
  const zh = SITE.zh;
  return (
    <>
      <Head>
        <title>未名集 · Anonymous Archive</title>
        <meta name="description" content="一名法学出身写作者的写作档案：随笔与法律解析。" />
      </Head>
      <main className="landing-main" id="main">
        <div className="landing-inner">
          <p className="eyebrow">A WRITER'S ARCHIVE · 写作者个人档案</p>
          <h1 className="landing-title display">{zh.name}</h1>
          <p className="landing-tagline">{zh.tagline}</p>
          <div className="doors">
            <Link className="btn btn-gold" href="/zh" lang="zh-CN">进入中文区</Link>
            <Link className="btn" href="/en" lang="en">Enter English</Link>
          </div>
        </div>
      </main>
      <ThemePalette isZh />
    </>
  );
}
