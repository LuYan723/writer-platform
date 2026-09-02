/* 与 build.py 相同规则的轻量 Markdown 渲染器（Node/浏览器通用）。
   支持：标题、段落、粗斜体、代码、列表、表格、引用，
   以及 :::
     quote  / point / gallery
   ::: 自定义块。 */

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inline(text) {
  let out = escapeHtml(text);
  const codes = [];
  out = out.replace(/`([^`]+)`/g, (_m, code) => {
    const key = `\u0000${codes.length}\u0001`;
    codes.push(`<code>${code}</code>`);
    return key;
  });
  out = out.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_m, alt, url) => `<img src="${escapeHtml(url)}" alt="${alt}" loading="lazy">`);
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label, url) => `<a href="${escapeHtml(url)}">${label}</a>`);
  out = out.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/__([^_\n]+)__/g, "<strong>$1</strong>");
  out = out.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, "<em>$1</em>");
  out = out.replace(/\u0000(\d+)\u0001/g, (_m, i) => codes[Number(i)]);
  return out;
}

function renderList(lines) {
  const items = lines.map((raw) => {
    const m = raw.match(/^(\s*)([-*+]|\d+\.)\s+(.*)$/);
    return { indent: m[1].replace(/\t/g, "    ").length, ordered: m[2].endsWith("."), text: m[3] };
  });
  let html = "";
  let i = 0;

  function consume(indent) {
    let tag = null;
    let lis = [];
    const close = () => {
      if (lis.length) html += `<${tag}>${lis.join("")}</${tag}>`;
      lis = [];
      tag = null;
    };
    while (i < items.length) {
      const item = items[i];
      if (item.indent < indent) break;
      if (item.indent === indent) {
        close();
        tag = item.ordered ? "ol" : "ul";
        let inner = inline(item.text);
        if (i + 1 < items.length && items[i + 1].indent > indent) {
          i += 1;
          inner += consume(items[i].indent);
        }
        lis.push(`<li>${inner}</li>`);
        i += 1;
      } else {
        i += 1;
      }
    }
    close();
  }

  consume(items[0].indent);
  return html;
}

function renderTable(lines) {
  if (lines.length < 2) return "";
  const split = (line) => line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((s) => s.trim());
  const divider = split(lines[1]);
  if (!divider.every((cell) => /^:?-{2,}:?$/.test(cell || "-"))) return "";
  const head = split(lines[0]);
  const body = lines.slice(2).map(split);
  let html = '<div class="table-wrap"><table><thead><tr>';
  head.forEach((cell) => { html += `<th>${inline(cell)}</th>`; });
  html += "</tr></thead><tbody>";
  body.forEach((row) => {
    html += "<tr>";
    row.forEach((cell) => { html += `<td>${inline(cell)}</td>`; });
    html += "</tr>";
  });
  html += "</tbody></table></div>";
  return html;
}

function renderPlain(text) {
  if (!text) return "";
  const out = [];
  const lines = text.replace(/\r/g, "").split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const stripped = line.trim();
    if (!stripped) { i += 1; continue; }

    const heading = stripped.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      out.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      i += 1;
      continue;
    }
    if (/^([-*_])\1{2,}$/.test(stripped)) { out.push("<hr>"); i += 1; continue; }
    if (stripped.startsWith(">")) {
      const quotes = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quotes.push(lines[i].replace(/^\s*>\s?/, ""));
        i += 1;
      }
      out.push(`<blockquote>${renderPlain(quotes.join("\n"))}</blockquote>`);
      continue;
    }
    if (/^\s*(?:[-*+]|\d+\.)\s+/.test(stripped)) {
      const list = [];
      while (i < lines.length && /^\s*(?:[-*+]|\d+\.)\s+/.test(lines[i])) {
        list.push(lines[i]);
        i += 1;
      }
      out.push(renderList(list));
      continue;
    }
    if (stripped.startsWith("|")) {
      const table = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        table.push(lines[i]);
        i += 1;
      }
      out.push(renderTable(table));
      continue;
    }
    const paragraph = [];
    while (i < lines.length && lines[i].trim()) {
      const next = lines[i];
      if (/^\s*(?:#{1,6}\s|[-*+]|\d+\.\s|>|\|)/.test(next)) break;
      paragraph.push(next);
      i += 1;
    }
    out.push(`<p>${inline(paragraph.join(" "))}</p>`);
  }
  return out.join("\n");
}

function renderGallery(label, body) {
  const rows = body
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("|").map((s) => s.trim());
      return { src: parts[0], alt: parts[1] || "", caption: parts[2] || "" };
    });
  if (!rows.length) return "";
  const cells = rows
    .map(
      (row) =>
        `<button type="button" class="gallery-btn" data-lightbox data-src="${escapeHtml(row.src)}" data-caption="${escapeHtml(row.caption || row.alt)}"><img src="${escapeHtml(row.src)}" alt="${escapeHtml(row.alt)}" loading="lazy"></button>`
    )
    .join("");
  const caption = label ? `<figcaption>${escapeHtml(label)}</figcaption>` : "";
  return `<figure class="rich gallery">${caption}<div class="gallery-grid">${cells}</div></figure>`;
}

export function renderMarkdown(source) {
  if (!source) return "";
  const out = [];
  const lines = String(source).replace(/\r/g, "").split("\n");
  let buffer = [];
  let i = 0;

  const flush = () => {
    if (buffer.length) {
      out.push(renderPlain(buffer.join("\n")));
      buffer = [];
    }
  };

  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith(":::")) {
      flush();
      const rest = line.slice(3).trim();
      const kind = rest.split(/\s/, 1)[0];
      const label = rest.slice(kind.length).trim();
      const body = [];
      i += 1;
      while (i < lines.length && lines[i].trim() !== ":::") {
        body.push(lines[i]);
        i += 1;
      }
      i += 1;
      if (kind === "quote") {
        out.push(`<figure class="rich cite-card"><figcaption>${escapeHtml(label || "引用")}</figcaption><blockquote>${renderMarkdown(body.join("\n"))}</blockquote></figure>`);
      } else if (kind === "point") {
        const head = label ? `<h4>${escapeHtml(label)}</h4>` : "";
        out.push(`<aside class="rich callout"><span class="callout-mark" aria-hidden="true">!</span><div class="callout-inner">${head}${renderMarkdown(body.join("\n"))}</div></aside>`);
      } else if (kind === "gallery") {
        out.push(renderGallery(label, body.join("\n")));
      } else {
        out.push(renderPlain(body.join("\n")));
      }
    } else {
      buffer.push(line);
      i += 1;
    }
  }
  flush();
  return out.join("\n");
}
