Run a full monthly wiki lint for my second brain. Today is $CURRENT_DATE.

Read `index.md` first to get the full page catalog. Then run each check below in order. After each check, print findings and wait for my confirmation before making any changes.

---

## Check 1 — Dangling wikilinks

Scan every file in `40-Resources/`, `50-Slipbox/`, and `60-MOCs/` for `[[...]]` wikilinks.
For each link, verify the target exists in `index.md` or as a file on disk.

Report a table:

| Source file | Broken link | Suggested fix (existing note or "create new") |
|---|---|---|

For each broken link, propose one of:
- **Retarget** — a close-enough existing note to repoint to
- **Create stub** — the concept deserves its own page (add to `00-Inbox/` as a stub task)
- **Remove** — the link was noise

Apply confirmed fixes immediately.

---

## Check 2 — Orphan pages

For every file in `40-Resources/`, `50-Slipbox/`, and `60-MOCs/`, count inbound wikilinks from all other files.

Report orphans (0 inbound links):

| Orphan file | Age (days since created) | Suggested action |
|---|---|---|

Suggested actions:
- **Link** — name 1–2 notes that should reference it
- **Merge** — content belongs inside another note
- **Archive** — genuinely superseded, move to `80-Archive/`
- **Keep** — it's a root node (MOC, index) that doesn't need inbound links

Apply confirmed actions.

---

## Check 3 — Stale seedlings

Find all notes in `50-Slipbox/` with `status: seedling` where `created:` is more than 30 days before today.

Report a table:

| Note | Created | Age (days) | Inbound links | Outbound links |
|---|---|---|---|---|

For each stale seedling, suggest one of:
- **Promote to budding** — it has enough links now; just needs the status bump
- **Needs links** — suggest 2–3 notes to connect it to, then promote
- **Discard** — the idea didn't grow; delete and remove from `index.md`

Apply confirmed changes.

---

## Check 4 — Contradictions between slipbox claims

Read all notes in `50-Slipbox/`. Look for pairs of notes whose titles or body content make opposing or incompatible claims (e.g., "X causes Y" vs. "X does not cause Y", or conflicting statistics/dates about the same subject).

Report each suspected contradiction:

| Note A | Note B | Conflict description |
|---|---|---|

For each, suggest:
- **Reconcile** — one note was written with more recent/better information; update the older
- **Nuance** — both can be true in different contexts; add a clarifying sentence to each
- **Flag** — uncertain; add a `#needs-review` tag and drop a task in `00-Inbox/`

Apply confirmed resolutions.

---

## Check 5 — Concept gaps

Scan all files in `10-Daily/`, `40-Resources/`, `50-Slipbox/`, and `60-MOCs/` for noun phrases that appear in 3 or more distinct files but have no dedicated page in `50-Slipbox/` or `40-Resources/`.

Report the top candidates:

| Concept | Mention count | Files it appears in | Suggested note type |
|---|---|---|---|

For each confirmed gap, create a stub note in `00-Inbox/` with:
- Filename: the concept name
- Frontmatter: `type: fleeting`, `status: seedling`, `tags: [needs-expansion]`
- Body: one-sentence placeholder + list of source files that mention it

---

## Wrap-up

After all checks are done and confirmed changes are applied:

1. Update `index.md` to reflect any added, removed, or renamed files.
2. Append to `log.md`: `## [$CURRENT_DATE] monthly-lint | <N issues found, M fixed, K deferred>`.
3. Write a session summary to `90-Meta/AI-Sessions/$CURRENT_DATE-monthly-lint.md` with a one-paragraph health report: what the vault looked like, what was fixed, what was deferred.
