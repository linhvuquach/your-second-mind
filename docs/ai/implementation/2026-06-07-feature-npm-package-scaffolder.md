---
phase: implementation
title: Implementation Guide
description: Technical implementation notes, patterns, and code guidelines
---

# Implementation Guide

> **Revision (2026-06-20):** Implementation guide for the `your-second-mind` npm package
> (TypeScript + ESM, Node 20+). Stack: `@clack/prompts`, `node:util parseArgs`, `tsup`,
> `vitest`, `picocolors`. See the design doc for architecture and module responsibilities.

## Development Setup

**Prerequisites:** Node 20+, npm.

```bash
npm install            # @clack/prompts, picocolors (runtime); typescript, tsup, vitest, @types/node (dev)
npm run dev            # tsup --watch (rebuild on change)
npm run build          # tsup → dist/cli.js (ESM, .d.ts, shebang)
npm run typecheck      # tsc --noEmit
npm test               # vitest run
node dist/cli.js --dry-run --name Alice   # local smoke run
```

`package.json` essentials: `"type": "module"`, `"bin": { "your-second-mind": "dist/cli.js" }`,
`"engines": { "node": ">=20" }`, `"files": ["dist", "templates"]`.

## Code Structure

```
src/
  cli.ts        # bin entry: Node-version gate, parseArgs, dispatch, error boundary
  args.ts       # parseArgs schema → { partialConfig, runFlags }
  prompts.ts    # @clack interactive flow + isCancel handling
  config.ts     # Config/Agent types, DEFAULTS, resolve(), validate(), ConfigError
  variables.ts  # buildVariables(config, date) → Record<string,string>
  render.ts     # renderTemplate(content, vars)
  templates.ts  # TEMPLATES_DIR, AGENT_FILES, NOTE_TEMPLATES, NAV_FILES, FOLDER_META, COMMAND_FILES
  scaffold.ts   # createDirs + writeFiles (idempotent/force/dry-run) → ScaffoldResult
  git.ts        # isGitAvailable(), gitInit()
  ui.ts         # intro/outro, summary, picocolors helpers
templates/      # shipped verbatim; read at runtime (NOT bundled)
test/{unit,integration}/
```

**Naming:** camelCase fns/vars, PascalCase types, SCREAMING_SNAKE module constants
(`DEFAULTS`, `AGENT_FILES`, `FOLDER_META`). One responsibility per module.

## Implementation Notes

### Core features
- **Config resolution** (`config.ts`): `resolve(flags, answers)` layers `DEFAULTS ← flags ←
  answers`, expands `~` via `os.homedir()`. `validate()` throws `ConfigError` (non-empty
  `name`, ≥1 area, ≥1 valid agent). Keep this module **pure** (no FS) for unit testing.
- **Variable build** (`variables.ts`): `buildVariables(config, date)` — `date` is **injected**
  (captured once in `cli.ts` as `new Date()`), never read inside pure code, so tests are
  deterministic. Per-folder vars (`{{FOLDER_*}}`) are injected during `_index.md` render, not here.
- **Render** (`render.ts`): `for (const [k,v] of Object.entries(vars)) content =
  content.replaceAll('{{'+k+'}}', v)`. Unknown `{{X}}` left intact — the integration test's
  no-leak scan catches genuine misses.
- **Scaffold** (`scaffold.ts`): create dirs → write agent schemas (only `config.agents`) →
  nav files → one `_index.md` per folder → all 6 note templates → **copy `agents-workflow/*`
  verbatim**. Returns `ScaffoldResult { created, skipped, overwritten, tree }`. `dryRun`
  builds the tree and writes nothing.

### Patterns & best practices
- **Pure core / effectful edges:** `config`/`variables`/`render` are side-effect-free;
  `scaffold`/`git`/`prompts`/`ui` own all I/O. Test the core without a filesystem.
- **Template path resolution (critical):**
  ```ts
  import { fileURLToPath } from "node:url";
  export const TEMPLATES_DIR = fileURLToPath(new URL("../templates", import.meta.url));
  ```
  Resolve relative to the compiled module, **never `process.cwd()`**. `dist/cli.js → ../templates`.
- **Verbatim command files:** `agents-workflow/{weekly-review,monthly-lint}.md` are **copied,
  not rendered** — they carry agent-runtime `$CURRENT_DATE`/`$ARGUMENTS` that must survive.
  Never route them through `renderTemplate`.
- **`{{DATE}}` once per run:** single `new Date()` in `cli.ts`, threaded through.

## Integration Points

- **Filesystem:** `node:fs` (`mkdir {recursive}`, `writeFile`, `existsSync` for skip checks).
  All writes confined to the resolved target dir.
- **git:** `node:child_process` `spawnSync('git', …)`; `isGitAvailable()` guards `git --version`
  before init/add/commit.
- **Prompts:** `@clack/prompts` (`intro`, `text`, `multiselect`, `confirm`, `outro`, `isCancel`).
- **Bundled assets:** `templates/` read via `TEMPLATES_DIR`; shipped through the `files` whitelist.

## Error Handling

- **Single error boundary** in `cli.ts` `main()` try/catch:
  - `ConfigError` → print message to stderr, exit 1.
  - `@clack` cancel (`isCancel`) → print "Cancelled.", exit 1, **before any write**.
  - Unexpected error → print message, exit 1.
- **Node-version gate** runs first (before parseArgs): major `< 20` → "Node 20+ required", exit 1.
- **Missing git** is non-fatal: warn and skip the git step; scaffold still succeeds.
- **Idempotency:** existing files skipped (counted) unless `--force`; never destructive without it.
- No partial-on-error garbage: validation completes before the first write.

## Performance Considerations

- One-shot CLI; target full scaffold < 2s. No caching/optimization needed.
- Read each template once; small file count. Avoid re-reading `TEMPLATES_DIR` per file
  beyond what's necessary.

## Security Notes

- **No network, no secrets** at runtime — purely local filesystem scaffolding.
- **No auth.** The only credential in the project is the **npm publish token** (`NODE_AUTH_TOKEN`),
  used in CI only — never committed (see deployment doc).
- **Path safety:** confine writes to the resolved target dir; expand `~` but do not follow
  user input outside the chosen vault path.
- **Supply chain:** runtime deps limited to `@clack/prompts` + `picocolors`; pin and review
  on bump. `npm pack` audit (testing doc) ensures no personal data ships.
- **Input validation:** `validate()` rejects empty/invalid config before any write.
