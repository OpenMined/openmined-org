/**
 * audit-image-shapes — enforce "resize, never reshape" on image generation.
 *
 *   node scripts/audit-image-shapes.mjs
 *
 * Fails when a build-time image call forces a non-native aspect ratio, i.e.
 * constrains BOTH width and height (or asks for a `fit`). See AGENTS.md →
 * "Images: resize, never reshape".
 *
 * Why this exists rather than a code-review habit: the failure is SILENT. Ask
 * Astro's `getImage` for 600×600 from a 16:9 source and you get a file that is
 * exactly 600×600 — so every dimension assertion passes — but the image inside it
 * has been letterboxed and padded with opaque #000000, baked in permanently. It
 * cost a round of review to spot, and only sampling pixels proved it. `fit: 'cover'`
 * does not prevent it; the option is not honoured.
 *
 * Static analysis only (no build required), so it is cheap enough to run any time.
 *
 * Escape hatch — put this on the line before a call that legitimately needs both
 * dimensions (a genuinely square source, a fixed-size sprite):
 *   // audit-image-shapes: allow — <reason>
 */
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, relative } from 'path';
import { globSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SRC = join(ROOT, 'src');

const ALLOW = /audit-image-shapes:\s*allow/;

/** Files worth scanning — anywhere an image call can appear. */
const files = globSync('**/*.{astro,ts,tsx,js,mjs,md,mdx}', { cwd: SRC })
  .map((f) => join(SRC, f));

/**
 * Slice from `start` until the delimiter that closes the call, tracking nesting so
 * a `{...}` prop value or a nested call doesn't end the slice early.
 */
function callSlice(text, start, openCh, closeCh) {
  let depth = 0;
  let quote = null;
  for (let i = start; i < text.length && i < start + 2000; i++) {
    const c = text[i];
    if (quote) {
      if (c === quote && text[i - 1] !== '\\') quote = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { quote = c; continue; }
    if (c === openCh || c === '{' || c === '(') depth++;
    else if (c === closeCh || c === '}' || c === ')') {
      depth--;
      if (depth <= 0) return text.slice(start, i + 1);
    }
  }
  return text.slice(start, start + 2000);
}

const findings = [];

for (const file of files) {
  let text;
  try { text = readFileSync(file, 'utf8'); } catch { continue; }
  if (!/getImage\s*\(|<Image|<Picture/.test(text)) continue;

  const lines = text.split('\n');
  const lineAt = (idx) => text.slice(0, idx).split('\n').length;

  const scan = (re, openCh, closeCh, label) => {
    for (const m of text.matchAll(re)) {
      const slice = callSlice(text, m.index, openCh, closeCh);
      const line = lineAt(m.index);
      // Opt-out on the preceding non-blank line.
      let prev = line - 2;
      while (prev >= 0 && !lines[prev]?.trim()) prev--;
      if (prev >= 0 && ALLOW.test(lines[prev] ?? '')) continue;

      // `widths={[...]}` / `densities` are the correct, one-dimension forms.
      const hasWidth = /\bwidth\s*[:=]/.test(slice);
      const hasHeight = /\bheight\s*[:=]/.test(slice);
      const hasFit = /\bfit\s*[:=]/.test(slice);

      if (hasWidth && hasHeight) {
        findings.push({ file, line, label, why: 'constrains BOTH width and height — the source gets padded to fit' });
      } else if (hasFit) {
        findings.push({ file, line, label, why: "passes `fit` — not honoured by Astro's image service; crop in CSS instead" });
      }
    }
  };

  scan(/getImage\s*\(/g, '(', ')', 'getImage()');
  scan(/<(?:Image|Picture)\b/g, '<', '>', '<Image>');
}

if (findings.length === 0) {
  console.log(`✓ image shapes clean — scanned ${files.length} files, no forced-aspect image calls`);
  process.exit(0);
}

console.error(`✗ ${findings.length} forced-aspect image call(s) — see AGENTS.md → "Images: resize, never reshape"\n`);
for (const f of findings) {
  console.error(`  ${relative(ROOT, f.file)}:${f.line}  ${f.label}`);
  console.error(`    ${f.why}`);
  console.error(`    fix: constrain one dimension only, and crop with CSS (object-fit / background-size: cover)\n`);
}
process.exit(1);
