---
phase: testing
title: Testing Strategy
description: Define testing approach, test cases, and quality assurance
---

# Testing Strategy

> **Revision (2026-06-20):** Rewritten for the `your-second-mind` npm package (TypeScript +
> ESM). The prior `setup.py` / stdlib-`unittest` strategy is **dropped**. Test runner:
> **`vitest`**. Two layers: pure-function **unit tests** (config/variables/render/args, no
> filesystem) and **integration tests** that scaffold into a tmp dir and assert the output.

## Test Coverage Goals

- 100% of CLI flags exercised (`--yes`, `--dry-run`, `--force`, `--no-git`, list flags, `--help`/`--version`)
- 100% of template variables verified as substituted (no `{{` in any generated file)
- 100% of config-driven branching: agents subset, custom areas, custom raw sources, git on/off
- All error/exit paths exercised: missing `name` under `--yes`, invalid agent, Node-version gate, user cancel
- `agents-workflow/*` command files asserted **byte-identical** to source (verbatim copy; `$CURRENT_DATE`/`$ARGUMENTS` survive)

## Unit Tests (`test/unit/`, vitest)

### `render.test.ts` ✅ 6 tests passing (M2)
- [x] Replaces single `{{NAME}}` with the provided value
- [x] Replaces multiple distinct variables in one string
- [x] Replaces same variable appearing more than once
- [x] Leaves unrecognized `{{OTHER}}` unchanged (no throw)
- [x] Handles empty vars map
- [x] Handles content with no placeholders

### `variables.test.ts` ✅ 15 tests passing (M2)
- [x] `{{AREAS_LIST}}` → `- area-research\n- area-teaching` (prefixed `area-`)
- [x] `{{AREAS_FOLDERS}}` → `30-Areas/area-research/\n30-Areas/area-teaching/`
- [x] `{{RAW_SOURCES_LIST}}` → `raw/papers/, raw/datasets/`
- [x] `{{AGENTS_USED}}` maps `claude-code`→`Claude Code`, `cursor`→`Cursor`, `codex`→`Codex`
- [x] `{{DATE}}` uses the **injected** date arg (deterministic; no hidden `new Date()`)
- [x] `{{PLUGINS_CORE}}` / `{{PLUGINS_AI}}` render as bullet lists
- [x] Single agent maps correctly
- [x] All values are plain strings (no non-string types in Record)

### `config.test.ts` ✅ 21 tests passing (M2)
- [x] `DEFAULTS` match the requirements table (role, language, vault_path, areas, raw_sources, agents, gitInit)
- [x] `resolve()` returns all defaults when called with empty objects
- [x] `resolve()` precedence: defaults ← flags ← prompt answers (answer wins over flag wins over default)
- [x] `resolve()` expands `~` in `vaultPath` via `os.homedir()`
- [x] `resolve()` expands `~` in custom vault path from flags
- [x] `resolve()` does not expand `~` when path is already absolute
- [x] `resolve()` ignores undefined flag values (does not clobber defaults)
- [x] `validate()` throws `ConfigError` for empty `name`
- [x] `validate()` throws `ConfigError` for whitespace-only `name`
- [x] `validate()` throws `ConfigError` for empty `areas`
- [x] `validate()` throws `ConfigError` for empty `agents`
- [x] `validate()` throws `ConfigError` for unrecognised agent string
- [x] Minimal valid config passes without throwing

### `args.test.ts`
- [ ] Parses booleans (`--yes`, `--dry-run`, `--force`, `--no-git`) and strings (`--name`, `--vault-path`)
- [ ] Comma-splits list flags (`--areas a,b,c` → `["a","b","c"]`, `--agents claude-code,cursor`)
- [ ] Unknown flag → error (non-zero path)
- [ ] `--no-git` sets `gitInit: false`

### `templates.test.ts` ✅ 23 tests passing (M4)
- [x] `TEMPLATES_DIR` points to an existing directory
- [x] `AGENT_FILES` maps each agent to correct dest filename (`CLAUDE.md`, `.cursorrules`, `AGENTS.md`)
- [x] All agent template paths exist on disk
- [x] `NOTE_TEMPLATES` has exactly 6 entries (all expected note types)
- [x] All note template paths exist on disk
- [x] `NAV_FILES` has exactly 4 entries (README.md, index.md, log.md, .gitignore)
- [x] All nav template paths exist on disk
- [x] `COMMAND_FILES` has exactly 3 entries (weekly-review.md, monthly-lint.md, README.md)
- [x] All command file paths exist on disk
- [x] `TOP_FOLDERS` has exactly 10 entries, starts with `00-Inbox`, ends with `90-Meta`
- [x] `FOLDER_META` has an entry for every `TOP_FOLDER`
- [x] Each `FOLDER_META` entry has non-empty `purpose` and `agentInstruction`
- [x] `readTemplate` reads schema template containing `{{NAME}}`
- [x] `readTemplate` reads `_index.md.tmpl` containing `{{FOLDER_NAME}}`
- [x] `readTemplate` preserves Templater `<% tp.date.now` in note templates
- [x] `readTemplate` preserves `$CURRENT_DATE` in command files

