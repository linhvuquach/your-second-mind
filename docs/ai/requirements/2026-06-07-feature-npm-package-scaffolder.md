---
phase: requirements
title: Requirements & Problem Understanding
description: Clarify the problem space, gather requirements, and define success criteria
---

# Requirements & Problem Understanding

> **Revision (2026-06-20):** This requirement was revised to ship `second-mind` as an
> **npm package from day one**. The previous approach (GitHub template repository +
> `python3 setup.py`, stdlib only) is **superseded and dropped**. All phase docs for this
> feature (requirements → monitoring) have been realigned to the npm-package direction and
> renamed `feature-npm-package-scaffolder`.
>
> **Locked decisions (this revision):**
> - **Package name:** `your-second-mind`. Primary entry point: `npx your-second-mind@latest`.
> - **Distribution:** npm package only. No GitHub template.
> - **UX:** interactive prompts (create-vite style); non-interactive via individual flags +
>   `--yes`. A `--config` file is **deferred to v2**.
> - **Stack:** TypeScript, ESM, compiled to JS for publish; **Node 20+ LTS**.
> - **Note templates:** **all six are always installed** — no template selection prompt.
> - **Built-in commands:** ship `weekly-review` and `monthly-lint` into an agent-agnostic
>   **`agents-workflow/`** folder in the generated vault, with copy-into-your-agent guidance —
>   not wired to any single agent.

## Problem Statement

The `second-mind` repo and working vault are fully functional but hardcoded to one person
(Linh, specific vault path, area names, agent stack). Others who want to adopt this
second-brain system must manually copy files, find-and-replace personal values, and
understand the full system from scratch. There is no automated, low-friction setup path.

We are distributing this as an **npm package from day one**: a user runs a single
`npx your-second-mind@latest` command, answers a short series of interactive prompts, and
gets a fully personalized PARA + LLM Wiki Obsidian vault scaffolded on disk — no repo
clone, no Python, no manual file editing. The vault ships with **portable, agent-agnostic
commands** (`weekly-review`, `monthly-lint`) so the recurring-maintenance workflows are
available regardless of which AI agent the user runs.

**Who is affected:** Any software engineer or knowledge worker who already has Node.js
installed (near-ubiquitous in this audience) and wants to set up their own PARA + LLM Wiki
second brain without reverse-engineering a personal vault.

**Current workaround:** None shipped yet. The earlier plan required forking a GitHub
template, editing a `config.yaml`, and running `python3 setup.py` — three manual steps and
a Python runtime dependency this revision removes.

## Goals & Objectives

**Primary goals:**
- Publish the **`your-second-mind`** npm package, launched via `npx your-second-mind@latest`
  (a `bin` of the same name, runnable globally or one-shot through `npx`).
- **Interactive scaffolder** (create-vite style) that prompts for: name, role, language,
  writing style, vault path, areas, raw source types, agents, Obsidian plugins, and git init
  — with sensible defaults (see "Default configuration values") so a user can press Enter
  through it.
- **Non-interactive mode** via individual CLI flags plus `--yes` (apply defaults for
  unprovided answers), for scripted/CI runs. A `--config` file is **deferred to v2**.
- **TypeScript + ESM**, type-checked, compiled to JS for publish; runs on **Node 20+ LTS**.
- Scaffold a complete vault from bundled templates: PARA folder skeleton, `_index.md` per
  top-level folder, agent schema files (only for selected agents), **all six note
  templates**, navigation files (`README.md`, `index.md`, `log.md`, `.gitignore`), and an
  optional initial git commit.
- **Ship two portable built-in commands** — `weekly-review` and `monthly-lint` — into an
  **agent-agnostic `agents-workflow/` folder** in the generated vault, with guidance on how
  to copy them into whichever agent the user runs (see "Built-in commands" below).
- `--dry-run` preview of the file tree without writing; **idempotent** by default
  (skip pre-existing files, report a skip count) with `--force` to overwrite.

