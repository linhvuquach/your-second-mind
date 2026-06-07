# Daily Use — Building the Second Brain

A practical guide to capturing, processing, and retrieving knowledge every day
using this vault (PARA + Zettelkasten + LLM Wiki).

---

## The daily rhythm

| Time | Where | What |
|---|---|---|
| Morning (5 min) | Mobile / desktop | Open daily note, set AM intent |
| Throughout day | Mobile / Web Clipper | Capture: articles, ideas, fleeting notes → `00-Inbox/` |
| Evening (5 min) | Mobile / desktop | Evening review in daily note |
| Ingest session (15–30 min) | Desktop + AI | Process inbox, run ingest on queued sources |
| Sunday (30–45 min) | Desktop | Weekly review — inbox zero, slipbox grooming, plan |

The vault compounds only if capture and ingest happen regularly.
Capture without ingest fills the inbox. Ingest without capture starves the wiki.

---

## Web Clipper — capturing articles and web pages

**Obsidian Web Clipper** is the official browser extension. It saves any web page
as a markdown file directly into your vault.

### Install

- Chrome / Edge: [Obsidian Web Clipper on Chrome Web Store](https://chrome.google.com/webstore/detail/obsidian-web-clipper)
- Firefox: available on Firefox Add-ons
- Safari: available on the Mac App Store (macOS / iOS)

### Configure

In the extension settings:

| Setting | Value |
|---|---|
| Vault | `second-brain` |
| Default folder | `00-Inbox/` |
| Note name | `{{published}} {{title}}` |
| Template | see below |

**Clip template (paste into extension settings):**

```
---
created: {{date}}
updated: {{date}}
type: fleeting
tags: []
status: seedling
source: {{url}}
author: {{author}}
---

# {{title}}

{{content}} or {{highlights}}
```

### How to use

1. Open any article you want to keep.
2. Highlight key passages in the browser (the clipper captures them).
3. Click the extension icon → review title and folder → **Save**.
4. The file lands in `00-Inbox/` as a fleeting note.
5. During your ingest session, move the raw source to `raw/articles/` and run
   the ingest workflow to promote it into the wiki layer.

> **Rule:** Clip liberally. Process selectively. Not everything clipped needs a
> full ingest — some items stay as fleeting notes and get discarded at weekly review.

---

## Mobile capture — Obsidian on iOS / Android

Obsidian has a free mobile app (iOS and Android). Use it for:

- Quick fleeting thoughts → `00-Inbox/`
- Opening your daily note on the go
- Reading and reviewing existing wiki pages
- **Not** heavy writing or ingest — do that at desktop with AI

### Quick-capture on mobile

1. Open Obsidian → tap the new note icon
2. The Periodic Notes plugin auto-opens today's daily note if configured
3. Drop a thought in `## Log` section, or create a new file in `00-Inbox/`
4. Tap save — sync handles the rest

### Daily note on mobile

With the Periodic Notes plugin installed and synced, your `10-Daily/YYYY-MM-DD.md`
template opens automatically when you tap "Today" — same file that syncs to desktop.

---

## Cross-device sync

You need one sync method. Pick one.

| Method | Cost | Platforms | Notes |
|---|---|---|---|
| **Obsidian Sync** | $8/mo | All | Official, E2E encrypted, simplest setup, real-time |
| **iCloud Drive** | Free (5 GB) | Apple only | Store vault in `~/Library/Mobile Documents/iCloud~md~obsidian/`; auto-syncs |
| **Remotely Save plugin** | Free | All | Connects to S3, Dropbox, OneDrive, or WebDAV; install via Community Plugins |
| **Working Copy + git** | Free (iOS) | iOS + any git host | Manual commits required; best if you already use git for the vault |

### Recommended for this vault: iCloud (Apple) or Obsidian Sync

This vault is already a git repo — git is the source of truth for history. Sync is
only for getting files between devices fast. Use the simplest option that works on
your devices.

**iCloud setup (Apple devices):**

1. Move your vault folder to:
   `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/second-brain/`
2. Open Obsidian → Open vault from that path
3. On iPhone: Obsidian → Settings → About → tap vault name → it appears automatically

**Obsidian Sync setup:**

1. Settings → Sync → Create new remote vault
2. Enable on each device
3. Select what to sync (exclude `raw/` if size is a concern — those files are in git)

### Sync hygiene

- Never edit the same file simultaneously on two devices — last-write wins
- Commit git after desktop ingest sessions; don't rely on sync for history
- `.gitignore` already excludes `.obsidian/workspace.json` and `.obsidian/workspace-mobile.json`
  so per-device UI state doesn't create merge conflicts

---

## Daily ingest session (15–30 min at desktop)

This is the core compounding operation. Run it whenever you have 1–3 items in
`raw/articles/` or clipped items in `00-Inbox/` worth processing.

### The 6-step workflow (from CLAUDE.md)

```
1. Read the source in raw/
2. Discuss key takeaways with the AI
3. Write a lit note in 40-Resources/learning/
4. Update concept pages in 50-Slipbox/ and 60-MOCs/
5. Update index.md with new pages
6. Append to log.md
```

### How to run it

**In Claude Code (terminal):**
```
cd ~/Documents/second-brain
claude
> Ingest raw/articles/[filename].md
```

**In Cursor:**
```
Cmd+I → "Ingest raw/articles/[filename].md"
```

The AI follows the 6-step workflow automatically. Your job is to review each
file before it's written (the AI should ask for approval at each step), then
`git commit` when the session is done.

### What one ingest produces

| Output | Location | Count |
|---|---|---|
| Lit note (summary) | `40-Resources/learning/` | 1 |
| Atomic slipbox claims | `50-Slipbox/` | 2–5 |
| MOC updates | `60-MOCs/` | 1–2 updated |
| index.md entries | `index.md` | 3–8 lines added |
| log.md entry | `log.md` | 1 line |

One 20-minute session with one article produces ~5–10 new wiki pages.
After 20 ingests: 100–200 cross-referenced pages from 20 articles.

---

## Weekly review (Sunday, 30–45 min)

The weekly review prevents inbox rot and advances notes toward evergreen status.
Use the template at `90-Meta/Templates/weekly-review.md`.

### The 5 steps

**Step 1 — Review daily notes**
```
# Prompt to Claude Code:
Read 10-Daily/<monday>.md through <sunday>.md.
Produce a summary: What I shipped, Decisions made, Open loops,
People I owe something, Things I learned.
```

**Step 2 — Project sweep**
Open each `20-Projects/_index.md`. Mark status: active / blocked / done / archive.
Update the next action field.

**Step 3 — Inbox to zero**
For every file in `00-Inbox/`:
- Discard: delete (it was noise)
- File: move to the correct PARA folder
- Promote: run ingest (it's worth a lit note)

No file should stay in `00-Inbox/` past Sunday.

**Step 4 — Slipbox grooming**
```
# Prompt:
Show me notes in 50-Slipbox/ created this week. For each, suggest
3 existing notes it should link to based on semantic similarity.
```
Review suggestions, add wikilinks, and upgrade `status: seedling` notes
that now have cross-references to `status: budding`.

**Step 5 — Plan next week**
Three priorities. One project to close. One person to reach out to.

---

## Monthly lint (30 min, once a month)

```
# Prompt to Claude Code:
Lint the wiki — check for: dangling wikilinks, orphan pages with no
inbound links, notes marked seedling for >30 days, contradictions
between slipbox claims, important concepts mentioned in multiple notes
but without their own page.
```

Fix issues immediately or add them to `00-Inbox/` for the next weekly review.

---

## The compounding model

| Habit | Frequency | Time | What it builds |
|---|---|---|---|
| Daily capture | Daily | 5 min | Raw material in `00-Inbox/` |
| Daily note | Daily | 5 min | Searchable day-by-day log |
| Weekly review | Weekly | 40 min | Inbox zero, note maturation |
| Ingest session | 2–3×/week | 20 min | 5–10 new wiki pages per session |
| Lint pass | Monthly | 30 min | Wiki health, orphan removal |

After 3 months of consistent use:
- ~20–40 ingested sources
- ~100–300 cross-referenced wiki pages
- Every query answered from compiled knowledge, not cold-start

A RAG system gives the same answer on day 1 and day 365.
This vault answers better on day 365 because every session added to the compiled layer.
