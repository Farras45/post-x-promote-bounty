import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Copies POST.json (the entry's X post address) into the output dir.
// The house reads the post itself; this program writes nothing about it.
const repoRoot = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const source = join(repoRoot, "POST.json");
const post = JSON.parse(readFileSync(source, "utf8")) as { url?: unknown };
if (typeof post.url !== "string" || !/^https:\/\/(x\.com|twitter\.com)\/\w+\/status\/\d+$/.test(post.url)) {
  throw new Error("POST.json must hold one X post address, https://x.com/<handle>/status/<id>");
}

mkdirSync(outDir, { recursive: true });
copyFileSync(source, join(outDir, "POST.json"));
console.log(`wrote POST.json to ${outDir}`);
