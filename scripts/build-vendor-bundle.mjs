// Bundles the @skooldio/skooldio-lams-markdown tool registry into vendor/lams-diagram.js —
// one classic script exposing window.LAMS_TOOLS, so the Diagrams tab can re-render a diagram
// from edited JSON. A classic script (not a module) because the page must also work on file://.
//
//   node scripts/build-vendor-bundle.mjs
//
// Only the DOM renderers come along: TOOL_REGISTRY[key].render(element, params) needs no React,
// so esbuild tree-shakes the package's React components out. LAMS_MARKDOWN overrides where the
// package lives (default: sibling checkout).
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG = resolve(
  process.env.LAMS_MARKDOWN ?? join(__dirname, "..", "..", "skooldio-lams-markdown"),
);
const OUT = join(__dirname, "..", "vendor", "lams-diagram.js");

// The entry lives next to the package's dist so esbuild resolves its bare imports
// (diagramatics, mathjax-full, …) against the package's own node_modules.
const entry = join(PKG, "dist", "__bett-sim-entry.js");
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(
  entry,
  'import { TOOL_REGISTRY } from "./index.js";\nwindow.LAMS_TOOLS = TOOL_REGISTRY;\n',
);
try {
  // the package's own esbuild, via its JS shim — no shell, no .cmd/.ps1 platform split
  execFileSync(
    process.execPath,
    [
      join(PKG, "node_modules", "esbuild", "bin", "esbuild"),
      entry,
      "--bundle",
      "--format=iife",
      "--minify",
      "--target=es2020",
      `--outfile=${OUT}`,
    ],
    { stdio: "inherit" },
  );
} finally {
  rmSync(entry, { force: true });
}
console.log(`\nbundled -> ${OUT}`);
