import { defineConfig } from "tsup";

export default defineConfig({
  entry: { cli: "src/cli.ts" },
  outDir: "dist",
  format: ["esm"],
  target: "node20",
  platform: "node",
  dts: true,
  clean: true,
  sourcemap: true,
  // Shebang so the published bin is directly executable.
  banner: { js: "#!/usr/bin/env node" },
});
