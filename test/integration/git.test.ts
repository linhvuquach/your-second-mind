import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { scaffold } from "../../src/scaffold.js";
import { buildVariables } from "../../src/variables.js";
import { resolve } from "../../src/config.js";
import { isGitAvailable, gitInit } from "../../src/git.js";

const TEST_DATE = new Date("2026-06-29");

function tmpDir(): [string, () => void] {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ysm-git-test-"));
  return [dir, () => fs.rmSync(dir, { recursive: true, force: true })];
}

function makeConfig(vaultPath: string, overrides: Record<string, unknown> = {}) {
  return resolve({ name: "TestUser", vaultPath, gitInit: false, ...overrides } as Parameters<typeof resolve>[0], {});
}

describe("git — isGitAvailable", () => {
  it("returns a boolean", () => {
    expect(typeof isGitAvailable()).toBe("boolean");
  });
});

describe("git — gitInit", () => {
  it.skipIf(!isGitAvailable())("creates .git dir and an initial commit with clean status", () => {
    const [dir, cleanup] = tmpDir();
    try {
      const cfg = makeConfig(dir);
      scaffold(cfg, buildVariables(cfg, TEST_DATE));
      gitInit(dir);

      expect(fs.existsSync(path.join(dir, ".git"))).toBe(true);

      const log = spawnSync("git", ["-C", dir, "log", "--oneline"], { encoding: "utf8" });
      expect(log.stdout.trim().split("\n").length).toBeGreaterThanOrEqual(1);

      const status = spawnSync("git", ["-C", dir, "status", "--porcelain"], { encoding: "utf8" });
      expect(status.stdout.trim()).toBe("");
    } finally {
      cleanup();
    }
  });

  it("no-git: .git directory absent when gitInit is not called", () => {
    const [dir, cleanup] = tmpDir();
    try {
      const cfg = makeConfig(dir);
      scaffold(cfg, buildVariables(cfg, TEST_DATE));
      expect(fs.existsSync(path.join(dir, ".git"))).toBe(false);
    } finally {
      cleanup();
    }
  });
});
