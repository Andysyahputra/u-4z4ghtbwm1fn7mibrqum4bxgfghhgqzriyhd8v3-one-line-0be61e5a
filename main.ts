import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One original funny line for "One Line, One Laugh".
// Concrete relatable image (CAPTCHA) + sharp twist at the end.
const LINE =
  "The CAPTCHA asked me to prove I'm human, so I cried at a dog video — and passed instantly.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Never remove the output directory itself; just ensure it exists.
mkdirSync(outDir, { recursive: true });

// Validate: 1-140 characters (counted as code points), not only whitespace,
// and strictly a single line — the entry must be one line, whole and alone.
const length = [...LINE].length;
if (length < 1 || length > 140) {
  throw new Error(`entry length ${length} is outside the 1-140 character gate`);
}
if (LINE.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}
if (/[\r\n]/.test(LINE)) {
  throw new Error("entry must be a single line");
}

const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

// Verify the round trip: what was written is exactly the line, valid UTF-8.
const written = readFileSync(outPath, "utf8");
if (written !== LINE) {
  throw new Error("round-trip check failed: written file differs from the line");
}
