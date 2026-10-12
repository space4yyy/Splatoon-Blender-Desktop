import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { delimiter, resolve } from 'node:path';

const cross = process.platform !== 'win32';
const args = ['scripts/run-tauri.mjs', 'build', '--target', 'x86_64-pc-windows-msvc', '--bundles', 'nsis'];
if (cross) args.push('--runner', 'cargo-xwin');
const paths = [resolve('.build-tools/bin')];
if (process.platform === 'darwin') {
    paths.push('/opt/homebrew/opt/rustup/bin', '/opt/homebrew/opt/llvm/bin', '/opt/homebrew/opt/lld/bin');
}
const result = spawnSync(process.execPath, [...args, ...process.argv.slice(2)], {
    stdio: 'inherit',
    env: { ...process.env, PATH: [...paths.filter(existsSync), process.env.PATH].join(delimiter) },
});
if (result.error) throw result.error;
process.exit(result.status ?? 1);
