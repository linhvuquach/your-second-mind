import { describe, it, expect } from "vitest";
import { parseCliArgs } from "../../src/args.js";

describe("parseCliArgs — booleans", () => {
  it("parses --yes as runFlags.yes=true", () => {
    const { runFlags } = parseCliArgs(["--yes"]);
    expect(runFlags.yes).toBe(true);
  });

  it("parses -y short form as runFlags.yes=true", () => {
    const { runFlags } = parseCliArgs(["-y"]);
    expect(runFlags.yes).toBe(true);
  });

  it("parses --dry-run as runFlags.dryRun=true", () => {
    const { runFlags } = parseCliArgs(["--dry-run"]);
    expect(runFlags.dryRun).toBe(true);
  });

  it("parses --force as runFlags.force=true", () => {
    const { runFlags } = parseCliArgs(["--force"]);
    expect(runFlags.force).toBe(true);
  });

  it("parses --no-git as runFlags.noGit=true", () => {
    const { runFlags } = parseCliArgs(["--no-git"]);
    expect(runFlags.noGit).toBe(true);
  });

  it("all flags default to false with no args", () => {
    const { runFlags } = parseCliArgs([]);
    expect(runFlags.yes).toBe(false);
    expect(runFlags.dryRun).toBe(false);
    expect(runFlags.force).toBe(false);
    expect(runFlags.noGit).toBe(false);
    expect(runFlags.help).toBe(false);
    expect(runFlags.version).toBe(false);
  });
});

describe("parseCliArgs — string flags", () => {
  it("parses --name into partialConfig.name", () => {
    const { partialConfig } = parseCliArgs(["--name", "Alice"]);
    expect(partialConfig.name).toBe("Alice");
  });

  it("parses --vault-path into partialConfig.vaultPath", () => {
    const { partialConfig } = parseCliArgs(["--vault-path", "/tmp/vault"]);
    expect(partialConfig.vaultPath).toBe("/tmp/vault");
  });

  it("parses --role into partialConfig.role", () => {
    const { partialConfig } = parseCliArgs(["--role", "researcher"]);
    expect(partialConfig.role).toBe("researcher");
  });

  it("partialConfig is empty when no config flags provided", () => {
    const { partialConfig } = parseCliArgs([]);
    expect(Object.keys(partialConfig)).toHaveLength(0);
  });
});

describe("parseCliArgs — comma-split list flags", () => {
  it("splits --areas into an array", () => {
    const { partialConfig } = parseCliArgs(["--areas", "research,writing,teaching"]);
    expect(partialConfig.areas).toEqual(["research", "writing", "teaching"]);
  });

  it("splits --agents into an array", () => {
    const { partialConfig } = parseCliArgs(["--agents", "claude-code,cursor"]);
    expect(partialConfig.agents).toEqual(["claude-code", "cursor"]);
  });

  it("splits --raw-sources into an array", () => {
    const { partialConfig } = parseCliArgs(["--raw-sources", "papers,datasets"]);
    expect(partialConfig.rawSources).toEqual(["papers", "datasets"]);
  });

  it("trims whitespace from comma-split items", () => {
    const { partialConfig } = parseCliArgs(["--areas", "research, writing , teaching"]);
    expect(partialConfig.areas).toEqual(["research", "writing", "teaching"]);
  });
});

describe("parseCliArgs — --no-git", () => {
  it("sets partialConfig.gitInit=false when --no-git provided", () => {
    const { partialConfig } = parseCliArgs(["--no-git"]);
    expect(partialConfig.gitInit).toBe(false);
  });

  it("does not set partialConfig.gitInit when --no-git absent", () => {
    const { partialConfig } = parseCliArgs([]);
    expect(partialConfig.gitInit).toBeUndefined();
  });
});

describe("parseCliArgs — unknown flag", () => {
  it("throws on an unknown flag", () => {
    expect(() => parseCliArgs(["--unknown-flag"])).toThrow();
  });
});
