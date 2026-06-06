---
phase: testing
title: Testing Strategy
description: Define testing approach, test cases, and quality assurance
---

# Testing Strategy

This is a filesystem/configuration setup task — there is no compiled code and no unit test framework. "Testing" means verifying that files exist, have correct content, and that git is properly initialized. All tests are shell-based verification checks.

## Test Coverage Goals

- 100% of created files verified (existence + key content)
- Git initialization verified (repo init + clean status + commit present)
- Agent schema correctness verified (key sections present in CLAUDE.md and .cursorrules)

## File Existence Tests

### Folder skeleton

- [ ] `test -d /Users/linhvuquach/Documents/second-brain/raw/articles` exits 0
- [ ] `test -d /Users/linhvuquach/Documents/second-brain/raw/books` exits 0
- [ ] `test -d /Users/linhvuquach/Documents/second-brain/raw/videos` exits 0
- [ ] `test -d /Users/linhvuquach/Documents/second-brain/raw/podcasts` exits 0
- [ ] `test -d /Users/linhvuquach/Documents/second-brain/raw/assets` exits 0
- [ ] `test -d /Users/linhvuquach/Documents/second-brain/00-Inbox` exits 0
- [ ] `test -d /Users/linhvuquach/Documents/second-brain/10-Daily` exits 0
- [ ] `test -d /Users/linhvuquach/Documents/second-brain/20-Projects` exits 0
- [ ] `test -d /Users/linhvuquach/Documents/second-brain/30-Areas/area-engineering-craft` exits 0
- [ ] `test -d /Users/linhvuquach/Documents/second-brain/30-Areas/area-health` exits 0
- [ ] `test -d /Users/linhvuquach/Documents/second-brain/30-Areas/area-finances` exits 0
- [ ] `test -d /Users/linhvuquach/Documents/second-brain/30-Areas/area-relationships` exits 0
- [ ] `test -d /Users/linhvuquach/Documents/second-brain/40-Resources/tech/languages` exits 0
- [ ] `test -d /Users/linhvuquach/Documents/second-brain/40-Resources/tech/system-design` exits 0
- [ ] `test -d /Users/linhvuquach/Documents/second-brain/40-Resources/tech/snippets` exits 0
- [ ] `test -d /Users/linhvuquach/Documents/second-brain/40-Resources/tech/tools` exits 0
- [ ] `test -d /Users/linhvuquach/Documents/second-brain/40-Resources/learning` exits 0
- [ ] `test -d /Users/linhvuquach/Documents/second-brain/40-Resources/general` exits 0
- [ ] `test -d /Users/linhvuquach/Documents/second-brain/50-Slipbox` exits 0
- [ ] `test -d /Users/linhvuquach/Documents/second-brain/60-MOCs` exits 0
- [ ] `test -d /Users/linhvuquach/Documents/second-brain/70-People` exits 0
- [ ] `test -d /Users/linhvuquach/Documents/second-brain/80-Archive` exits 0
- [ ] `test -d /Users/linhvuquach/Documents/second-brain/90-Meta/Templates` exits 0
- [ ] `test -d /Users/linhvuquach/Documents/second-brain/90-Meta/Attachments` exits 0
- [ ] `test -d /Users/linhvuquach/Documents/second-brain/90-Meta/AI-Sessions` exits 0

### Vault-root files

- [ ] `test -f /Users/linhvuquach/Documents/second-brain/CLAUDE.md` exits 0
- [ ] `test -f /Users/linhvuquach/Documents/second-brain/.cursorrules` exits 0
- [ ] `test -f /Users/linhvuquach/Documents/second-brain/README.md` exits 0
- [ ] `test -f /Users/linhvuquach/Documents/second-brain/index.md` exits 0
- [ ] `test -f /Users/linhvuquach/Documents/second-brain/log.md` exits 0
- [ ] `test -f /Users/linhvuquach/Documents/second-brain/.gitignore` exits 0

### Templates

- [ ] `test -f /Users/linhvuquach/Documents/second-brain/90-Meta/Templates/daily-note.md` exits 0
- [ ] `test -f /Users/linhvuquach/Documents/second-brain/90-Meta/Templates/lit-note.md` exits 0
- [ ] `test -f /Users/linhvuquach/Documents/second-brain/90-Meta/Templates/evergreen-note.md` exits 0
- [ ] `test -f /Users/linhvuquach/Documents/second-brain/90-Meta/Templates/project-note.md` exits 0
- [ ] `test -f /Users/linhvuquach/Documents/second-brain/90-Meta/Templates/weekly-review.md` exits 0
- [ ] `test -f /Users/linhvuquach/Documents/second-brain/90-Meta/Templates/ingest-session.md` exits 0

