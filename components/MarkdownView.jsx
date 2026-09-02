"use client";

import { useEffect } from "react";

export default function MarkdownView({ html }) {
  useEffect(() => {
    const buttons = Array.from(document.querySelectorAll("[data-lightbox]"));
    if (!buttons.length) return undefined;
    const wrap = document.createElement("div");
    wrap.className = "lightbox";
    wrap.hidden = true;
    wrap.innerHTML =
      '<button type="button" class="lightbox-close" aria-label="Close">×</button>' +
      '<figure><img alt=""><figcaption></figcaption></figure>';
    document.body.appendChild(wrap);
    const img = wrap.querySelector("img");
    const caption = wrap.querySelector("figcaption");
    let index = 0;
    const show = (i) => {
      index = (i + buttons.length) % buttons.length;
      const btn = buttons[index];
      img.src = btn.dataset.src;
      img.alt = btn.querySelector("img")?.alt || "";
      caption.textContent = btn.dataset.caption || "";
      wrap.hidden = false;
      document.body.classList.add("lightbox-open");
      wrap.querySelector(".lightbox-close").focus();
    };
    const close = () => {
      wrap.hidden = true;
      document.body.classList.remove("lightbox-open");
    };
    buttons.forEach((btn, i) => btn.addEventListener("click", () => show(i)));
    wrap.querySelector(".lightbox-close").addEventListener("click", close);
    wrap.addEventListener("click", (e) => {
      if (e.target === wrap) close();
    });
    const onKey = (e) => {
      if (!wrap.hidden && e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      wrap.remove();
    };
  }, [html]);
  return <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />;
}
