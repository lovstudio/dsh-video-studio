import { build as esbuild, transform } from "esbuild";
import { build as vite } from "vite";
import { bundle } from "@remotion/bundler";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { format } from "prettier";

await mkdir("lib", { recursive: true });
// These directories contain generated files only; stale chunks must not ship.
await rm("lib/types", { recursive: true, force: true });
await rm("lib/remotion", { recursive: true, force: true });
execFileSync(
  process.execPath,
  ["node_modules/typescript/bin/tsc", "-p", "tsconfig.build.json"],
  { stdio: "inherit" },
);
await esbuild({
  entryPoints: {
    index: "src/index.ts",
    dev: "src/host/dev.ts",
    invariant: "src/invariant.ts",
  },
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node22",
  packages: "external",
  outdir: "lib",
});
await esbuild({
  entryPoints: ["src/shell/index.tsx"],
  bundle: true,
  platform: "browser",
  format: "cjs",
  target: "es2022",
  outfile: "lib/client.cjs",
  external: [
    "react",
    "react/jsx-runtime",
    "@deepseek-ai/cordis",
    "@deepseek-ai/dsh-client-store",
    "@deepseek-ai/dsh-client-ui-slots",
    "@deepseek-ai/dsh-client-ui-primitives",
  ],
  banner: {
    js: 'window.__ModuleLoader__.load({id:"@lovstudio/dsh-video-studio",factory:(require)=>{var module={exports:{}};var exports=module.exports;',
  },
  footer: { js: "return module.exports;}});" },
});
await vite({
  configFile: false,
  base: "/video-studio/",
  build: {
    outDir: "lib/studio",
    emptyOutDir: true,
    chunkSizeWarningLimit: 1400,
  },
});
await bundle({
  entryPoint: new URL("../src/remotion/index.tsx", import.meta.url).pathname,
  outDir: new URL("../lib/remotion", import.meta.url).pathname,
  webpackOverride: (config) => ({ ...config, devtool: false }),
});
// Remotion's source navigation metadata is irrelevant to this render-only bundle.
// Remove the build machine's path to make the committed distribution portable.
const renderHtml = new URL("../lib/remotion/index.html", import.meta.url);
const html = await readFile(renderHtml, "utf8");
const cwdAssignment = /window\.remotion_cwd = [^;]*;/;
if (!cwdAssignment.test(html)) {
  throw new Error(
    "Remotion HTML changed; review distribution path normalization.",
  );
}
await writeFile(
  renderHtml,
  html.replace(cwdAssignment, 'window.remotion_cwd = "";'),
);
// Preserve embedded shader/WASM bytes as escaped strings, then format for review.
for (const file of await readdir("lib", { recursive: true })) {
  if (!/\.(?:js|cjs|css|html)$/.test(file)) continue;
  const filepath = `lib/${file}`;
  let code = await readFile(filepath, "utf8");
  if (/\.(?:js|cjs)$/.test(file)) {
    code = (
      await transform(code, {
        target: "es2022",
        supported: { "template-literal": false },
        legalComments: "inline",
      })
    ).code;
  }
  const formatted = await format(code, { filepath });
  await writeFile(
    filepath,
    formatted.replace(/^[\t ]+/gm, (indent) => indent.replace(/\t/g, "  ")),
  );
}
console.log(
  "Built DSH host, isolated editor, and shared Remotion composition.",
);
