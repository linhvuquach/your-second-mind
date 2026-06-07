---
phase: planning
title: Project Planning & Task Breakdown
description: Break down work into actionable tasks and estimate timeline
---

# Project Planning & Task Breakdown

## Milestones

- [x] M1: Folder skeleton created (all directories + .gitkeep)
- [x] M2: Agent schemas and navigation files created (CLAUDE.md, .cursorrules, README.md, index.md, log.md, .gitignore)
- [x] M3: Templates created (6 files in 90-Meta/Templates/)
- [x] M4: _index.md files created (10 files, one per top-level folder)
- [x] M5: Git initialized and first commit made
- [x] M6: Verification checks pass (all file/content/git tests green)

## Task Breakdown

### Phase 1: Folder Skeleton

- [x] T1.1: Create `raw/` with subdirs: `articles/`, `books/`, `videos/`, `podcasts/`, `assets/`
- [x] T1.2: Create `00-Inbox/`
- [x] T1.3: Create `10-Daily/`
- [x] T1.4: Create `20-Projects/`
- [x] T1.5: Create `30-Areas/` with subdirs: `area-engineering-craft/`, `area-health/`, `area-finances/`, `area-relationships/`
- [x] T1.6: Create `40-Resources/` with subdirs: `tech/languages/`, `tech/system-design/`, `tech/snippets/`, `tech/tools/`, `learning/`, `general/`
- [x] T1.7: Create `50-Slipbox/`
- [x] T1.8: Create `60-MOCs/`
- [x] T1.9: Create `70-People/`
- [x] T1.10: Create `80-Archive/`
- [x] T1.11: Create `90-Meta/` with subdirs: `Templates/`, `Attachments/`, `AI-Sessions/`
- [x] T1.12: Add `.gitkeep` to all empty leaf directories

### Phase 2: Agent Schemas & Navigation Files

- [x] T2.1: Create `CLAUDE.md` — full template from updated docs Section 4, Pattern B (two-layer model, special files, folder map, frontmatter contract, operating rules, ingest workflow, common prompts)
- [x] T2.2: Create `.cursorrules` — full Cursor schema template from updated docs Section 4, Pattern C (same conventions, Cursor-native format)
- [x] T2.3: Create `README.md` — human dashboard with folder overview, agent entry points, quick start for Day 2
- [x] T2.4: Create `index.md` — seeded with category headers (Sources, Concepts, MOCs, Projects, People) and placeholder text
- [x] T2.5: Create `log.md` — seeded with Day 1 init entry: `## [2026-06-06] init | Vault Day 1 setup`
- [x] T2.6: Create `.gitignore` — exclude `.obsidian/workspace.json`, `.obsidian/workspace-mobile.json`, `.trash/`

### Phase 3: Templates

- [x] T3.1: Create `90-Meta/Templates/daily-note.md` — frontmatter (type: daily) + sections: AM Intent, Log, Evening Review, Tomorrow; Templater `<% tp.date.now() %>` for date fields
- [x] T3.2: Create `90-Meta/Templates/lit-note.md` — frontmatter (type: lit, source URL, author, read date) + sections: Summary, Key Claims, Atomic Claim Candidates, Quotes
- [x] T3.3: Create `90-Meta/Templates/evergreen-note.md` — frontmatter (type: evergreen, status: seedling) + sections: Claim, Supporting Evidence, Counterarguments, Related Notes
- [x] T3.4: Create `90-Meta/Templates/project-note.md` — frontmatter (type: project, status) + sections: Goal, Status, Next Action, Decisions Log, Related
- [x] T3.5: Create `90-Meta/Templates/weekly-review.md` — the 5-step review script from docs Section 5 with Claude Code prompts embedded
- [x] T3.6: Create `90-Meta/Templates/ingest-session.md` — ingest checklist: read source → discuss takeaways → write summary → update entity/concept pages → update index.md → append log.md

### Phase 4: _index.md Files

- [x] T4.1: `00-Inbox/_index.md` — purpose: raw captures; naming: no conventions; what belongs: anything unprocessed; agent instruction: triage before moving
- [x] T4.2: `10-Daily/_index.md` — purpose: daily notes; naming: YYYY-MM-DD.md; what belongs: journal, meetings, todos; do not process these
- [x] T4.3: `20-Projects/_index.md` — purpose: active time-bound projects; naming: proj-kebab-name/; each subfolder has _index.md; read it first
- [x] T4.4: `30-Areas/_index.md` — purpose: ongoing responsibilities; naming: area-kebab-name/; not time-bound
- [x] T4.5: `40-Resources/_index.md` — purpose: reference + wiki layer; naming: lit-title.md for literature, tech-topic.md for tech; LLM maintains this
- [x] T4.6: `50-Slipbox/_index.md` — purpose: atomic evergreen notes; naming: full-sentence claim as filename; status: seedling→budding→evergreen
- [x] T4.7: `60-MOCs/_index.md` — purpose: Maps of Content; naming: MOC - Topic.md; hand-written index notes linking atomic notes
- [x] T4.8: `70-People/_index.md` — purpose: CRM-style person notes; naming: first-last.md; includes recent interactions and shared projects
- [x] T4.9: `80-Archive/_index.md` — purpose: inactive/historical; read-only; NEVER modify archived files
- [x] T4.10: `90-Meta/_index.md` — purpose: vault meta (templates, attachments, agent session logs); Templates/ contains Templater templates; AI-Sessions/ for agent summaries

### Phase 5: Git

- [x] T5.1: `git init` in vault
- [x] T5.2: `git add .` (stages all files including .gitignore)
- [x] T5.3: `git commit -m "Day 1: PARA + Karpathy skeleton, agent schemas, templates"`

### Phase 6: Verification

- [x] T6.1: Run folder existence checks (all 25 directories)
- [x] T6.2: Run file existence checks (all vault-root, template, and _index.md files)
- [x] T6.3: Run content correctness checks (key sections in CLAUDE.md, .cursorrules, .gitignore, log.md, templates)
- [x] T6.4: Run git checks (repo initialized, commit present, clean status)

## Dependencies

- T1.x must complete before T4.x (_index.md files go inside created folders)
- T2.6 (.gitignore) must complete before T5.2 (`git add`)
- All T1–T4 must complete before T5.x (git)
- T5.x must complete before T6.x (verification includes git checks)

## Timeline & Estimates

Single session execution — all tasks completable in one Claude Code run (~10–15 minutes of file creation).

| Phase | Tasks | Estimate |
|---|---|---|
| Folder skeleton | T1.1–T1.12 | ~2 min |
| Agent schemas + nav | T2.1–T2.6 | ~5 min |
| Templates | T3.1–T3.6 | ~5 min |
| _index.md files | T4.1–T4.10 | ~3 min |
| Git | T5.1–T5.3 | ~1 min |
| Verification | T6.1–T6.4 | ~1 min |

## Risks & Mitigation

| Risk | Likelihood | Mitigation |
|---|---|---|
| `.obsidian/` config overwritten | Low | Never touch `.obsidian/`; only create new files |
| `.gitignore` not excluding workspace.json before first commit | Low | Create .gitignore in T2.6 before T5.2 |
| Templater syntax in templates confuses Obsidian before plugin install | None | Templater syntax is inert text until plugin is installed; safe to pre-create |
| Template file creation order | Low | Templates are independent; any order works |

## Resources Needed

- Claude Code with Write access to `/Users/linhvuquach/Documents/second-brain/`
- Reference: updated `docs/building-a-second-brain.md` (Section 2, 4, 5 templates)
- No external dependencies, APIs, or packages required
