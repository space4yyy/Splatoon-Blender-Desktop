import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const desktopRoot = fileURLToPath(new URL("../", import.meta.url));
const webRoot = resolve(desktopRoot, "web");
const viteCli = resolve(webRoot, "node_modules/vite/bin/vite.js");
const viteConfig = resolve(desktopRoot, "scripts/vite.desktop.config.mjs");
const result = spawnSync(process.execPath, [viteCli, "build", "--config", viteConfig], {
  cwd: webRoot,
  stdio: "inherit",
});

if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

const copyAssets = spawnSync(process.execPath, [resolve(webRoot, "scripts/copy-offline-assets.mjs")], {
  cwd: webRoot,
  stdio: "inherit",
});
if (copyAssets.error) throw copyAssets.error;
if (copyAssets.status !== 0) process.exit(copyAssets.status ?? 1);
