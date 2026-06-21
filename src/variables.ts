import type { Agent, Config } from "./config.js";

const AGENT_DISPLAY: Record<Agent, string> = {
  "claude-code": "Claude Code",
  cursor: "Cursor",
  codex: "Codex",
};

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function toBullets(items: string[]): string {
  return items.map((s) => `- ${s}`).join("\n");
}

export function buildVariables(config: Config, date: Date): Record<string, string> {
  return {
    NAME: config.name,
    ROLE: config.role,
    LANGUAGE: config.language,
    WRITING_STYLE: config.writingStyle,
    VAULT_PATH: config.vaultPath,
    AREAS_LIST: toBullets(config.areas.map((a) => `area-${a}`)),
    AREAS_FOLDERS: config.areas.map((a) => `30-Areas/area-${a}/`).join("\n"),
    RAW_SOURCES_LIST: config.rawSources.map((s) => `raw/${s}/`).join(", "),
    AGENTS_USED: config.agents.map((a) => AGENT_DISPLAY[a]).join(", "),
    DATE: formatDate(date),
    PLUGINS_CORE: toBullets(config.obsidianPlugins.core),
    PLUGINS_AI: toBullets(config.obsidianPlugins.ai),
  };
}
