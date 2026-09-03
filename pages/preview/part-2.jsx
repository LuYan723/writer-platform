import Link from "next/link";
import Head from "next/head";
import WordReveal from "@/components/WordReveal";
import ThemePalette from "@/components/ThemePalette";

export default function PreviewPart2() {
  return (
    <>
      <Head>
        <title>动效预览 · 第二屏</title>
      </Head>
      <nav className="preview-nav">
        <span className="preview-brand">Motion Lab / 第二屏</span>
        <div className="preview-links">
          <Link href="/">回到首页</Link>
          <Link href="/preview">← 回到预览</Link>
        </div>
      </nav>
      <main className="preview-page">
        <section className="demo-block">
          <p className="demo-label">Arrived · 过渡完成</p>
          <h1 className="demo-title">
            <WordReveal text="刚才那条光，就是页面切换的过渡。" />
          </h1>
          <p className="demo-copy">
            现在再点一次下面的链接，观察返回时的扫描光与页面揭开。正式上线时，会用在导航、文章卡片和所有跨页跳转上。
          </p>
          <div className="preview-cta">
            <Link className="btn btn-gold" href="/preview">返回上一屏再看一次</Link>
            <Link className="btn" href="/zh/articles">顺便看看文章列表</Link>
          </div>
        </section>
        <section className="demo-block">
          <p className="demo-label">Variants · 可变强度</p>
          <h2 className="demo-title" style={{ fontSize: "clamp(1.7rem, 3.6vw, 2.8rem)" }}>
            担心太花？同一套效果可以调出三种强度
          </h2>
          <p className="demo-copy">
            A 扫描线淡出（现在这版）· B 只保留顶部进度条 · C 经典淡入淡出。确定方向后，我把正式页面切成你选的那档，并让“减弱动态效果”系统设置自动降为 C。
          </p>
        </section>
      </main>
      <ThemePalette isZh />
    </>
  );
}
