import { describe, it, expect } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { scaffold } from "../../src/scaffold.js";
import { buildVariables } from "../../src/variables.js";
import { resolve } from "../../src/config.js";

const TEST_DATE = new Date("2026-06-28");

function tmpDir(): [string, () => void] {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ysm-test-"));
  return [dir, () => fs.rmSync(dir, { recursive: true, force: true })];
}

function makeConfig(vaultPath: string, overrides: Partial<Parameters<typeof resolve>[0]> = {}) {
  return resolve({ name: "TestUser", vaultPath, gitInit: false, ...overrides }, {});
}

function collectFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  function walk(current: string): void {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile()) results.push(path.relative(dir, full));
    }
  }
  walk(dir);
  return results;
}

// ── Directory structure ────────────────────────────────────────────────────────

describe("scaffold — directory structure", () => {
  it("creates all 10 top-level PARA folders", () => {
    const [dir, cleanup] = tmpDir();
    try {
      scaffold(makeConfig(dir), buildVariables(makeConfig(dir), TEST_DATE));
      for (const folder of [
        "00-Inbox", "10-Daily", "20-Projects", "30-Areas",
        "40-Resources", "50-Slipbox", "60-MOCs", "70-People",
        "80-Archive", "90-Meta",
      ]) {
        expect(fs.existsSync(path.join(dir, folder)), `missing ${folder}`).toBe(true);
      }
    } finally { cleanup(); }
  });

  it("creates area subfolders under 30-Areas with area- prefix", () => {
    const [dir, cleanup] = tmpDir();
    try {
      const cfg = makeConfig(dir, { areas: ["research", "writing"] });
      scaffold(cfg, buildVariables(cfg, TEST_DATE));
      expect(fs.existsSync(path.join(dir, "30-Areas", "area-research"))).toBe(true);
      expect(fs.existsSync(path.join(dir, "30-Areas", "area-writing"))).toBe(true);
    } finally { cleanup(); }
  });

  it("creates raw source subfolders", () => {
    const [dir, cleanup] = tmpDir();
    try {
      const cfg = makeConfig(dir, { rawSources: ["papers", "datasets"] });
      scaffold(cfg, buildVariables(cfg, TEST_DATE));
      expect(fs.existsSync(path.join(dir, "raw", "papers"))).toBe(true);
      expect(fs.existsSync(path.join(dir, "raw", "datasets"))).toBe(true);
    } finally { cleanup(); }
  });

  it("does not create area subfolders excluded by config", () => {
    const [dir, cleanup] = tmpDir();
    try {
      const cfg = makeConfig(dir, { areas: ["research"] });
      scaffold(cfg, buildVariables(cfg, TEST_DATE));
      expect(fs.existsSync(path.join(dir, "30-Areas", "area-engineering-craft"))).toBe(false);
    } finally { cleanup(); }
  });

  it("creates 90-Meta/Templates and 90-Meta/AI-Sessions", () => {
    const [dir, cleanup] = tmpDir();
    try {
      const cfg = makeConfig(dir);
      scaffold(cfg, buildVariables(cfg, TEST_DATE));
      expect(fs.existsSync(path.join(dir, "90-Meta", "Templates"))).toBe(true);
      expect(fs.existsSync(path.join(dir, "90-Meta", "AI-Sessions"))).toBe(true);
    } finally { cleanup(); }
  });

  it("creates agents-workflow directory", () => {
    const [dir, cleanup] = tmpDir();
    try {
      const cfg = makeConfig(dir);
      scaffold(cfg, buildVariables(cfg, TEST_DATE));
      expect(fs.existsSync(path.join(dir, "agents-workflow"))).toBe(true);
    } finally { cleanup(); }
  });
});

// ── File writing ──────────────────────────────────────────────────────────────

