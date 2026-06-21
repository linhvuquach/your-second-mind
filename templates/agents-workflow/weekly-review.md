Run a full weekly review for my second brain. Today is $CURRENT_DATE.

## Setup

First, determine the review week:
- If the user passed a date argument (`$ARGUMENTS`), parse it as any day in the target week.
- Otherwise use today's date.
- Compute Monday and Sunday of that ISO week (Mon–Sun).
- Call them MONDAY and SUNDAY (format YYYY-MM-DD).

Read `index.md` to orient yourself, then proceed through all five steps below in order. After completing each step, pause and print a **"Step N complete — proceed? (y to continue)"** checkpoint so I can review before moving on. Wait for my confirmation before starting the next step.

---

## Step 1 — Review daily notes

Read `10-Daily/MONDAY.md` through `10-Daily/SUNDAY.md` (skip files that don't exist).

Then write a markdown summary with these sections:
- **What I shipped** — concrete deliverables, PRs merged, tasks closed
- **Decisions made** — choices I committed to
- **Open loops** — things started but not finished
- **People I owe something** — commitments or replies outstanding
- **Things I learned** — concepts, discoveries, insights
- **Done list** — TODOs I marked complete (celebrate these)

Print the summary inline. Do not create a file yet.

---

## Step 2 — Project sweep

Read `20-Projects/_index.md`. Then for every project subfolder that has an `_index.md`, read it.

Produce a markdown table:

| Project | Current status | Suggested status | Next action |
|---|---|---|---|

Allowed statuses: active / blocked / done / archive.

Ask me to confirm which status changes to apply before writing anything.

---

## Step 3 — Inbox to zero

List every file in `00-Inbox/`. For each file, read its content and propose one action:
- **Discard** — noise, suggest deleting
- **File** — belongs in a PARA folder; name the exact destination path
- **Promote** — worth a lit note; run the ingest workflow

Print the proposals as a numbered list. Ask me to confirm each action before executing any moves or deletions. After confirmed actions are done, verify `00-Inbox/` is empty.

---

## Step 4 — Slipbox grooming

List all files in `50-Slipbox/` whose `created:` frontmatter falls within MONDAY–SUNDAY.

For each new slipbox note:
1. Read the note.
2. Scan other notes in `50-Slipbox/` for semantic overlap.
3. Suggest 3 existing notes it should link to, with a one-line reason each.

Print the suggestions. Ask me which links to add before editing any files.

For notes I confirm, add the wikilinks and upgrade `status: seedling` → `status: budding` if the note now has at least 2 outbound links.

---

## Step 5 — Plan next week

Ask me interactively:
1. What are your three priorities for next week?
2. Which one project will you close or ship?
3. Who is one person you'll reach out to?

After I answer, assemble a weekly review note from `90-Meta/Templates/weekly-review.md`:
- Replace the template date placeholders with MONDAY's date.
- Fill in the Step 1 summary.
- Fill in the Step 2 project table with confirmed statuses.
- Check the inbox-zero checkbox.
- Fill in the Step 5 answers.

Save the file to `10-Daily/MONDAY--weekly-review.md`.

Update `index.md` to include the new file.
Append to `log.md`: `## [TODAY] weekly-review | Week of MONDAY`.
Write a session summary to `90-Meta/AI-Sessions/TODAY-weekly-review.md`.
