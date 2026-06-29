---
phase: planning
title: Project Planning & Task Breakdown
description: Break down work into actionable tasks and estimate timeline
---

# Project Planning & Task Breakdown

> **Revision (2026-06-20):** Rebuilt for the **`your-second-mind` npm package** (TypeScript +
> ESM, Node 20+). The prior Python `setup.py` task breakdown is **dropped**. No code exists
> yet — this is a greenfield plan; all tasks below are **not started**. Stack per the design
> doc: `@clack/prompts`, `node:util parseArgs`, `tsup`, `vitest`, `picocolors`.

## Status at a glance

- **Done:** M1 (Project scaffold) — 2026-06-21; M2 (Pure core) — 2026-06-21; M3 (Templates) — 2026-06-21; M4 (Scaffold writer) — 2026-06-28; M5 (CLI surface) — 2026-06-29; M6 (Integration tests) — 2026-06-29
- **In progress:** none
- **Blocked:** none
- **Not started:** M7–M8 below

## Milestones

- [x] **M1 — Project scaffold:** `package.json` (bin, ESM, engines, files), `tsconfig`, `tsup`, `vitest`, `src/`+`templates/`+`test/` skeleton
- [x] **M2 — Pure core:** `config.ts`, `variables.ts`, `render.ts` + unit tests (no FS)
- [x] **M3 — Templates extracted & parameterized:** schemas, vault, notes (6), `agents-workflow/` (2 commands + README)
- [x] **M4 — Scaffold writer:** dir creation + idempotent/force/dry-run file writing → `ScaffoldResult`
- [x] **M5 — CLI surface:** `args.ts`, `prompts.ts`, `cli.ts`, `git.ts`, `ui.ts`
- [x] **M6 — Integration tests:** tmp-dir scaffold, no-`{{`-leak, personalization, partial-agents, dry-run, force
- [ ] **M7 — Packaging & docs:** `files` whitelist, `npm pack` verification, root `README.md`, CI workflow
- [ ] **M8 — Publish:** confirm name availability, `npm publish`, smoke-test `npx your-second-mind@latest`

## Task Breakdown

