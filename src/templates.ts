import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import path from "node:path";
import type { Agent } from "./config.js";

export const TEMPLATES_DIR = fileURLToPath(new URL("../templates", import.meta.url));

// agent → [destFileName, tmplRelPath]
export const AGENT_FILES: Record<Agent, [string, string]> = {
  "claude-code": ["CLAUDE.md", "schemas/CLAUDE.md.tmpl"],
  cursor: [".cursorrules", "schemas/cursorrules.tmpl"],
  codex: ["AGENTS.md", "schemas/AGENTS.md.tmpl"],
};

// [destFileName, tmplRelPath] — copied verbatim; Templater <% %> syntax preserved
export const NOTE_TEMPLATES: [string, string][] = [
  ["daily-note.md", "notes/daily-note.md.tmpl"],
  ["lit-note.md", "notes/lit-note.md.tmpl"],
  ["evergreen-note.md", "notes/evergreen-note.md.tmpl"],
  ["project-note.md", "notes/project-note.md.tmpl"],
  ["weekly-review.md", "notes/weekly-review.md.tmpl"],
  ["ingest-session.md", "notes/ingest-session.md.tmpl"],
];

// [destFileName, tmplRelPath] — rendered with global vars
export const NAV_FILES: [string, string][] = [
  ["README.md", "vault/README.md.tmpl"],
  ["index.md", "vault/index.md.tmpl"],
  ["log.md", "vault/log.md.tmpl"],
  [".gitignore", "vault/gitignore.tmpl"],
];

// [destFileName, tmplRelPath] — copied verbatim; $CURRENT_DATE/$ARGUMENTS must survive
export const COMMAND_FILES: [string, string][] = [
  ["weekly-review.md", "agents-workflow/weekly-review.md"],
  ["monthly-lint.md", "agents-workflow/monthly-lint.md"],
  ["README.md", "agents-workflow/README.md"],
];

export const TOP_FOLDERS = [
  "00-Inbox",
  "10-Daily",
  "20-Projects",
  "30-Areas",
  "40-Resources",
  "50-Slipbox",
  "60-MOCs",
  "70-People",
  "80-Archive",
  "90-Meta",
] as const;

export type TopFolder = (typeof TOP_FOLDERS)[number];

export const FOLDER_META: Record<TopFolder, { purpose: string; agentInstruction: string }> = {
  "00-Inbox": {
    purpose: "Raw captures. Triage during weekly review.",
    agentInstruction:
      "When asked to triage inbox, read this folder, propose where each item belongs, ask before moving.",
  },
  "10-Daily": {
    purpose: "Daily journal entries. Filename YYYY-MM-DD.md.",
    agentInstruction:
      "Use the daily-note template in 90-Meta/Templates/ when creating daily notes.",
  },
  "20-Projects": {
    purpose: "Active projects. Each project has an _index.md to read first.",
    agentInstruction: "Read the project _index.md before touching files in a project folder.",
  },
  "30-Areas": {
    purpose: "Ongoing areas of responsibility.",
    agentInstruction: "Read the area _index.md before touching files in an area folder.",
  },
  "40-Resources": {
    purpose: "Reference material and learning notes (wiki layer).",
    agentInstruction: "Maintain and update this as the wiki layer during ingests.",
  },
  "50-Slipbox": {
    purpose: "Atomic evergreen notes. Every title is a full-sentence claim.",
    agentInstruction:
      "Titles must be full-sentence claims. Check related notes to avoid duplicates before creating.",
  },
  "60-MOCs": {
    purpose: "Hand-curated Maps of Content (index notes).",
    agentInstruction:
      "Generate MOCs on request; link back from each indexed note to its MOC.",
  },
  "70-People": {
    purpose: "One file per person.",
    agentInstruction: "One file per person; update when relevant context changes.",
  },
  "80-Archive": {
    purpose: "Read-only history. Do not modify.",
    agentInstruction: "Never modify or delete files here.",
  },
  "90-Meta": {
    purpose: "Templates and AI session summaries.",
    agentInstruction:
      "Write session summaries to 90-Meta/AI-Sessions/YYYY-MM-DD-<topic>.md.",
  },
};

export function readTemplate(relPath: string): string {
  return readFileSync(path.join(TEMPLATES_DIR, relPath), "utf8");
}