## Integration Tests (`test/integration/scaffold.test.ts`, vitest)

Each case scaffolds into a unique tmp dir (`os.tmpdir()` + `fs.mkdtemp`), asserts, and cleans up. Runs against the **scaffold module** (and at least one case against the **built `dist/`** to catch template-path/bundling regressions).

### scaffold.test.ts ✅ 28 tests passing (M4)

#### Directory structure
- [x] All 10 top-level PARA folders created (00-Inbox … 90-Meta)
- [x] Area subfolders created under 30-Areas with `area-` prefix
- [x] Raw source subfolders created under `raw/`
- [x] Area folders excluded by config are not created
- [x] `90-Meta/Templates` and `90-Meta/AI-Sessions` created
- [x] `agents-workflow/` directory created

#### Agent schema files
- [x] `CLAUDE.md` written for `claude-code` agent
- [x] `.cursorrules` written for `cursor` agent
- [x] `AGENTS.md` written for `codex` agent
- [x] `CLAUDE.md` absent when `claude-code` not in agents
- [x] `.cursorrules` absent when `cursor` not in agents
- [x] `CLAUDE.md` contains the configured name (renders `{{NAME}}`)

#### Nav files
- [x] `README.md`, `index.md`, `log.md`, `.gitignore` all written

#### `_index.md` per folder
- [x] `_index.md` written in every top-level PARA folder (10 files)
- [x] `00-Inbox/_index.md` contains the folder name

#### Note templates
- [x] All 6 note templates written to `90-Meta/Templates/`
- [x] Note templates preserve Templater `<% %>` syntax verbatim

#### agents-workflow
- [x] `weekly-review.md`, `monthly-lint.md`, `README.md` all written
- [x] Command files preserve `$CURRENT_DATE` verbatim (not substituted)
- [x] Command files contain no `{{` placeholders

#### No `{{` leakage
- [x] All rendered files scanned; no unreplaced `{{` found

#### Idempotency
- [x] Second run (no force) skips existing files; `skipped > 0`, `overwritten == 0`
- [x] First run reports `created > 0`
- [x] Second run with `--force` + different name overwrites; content updated; `overwritten > 0`
- [x] `ScaffoldResult` has numeric `created`/`skipped`/`overwritten` and non-empty `tree` array

#### Dry-run
- [x] Writes nothing to disk (no dirs or files created)
- [x] Returns non-empty tree containing `CLAUDE.md` and `README.md`
- [x] Dry-run `created` count equals real-run `created` count

### Remaining integration scenarios (M6 — after CLI surface)
- [ ] With git on: `git log --oneline` ≥ 1 commit; `git status --porcelain` empty
- [ ] Personalization: `name: Alice, agents: [cursor]` → zero occurrences of `Linh`/`engineering-craft`/`/Users/linhvuquach`
- [ ] `agents: [claude-code, codex]` → `CLAUDE.md` + `AGENTS.md` exist; `.cursorrules` absent
- [ ] `raw_sources: [papers, datasets]` → `raw/papers/`, `raw/datasets/`; no `raw/articles/`
- [ ] Built-`dist/` template path test (catch bundling regressions)

### `--no-git`
- [ ] No `.git/` directory created; exits 0

## CLI / error-path tests

- [ ] `--yes` without `--name` → non-zero exit; stderr mentions `name`
- [ ] Invalid `--agents vim` → non-zero exit; stderr lists valid options
- [ ] Node-version gate: simulated `process.versions.node` < 20 → non-zero exit, "Node 20+ required"
- [ ] `@clack` cancel (Ctrl-C) before completion → non-zero exit, no files written
- [ ] `--help` and `--version` exit 0 with expected output

## Packaging tests

- [ ] `npm pack` tarball includes `dist/` and `templates/`, excludes `src/`/`test/`
- [ ] No personal strings (`Linh`, `/Users/linhvuquach`) anywhere in the tarball
- [ ] Smoke: install the packed tarball into a temp project and run the bin from a **different CWD** → vault scaffolds correctly (template path resolves via `import.meta.url`, not CWD)

## Test Data (fixtures)

- **Minimal:** `name: TestUser`, `vaultPath: <tmp>`, `areas: [test-area]`, `agents: [claude-code]`, `gitInit: false`
- **Full default:** all defaults, `name: Alice Doe`
- **Cursor-only:** `agents: [cursor]`
- **Custom:** `areas: [research, writing, teaching]`, `rawSources: [papers, datasets]`

## Manual / acceptance testing

- [ ] `npx your-second-mind@latest` (or built bin) interactive run → press-Enter-through yields a valid vault
- [ ] Open generated vault in Obsidian — folders in correct order, `_index.md` Dataview blocks render
- [ ] Open `CLAUDE.md` — correct name/role, no `{{`
- [ ] Copy `agents-workflow/weekly-review.md` → `.claude/commands/` and run `/weekly-review` end-to-end against the fresh vault (all referenced paths exist, incl. the weekly-review note template)

## CI

`vitest run` + `tsc --noEmit` (typecheck) + `tsup` build gate every PR (see deployment doc). Failures block merge. Issues found during implementation are fixed immediately; no separate tracker.
