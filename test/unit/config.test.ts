import { describe, it, expect } from "vitest";
import os from "node:os";
import { DEFAULTS, resolve, validate, ConfigError } from "../../src/config.js";
import type { Config } from "../../src/config.js";

describe("DEFAULTS", () => {
  it("has expected role", () => expect(DEFAULTS.role).toBe("software engineer"));
  it("has expected language", () => expect(DEFAULTS.language).toBe("English"));
  it("has expected writingStyle", () => expect(DEFAULTS.writingStyle).toBe("terse, prefer bullets over prose"));
  it("has expected vaultPath (unexpanded)", () => expect(DEFAULTS.vaultPath).toBe("~/Documents/second-brain"));
  it("has 4 default areas", () => expect(DEFAULTS.areas).toHaveLength(4));
  it("has 3 default agents", () => expect(DEFAULTS.agents).toHaveLength(3));
  it("has gitInit true", () => expect(DEFAULTS.gitInit).toBe(true));
});

describe("resolve", () => {
  it("returns all defaults when called with empty objects", () => {
    const config = resolve({}, {});
    expect(config.role).toBe(DEFAULTS.role);
    expect(config.areas).toEqual(DEFAULTS.areas);
    expect(config.agents).toEqual(DEFAULTS.agents);
  });

  it("flag values override defaults", () => {
    const config = resolve({ role: "researcher" }, {});
    expect(config.role).toBe("researcher");
    expect(config.language).toBe(DEFAULTS.language);
  });

  it("answers override flags", () => {
    const config = resolve({ role: "researcher" }, { role: "designer" });
    expect(config.role).toBe("designer");
  });

  it("expands ~ in vaultPath", () => {
    const config = resolve({}, {});
    expect(config.vaultPath).toBe(`${os.homedir()}/Documents/second-brain`);
  });

  it("expands ~ in a custom vaultPath from flags", () => {
    const config = resolve({ vaultPath: "~/my-brain" }, {});
    expect(config.vaultPath).toBe(`${os.homedir()}/my-brain`);
  });

  it("does not expand ~ if path is already absolute", () => {
    const config = resolve({ vaultPath: "/absolute/path" }, {});
    expect(config.vaultPath).toBe("/absolute/path");
  });

  it("ignores undefined flag values (does not clobber defaults)", () => {
    const config = resolve({ areas: undefined }, {});
    expect(config.areas).toEqual(DEFAULTS.areas);
  });

  it("answers name is propagated", () => {
    const config = resolve({}, { name: "Alice" });
    expect(config.name).toBe("Alice");
  });
});

describe("validate", () => {
  const valid: Config = {
    name: "Alice",
    role: "researcher",
    language: "English",
    writingStyle: "terse",
    vaultPath: "/tmp/brain",
    areas: ["research"],
    rawSources: ["papers"],
    agents: ["cursor"],
    obsidianPlugins: { core: [], ai: [], optional: [] },
    gitInit: false,
  };

  it("passes on a valid config", () => {
    expect(() => validate(valid)).not.toThrow();
  });

  it("throws ConfigError when name is empty", () => {
    expect(() => validate({ ...valid, name: "" })).toThrow(ConfigError);
  });

  it("throws ConfigError when name is whitespace only", () => {
    expect(() => validate({ ...valid, name: "   " })).toThrow(ConfigError);
  });

  it("throws ConfigError when areas is empty", () => {
    expect(() => validate({ ...valid, areas: [] })).toThrow(ConfigError);
  });

  it("throws ConfigError when agents is empty", () => {
    expect(() => validate({ ...valid, agents: [] })).toThrow(ConfigError);
  });

  it("throws ConfigError on an unrecognised agent string", () => {
    expect(() => validate({ ...valid, agents: ["vscode" as never] })).toThrow(ConfigError);
  });

  it("ConfigError has a message", () => {
    try {
      validate({ ...valid, name: "" });
    } catch (e) {
      expect(e).toBeInstanceOf(ConfigError);
      expect((e as ConfigError).message).toBeTruthy();
    }
  });
});
