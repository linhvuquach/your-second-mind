import os from "node:os";

export type Agent = "claude-code" | "cursor" | "codex";

export interface Config {
  name: string;
  role: string;
  language: string;
  writingStyle: string;
  vaultPath: string;
  areas: string[];
  rawSources: string[];
  agents: Agent[];
  obsidianPlugins: { core: string[]; ai: string[]; optional: string[] };
  gitInit: boolean;
}

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
  }
}

const VALID_AGENTS = new Set<string>(["claude-code", "cursor", "codex"]);

export const DEFAULTS: Omit<Config, "name"> = {
  role: "software engineer",
  language: "English",
  writingStyle: "terse, prefer bullets over prose",
  vaultPath: "~/Documents/second-brain",
  areas: ["engineering-craft", "career", "learning", "side-projects"],
  rawSources: ["articles", "books", "videos", "podcasts", "assets"],
  agents: ["claude-code", "cursor", "codex"],
  obsidianPlugins: {
    core: ["Periodic Notes", "Templater", "Dataview", "Calendar"],
    ai: ["Smart Connections", "Copilot"],
    optional: ["Excalidraw", "Kanban"],
  },
  gitInit: true,
};

function omitUndefined<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined),
  ) as Partial<T>;
}

export function resolve(flags: Partial<Config>, answers: Partial<Config>): Config {
  const merged = {
    ...DEFAULTS,
    ...omitUndefined(flags),
    ...omitUndefined(answers),
  } as Config;
  merged.vaultPath = merged.vaultPath.replace(/^~(?=\/|$)/, os.homedir());
  return merged;
}

export function validate(config: Config): void {
  if (!config.name?.trim()) {
    throw new ConfigError("--name is required and must be non-empty.");
  }
  if (config.areas.length === 0) {
    throw new ConfigError("At least one area is required.");
  }
  if (config.agents.length === 0) {
    throw new ConfigError("At least one agent must be selected.");
  }
  for (const agent of config.agents) {
    if (!VALID_AGENTS.has(agent)) {
      throw new ConfigError(
        `Unknown agent "${agent}". Valid agents: ${[...VALID_AGENTS].join(", ")}.`,
      );
    }
  }
}
