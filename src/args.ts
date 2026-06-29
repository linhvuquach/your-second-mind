import { parseArgs } from "node:util";
import type { Config, Agent } from "./config.js";

export interface RunFlags {
  yes: boolean;
  dryRun: boolean;
  force: boolean;
  noGit: boolean;
  help: boolean;
  version: boolean;
}

export interface ParsedArgs {
  partialConfig: Partial<Config>;
  runFlags: RunFlags;
}

export function parseCliArgs(argv = process.argv.slice(2)): ParsedArgs {
  const { values } = parseArgs({
    args: argv,
    options: {
      yes: { type: "boolean", short: "y", default: false },
      name: { type: "string" },
      role: { type: "string" },
      "vault-path": { type: "string" },
      areas: { type: "string" },
      "raw-sources": { type: "string" },
      agents: { type: "string" },
      "no-git": { type: "boolean", default: false },
      "dry-run": { type: "boolean", default: false },
      force: { type: "boolean", default: false },
      help: { type: "boolean", short: "h", default: false },
      version: { type: "boolean", short: "V", default: false },
    },
    strict: true,
  });

  const partialConfig: Partial<Config> = {};
  if (values.name !== undefined) partialConfig.name = values.name;
  if (values.role !== undefined) partialConfig.role = values.role;
  if (values["vault-path"] !== undefined) partialConfig.vaultPath = values["vault-path"];
  if (values.areas !== undefined)
    partialConfig.areas = values.areas.split(",").map((s) => s.trim()).filter(Boolean);
  if (values["raw-sources"] !== undefined)
    partialConfig.rawSources = values["raw-sources"].split(",").map((s) => s.trim()).filter(Boolean);
  if (values.agents !== undefined)
    partialConfig.agents = values.agents.split(",").map((s) => s.trim()).filter(Boolean) as Agent[];
  if (values["no-git"]) partialConfig.gitInit = false;

  return {
    partialConfig,
    runFlags: {
      yes: values.yes ?? false,
      dryRun: values["dry-run"] ?? false,
      force: values.force ?? false,
      noGit: values["no-git"] ?? false,
      help: values.help ?? false,
      version: values.version ?? false,
    },
  };
}