describe("scaffold — agent schema files", () => {
  it("writes CLAUDE.md for claude-code agent", () => {
    const [dir, cleanup] = tmpDir();
    try {
      const cfg = makeConfig(dir, { agents: ["claude-code"] });
      scaffold(cfg, buildVariables(cfg, TEST_DATE));
      expect(fs.existsSync(path.join(dir, "CLAUDE.md"))).toBe(true);
    } finally { cleanup(); }
  });

  it("writes .cursorrules for cursor agent", () => {
    const [dir, cleanup] = tmpDir();
    try {
      const cfg = makeConfig(dir, { agents: ["cursor"] });
      scaffold(cfg, buildVariables(cfg, TEST_DATE));
      expect(fs.existsSync(path.join(dir, ".cursorrules"))).toBe(true);
    } finally { cleanup(); }
  });

  it("writes AGENTS.md for codex agent", () => {
    const [dir, cleanup] = tmpDir();
    try {
      const cfg = makeConfig(dir, { agents: ["codex"] });
      scaffold(cfg, buildVariables(cfg, TEST_DATE));
      expect(fs.existsSync(path.join(dir, "AGENTS.md"))).toBe(true);
    } finally { cleanup(); }
  });

  it("does not write CLAUDE.md when claude-code not in agents", () => {
    const [dir, cleanup] = tmpDir();
    try {
      const cfg = makeConfig(dir, { agents: ["cursor"] });
      scaffold(cfg, buildVariables(cfg, TEST_DATE));
      expect(fs.existsSync(path.join(dir, "CLAUDE.md"))).toBe(false);
    } finally { cleanup(); }
  });

  it("does not write .cursorrules when cursor not in agents", () => {
    const [dir, cleanup] = tmpDir();
    try {
      const cfg = makeConfig(dir, { agents: ["claude-code"] });
      scaffold(cfg, buildVariables(cfg, TEST_DATE));
      expect(fs.existsSync(path.join(dir, ".cursorrules"))).toBe(false);
    } finally { cleanup(); }
  });

  it("writes CLAUDE.md containing the configured name", () => {
    const [dir, cleanup] = tmpDir();
    try {
      const cfg = makeConfig(dir, { agents: ["claude-code"] });
      scaffold(cfg, buildVariables(cfg, TEST_DATE));
      const content = fs.readFileSync(path.join(dir, "CLAUDE.md"), "utf8");
      expect(content).toContain("TestUser");
    } finally { cleanup(); }
  });
});

describe("scaffold — nav files", () => {
  it("writes README.md, index.md, log.md, .gitignore", () => {
    const [dir, cleanup] = tmpDir();
    try {
      const cfg = makeConfig(dir);
      scaffold(cfg, buildVariables(cfg, TEST_DATE));
      expect(fs.existsSync(path.join(dir, "README.md"))).toBe(true);
      expect(fs.existsSync(path.join(dir, "index.md"))).toBe(true);
      expect(fs.existsSync(path.join(dir, "log.md"))).toBe(true);
      expect(fs.existsSync(path.join(dir, ".gitignore"))).toBe(true);
    } finally { cleanup(); }
  });
});

describe("scaffold — _index.md per folder", () => {
  it("writes _index.md in every top-level PARA folder", () => {
    const [dir, cleanup] = tmpDir();
    try {
      const cfg = makeConfig(dir);
      scaffold(cfg, buildVariables(cfg, TEST_DATE));
      for (const folder of [
        "00-Inbox", "10-Daily", "20-Projects", "30-Areas",
        "40-Resources", "50-Slipbox", "60-MOCs", "70-People",
        "80-Archive", "90-Meta",
      ]) {
        expect(fs.existsSync(path.join(dir, folder, "_index.md")), `missing ${folder}/_index.md`).toBe(true);
      }
    } finally { cleanup(); }
  });

  it("_index.md for 00-Inbox contains the folder name", () => {
    const [dir, cleanup] = tmpDir();
    try {
      const cfg = makeConfig(dir);
      scaffold(cfg, buildVariables(cfg, TEST_DATE));
      const content = fs.readFileSync(path.join(dir, "00-Inbox", "_index.md"), "utf8");
      expect(content).toContain("00-Inbox");
    } finally { cleanup(); }
  });
});

describe("scaffold — note templates", () => {
  it("writes all 6 note templates to 90-Meta/Templates/", () => {
    const [dir, cleanup] = tmpDir();
    try {
      const cfg = makeConfig(dir);
      scaffold(cfg, buildVariables(cfg, TEST_DATE));
      for (const name of [
        "daily-note.md", "lit-note.md", "evergreen-note.md",
        "project-note.md", "weekly-review.md", "ingest-session.md",
      ]) {
        expect(fs.existsSync(path.join(dir, "90-Meta", "Templates", name)), `missing ${name}`).toBe(true);
      }
    } finally { cleanup(); }
  });

  it("note templates preserve Templater <% %> syntax verbatim", () => {
    const [dir, cleanup] = tmpDir();
    try {
      const cfg = makeConfig(dir);
      scaffold(cfg, buildVariables(cfg, TEST_DATE));
      const content = fs.readFileSync(path.join(dir, "90-Meta", "Templates", "daily-note.md"), "utf8");
      expect(content).toContain("<% tp.date.now");
    } finally { cleanup(); }
  });
});

