"use client";

import { useEffect, useRef, useState } from "react";

export default function QuoteRail({ quotes, isZh }) {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function scrollTo(i) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: i * track.clientWidth, behavior: reduce ? "auto" : "smooth" });
    setIndex(i);
  }

  function step(dir) {
    const track = trackRef.current;
    if (!track) return;
    const next = (index + dir + quotes.length) % quotes.length;
    scrollTo(next);
  }

  useEffect(() => {
    if (reduce || paused) return undefined;
    const timer = window.setInterval(() => step(1), 4200);
    return () => window.clearInterval(timer);
  }, [index, paused, reduce]);

  return (
    <div
      className="quote-rail"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="quote-track" ref={trackRef} aria-live="polite">
        {quotes.map((quote, i) => (
          <figure className="quote-slide" key={i}>
            <blockquote>“{quote.text}”</blockquote>
            <figcaption>
              <span className="quote-avatar" aria-hidden="true">{quote.name.slice(0, 1)}</span>
              <span>{quote.name}</span>
              <span className="quote-role">{quote.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="quote-controls">
        {quotes.map((_, i) => (
          <button
            key={i}
            type="button"
            className={i === index ? "quote-dot active" : "quote-dot"}
            aria-label={isZh ? `第 ${i + 1} 条` : `Quote ${i + 1}`}
            aria-current={i === index}
            onClick={() => scrollTo(i)}
          />
        ))}
        <div className="quote-arrows">
          <button type="button" aria-label={isZh ? "上一条" : "Previous"} onClick={() => step(-1)}>←</button>
          <button type="button" aria-label={isZh ? "下一条" : "Next"} onClick={() => step(1)}>→</button>
        </div>
      </div>
    </div>
  );
}
