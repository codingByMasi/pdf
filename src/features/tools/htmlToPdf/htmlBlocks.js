// Safely reads an HTML page into plain blocks (headings, paragraphs, lists, tables). Nothing runs and nothing loads.
const DROP = new Set(['script', 'style', 'iframe', 'object', 'embed', 'noscript', 'template', 'svg', 'canvas', 'head', 'link', 'meta', 'title',
  'form', 'input', 'button', 'select', 'textarea', 'audio', 'video', 'img', 'picture', 'map']);
const BLOCKS = new Set(['p', 'div', 'section', 'article', 'header', 'footer', 'main', 'nav', 'aside', 'figure', 'figcaption', 'address', 'dl', 'dt', 'dd', 'details', 'summary', 'fieldset']);
const BOLD = new Set(['b', 'strong', 'th']);
const MAX_BLOCKS = 20000;

function clean(text) {
  return text.replace(/\s+/g, ' ');
}

// Walks the page and fills `blocks`. Returns how many pictures were left out.
function build(root) {
  const blocks = [];
  let runs = [];
  let skippedImages = 0;

  const flush = (extra = {}) => {
    const trimmed = [...runs];
    while (trimmed.length && trimmed[0].text.trim() === '') trimmed.shift();
    while (trimmed.length && trimmed.at(-1).text.trim() === '') trimmed.pop();
    runs = [];
    if (!trimmed.length) return;
    trimmed[0] = { ...trimmed[0], text: trimmed[0].text.trimStart() };
    trimmed[trimmed.length - 1] = { ...trimmed.at(-1), text: trimmed.at(-1).text.trimEnd() };
    blocks.push({ kind: 'para', runs: trimmed, ...extra });
  };

  function inline(node, bold) {
    if (node.nodeType === 3) {
      const text = clean(node.nodeValue);
      if (text) runs.push({ text, bold });
      return;
    }
    if (node.nodeType !== 1) return;
    const tag = node.tagName.toLowerCase();
    if (tag === 'br') runs.push({ text: '\n', bold });
    else if (!DROP.has(tag)) for (const child of node.childNodes) inline(child, bold || BOLD.has(tag));
    else if (tag === 'img' || tag === 'picture') skippedImages += 1;
  }

  function table(node) {
    const rows = [];
    for (const tr of node.querySelectorAll('tr')) {
      if (tr.closest('table') !== node) continue;
      rows.push(Array.from(tr.children, (cell) => clean(cell.textContent ?? '').trim()));
    }
    if (rows.length) blocks.push({ kind: 'table', rows });
  }

  function walk(node, ctx) {
    if (blocks.length > MAX_BLOCKS) return;
    if (node.nodeType === 3) {
      inline(node, ctx.bold);
      return;
    }
    if (node.nodeType !== 1) return;
    const tag = node.tagName.toLowerCase();
    if (DROP.has(tag)) {
      if (tag === 'img' || tag === 'picture') skippedImages += 1;
      return;
    }
    if (/^h[1-6]$/.test(tag)) {
      flush();
      for (const child of node.childNodes) inline(child, true);
      flush({ kind: 'heading', level: Number(tag[1]) });
    } else if (tag === 'pre') {
      flush();
      blocks.push({ kind: 'pre', text: node.textContent.replace(/\r\n?/g, '\n').replace(/^\n|\n$/g, '') });
    } else if (tag === 'hr') {
      flush();
      blocks.push({ kind: 'rule' });
    } else if (tag === 'table') {
      flush();
      table(node);
    } else if (tag === 'ul' || tag === 'ol') {
      flush();
      let n = 0;
      for (const child of node.children) {
        if (child.tagName.toLowerCase() === 'li') {
          n += 1;
          const marker = tag === 'ol' ? `${n}.` : '•';
          for (const part of child.childNodes) {
            const name = part.nodeType === 1 ? part.tagName.toLowerCase() : '';
            if (name === 'ul' || name === 'ol') {
              flush({ kind: 'item', marker, depth: ctx.depth });
              walk(part, { ...ctx, depth: ctx.depth + 1 });
            } else inline(part, ctx.bold);
          }
          flush({ kind: 'item', marker, depth: ctx.depth });
        } else walk(child, ctx);
      }
    } else if (tag === 'blockquote') {
      flush();
      for (const child of node.childNodes) walk(child, { ...ctx, quote: true });
      flush({ quote: true });
    } else if (BLOCKS.has(tag) || tag === 'body' || tag === 'html') {
      flush();
      for (const child of node.childNodes) walk(child, ctx);
      flush(ctx.quote ? { quote: true } : {});
    } else {
      inline(node, ctx.bold);
    }
  }

  walk(root, { depth: 0, bold: false });
  flush();
  return { blocks, skippedImages };
}

// parser: the browser's DOMParser. Returns { blocks, skippedImages }. The page is parsed in an inert document.
export function htmlToBlocks(html, parser = new DOMParser()) {
  const doc = parser.parseFromString(html, 'text/html');
  return build(doc.body ?? doc.documentElement);
}
