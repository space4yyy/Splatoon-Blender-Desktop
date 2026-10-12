# Splatoon Blender Desktop

本仓库负责 Tauri 桌面应用、原生 Rust 层、桌面安装包与离线资源导入。网页和资源文件仍来自 [`space4yyy/Splatoon-Blender`](https://github.com/space4yyy/Splatoon-Blender)，该仓库保留为独立的 Vite 网页应用。

本地目录约定：克隆桌面仓库后，将网页仓库放在根目录的 `web/` 子目录。桌面构建通过 `source.json` 记录网页仓库地址，CI 会固定网页提交 SHA，再分别安装两边的 JavaScript 依赖。

```sh
git clone git@github.com:space4yyy/Splatoon-Blender-Desktop.git
cd Splatoon-Blender-Desktop
git clone git@github.com:space4yyy/Splatoon-Blender.git web
npm ci
(cd web && npm ci)
npm run desktop:dev
```

桌面仓库提供 `desktop:dev`、`desktop:build`、`desktop:build:macos` 和 `desktop:build:windows`。网站仓库只保留常规 `dev`、`build` 与网页部署流程；桌面版本所需的离线 CSP 和 Vite 构建处理由本仓库的 `scripts/vite.desktop.config.mjs` 提供。

## 自动流程

- 桌面仓库 `main` 有提交时启动构建；另外每 15 分钟检查一次网页仓库默认分支。
- 桌面仓库提交和网页仓库提交都与最近一次成功桌面发布相同时，workflow 结束，不执行平台构建。
- 桌面壳或网页有更新时，macOS 和 Windows 并行构建。两者都成功后才发布桌面程序 Release。
- 网页资源内容或 `offline-resources.json` 选集变化时，生成内容寻址的资源包 Release；资源内容不变时复用最近一次发布的资源包。
- Actions 页面提供手动运行入口，可指定网页仓库的分支、标签或提交；失败的构建可以对同一组提交重试。勾选强制构建可重建已发布提交。
- 桌面 Release 会记录 `Desktop-Commit` 和 `Source-Commit`；资源 Release 标签采用 `resources-v1-<资源 ID>`。

发布使用当前构建仓库的 `GITHUB_TOKEN`。不需要在源码仓库添加 workflow、PAT 或跨仓库 secrets。workflow 对构建仓库需要 `contents: write` 权限。

## 新仓库设置

1. 在 GitHub 创建 `Splatoon-Blender-Desktop` 仓库，并将本目录推送为其默认分支。
2. 确认 `space4yyy/Splatoon-Blender` 的默认分支含有网页源码和资源目录；桌面壳不再放在该仓库中。
3. 检查仓库 **Settings → Actions → General → Workflow permissions**，允许 Actions 写入内容，以便创建 Releases。
4. 在 **Actions → Build offline desktop releases → Run workflow** 手动运行一次。定时任务只在 workflow 到达默认分支后生效。

如果要构建另一个源码 fork，修改 `source.json` 中的 `repository` 和 `defaultRef`。

## 文件说明

- `.github/workflows/build.yml`：定时检查、手动构建、双平台构建及发布。
- `source.json`：网页仓库和默认分支。
- `src-tauri/`：桌面应用原生层、图标、安装器和配置。
- `scripts/`：桌面离线 Vite 构建、资源打包和差异检查。
- `scripts/resource_changed.py`：使用本仓库的 `offline-resources.json` 选取网页仓库中的资源并计算内容 ID；网页提交变化但资源内容未变时会复用原资源包。

每个 GitHub Release 中的单个文件必须小于 2 GiB。工作流会在上传前检查该限制；若 ZIP 超过限制，需要把资源包拆分后再调整应用导入和发布流程。

更多离线资源格式、磁盘位置和发行流程说明见 [DESKTOP.md](DESKTOP.md)。
