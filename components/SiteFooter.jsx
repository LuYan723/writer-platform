import { SITE } from "@/lib/site";

export default function SiteFooter({ lang, isAdmin }) {
  const site = SITE[lang];
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <p className="footer-brand">
          <span className="brand-seal" aria-hidden="true">{lang === "zh" ? "未" : "A"}</span>
          {site.name}
        </p>
        <p className="footer-note">
          © <span>{new Date().getFullYear()}</span> {site.penName}
        </p>
        <p className="footer-meta">
          {isAdmin ? (lang === "zh" ? "开发者模式" : "Developer mode") : null}{" "}
          {lang === "zh" ? "手写写作平台 · Next.js + Supabase" : "A hand-built writing platform · Next.js + Supabase"}
        </p>
      </div>
    </footer>
  );
}
