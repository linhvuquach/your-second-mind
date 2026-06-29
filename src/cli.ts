import { createRequire } from "node:module";
import { parseCliArgs } from "./args.js";
import { resolve, validate, ConfigError, type Config } from "./config.js";
import { buildVariables } from "./variables.js";
import { scaffold } from "./scaffold.js";
import { isGitAvailable, gitInit } from "./git.js";
import { runPrompts } from "./prompts.js";
import { printSummary, printOutro } from "./ui.js";

const _require = createRequire(import.meta.url);
const PKG_VERSION = (_require("../package.json") as { version: string }).version;

const NODE_MAJOR = Number(process.versions.node.split(".")[0]);

function printHelp(): void {
  console.log(
    `your-second-mind v${PKG_VERSION}

Scaffold a personalized PARA + Zettelkasten Obsidian vault.

Usage:
  npx your-second-mind@latest [options]

Options:
  --name <s>           Your name (required with --yes)
  --role <s>           Your role
  --vault-path <p>     Target vault directory (default: ~/Documents/second-brain)
  --areas <a,b,...>    Comma-separated areas
  --raw-sources <a,b>  Comma-separated raw source types
  --agents <a,b>       Agents: claude-code,cursor,codex (default: all)
  --no-git             Skip git init
  --dry-run            Preview files without writing
  --force              Overwrite existing files
  -y, --yes            Non-interactive (--name required)
  -h, --help           Show help
  -V, --version        Show version`,
  );
}

async function main(): Promise<void> {
  if (NODE_MAJOR < 20) {
    process.stderr.write("your-second-mind requires Node 20+.\n");
    process.exit(1);
  }

  let parsed: ReturnType<typeof parseCliArgs>;
  try {
    parsed = parseCliArgs();
  } catch (err) {
    process.stderr.write(`Error: ${(err as Error).message}\n`);
    process.exit(1);
  }

  const { partialConfig, runFlags } = parsed;

  if (runFlags.help) {
    printHelp();
    process.exit(0);
  }
  if (runFlags.version) {
    console.log(PKG_VERSION);
    process.exit(0);
  }

  try {
    let answers: Partial<Config> = {};
    if (!runFlags.yes) {
      answers = await runPrompts();
    }

    const config = resolve(partialConfig, answers);
    validate(config);

    const date = new Date();
    const vars = buildVariables(config, date);
    const result = scaffold(config, vars, { force: runFlags.force, dryRun: runFlags.dryRun });

    let gitDone = false;
    if (!runFlags.dryRun && config.gitInit) {
      if (isGitAvailable()) {
        gitInit(config.vaultPath);
        gitDone = true;
      } else {
        process.stderr.write("git not found — skipping git init.\n");
      }
    }

    printSummary(result, runFlags.dryRun);
    printOutro(config.vaultPath, gitDone);
  } catch (err) {
    if (err instanceof ConfigError) {
      process.stderr.write(`Error: ${err.message}\n`);
      process.exit(1);
    }
    throw err;
  }
}

main();