**Secondary goals:**
- CI pipeline that type-checks, tests, builds, and publishes on tag (semver).
- Curated, minimal dependency set (prompt library, arg parser, color) vetted for
  supply-chain weight.
- Templates and command files shipped inside the package (`files` whitelist / bundled
  `templates/`) so they are resolved relative to the installed package, not the CWD.
- Architecture that keeps prompt-collection, config-resolution, and file-writing as
  separable modules so the tool can grow (e.g. `--config` files in v2, or update/migrate
  an existing vault later).

**Non-goals:**
- **GitHub template repository** path — explicitly dropped in favor of npm-only.
- **Python `setup.py`** — superseded; no Python runtime requirement.
- **`--config` file (YAML/JSON) input** — deferred to v2; v1 is interactive + flags + `--yes`.
- **Note-template selection** — all six are always installed; no per-template opt-out in v1.
- **Updating/migrating an already-scaffolded vault** — v1 only creates; pulling newer
  commands/templates into an existing vault is future work.
- Publishing for non-Node runtimes (Deno/Bun) in v1 (should not be actively broken, but not tested).
- A GUI or web-based configurator.
- Auto-installing Obsidian plugins (GUI-only action; we write a checklist instead).
- **Auto-wiring commands into a specific agent's directory** (e.g. `.claude/commands/`) —
  v1 drops them in a neutral `agents-workflow/` folder and tells the user how to install them.
- Authoring *new* commands beyond the two existing ones (`weekly-review`, `monthly-lint`) in v1.
- Modifying any vault other than the user-selected target directory.

## Default configuration values

The prompts (and `--yes`) use these defaults, matching the working vault:

| Setting | Default |
|---|---|
| `name` | (required — no default; must be provided even with `--yes`) |
| `role` | `software engineer` |
| `language` | `English` |
| `writing_style` | `terse, prefer bullets over prose` |
| `vault_path` | `~/Documents/second-brain` |
| `areas` | `engineering-craft`, `career`, `learning`, `side-projects` |
| `raw_sources` | `articles`, `books`, `videos`, `podcasts`, `assets` |
| `agents` | `claude-code`, `cursor`, `codex` (all three) |
| note templates | all six, always (not configurable) |
| `obsidian_plugins` | standard core + AI set (Periodic Notes, Templater, Dataview, Smart Connections, …) |
| `git.init` | `true` |

`name` is the only field with no default; a `--yes` run still requires `--name <value>`
(or it errors clearly).

## Built-in commands

The scaffolder bundles the two existing second-brain command files and installs them into
an **agent-agnostic `agents-workflow/` folder** in the generated vault
(e.g. `agents-workflow/weekly-review.md`, `agents-workflow/monthly-lint.md`). They are
**not** auto-wired into any one agent's directory:

- **`weekly-review`** — five-step weekly review: review daily notes, project sweep,
  inbox-to-zero, slipbox grooming, plan next week; writes a weekly-review note and session log.
- **`monthly-lint`** — five-check monthly wiki lint: dangling wikilinks, orphan pages,
  stale seedlings, contradictions, concept gaps; updates `index.md` and `log.md`.

Both reference only **relative vault paths** (PARA folders, `index.md`, `log.md`,
`90-Meta/Templates/`, `90-Meta/AI-Sessions/`) and agent-runtime variables (`$CURRENT_DATE`,
`$ARGUMENTS`) — no personal data — so they ship essentially as-is with no `{{VARIABLE}}`
personalization required. Because all six note templates are always installed, the
`weekly-review` command's dependency on `90-Meta/Templates/weekly-review.md` is always satisfied.

The `agents-workflow/` folder includes a short **`README.md` guideline** that tells the user
how to copy each command into the agent they use, with concrete examples per common agent, e.g.:
- **Claude Code** → copy to `.claude/commands/<name>.md` (becomes `/weekly-review`, `/monthly-lint`).
- **Cursor** → reference from `.cursorrules` / paste into a Cursor command.
- **Codex / other** → copy into that agent's command/instructions location, or invoke the
  file's contents as a prompt.

