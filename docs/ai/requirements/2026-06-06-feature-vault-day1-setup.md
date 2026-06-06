---
phase: requirements
title: Requirements & Problem Understanding
description: Clarify the problem space, gather requirements, and define success criteria
---

# Requirements & Problem Understanding

## Problem Statement

The vault at `/Users/linhvuquach/Documents/second-brain` is a fresh Obsidian install with only default `.obsidian/` config — no folder structure, no templates, no agent schemas, and no version control. Without scaffolding, the vault cannot support the PARA + Zettelkasten + LLM Wiki workflows described in `docs/building-a-second-brain.md`. Linh (software engineer) cannot effectively use Claude Code or Cursor as wiki-maintaining agents until the schema files (`CLAUDE.md`, `.cursorrules`) and folder conventions exist.

**Who is affected:** Linh — sole owner of this personal knowledge vault.

**Current workaround:** None — vault is functionally empty.

## Goals & Objectives

**Primary goals (Day 1 of the 7-day starter plan):**
- Create the full PARA + Slipbox + `raw/` folder skeleton per Section 2 of the updated doc
- Create agent schema files (`CLAUDE.md`, `.cursorrules`, `AGENTS.md`) so Claude Code, Cursor, and Codex can operate on the vault immediately
- Create vault-root navigation files (`README.md`, `index.md`, `log.md`)
- Create comprehensive templates in `90-Meta/Templates/`
- Create `_index.md` for each top-level folder (so agents know each folder's purpose before touching files)
- Initialize git with a `.gitignore` and first commit

**Secondary goals:**
- `.gitignore` excludes `workspace.json` (changes every session) and `.trash/`
- Each template is comprehensive (frontmatter + sections + embedded prompts), not a minimal stub
- All files use the frontmatter contract defined in the doc

**Non-goals (explicitly out of scope for Day 1):**
- Installing Obsidian community plugins (requires Obsidian GUI — manual step)
- Configuring Periodic Notes, Templater, or Obsidian Git plugin settings
- Writing any actual notes or capturing any content
- Setting up MCP servers or Claude Desktop integration (Week 4)
- Setting up mobile capture (Week 3)

## User Stories & Use Cases

- **As Linh**, I want a structured folder skeleton so that every note I create has an obvious home and I don't start with a blank vault.
- **As Linh using Claude Code**, I want `CLAUDE.md` at the vault root so that Claude automatically loads the vault conventions, folder map, and ingest workflow at the start of every session.
- **As Linh using Cursor**, I want `.cursorrules` at the vault root so that Cursor applies the same conventions without manual setup.
- **As Linh**, I want `index.md` and `log.md` seeded so that the LLM Wiki pattern is operational from the first ingest.
- **As Linh**, I want git tracking with a good `.gitignore` so that my vault history is clean and I can roll back mistakes.
- **As Linh**, I want comprehensive templates in `90-Meta/Templates/` so that on Day 2 I can create a daily note with the right structure without remembering all fields.

## Success Criteria

- [ ] All 10 top-level PARA + Slipbox + `raw/` folders exist at `/Users/linhvuquach/Documents/second-brain/`
- [ ] `raw/` has subdirectories: `articles/`, `books/`, `videos/`, `podcasts/`, `assets/`
- [ ] `30-Areas/` has 4 area sub-folders
- [ ] `40-Resources/` has `tech/` (with `languages/`, `system-design/`, `snippets/`, `tools/`), `learning/`, `general/`
- [ ] `90-Meta/` has `Templates/`, `Attachments/`, `AI-Sessions/`
- [ ] `CLAUDE.md` exists at vault root with full template from updated Section 4
- [ ] `.cursorrules` exists at vault root with full Cursor schema template
- [ ] `README.md` exists at vault root as human-facing dashboard
- [ ] `index.md` exists at vault root, seeded with category headers
- [ ] `log.md` exists at vault root with first entry dated 2026-06-06
- [ ] `.gitignore` excludes `.obsidian/workspace.json`, `.obsidian/workspace-mobile.json`, `.trash/`, `.DS_Store`
- [ ] `AGENTS.md` exists at vault root with Codex agent schema (same conventions as `CLAUDE.md`)
- [ ] `90-Meta/Templates/` contains 6 templates: `daily-note.md`, `lit-note.md`, `evergreen-note.md`, `project-note.md`, `weekly-review.md`, `ingest-session.md`
- [ ] Each of the 10 top-level folders has an `_index.md` (sub-folders described in parent's `_index.md`, not separately)
- [ ] Empty leaf directories have `.gitkeep` to preserve them in git
- [ ] `git log --oneline` inside vault shows at least one commit
- [ ] `git status` shows clean working tree after commit

## Constraints & Assumptions

- **Path**: vault is at `/Users/linhvuquach/Documents/second-brain/` — all files created here
- **macOS**: paths use `/`, file creation via Claude Code's Write tool
- **Minimal personalization**: CLAUDE.md and .cursorrules use "Linh, a software engineer" with standard area names; will be evolved by Day 7
- **Comprehensive templates**: templates include frontmatter + sections + embedded instruction prompts
- **Obsidian already installed**: the `.obsidian/` directory exists; we don't touch it
- **No community plugins yet**: templates reference Templater syntax (`<% %>`) but won't render until Templater is installed (Day 1 manual step)

## Questions & Open Items

All clarifying questions resolved. Decisions recorded:
- `.gitignore` includes `.DS_Store` (macOS system file that appears in every visited folder)
- `AGENTS.md` included in Day 1 (all three agent schemas: CLAUDE.md, .cursorrules, AGENTS.md)
- `_index.md` scope: top-level folders only; sub-folder conventions described in parent's `_index.md`
