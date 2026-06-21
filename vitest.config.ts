import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    environment: "node",
    // Skeleton has no tests yet (added in Phase 2+); keep CI green until then.
    passWithNoTests: true,
  },
});