This keeps the commands portable: one source of truth in `agents-workflow/`, copied wherever
the user's tooling expects it.

## User Stories & Use Cases

- **As a developer new to second brains**, I want to run `npx your-second-mind@latest`,
  answer a few prompts, and have a fully scaffolded Obsidian vault ready — no clone, no
  Python, no reading 500 lines of docs first.
- **As a researcher**, I want to pick custom areas (research-projects, teaching) and raw
  source types (papers, datasets) during the prompts so the vault fits my workflow from day one.
- **As a Claude Code user**, I want the generated `CLAUDE.md` to already reference my name
  and role, and the `agents-workflow/` folder to hold `weekly-review` and `monthly-lint` with
  clear instructions to copy them into `.claude/commands/` so the maintenance workflows just work.
- **As a Cursor-only user**, I want to select only `cursor` and have just `.cursorrules`
  created — plus the same portable commands in `agents-workflow/` I can wire into Cursor my way.
- **As a CI / dotfiles user**, I want `npx your-second-mind --yes --name Alice --vault-path ./brain`
  (and other flags) to run non-interactively and reproducibly.
- **As a cautious user**, I want `--dry-run` to print exactly what would be created, and a
  re-run to skip existing files unless I pass `--force`.
- **As the maintainer**, I want a tagged release to type-check, test, build, and publish to
  npm automatically so shipping an update is one push.

## Success Criteria

### Package & distribution
- [ ] Package published to npm as `your-second-mind`; `npx your-second-mind@latest` launches
      the scaffolder, and a global install exposes a `your-second-mind` command.
- [ ] `package.json` has a `bin` entry, `type: "module"`, an `engines.node >=20`, and a
      `files` whitelist that includes the compiled output and bundled `templates/`.
- [ ] `npm pack` tarball contains the templates, command files, and compiled JS, and nothing
      personal (no references to `Linh`, `/Users/linhvuquach`, or the working vault).
- [ ] Templates and command files resolve relative to the installed package location,
      working when invoked from any directory.

### CLI behavior
- [ ] Running with no flags launches **interactive prompts** with working defaults; pressing
      Enter through all prompts (after entering a name) yields a valid vault.
- [ ] Prompts cover: name, role, language, writing style, vault path, areas, raw sources,
      agents (multi-select), plugins, git init. (No note-template prompt — all six install.)
- [ ] Non-interactive run via flags + `--yes` produces a vault identical to the equivalent
      interactive answers; exits 0. `--yes` without `--name` errors clearly and exits non-zero.
- [ ] `--dry-run` prints the expected file tree; writes nothing; exits 0.
- [ ] Default run is idempotent: pre-existing files are skipped silently with a summary
      (`skipped N existing files`); `--force` overwrites.
- [ ] Only agent schema files for selected agents are created.
- [ ] All six note templates are installed in every vault.
- [ ] Area sub-folders and `raw/` sub-folders match exactly what the user selected.
- [ ] Git is initialized and an initial commit made only when the user opts in and `git` is available;
      a missing `git` prints a clear, non-fatal message and skips that step.
- [ ] Invalid/aborted input (e.g. empty required field, Ctrl-C) exits non-zero with a clear message and no partial-on-error garbage.
- [ ] Node < 20 detected at startup → exits non-zero with a clear "Node 20+ required" message.

### Built-in commands
- [ ] Every generated vault contains `agents-workflow/weekly-review.md` and
      `agents-workflow/monthly-lint.md`, regardless of which agents were selected.
- [ ] `agents-workflow/README.md` explains how to copy each command into the user's agent, with
      at least Claude Code (`.claude/commands/`), Cursor, and a generic "other agent" example.
