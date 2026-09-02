"use client";

import { useState } from "react";
import Link from "next/link";
import ThemePalette from "./ThemePalette";
import { SITE, UI } from "@/lib/site";

export default function SiteNav({ lang, active }) {
  const [openMenu, setOpenMenu] = useState(false);
  const site = SITE[lang];
  const ui = UI[lang];
  const other = lang === "zh" ? "en" : "zh";
  const nav = [
    ["home", ui.home, `/${lang}`],
    ["articles", ui.articles, `/${lang}/articles`],
    ["about", ui.about, `/${lang}/about`]
  ];
  return (
    <>
      <header className="site-nav">
        <div className="nav-inner">
          <Link className="brand" href={`/${lang}`}>
            <span className="brand-seal" aria-hidden="true">{lang === "zh" ? "未" : "A"}</span>
            <span className="brand-name">{site.name}</span>
          </Link>
          <nav className={openMenu ? "nav-links open" : "nav-links"} aria-label={ui.articles}>
            {nav.map(([key, label, href]) => (
              <Link key={key} className={active === key ? "nav-link active" : "nav-link"} href={href}>
                {label}
              </Link>
            ))}
            <Link className="nav-link lang-switch" href={`/${other}`} lang={other === "en" ? "en" : "zh-CN"}>
              {ui.switchZone}
            </Link>
          </nav>
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={openMenu}
            onClick={() => setOpenMenu((v) => !v)}
          >
            <span aria-hidden="true" />
          </button>
        </div>
      </header>
      <ThemePalette isZh={lang === "zh"} />
    </>
  );
}
