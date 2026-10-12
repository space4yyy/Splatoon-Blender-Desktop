# Windows installer template

Source: https://github.com/tauri-apps/tauri/blob/tauri-cli-v2.11.5/crates/tauri-bundler/src/bundle/windows/nsis/installer.nsi

This is the official Tauri CLI 2.11.5 template, distributed under Tauri's MIT license option. The only behavioral change removes `/SOLID` from `SetCompressor` so the complete offline resource library and WebView2 installer can be built on macOS without overflowing the solid temporary stream. Compression is selected as `zlib` in `tauri.windows.conf.json`.

Keep this template aligned with the pinned CLI when upgrading.