describe("scaffold — agents-workflow", () => {
  it("writes weekly-review.md, monthly-lint.md, README.md", () => {
    const [dir, cleanup] = tmpDir();
    try {
      const cfg = makeConfig(dir);
      scaffold(cfg, buildVariables(cfg, TEST_DATE));
      expect(fs.existsSync(path.join(dir, "agents-workflow", "weekly-review.md"))).toBe(true);
      expect(fs.existsSync(path.join(dir, "agents-workflow", "monthly-lint.md"))).toBe(true);
      expect(fs.existsSync(path.join(dir, "agents-workflow", "README.md"))).toBe(true);
    } finally { cleanup(); }
  });

  it("command files preserve $CURRENT_DATE verbatim (not substituted)", () => {
    const [dir, cleanup] = tmpDir();
    try {
      const cfg = makeConfig(dir);
      scaffold(cfg, buildVariables(cfg, TEST_DATE));
      const content = fs.readFileSync(path.join(dir, "agents-workflow", "weekly-review.md"), "utf8");
      expect(content).toContain("$CURRENT_DATE");
    } finally { cleanup(); }
  });

  it("command files contain no {{ placeholders", () => {
    const [dir, cleanup] = tmpDir();
    try {
      const cfg = makeConfig(dir);
      scaffold(cfg, buildVariables(cfg, TEST_DATE));
      for (const name of ["weekly-review.md", "monthly-lint.md"]) {
        const content = fs.readFileSync(path.join(dir, "agents-workflow", name), "utf8");
        expect(content).not.toMatch(/\{\{/);
      }
    } finally { cleanup(); }
  });
});

// ── Personalization (M6) ──────────────────────────────────────────────────────

describe("scaffold — personalization", () => {
  it("contains no personal values from the original author", () => {
    const [dir, cleanup] = tmpDir();
    try {
      const cfg = makeConfig(dir, { name: "Alice", agents: ["cursor"], areas: ["research", "writing"] });
      scaffold(cfg, buildVariables(cfg, TEST_DATE));
      const files = collectFiles(dir);
      const PERSONAL = ["Linh", "linhvuquach", "engineering-craft"];
      for (const rel of files) {
        if (rel.endsWith(".gitkeep")) continue;
        const content = fs.readFileSync(path.join(dir, rel), "utf8");
        for (const pattern of PERSONAL) {
          expect(content, `"${pattern}" found in ${rel}`).not.toContain(pattern);
        }
      }
    } finally { cleanup(); }
  });
});

// ── Full agent subsetting (M6) ────────────────────────────────────────────────

describe("scaffold — full agent subsetting", () => {
  it("agents [claude-code, codex]: CLAUDE.md + AGENTS.md present; .cursorrules absent", () => {
    const [dir, cleanup] = tmpDir();
    try {
      const cfg = makeConfig(dir, { agents: ["claude-code", "codex"] });
      scaffold(cfg, buildVariables(cfg, TEST_DATE));
      expect(fs.existsSync(path.join(dir, "CLAUDE.md"))).toBe(true);
      expect(fs.existsSync(path.join(dir, "AGENTS.md"))).toBe(true);
      expect(fs.existsSync(path.join(dir, ".cursorrules"))).toBe(false);
    } finally { cleanup(); }
  });
});

// ── Raw sources (M6) ──────────────────────────────────────────────────────────

describe("scaffold — raw sources", () => {
  it("custom rawSources create expected dirs; default dirs absent", () => {
    const [dir, cleanup] = tmpDir();
    try {
      const cfg = makeConfig(dir, { rawSources: ["papers", "datasets"] });
      scaffold(cfg, buildVariables(cfg, TEST_DATE));
      expect(fs.existsSync(path.join(dir, "raw", "papers"))).toBe(true);
      expect(fs.existsSync(path.join(dir, "raw", "datasets"))).toBe(true);
      expect(fs.existsSync(path.join(dir, "raw", "articles"))).toBe(false);
    } finally { cleanup(); }
  });
});

// ── No {{ leakage ──────────────────────────────────────────────────────────────

describe("scaffold — no {{ leakage in rendered files", () => {
  it("has no unreplaced {{ in any rendered file", () => {
    const [dir, cleanup] = tmpDir();
    try {
      const cfg = makeConfig(dir);
      scaffold(cfg, buildVariables(cfg, TEST_DATE));
      const files = collectFiles(dir);
      const rendered = files.filter(
        (f) =>
          !f.startsWith("agents-workflow/") &&
          !f.startsWith("90-Meta/Templates/") &&
          !f.endsWith(".gitkeep"),
      );
      for (const rel of rendered) {
        const content = fs.readFileSync(path.join(dir, rel), "utf8");
        expect(content, `{{ found in ${rel}`).not.toMatch(/\{\{/);
      }
    } finally { cleanup(); }
  });
});

// ── Idempotency ───────────────────────────────────────────────────────────────

describe("scaffold — idempotency", () => {
  it("skips existing files on second run (no force)", () => {
    const [dir, cleanup] = tmpDir();
    try {
      const cfg = makeConfig(dir, { agents: ["claude-code"] });
      const vars = buildVariables(cfg, TEST_DATE);
      scaffold(cfg, vars);
      const result2 = scaffold(cfg, vars);
      expect(result2.skipped).toBeGreaterThan(0);
      expect(result2.overwritten).toBe(0);
    } finally { cleanup(); }
  });

  it("first run reports created count > 0", () => {
    const [dir, cleanup] = tmpDir();
    try {
      const cfg = makeConfig(dir, { agents: ["claude-code"] });
      const vars = buildVariables(cfg, TEST_DATE);
      const result = scaffold(cfg, vars);
      expect(result.created).toBeGreaterThan(0);
    } finally { cleanup(); }
  });

  it("overwrites with --force and updated content", () => {
    const [dir, cleanup] = tmpDir();
    try {
      const cfg1 = makeConfig(dir, { agents: ["claude-code"] });
      scaffold(cfg1, buildVariables(cfg1, TEST_DATE));

      const cfg2 = makeConfig(dir, { name: "Alice", agents: ["claude-code"] });
      const result2 = scaffold(cfg2, buildVariables(cfg2, TEST_DATE), { force: true });
      expect(result2.overwritten).toBeGreaterThan(0);
      const content = fs.readFileSync(path.join(dir, "CLAUDE.md"), "utf8");
      expect(content).toContain("Alice");
    } finally { cleanup(); }
  });

  it("ScaffoldResult includes created, skipped, overwritten, and tree", () => {
    const [dir, cleanup] = tmpDir();
    try {
      const cfg = makeConfig(dir, { agents: ["claude-code"] });
      const result = scaffold(cfg, buildVariables(cfg, TEST_DATE));
      expect(typeof result.created).toBe("number");
      expect(typeof result.skipped).toBe("number");
      expect(typeof result.overwritten).toBe("number");
      expect(Array.isArray(result.tree)).toBe(true);
      expect(result.tree.length).toBeGreaterThan(0);
    } finally { cleanup(); }
  });
});

// ── Dry-run ───────────────────────────────────────────────────────────────────

describe("scaffold — dry-run", () => {
  it("writes nothing to disk", () => {
    const [dir, cleanup] = tmpDir();
    try {
      const cfg = makeConfig(dir, { agents: ["claude-code"] });
      scaffold(cfg, buildVariables(cfg, TEST_DATE), { dryRun: true });
      // vault dir should be empty (tmp dir itself exists but nothing written inside)
      const files = collectFiles(dir);
      expect(files).toHaveLength(0);
      // top-level dirs not created either
      expect(fs.existsSync(path.join(dir, "00-Inbox"))).toBe(false);
    } finally { cleanup(); }
  });

  it("returns a non-empty tree of expected paths", () => {
    const [dir, cleanup] = tmpDir();
    try {
      const cfg = makeConfig(dir, { agents: ["claude-code"] });
      const result = scaffold(cfg, buildVariables(cfg, TEST_DATE), { dryRun: true });
      expect(result.tree.length).toBeGreaterThan(0);
      const treeStr = result.tree.join("\n");
      expect(treeStr).toContain("CLAUDE.md");
      expect(treeStr).toContain("README.md");
    } finally { cleanup(); }
  });

  it("dry-run created count equals expected file count", () => {
    const [dir, cleanup] = tmpDir();
    try {
      const cfg = makeConfig(dir, { agents: ["claude-code"] });
      const dryResult = scaffold(cfg, buildVariables(cfg, TEST_DATE), { dryRun: true });
      const realResult = scaffold(cfg, buildVariables(cfg, TEST_DATE));
      expect(dryResult.created).toBe(realResult.created);
    } finally { cleanup(); }
  });
});
