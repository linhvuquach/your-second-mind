import { describe, it, expect } from "vitest";
import path from "node:path";
import { existsSync } from "node:fs";
import {
  TEMPLATES_DIR,
  AGENT_FILES,
  NOTE_TEMPLATES,
  NAV_FILES,
  COMMAND_FILES,
  FOLDER_META,
  TOP_FOLDERS,
  readTemplate,
} from "../../src/templates.js";

describe("TEMPLATES_DIR", () => {
  it("points to an existing directory", () => {
    expect(existsSync(TEMPLATES_DIR)).toBe(true);
  });
});

describe("AGENT_FILES", () => {
  it("maps claude-code to CLAUDE.md", () => {
    expect(AGENT_FILES["claude-code"][0]).toBe("CLAUDE.md");
  });
  it("maps cursor to .cursorrules", () => {
    expect(AGENT_FILES["cursor"][0]).toBe(".cursorrules");
  });
  it("maps codex to AGENTS.md", () => {
    expect(AGENT_FILES["codex"][0]).toBe("AGENTS.md");
  });
  it("all template paths exist on disk", () => {
    for (const [, tmplPath] of Object.values(AGENT_FILES)) {
      expect(existsSync(path.join(TEMPLATES_DIR, tmplPath))).toBe(true);
    }
  });
});

describe("NOTE_TEMPLATES", () => {
  it("has exactly 6 entries", () => {
    expect(NOTE_TEMPLATES).toHaveLength(6);
  });
  it("includes all expected note types", () => {
    const destNames = NOTE_TEMPLATES.map(([d]) => d);
    expect(destNames).toContain("daily-note.md");
    expect(destNames).toContain("lit-note.md");
    expect(destNames).toContain("evergreen-note.md");
    expect(destNames).toContain("project-note.md");
    expect(destNames).toContain("weekly-review.md");
    expect(destNames).toContain("ingest-session.md");
  });
  it("all template paths exist on disk", () => {
    for (const [, tmplPath] of NOTE_TEMPLATES) {
      expect(existsSync(path.join(TEMPLATES_DIR, tmplPath))).toBe(true);
    }
  });
});

describe("NAV_FILES", () => {
  it("has exactly 4 entries", () => {
    expect(NAV_FILES).toHaveLength(4);
  });
  it("includes README.md, index.md, log.md, .gitignore", () => {
    const destNames = NAV_FILES.map(([d]) => d);
    expect(destNames).toContain("README.md");
    expect(destNames).toContain("index.md");
    expect(destNames).toContain("log.md");
    expect(destNames).toContain(".gitignore");
  });
  it("all template paths exist on disk", () => {
    for (const [, tmplPath] of NAV_FILES) {
      expect(existsSync(path.join(TEMPLATES_DIR, tmplPath))).toBe(true);
    }
  });
});

describe("COMMAND_FILES", () => {
  it("has exactly 3 entries", () => {
    expect(COMMAND_FILES).toHaveLength(3);
  });
  it("includes weekly-review.md, monthly-lint.md, README.md", () => {
    const destNames = COMMAND_FILES.map(([d]) => d);
    expect(destNames).toContain("weekly-review.md");
    expect(destNames).toContain("monthly-lint.md");
    expect(destNames).toContain("README.md");
  });
  it("all template paths exist on disk", () => {
    for (const [, tmplPath] of COMMAND_FILES) {
      expect(existsSync(path.join(TEMPLATES_DIR, tmplPath))).toBe(true);
    }
  });
});

describe("TOP_FOLDERS", () => {
  it("has exactly 10 entries", () => {
    expect(TOP_FOLDERS).toHaveLength(10);
  });
  it("starts with 00-Inbox and ends with 90-Meta", () => {
    expect(TOP_FOLDERS[0]).toBe("00-Inbox");
    expect(TOP_FOLDERS[TOP_FOLDERS.length - 1]).toBe("90-Meta");
  });
});

describe("FOLDER_META", () => {
  it("has an entry for every TOP_FOLDER", () => {
    for (const folder of TOP_FOLDERS) {
      expect(FOLDER_META).toHaveProperty(folder);
    }
  });
  it("each entry has a non-empty purpose", () => {
    for (const [, meta] of Object.entries(FOLDER_META)) {
      expect(typeof meta.purpose).toBe("string");
      expect(meta.purpose.length).toBeGreaterThan(0);
    }
  });
  it("each entry has a non-empty agentInstruction", () => {
    for (const [, meta] of Object.entries(FOLDER_META)) {
      expect(typeof meta.agentInstruction).toBe("string");
      expect(meta.agentInstruction.length).toBeGreaterThan(0);
    }
  });
});

describe("readTemplate", () => {
  it("reads the CLAUDE.md.tmpl and contains {{NAME}}", () => {
    const content = readTemplate("schemas/CLAUDE.md.tmpl");
    expect(content).toContain("{{NAME}}");
  });
  it("reads the _index.md.tmpl and contains {{FOLDER_NAME}}", () => {
    const content = readTemplate("vault/_index.md.tmpl");
    expect(content).toContain("{{FOLDER_NAME}}");
  });
  it("preserves Templater syntax in note templates", () => {
    const content = readTemplate("notes/daily-note.md.tmpl");
    expect(content).toContain("<% tp.date.now");
  });
  it("preserves $CURRENT_DATE in command files", () => {
    const content = readTemplate("agents-workflow/weekly-review.md");
    expect(content).toContain("$CURRENT_DATE");
  });
});
