import { defineManifest } from "@crxjs/vite-plugin";

import { version } from "./package.json";

// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch, label = "0"] = version.replace(/[^\d.-]+/g, "").split(/[.-]/);

export const manifest = defineManifest(() => ({
  manifest_version: 3,
  name: "Light Town App",
  author: "Michail Shcherbakov",
  description: "Light Town Browser Extension",
  // homepage_url: "https://",
  version: `${major}.${minor}.${patch}.${label}`,
  version_name: version,
  action: {
    default_title: "Light Town",
    default_popup: "index.html",
  },
  background: {
    service_worker: "src/background.ts",
    type: "module",
  },
  content_scripts: [
    {
      all_frames: true,
      js: ["src/content/autofill.ts"],
      matches: ["http://*/*", "https://*/*", "file:///*"],
      run_at: "document_start",
    },
  ],
}));