### _index.md files

- [ ] `test -f /Users/linhvuquach/Documents/second-brain/00-Inbox/_index.md` exits 0
- [ ] `test -f /Users/linhvuquach/Documents/second-brain/10-Daily/_index.md` exits 0
- [ ] `test -f /Users/linhvuquach/Documents/second-brain/20-Projects/_index.md` exits 0
- [ ] `test -f /Users/linhvuquach/Documents/second-brain/30-Areas/_index.md` exits 0
- [ ] `test -f /Users/linhvuquach/Documents/second-brain/40-Resources/_index.md` exits 0
- [ ] `test -f /Users/linhvuquach/Documents/second-brain/50-Slipbox/_index.md` exits 0
- [ ] `test -f /Users/linhvuquach/Documents/second-brain/60-MOCs/_index.md` exits 0
- [ ] `test -f /Users/linhvuquach/Documents/second-brain/70-People/_index.md` exits 0
- [ ] `test -f /Users/linhvuquach/Documents/second-brain/80-Archive/_index.md` exits 0
- [ ] `test -f /Users/linhvuquach/Documents/second-brain/90-Meta/_index.md` exits 0

## Content Correctness Tests

### CLAUDE.md key sections

- [ ] `grep -q "Two-layer model" /Users/linhvuquach/Documents/second-brain/CLAUDE.md`
- [ ] `grep -q "index.md" /Users/linhvuquach/Documents/second-brain/CLAUDE.md`
- [ ] `grep -q "log.md" /Users/linhvuquach/Documents/second-brain/CLAUDE.md`
- [ ] `grep -q "raw/" /Users/linhvuquach/Documents/second-brain/CLAUDE.md`
- [ ] `grep -q "Ingest workflow" /Users/linhvuquach/Documents/second-brain/CLAUDE.md`
- [ ] `grep -q "80-Archive" /Users/linhvuquach/Documents/second-brain/CLAUDE.md`

### .cursorrules key sections

- [ ] `grep -q "index.md" /Users/linhvuquach/Documents/second-brain/.cursorrules`
- [ ] `grep -q "NEVER MODIFY" /Users/linhvuquach/Documents/second-brain/.cursorrules`
- [ ] `grep -q "Ingest workflow" /Users/linhvuquach/Documents/second-brain/.cursorrules`

### .gitignore exclusions

- [ ] `grep -q "workspace.json" /Users/linhvuquach/Documents/second-brain/.gitignore`
- [ ] `grep -q ".trash/" /Users/linhvuquach/Documents/second-brain/.gitignore`

### log.md first entry

- [ ] `grep -q "2026-06-06" /Users/linhvuquach/Documents/second-brain/log.md`
- [ ] `grep -q "init" /Users/linhvuquach/Documents/second-brain/log.md`

### Templates have frontmatter

- [ ] `grep -q "^---" /Users/linhvuquach/Documents/second-brain/90-Meta/Templates/daily-note.md`
- [ ] `grep -q "^---" /Users/linhvuquach/Documents/second-brain/90-Meta/Templates/lit-note.md`
- [ ] `grep -q "^---" /Users/linhvuquach/Documents/second-brain/90-Meta/Templates/evergreen-note.md`

## Git Tests

- [ ] `git -C /Users/linhvuquach/Documents/second-brain rev-parse --is-inside-work-tree` returns `true`
- [ ] `git -C /Users/linhvuquach/Documents/second-brain log --oneline | wc -l` ≥ 1
- [ ] `git -C /Users/linhvuquach/Documents/second-brain status --porcelain` returns empty (clean tree)

## Manual Testing

After automated checks pass:

- [ ] Open Obsidian — file explorer shows all top-level folders in correct order
- [ ] Open `CLAUDE.md` in Obsidian — renders correctly, no broken formatting
- [ ] Open `90-Meta/Templates/daily-note.md` — frontmatter fields visible in Properties panel
- [ ] Obsidian graph view — no errors, vault loads cleanly

## Bug Tracking

Issues found during implementation are fixed immediately; no separate tracker needed for a single-session setup task.
