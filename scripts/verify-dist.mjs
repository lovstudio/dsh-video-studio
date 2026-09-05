import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";

const manifest = JSON.parse(
  await readFile(new URL("../package.json", import.meta.url), "utf8"),
);
assert.equal(
  manifest.scripts.prepare,
  undefined,
  "Git installs must not require a prepare build",
);
for (const file of [
  manifest.main,
  manifest.types,
  manifest.exports["./client"],
  manifest.exports["./invariant"],
  "lib/studio/index.html",
  "lib/remotion/index.html",
  "cordis.patch.yml",
]) {
  await access(new URL(`../${file}`, import.meta.url));
}
assert.equal(manifest.dsh.bundle.patch, "./cordis.patch.yml");
const patch = await readFile(
  new URL("../cordis.patch.yml", import.meta.url),
  "utf8",
);
assert.ok(patch.includes(manifest.name), "DSH patch must mount this package");
const renderHtml = await readFile(
  new URL("../lib/remotion/index.html", import.meta.url),
  "utf8",
);
assert.ok(
  renderHtml.includes('window.remotion_cwd = "";'),
  "Remotion bundle must not expose the build machine path",
);
const renderFiles = await readdir(
  new URL("../lib/remotion/", import.meta.url),
  { recursive: true },
);
assert.ok(
  !renderFiles.some((file) => file.endsWith(".map")),
  "Stale source maps must not ship",
);
for (const directory of ["studio", "remotion"]) {
  const html = await readFile(
    new URL(`../lib/${directory}/index.html`, import.meta.url),
    "utf8",
  );
  for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    if (/^(?:https?:|data:|#)/.test(match[1])) continue;
    const asset = match[1]
      .replace(/^\/video-studio\//, "")
      .replace(/^\.\//, "");
    await access(new URL(`../lib/${directory}/${asset}`, import.meta.url));
  }
}
const plugin = await import("../lib/index.js");
assert.equal(typeof plugin.apply, "function");
assert.equal("default" in plugin, false);
assert.deepEqual(plugin.inject, ["webServer", "connection"]);
console.log(
  "Prebuilt host, editor, renderer, declarations and DSH patch are present.",
);
