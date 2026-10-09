import vinext from "vinext";
import { defineConfig } from "vite";
export default defineConfig(async () => {
 const { cloudflare } = await import("@cloudflare/vite-plugin");
 return {
  server: { watch: { useFsEvents: false, usePolling: true } },
  plugins: [vinext(), cloudflare({
   viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
   config: { name: "lulu-zhao-v0-archive", main: "./worker/index.ts", compatibility_date: "2026-10-08", compatibility_flags: ["nodejs_compat"], workers_dev: true, routes: [{ pattern: "v0.luluzhao.me", custom_domain: true }] }
  })]
 };
});