### Phase 1 — Project scaffold (M1) — ✅ done 2026-06-21
- [x] T1.1 `package.json`: `name: your-second-mind`, `type: module`, `bin: { "your-second-mind": "dist/cli.js" }`, `engines.node >=20`, `files: ["dist", "templates"]`, scripts (`build`, `dev`, `test`, `typecheck`), deps (`@clack/prompts`, `picocolors`), devDeps (`typescript`, `tsup`, `vitest`, `@types/node`) — versions pinned via `npm install`
- [x] T1.2 `tsconfig.json` (ESM, `moduleResolution: bundler`, strict; added `ignoreDeprecations: "6.0"` for TS 6 `baseUrl` warning surfaced by tsup's dts step)
- [x] T1.3 `tsup.config.ts`: entry `src/cli.ts` → `dist/cli.js`, `format: esm`, `dts`, shebang banner (`#!/usr/bin/env node`) — verified present in output
- [x] T1.4 `vitest.config.ts` (added `passWithNoTests: true` so the empty skeleton keeps CI green until Phase 2 tests land)
- [x] T1.5 Created `src/`, `templates/{schemas,vault,notes,agents-workflow}/`, `test/{unit,integration}/` skeleton (`.gitkeep` in empty leaves); `.gitignore` extended with `node_modules`, `dist`, `*.tsbuildinfo`. Added placeholder `src/cli.ts` (Node-version gate stub; replaced in Phase 5).

### Phase 2 — Pure core + unit tests (M2) — ✅ done 2026-06-21
- [x] T2.1 `config.ts`: `Config`/`Agent` types, `DEFAULTS`, `resolve(flags, answers)` (layer defaults←flags←answers, `~` expansion via `os.homedir()`), `validate()` → `ConfigError`
- [x] T2.2 `variables.ts`: `buildVariables(config, date)` → `Record<string,string>` (all 12 non-per-folder vars)
- [x] T2.3 `render.ts`: `renderTemplate(content, vars)` — replaceAll loop; unknown `{{X}}` left intact
- [x] T2.4 Unit tests: 42 tests across render (6), config (21), variables (15) — all pass; TDD order

### Phase 3 — Templates (M3) — ✅ done 2026-06-21
- [x] T3.1 `templates/schemas/CLAUDE.md.tmpl` — `{{NAME}}`, `{{ROLE}}`, `{{LANGUAGE}}`, `{{WRITING_STYLE}}`, `{{RAW_SOURCES_LIST}}`, `{{AREAS_LIST}}`
- [x] T3.2 `templates/schemas/cursorrules.tmpl` — `{{RAW_SOURCES_LIST}}`, `{{AREAS_LIST}}`
- [x] T3.3 `templates/schemas/AGENTS.md.tmpl` — `{{RAW_SOURCES_LIST}}`, `{{AREAS_LIST}}`
- [x] T3.4 `templates/vault/README.md.tmpl` — `{{VAULT_PATH}}`, `{{DATE}}`, `{{AGENTS_USED}}`, `{{PLUGINS_CORE}}`, `{{PLUGINS_AI}}`
- [x] T3.5 `templates/vault/index.md.tmpl` — `{{DATE}}`; personal pages stripped, generic comment scaffolding only
- [x] T3.6 `templates/vault/log.md.tmpl` — `{{DATE}}`; one generic init entry
- [x] T3.7 `templates/vault/gitignore.tmpl` — no subs; `.obsidian/` + `.DS_Store` only
- [x] T3.8 `templates/vault/_index.md.tmpl` — `{{DATE}}`, `{{FOLDER_NAME}}`, `{{FOLDER_PATH}}`, `{{FOLDER_PURPOSE}}`, `{{FOLDER_AGENT_INSTRUCTION}}`; Dataview stub
- [x] T3.9 `templates/notes/*.md.tmpl` — all 6 (daily, lit, evergreen, project, weekly-review, ingest-session); Templater `<% %>` syntax preserved verbatim; zero personal values
- [x] T3.10 `templates/agents-workflow/weekly-review.md` + `monthly-lint.md` — copied verbatim from `.claude/commands/`; `$CURRENT_DATE`/`$ARGUMENTS` confirmed present
- [x] T3.11 `templates/agents-workflow/README.md` — copy guide for Claude Code, Cursor, Codex/OpenAI, and generic agents

**Verification:** `grep -r "Linh\|linhvuquach\|engineering-craft" templates/` → CLEAN; 22 `{{VAR}}` placeholders all map to known variables; build + 42 tests pass.

### Phase 4 — Scaffold writer (M4) — ✅ done 2026-06-28
- [x] T4.1 `templates.ts`: `TEMPLATES_DIR` (`fileURLToPath(new URL("../templates", import.meta.url))`), `AGENT_FILES`, `NOTE_TEMPLATES` (all 6), `NAV_FILES`, `FOLDER_META`, `COMMAND_FILES`; `TOP_FOLDERS` const array; `readTemplate` helper
- [x] T4.2 `scaffold.ts` — dir creation: PARA folders, `area-<x>/`, `raw/<src>/`, `90-Meta/{Templates,AI-Sessions}`, `agents-workflow/`, `.gitkeep` in empty leaves
- [x] T4.3 `scaffold.ts` — file writing: agent schemas (only `config.agents`), nav files, one `_index.md` per folder (per-folder vars), all 6 note templates, `agents-workflow/*` **copied verbatim (no render)**
- [x] T4.4 Idempotency: per-file `[create]`/`[skip]`/`[overwrite]`; `force` flag; `ScaffoldResult {created, skipped, overwritten, tree}`
- [x] T4.5 `dryRun`: build tree, write nothing

**Verification:** 93 tests pass (42 prior + 23 unit templates + 28 integration scaffold); typecheck clean; build clean. No `{{` leakage in rendered output confirmed by integration test.

### Phase 5 — CLI surface (M5) — ✅ done 2026-06-29
- [x] T5.1 `args.ts`: `parseArgs` options (`--yes`, `--name`, `--role`, `--vault-path`, `--areas`, `--raw-sources`, `--agents`, `--no-git`, `--dry-run`, `--force`, `--help`, `--version`); map → `Partial<Config>` + run flags; comma-split lists; unknown-flag error
- [x] T5.2 `prompts.ts`: `@clack` intro + grouped prompts (text, multiselect for agents/areas, confirm git) with defaults; `isCancel`/`cancel` → exit 1
- [x] T5.3 `git.ts`: `isGitAvailable()`, `gitInit()` (init/add/commit); missing-git non-fatal
- [x] T5.4 `ui.ts`: picocolors status lines, summary, `@clack` outro with next-steps (open Obsidian; copy a command from `agents-workflow/`)
- [x] T5.5 `cli.ts`: `main()` — Node≥20 gate → parseArgs → help/version → interactive vs `--yes` → resolve/validate → scaffold → optional gitInit → summary; try/catch maps `ConfigError` to clean exit codes
- [x] T5.6 Manual smoke: `node dist/cli.js --dry-run`; real run into a temp dir; `grep -r "{{" <vault>` = 0 leaks; `--yes` without `--name` → exit 1; unknown flag → exit 1

**Verification:** 110 tests pass (93 prior + 17 args unit); typecheck clean; tsup build clean (16.24 KB bundle + 0.013 KB d.ts). All smoke cases verified.

### Phase 6 — Integration tests (M6) — ✅ done 2026-06-29
- [x] T6.1 scaffold.test.ts additions: personalization (`name: Alice, areas:[research,writing], agents:[cursor]` → no `Linh`/`engineering-craft`), full agent subsetting `[claude-code, codex]`, raw sources `[papers, datasets]`
- [x] T6.2 `test/integration/git.test.ts`: isGitAvailable returns boolean; gitInit creates .git + initial commit + clean status; no-git: .git absent when not called
- [x] T6.3 `test/integration/cli.test.ts`: --version, --help, --yes without name → exit 1, unknown flag → exit 1, invalid agent → exit 1, dry-run writes nothing, template path from different CWD resolves via import.meta.url

**Verification:** 123 tests pass; typecheck clean.

### Phase 7 — Packaging & docs (M7)
- [ ] T7.1 Verify `npm pack` tarball includes `dist/` + `templates/`, excludes source/tests, no personal strings
- [ ] T7.2 Root `README.md`: what it is, `npx your-second-mind@latest` quick start, what you get, flags table, multi-agent note, post-setup links
- [ ] T7.3 CI workflow: `typecheck` + `test` + `build` on PR; `npm publish` on tag (`NODE_AUTH_TOKEN`)

### Phase 8 — Publish (M8)
- [ ] T8.1 Confirm `your-second-mind` availability on npm (decide scope/license)
- [ ] T8.2 `npm publish`; smoke-test `npx your-second-mind@latest` from a clean dir

## Dependencies

- T1.x → everything (scaffold first)
- T2.x (pure core) is independent of T3.x (templates) — can parallelize
- T3.x → T4.3 (writer needs template files); T4.1 → T4.2 → T4.3 → T4.4 → T4.5
- T2.x + T4.x → T5.5 (`cli.ts` wires core + scaffold + CLI)
- T5.x → T6.1 (integration tests exercise the full path)
- T1–T6 → T7.x → T8.x (publish last)

## Timeline & Estimates

| Phase | Tasks | Estimate |
|---|---|---|
| Project scaffold | T1.1–T1.5 | ~15 min |
| Pure core + unit tests | T2.1–T2.4 | ~30 min |
| Templates | T3.1–T3.11 | ~25 min |
| Scaffold writer | T4.1–T4.5 | ~35 min |
| CLI surface | T5.1–T5.6 | ~35 min |
| Integration tests | T6.1 | ~20 min |
| Packaging & docs | T7.1–T7.3 | ~20 min |
| Publish | T8.1–T8.2 | ~10 min |

## Risks & Mitigation

| Risk | Likelihood | Mitigation |
|---|---|---|
| Template path breaks once bundled/published | Medium | Resolve via `import.meta.url`, never CWD; T7.1 verifies tarball contents; integration test runs against built output |
| `agents-workflow/*` gets `{{VAR}}`-rendered, mangling `$CURRENT_DATE`/`$ARGUMENTS` | Medium | Writer copies command files **verbatim** (T4.3); integration test asserts the `$`-vars survive |
| Personal value leaks into a `.tmpl` | Low | Review each template post-extraction (T3.x); integration test checks `Linh`/path absence + no `{{` (T6.1) |
| `parseArgs` can't express a needed flag shape | Low | Flag set is flat (strings/booleans); fall back to manual post-processing in `args.ts` if needed |
| `@clack` cancel (Ctrl-C) leaves a partial vault | Low | `isCancel` exits before any write; writes happen only after full resolve/validate |
| npm name `your-second-mind` taken | Low | T8.1 checks early; scope fallback (`@<org>/your-second-mind`) |
| Node < 20 on user machine | Low | Startup gate exits with clear message; `engines.node` set |

## Resources Needed

- Source: working vault files in `/Users/linhvuquach/Documents/second-brain/` (template extraction)
- Source: `.claude/commands/{weekly-review,monthly-lint}.md` (command files)
- Reference: `docs/building-a-second-brain.md`
- Node 20+, npm account/token for publish
