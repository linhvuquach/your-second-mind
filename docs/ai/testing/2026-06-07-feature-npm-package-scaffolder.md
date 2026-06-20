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

### `render.test.ts`
- [ ] Replaces single `{{NAME}}` with the provided value
- [ ] Replaces multiple distinct variables in one string
- [ ] Leaves unrecognized `{{OTHER}}` unchanged (no throw)
- [ ] Works across multi-line template content

### `variables.test.ts`
- [ ] `{{AREAS_LIST}}` → `- area-health\n- area-finance` (prefixed `area-`)
- [ ] `{{AREAS_FOLDERS}}` → `30-Areas/area-health/\n30-Areas/area-finance/`
- [ ] `{{RAW_SOURCES_LIST}}` → `raw/articles/, raw/books/`
- [ ] `{{AGENTS_USED}}` maps `claude-code`→`Claude Code`, `cursor`→`Cursor`, `codex`→`Codex`
- [ ] `{{DATE}}` uses the **injected** date arg (deterministic; no hidden `new Date()`)
- [ ] `{{PLUGINS_CORE}}` / `{{PLUGINS_AI}}` render as bullet lists

### `config.test.ts`
- [ ] `DEFAULTS` match the requirements table (role, language, vault_path, areas, raw_sources, agents, gitInit)
- [ ] `resolve()` precedence: defaults ← flags ← prompt answers (answer wins over flag wins over default)
- [ ] `resolve()` expands `~` in `vaultPath` via `os.homedir()`
- [ ] `validate()` throws `ConfigError` mentioning the field for: empty `name`, empty `areas`, empty `agents`
- [ ] `validate()` throws listing valid options for an invalid agent (e.g. `vim`)
- [ ] Minimal valid config passes without throwing

### `args.test.ts`
- [ ] Parses booleans (`--yes`, `--dry-run`, `--force`, `--no-git`) and strings (`--name`, `--vault-path`)
- [ ] Comma-splits list flags (`--areas a,b,c` → `["a","b","c"]`, `--agents claude-code,cursor`)
- [ ] Unknown flag → error (non-zero path)
- [ ] `--no-git` sets `gitInit: false`

## Integration Tests (`test/integration/scaffold.test.ts`, vitest)

Each case scaffolds into a unique tmp dir (`os.tmpdir()` + `fs.mkdtemp`), asserts, and cleans up. Runs against the **scaffold module** (and at least one case against the **built `dist/`** to catch template-path/bundling regressions).

### Happy path — full default config
- [ ] All expected PARA directories exist (00-Inbox … 90-Meta, `raw/*`, `area-*`, `agents-workflow/`)
- [ ] `CLAUDE.md`, `.cursorrules`, `AGENTS.md` exist (all three agents default)
- [ ] `README.md`, `index.md`, `log.md`, `.gitignore` exist
- [ ] All 6 note templates exist in `90-Meta/Templates/`
- [ ] One `_index.md` per top-level folder
- [ ] **No `{{` in any generated file** (recursive scan)
- [ ] With git on: `git log --oneline` ≥ 1 commit; `git status --porcelain` empty

### Personalization completeness
- [ ] `name: Alice`, `role: researcher`, `areas: [research, teaching]`, `agents: [cursor]` →
      zero occurrences of `Linh`, `engineer`, `engineering-craft`, `/Users/linhvuquach` anywhere in the tree

### Agent subsetting
- [ ] `agents: [cursor]` → `.cursorrules` exists; `CLAUDE.md` and `AGENTS.md` absent
- [ ] `agents: [claude-code, codex]` → `CLAUDE.md` + `AGENTS.md` exist; `.cursorrules` absent

### Templates always installed
- [ ] All 6 note templates present regardless of config (no selection path exists)

### Built-in commands (agents-workflow)
- [ ] `agents-workflow/weekly-review.md`, `monthly-lint.md`, `README.md` always present
- [ ] `weekly-review.md` / `monthly-lint.md` are **byte-identical** to the source templates (verbatim)
- [ ] They still contain `$CURRENT_DATE` and `$ARGUMENTS` (not substituted), and no `{{`

### Custom areas / raw sources
- [ ] `areas: [research, writing]` → `30-Areas/area-research/`, `area-writing/`; no `area-engineering-craft/`
- [ ] `raw_sources: [papers, datasets]` → `raw/papers/`, `raw/datasets/`; no `raw/articles/`

### `--dry-run`
- [ ] Exits 0, prints a tree containing expected paths, and the target dir does **not** exist afterward

### Idempotency / `--force`
- [ ] First run creates `CLAUDE.md` containing `Alice`
- [ ] Re-run without `--force` skips it (content unchanged) and reports a skip count
- [ ] Re-run with `--force` + `name: Bob` overwrites → contains `Bob`

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
