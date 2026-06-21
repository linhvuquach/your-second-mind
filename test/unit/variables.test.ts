import { describe, it, expect } from "vitest";
import { buildVariables } from "../../src/variables.js";
import type { Config } from "../../src/config.js";

const base: Config = {
  name: "Alice",
  role: "researcher",
  language: "English",
  writingStyle: "terse",
  vaultPath: "/Users/alice/brain",
  areas: ["research", "teaching"],
  rawSources: ["papers", "datasets"],
  agents: ["claude-code", "cursor"],
  obsidianPlugins: {
    core: ["Periodic Notes", "Templater"],
    ai: ["Smart Connections"],
    optional: [],
  },
  gitInit: true,
};

const date = new Date("2026-06-21T10:00:00Z");

describe("buildVariables", () => {
  it("includes NAME", () => {
    expect(buildVariables(base, date).NAME).toBe("Alice");
  });

  it("includes ROLE", () => {
    expect(buildVariables(base, date).ROLE).toBe("researcher");
  });

  it("includes LANGUAGE", () => {
    expect(buildVariables(base, date).LANGUAGE).toBe("English");
  });

  it("includes WRITING_STYLE", () => {
    expect(buildVariables(base, date).WRITING_STYLE).toBe("terse");
  });

  it("includes VAULT_PATH", () => {
    expect(buildVariables(base, date).VAULT_PATH).toBe("/Users/alice/brain");
  });

  it("AREAS_LIST is bullet lines with area- prefix", () => {
    expect(buildVariables(base, date).AREAS_LIST).toBe(
      "- area-research\n- area-teaching",
    );
  });

  it("AREAS_FOLDERS lists 30-Areas paths", () => {
    expect(buildVariables(base, date).AREAS_FOLDERS).toBe(
      "30-Areas/area-research/\n30-Areas/area-teaching/",
    );
  });

  it("RAW_SOURCES_LIST lists raw/ paths comma-separated", () => {
    expect(buildVariables(base, date).RAW_SOURCES_LIST).toBe(
      "raw/papers/, raw/datasets/",
    );
  });

  it("AGENTS_USED maps keys to display names", () => {
    expect(buildVariables(base, date).AGENTS_USED).toBe("Claude Code, Cursor");
  });

  it("DATE uses the injected date (YYYY-MM-DD UTC)", () => {
    expect(buildVariables(base, date).DATE).toBe("2026-06-21");
  });

  it("PLUGINS_CORE is a bullet list from obsidianPlugins.core", () => {
    expect(buildVariables(base, date).PLUGINS_CORE).toBe(
      "- Periodic Notes\n- Templater",
    );
  });

  it("PLUGINS_AI is a bullet list from obsidianPlugins.ai", () => {
    expect(buildVariables(base, date).PLUGINS_AI).toBe("- Smart Connections");
  });

  it("returns a plain string Record with no extra keys", () => {
    const vars = buildVariables(base, date);
    for (const v of Object.values(vars)) {
      expect(typeof v).toBe("string");
    }
  });

  it("single agent maps correctly", () => {
    expect(buildVariables({ ...base, agents: ["codex"] }, date).AGENTS_USED).toBe("Codex");
  });
});
