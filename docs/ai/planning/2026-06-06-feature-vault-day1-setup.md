---
phase: planning
title: Project Planning & Task Breakdown
description: Break down work into actionable tasks and estimate timeline
---

# Project Planning & Task Breakdown

## Milestones

- [ ] M1: Folder skeleton created (all directories + .gitkeep)
- [ ] M2: Agent schemas and navigation files created (CLAUDE.md, .cursorrules, README.md, index.md, log.md, .gitignore)
- [ ] M3: Templates created (6 files in 90-Meta/Templates/)
- [ ] M4: _index.md files created (10 files, one per top-level folder)
- [ ] M5: Git initialized and first commit made
- [ ] M6: Verification checks pass (all file/content/git tests green)

## Task Breakdown

### Phase 1: Folder Skeleton

- [ ] T1.1: Create `raw/` with subdirs: `articles/`, `books/`, `videos/`, `podcasts/`, `assets/`
- [ ] T1.2: Create `00-Inbox/`
- [ ] T1.3: Create `10-Daily/`
- [ ] T1.4: Create `20-Projects/`
- [ ] T1.5: Create `30-Areas/` with subdirs: `area-engineering-craft/`, `area-health/`, `area-finances/`, `area-relationships/`
- [ ] T1.6: Create `40-Resources/` with subdirs: `tech/languages/`, `tech/system-design/`, `tech/snippets/`, `tech/tools/`, `learning/`, `general/`
- [ ] T1.7: Create `50-Slipbox/`
- [ ] T1.8: Create `60-MOCs/`
- [ ] T1.9: Create `70-People/`
- [ ] T1.10: Create `80-Archive/`
- [ ] T1.11: Create `90-Meta/` with subdirs: `Templates/`, `Attachments/`, `AI-Sessions/`
- [ ] T1.12: Add `.gitkeep` to all empty leaf directories

### Phase 2: Agent Schemas & Navigation Files

- [ ] T2.1: Create `CLAUDE.md` — full template from updated docs Section 4, Pattern B (two-layer model, special files, folder map, frontmatter contract, operating rules, ingest workflow, common prompts)
- [ ] T2.2: Create `.cursorrules` — full Cursor schema template from updated docs Section 4, Pattern C (same conventions, Cursor-native format)
- [ ] T2.3: Create `README.md` — human dashboard with folder overview, agent entry points, quick start for Day 2
- [ ] T2.4: Create `index.md` — seeded with category headers (Sources, Concepts, MOCs, Projects, People) and placeholder text
- [ ] T2.5: Create `log.md` — seeded with Day 1 init entry: `## [2026-06-06] init | Vault Day 1 setup`
- [ ] T2.6: Create `.gitignore` — exclude `.obsidian/workspace.json`, `.obsidian/workspace-mobile.json`, `.trash/`

### Phase 3: Templates

- [ ] T3.1: Create `90-Meta/Templates/daily-note.md` — frontmatter (type: daily) + sections: AM Intent, Log, Evening Review, Tomorrow; Templater `<% tp.date.now() %>` for date fields
- [ ] T3.2: Create `90-Meta/Templates/lit-note.md` — frontmatter (type: lit, source URL, author, read date) + sections: Summary, Key Claims, Atomic Claim Candidates, Quotes
- [ ] T3.3: Create `90-Meta/Templates/evergreen-note.md` — frontmatter (type: evergreen, status: seedling) + sections: Claim, Supporting Evidence, Counterarguments, Related Notes
- [ ] T3.4: Create `90-Meta/Templates/project-note.md` — frontmatter (type: project, status) + sections: Goal, Status, Next Action, Decisions Log, Related
- [ ] T3.5: Create `90-Meta/Templates/weekly-review.md` — the 5-step review script from docs Section 5 with Claude Code prompts embedded
- [ ] T3.6: Create `90-Meta/Templates/ingest-session.md` — ingest checklist: read source → discuss takeaways → write summary → update entity/concept pages → update index.md → append log.md

### Phase 4: _index.md Files

- [ ] T4.1: `00-Inbox/_index.md` — purpose: raw captures; naming: no conventions; what belongs: anything unprocessed; agent instruction: triage before moving
- [ ] T4.2: `10-Daily/_index.md` — purpose: daily notes; naming: YYYY-MM-DD.md; what belongs: journal, meetings, todos; do not process these
- [ ] T4.3: `20-Projects/_index.md` — purpose: active time-bound projects; naming: proj-kebab-name/; each subfolder has _index.md; read it first
- [ ] T4.4: `30-Areas/_index.md` — purpose: ongoing responsibilities; naming: area-kebab-name/; not time-bound
- [ ] T4.5: `40-Resources/_index.md` — purpose: reference + wiki layer; naming: lit-title.md for literature, tech-topic.md for tech; LLM maintains this
- [ ] T4.6: `50-Slipbox/_index.md` — purpose: atomic evergreen notes; naming: full-sentence claim as filename; status: seedling→budding→evergreen
- [ ] T4.7: `60-MOCs/_index.md` — purpose: Maps of Content; naming: MOC - Topic.md; hand-written index notes linking atomic notes
- [ ] T4.8: `70-People/_index.md` — purpose: CRM-style person notes; naming: first-last.md; includes recent interactions and shared projects
- [ ] T4.9: `80-Archive/_index.md` — purpose: inactive/historical; read-only; NEVER modify archived files
- [ ] T4.10: `90-Meta/_index.md` — purpose: vault meta (templates, attachments, agent session logs); Templates/ contains Templater templates; AI-Sessions/ for agent summaries

### Phase 5: Git

- [ ] T5.1: `git init` in vault
- [ ] T5.2: `git add .` (stages all files including .gitignore)
- [ ] T5.3: `git commit -m "Day 1: PARA + Karpathy skeleton, agent schemas, templates"`

### Phase 6: Verification

- [ ] T6.1: Run folder existence checks (all 25 directories)
- [ ] T6.2: Run file existence checks (all vault-root, template, and _index.md files)
- [ ] T6.3: Run content correctness checks (key sections in CLAUDE.md, .cursorrules, .gitignore, log.md, templates)
- [ ] T6.4: Run git checks (repo initialized, commit present, clean status)

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
