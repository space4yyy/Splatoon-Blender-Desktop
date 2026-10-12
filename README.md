# Splatoon Blender Desktop Builds

独立的 GitHub Actions 构建仓库。它从 `source.json` 指定的源码仓库拉取固定提交，在 GitHub 托管的 macOS 和 Windows runner 上构建离线桌面程序，并把程序和资源包发布到**本仓库**的 Releases。它不会向源码仓库推送文件，也不会触发或修改上游 workflow。

## 自动流程

- 每 15 分钟检查一次源码仓库的默认分支；GitHub 可能延迟定时任务。
- 源码提交与最近一次成功桌面发布相同时，workflow 结束，不执行平台构建。
- 源码有更新时，macOS 和 Windows 并行构建。两者都成功后才发布桌面程序 Release。
- 资源目录、`offline-resources.json` 或资源打包脚本发生变化时，生成内容寻址的资源包 Release。其它源码更新沿用最近一次发布所引用的资源包。
- Actions 页面提供手动运行入口，可指定分支、标签或提交；失败的构建可以对同一提交重试。勾选强制构建可重建已发布提交。
- 桌面 Release 标签采用 `desktop-v<版本>-<源码短 SHA>-run<运行号>-attempt<重试号>`；资源 Release 标签采用 `resources-v1-<资源 ID>`。

发布使用当前构建仓库的 `GITHUB_TOKEN`。不需要在源码仓库添加 workflow、PAT 或跨仓库 secrets。workflow 对构建仓库需要 `contents: write` 权限。

## 新仓库设置

1. 在 GitHub 创建 `Splatoon-Blender-Desktop` 仓库，并将本目录推送为其默认分支。
2. 确认 `space4yyy/Splatoon-Blender` 的默认分支包含桌面离线版构建脚本。当前 `main` 已发布 `1.1.2`，workflow 会固定该分支解析到的提交进行构建。
3. 检查仓库 **Settings → Actions → General → Workflow permissions**，允许 Actions 写入内容，以便创建 Releases。
4. 在 **Actions → Build offline desktop releases → Run workflow** 手动运行一次。定时任务只在 workflow 到达默认分支后生效。

如果要构建另一个源码 fork，修改 `source.json` 中的 `repository` 和 `defaultRef`。

## 文件说明

- `.github/workflows/build.yml`：定时检查、手动构建、双平台构建及发布。
- `source.json`：源码仓库和默认分支。
- `scripts/resource_changed.py`：计算资源内容 ID，并与上次发布的资源标签比较；源码变更但资源内容未变时会复用原资源包。

每个 GitHub Release 中的单个文件必须小于 2 GiB。工作流会在上传前检查该限制；若 ZIP 超过限制，需要把资源包拆分后再调整应用导入和发布流程。
