import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import { delimiter } from "node:path";

const tauriCli = fileURLToPath(new URL("../node_modules/@tauri-apps/cli/tauri.js", import.meta.url));
const result = spawnSync(process.execPath, [tauriCli, ...process.argv.slice(2)], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    VITE_OFFLINE_BUILD: "1",
    PATH: process.platform === "darwin" && existsSync("/opt/homebrew/opt/rustup/bin/cargo")
      ? `/opt/homebrew/opt/rustup/bin${delimiter}${process.env.PATH}` : process.env.PATH,
  },
  stdio: "inherit",
});

if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
