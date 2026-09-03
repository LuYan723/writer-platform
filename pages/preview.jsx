import Link from "next/link";
import Head from "next/head";
import WordReveal from "@/components/WordReveal";
import QuoteRail from "@/components/QuoteRail";
import ThemePalette from "@/components/ThemePalette";

const quotes = [
  {
    text: "好的写作不是给出答案，而是把问题描述得足够准确。",
    name: "读者 一",
    role: "匿名留言"
  },
  {
    text: "读判决书读久了，会对叙述产生敬畏：同一个事实，换一种讲法，责任归属就完全颠倒。",
    name: "读者 二",
    role: "文章留言"
  },
  {
    text: "真正的难从来不是有没有感情，而是感情能不能经得起一句追问：依据是什么。",
    name: "读者 三",
    role: "文章留言"
  }
];

export default function Preview() {
  return (
    <>
      <Head>
        <title>动效预览 · Motion Preview</title>
      </Head>
      <nav className="preview-nav">
        <span className="preview-brand">Motion Lab / 动效预览</span>
        <div className="preview-links">
          <Link href="/">回到首页</Link>
          <Link href="/preview/part-2">体验页面过渡 →</Link>
        </div>
      </nav>
      <main className="preview-page">
        <section className="demo-block">
          <p className="demo-label">01 · Word Reveal</p>
          <h1 className="demo-title">
            <WordReveal text="逐字显现，是书写该有的节奏。" shimmer />
          </h1>
          <p className="demo-copy">
            <WordReveal text="每一个词从轻微的虚化中站稳，像墨水在纸上干透。中文字逐字、英文按词，节奏可调。" />
          </p>
        </section>

        <section className="demo-block">
          <p className="demo-label">02 · Reader Comments Rail</p>
          <h2 className="demo-title" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>
            留言不排队，像翻页一样浏览
          </h2>
          <p className="demo-copy">可自动轮播、左右拖拽、点小圆点跳转；悬停暂停。</p>
          <div style={{ marginTop: 26 }}>
            <QuoteRail quotes={quotes} isZh />
          </div>
        </section>

        <section className="demo-block">
          <p className="demo-label">03 · Route Transition</p>
          <h2 className="demo-title" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>
            点下去，页面像被光扫过再揭开
          </h2>
          <p className="demo-copy">这个效果已挂在全站路由上。点下面的按钮体验一次真实跳转（顶部也会出现金色进度条）。</p>
          <div className="preview-cta">
            <Link className="btn btn-gold" href="/preview/part-2">进入第二个预览页</Link>
            <Link className="btn" href="/zh">跳去中文区首页</Link>
          </div>
        </section>
      </main>
      <ThemePalette isZh />
    </>
  );
}
