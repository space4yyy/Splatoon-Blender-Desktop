import { existsSync, statSync } from "node:fs";
import webConfig from "../web/vite.config.mjs";

const characterArchive = new URL("../web/add-ons/character.zip", import.meta.url);
const characterCreatorBundled = existsSync(characterArchive)
  && statSync(characterArchive).size > 0;

function offlinePageTransform() {
  return {
    name: "splatoon-desktop-offline-page-transform",
    transformIndexHtml(html) {
      const offlineCsp = [
        "default-src 'self' blob: data:",
        "connect-src 'self' ipc: http://ipc.localhost blob:",
        "font-src 'self' data:",
        "img-src 'self' blob: data:",
        "media-src 'self' blob: data:",
        "style-src 'self' 'unsafe-inline'",
        "script-src 'self' 'unsafe-inline'",
        "frame-src 'none'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join("; ");

      return html
        .replace(/<head\b[^>]*>/i, match => `${match}\n    <meta http-equiv="Content-Security-Policy" content="${offlineCsp}">`)
        .replace(/<link\b[^>]*href=["']https:\/\/fonts\.googleapis\.com[^"']*["'][^>]*>/gi, "")
        .replace(/<link\b[^>]*href=["']https:\/\/fonts\.gstatic\.com[^"']*["'][^>]*>/gi, "")
        .replace(
          /<iframe\b[^>]*src=["']https:\/\/discord\.com\/widget[^"']*["'][^>]*><\/iframe>/gi,
          '<p class="offline-community-note">Discord preview is unavailable offline.</p>',
        )
        .replace(/\s+href=["']https?:\/\/[^"']*["']/gi, "")
        .replace(/\s+target=["']_blank["']/gi, "");
    },
  };
}

export default {
  ...webConfig,
  define: {
    ...webConfig.define,
    __DESKTOP_OFFLINE__: JSON.stringify(true),
    __CHARACTER_CREATOR_BUNDLED__: JSON.stringify(characterCreatorBundled),
  },
  plugins: [...(webConfig.plugins ?? []), offlinePageTransform()],
  build: {
    ...webConfig.build,
    target: "esnext",
  },
};
