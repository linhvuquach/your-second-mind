import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const CLI = fileURLToPath(new URL("../../dist/cli.js", import.meta.url));
const DIST_EXISTS = fs.existsSync(CLI);

function run(args: string[], cwd?: string) {
  return spawnSync("node", [CLI, ...args], {
    encoding: "utf8",
    cwd: cwd ?? process.cwd(),
    timeout: 10_000,
  });
}

describe.skipIf(!DIST_EXISTS)("CLI — exit codes", () => {
  it("--version exits 0 and prints a semver string", () => {
    const r = run(["--version"]);
    expect(r.status).toBe(0);
    expect(r.stdout.trim()).toMatch(/^\d+\.\d+\.\d+/);
  });

  it("--help exits 0 and contains Usage:", () => {
    const r = run(["--help"]);
    expect(r.status).toBe(0);
    expect(r.stdout).toContain("Usage:");
    expect(r.stdout).toContain("--dry-run");
  });

  it("--yes without --name exits 1, stderr mentions name", () => {
    const r = run(["--yes", "--vault-path", "/tmp/never"]);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain("name");
  });

  it("unknown flag exits 1 with error message", () => {
    const r = run(["--unknown-flag"]);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain("unknown-flag");
  });

  it("--agents with invalid agent exits 1, stderr mentions valid options", () => {
    const r = run(["--yes", "--name", "Alice", "--no-git", "--agents", "vim"]);
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/vim|valid|agent/i);
  });

  it("--yes --name Alice --no-git --dry-run exits 0 and writes nothing", () => {
    const vault = fs.mkdtempSync(path.join(os.tmpdir(), "ysm-cli-test-"));
    try {
      const r = run(["--yes", "--name", "Alice", "--vault-path", vault, "--no-git", "--dry-run"]);
      expect(r.status).toBe(0);
      expect(fs.readdirSync(vault)).toHaveLength(0);
    } finally {
      fs.rmSync(vault, { recursive: true, force: true });
    }
  });
});

describe.skipIf(!DIST_EXISTS)("CLI — template path resolution from different CWD", () => {
  it("resolves templates via import.meta.url regardless of CWD", () => {
    const vault = fs.mkdtempSync(path.join(os.tmpdir(), "ysm-cli-cwd-test-"));
    try {
      const r = run(
        ["--yes", "--name", "DistTest", "--vault-path", vault, "--no-git", "--agents", "claude-code"],
        os.tmpdir(),
      );
      expect(r.status).toBe(0);
      expect(fs.existsSync(path.join(vault, "CLAUDE.md"))).toBe(true);
      expect(fs.existsSync(path.join(vault, "00-Inbox", "_index.md"))).toBe(true);
      const content = fs.readFileSync(path.join(vault, "CLAUDE.md"), "utf8");
      expect(content).toContain("DistTest");
      expect(content).not.toMatch(/\{\{/);
    } finally {
      fs.rmSync(vault, { recursive: true, force: true });
    }
  });
});
