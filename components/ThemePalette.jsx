"use client";

import { useEffect, useRef, useState } from "react";

const PALETTES = [
  { id: "noir-gold", zh: "黑金律政", en: "Noir Gold", colors: ["#c9a86a", "#5fd4c8", "#8f7ae5"] },
  { id: "paper-cinnabar", zh: "宣纸朱砂", en: "Paper & Cinnabar", colors: ["#b03c27", "#1d7f74", "#67409b"] },
  { id: "navy-lantern", zh: "夜航青灯", en: "Navy Lantern", colors: ["#d5a65a", "#61d4cc", "#8f9bff"] },
  { id: "celadon-night", zh: "青瓷夜雨", en: "Celadon Night", colors: ["#a6cbb0", "#7dd6bf", "#b08ad8"] },
  { id: "cyber-pulse", zh: "赛博脉冲", en: "Cyber Pulse", colors: ["#d5a1ff", "#4fe0d1", "#7f8bff"] },
  { id: "moon-blue", zh: "月白墨蓝", en: "Moon & Ink", colors: ["#35608f", "#1c8277", "#7a45ac"] }
];

const KEY = "writer-palette";

function luminance(hex) {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const rgb = [0, 2, 4].map((i) => {
    const v = parseInt(h.substr(i, 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

function mix(color, toward, weight) {
  return `color-mix(in srgb, ${color} ${Math.round((1 - weight) * 100)}%, ${toward})`;
}

export default function ThemePalette({ isZh }) {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const stateRef = useRef({ palette: "noir-gold" });
  const [inputs, setInputs] = useState({ accent: "#c9a86a", a2: "#5fd4c8", a3: "#8f7ae5" });

  const apply = (next) => {
    const root = document.documentElement;
    root.setAttribute("data-palette", next.palette);
    ["--accent", "--accent-strong", "--accent-deep", "--a2", "--a3", "--on-accent", "--grad-title"].forEach((name) =>
      root.style.removeProperty(name)
    );
    if (next.custom) {
      const mode = getComputedStyle(root).getPropertyValue("--mode").trim();
      const light = mode === "light";
      const accent = next.custom.accent;
      const strong = mix(accent, light ? "#14100a" : "#ffffff", light ? 0.28 : 0.34);
      const deep = mix(accent, "#000000", 0.36);
      root.style.setProperty("--accent", accent);
      root.style.setProperty("--accent-strong", strong);
      root.style.setProperty("--accent-deep", deep);
      root.style.setProperty("--a2", next.custom.a2);
      root.style.setProperty("--a3", next.custom.a3);
      root.style.setProperty("--on-accent", luminance(accent) > 0.42 ? "#14100a" : "#f7f3ea");
      root.style.setProperty("--grad-title", `linear-gradient(100deg, ${strong}, ${accent} 55%, ${deep})`);
    }
    stateRef.current = next;
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch (e) {
      /* ignore */
    }
  };

  useEffect(() => {
    let saved = { palette: "noir-gold" };
    try {
      saved = JSON.parse(localStorage.getItem(KEY) || "{}");
      if (!saved.palette) saved = { palette: "noir-gold" };
    } catch (e) {
      /* ignore */
    }
    apply(saved);
    if (saved.custom) setInputs(saved.custom);
    else {
      const cs = getComputedStyle(document.documentElement);
      setInputs({
        accent: cs.getPropertyValue("--accent").trim() || "#c9a86a",
        a2: cs.getPropertyValue("--a2").trim() || "#5fd4c8",
        a3: cs.getPropertyValue("--a3").trim() || "#8f7ae5"
      });
    }
    setReady(true);
  }, []);

  const choose = (id) => apply({ palette: id });
  const changeCustom = (field, value) => {
    const base = stateRef.current.palette || "noir-gold";
    const custom = { ...inputs, [field]: value };
    setInputs(custom);
    apply({ palette: base, custom });
  };
  const reset = () => {
    setInputs({ accent: "#c9a86a", a2: "#5fd4c8", a3: "#8f7ae5" });
    apply({ palette: "noir-gold" });
  };

  return (
    <div className="theme-widget">
      <button
        type="button"
        className="theme-toggle"
        aria-expanded={open}
        aria-label={isZh ? "主题配色" : "Theme"}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="theme-dot" aria-hidden="true" />
      </button>
      {open ? (
        <section className="theme-panel" aria-label={isZh ? "主题配色" : "Theme"}>
          <header className="theme-head">
            <h2>{isZh ? "主题配色" : "Theme"}</h2>
            <button type="button" className="theme-close" aria-label={isZh ? "关闭" : "Close"} onClick={() => setOpen(false)}>
              ×
            </button>
          </header>
          <p className="theme-hint">{isZh ? "选择会保存在这台设备上。" : "Your choice stays on this device."}</p>
          <div className="palette-grid">
            {PALETTES.map((p) => {
              const current = stateRef.current;
              const active = ready && current.palette === p.id && !current.custom;
              return (
                <button
                  key={p.id}
                  type="button"
                  className="palette-btn"
                  aria-pressed={active}
                  onClick={() => choose(p.id)}
                >
                  <span className="palette-swatch" aria-hidden="true">
                    {p.colors.map((c) => (
                      <span key={c} style={{ background: c }} />
                    ))}
                  </span>
                  {isZh ? p.zh : p.en}
                </button>
              );
            })}
          </div>
          <div className="custom-theme">
            <h3>{isZh ? "自定义调色" : "Custom palette"}</h3>
            <div className="custom-controls">
              <label>
                {isZh ? "主色" : "Primary"}
                <input type="color" value={inputs.accent} onChange={(e) => changeCustom("accent", e.target.value)} />
              </label>
              <label>
                {isZh ? "点缀一" : "Accent 1"}
                <input type="color" value={inputs.a2} onChange={(e) => changeCustom("a2", e.target.value)} />
              </label>
              <label>
                {isZh ? "点缀二" : "Accent 2"}
                <input type="color" value={inputs.a3} onChange={(e) => changeCustom("a3", e.target.value)} />
              </label>
            </div>
            <button type="button" className="text-btn" onClick={reset}>
              {isZh ? "恢复默认配色" : "Reset to default"}
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