- [ ] The command files contain no personal references and no leftover `{{VARIABLE}}`
      placeholders; agent-runtime vars (`$CURRENT_DATE`, `$ARGUMENTS`) are preserved verbatim.
- [ ] After the user copies a command into Claude Code, it runs end-to-end against the
      scaffolded folder structure (every path it references exists, including the
      `weekly-review` note template).

### Personalization completeness
- [ ] A run with `name: Alice`, `role: researcher`, `areas: [research, teaching]`,
      `agents: [cursor]` produces a vault with zero references to `Linh`, `engineer`,
      `engineering-craft`, or `/Users/linhvuquach`, and no leftover `{{VARIABLE}}` placeholders.

## Constraints & Assumptions

- **Runtime:** Node.js 20+ LTS. Startup checks `process.versions.node` and exits with a
  clear message below the minimum.
- **Language/build:** TypeScript, ESM. Source compiled to JS (e.g. `tsup`/`tsc`) before
  publish; the published `bin` points at compiled JS, not raw TS.
- **Dependencies:** curated and minimal. Expected categories: a prompt library
  (e.g. `@clack/prompts` or `prompts`), an arg parser (e.g. `commander` or built-in
  `util.parseArgs`), and a color helper (e.g. `picocolors`). No config-file parser needed
  in v1 (`--config` deferred). Each dependency vetted for size and maintenance.
- **Template format:** `{{VARIABLE}}` placeholders (double curly braces, ALLCAPS) rendered
  by simple string replacement — no heavy templating engine in v1.
- **Command files are agent-agnostic:** delivered to `agents-workflow/`, never auto-installed
  into a specific agent's directory. Their agent-runtime variables (`$CURRENT_DATE`,
  `$ARGUMENTS`) must be left intact — they are not scaffolder placeholders and must not be substituted.
- **Templates bundled:** templates and command files shipped in the package and resolved via
  the package location, not CWD. Listed in `files` / not ignored by `.npmignore`.
- **Platform:** macOS and Linux are the supported/tested targets; Windows should work via
  Node's cross-platform `path`/`os` APIs (best-effort, not gated on in v1).
- **Idempotency:** target dir may already exist; pre-existing files are skipped (count
  reported), `--force` to overwrite. No data loss without `--force`.
- **Obsidian plugins:** install is manual; the scaffolder writes a checklist into the vault `README.md`.
- **Existing-vault edits:** the tool only writes inside the user-selected target directory;
  it never touches `/Users/linhvuquach/Documents/second-brain/` or any other path.

## Questions & Open Items

Resolved this revision:
- **Package name:** `your-second-mind`; primary entry `npx your-second-mind@latest`. ✓
- **Distribution:** npm package only — GitHub template path dropped. ✓
- **UX / v1 scope:** interactive prompts + flags + `--yes`; `--config` file deferred to v2. ✓
- **Stack / Node minimum:** TypeScript + ESM, **Node 20+**. ✓
- **Note templates:** all six always installed — no selection prompt. ✓
- **Command/template dependency:** resolved by always installing all templates. ✓
- **Command folder name:** `agents-workflow/` (avoids collision with the `agents:` config field). ✓
- **Built-in commands:** ship `weekly-review` + `monthly-lint` into `agents-workflow/` with
  copy-into-your-agent guidance. ✓
- **Default config values:** specified in "Default configuration values" table. ✓

Open:
- **npm scope/org:** publish bare `your-second-mind` vs scoped (e.g. `@linh/your-second-mind`);
  confirm `your-second-mind` is available on the npm registry.
- **Prompt library:** `@clack/prompts` (modern, nice UX) vs `prompts` (lighter) vs `inquirer`. (design-phase)
- **Arg parsing:** `commander` vs Node's built-in `util.parseArgs` (zero-dep). (design-phase)
- **`agents-workflow/README.md` coverage:** which agents to include beyond Claude Code, Cursor, generic.
- **License** to publish under (MIT assumed unless specified).
