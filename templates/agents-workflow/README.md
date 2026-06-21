# agents-workflow — Portable Agent Commands

This folder contains two recurring second-brain commands that work with any AI agent:

| File | What it does |
|---|---|
| `weekly-review.md` | 5-step weekly review: daily notes → projects → inbox → slipbox → plan |
| `monthly-lint.md` | 5-check monthly health: dangling links, orphans, stale seedlings, contradictions, gaps |

Both files reference only **relative vault paths** and agent-runtime variables
(`$CURRENT_DATE`, `$ARGUMENTS`). They contain no personal data and need no editing.

---

## How to install by agent

### Claude Code

Copy each file into your `.claude/commands/` folder:

```bash
cp agents-workflow/weekly-review.md  .claude/commands/weekly-review.md
cp agents-workflow/monthly-lint.md   .claude/commands/monthly-lint.md
```

Then invoke with `/weekly-review` or `/monthly-lint` inside a Claude Code session
opened at your vault root.

### Cursor

1. Open `.cursorrules` and add a reference at the bottom:
   ```
   ## Available commands
   - Weekly review: see agents-workflow/weekly-review.md
   - Monthly lint:  see agents-workflow/monthly-lint.md
   ```
2. When you want to run a command, paste its contents as a prompt, or ask Cursor
   to "run the weekly review as described in agents-workflow/weekly-review.md".

### Codex / OpenAI

Paste the command file contents as the system prompt or user message for that session,
substituting `$CURRENT_DATE` with today's date manually if your agent does not
resolve it automatically.

### Generic agent

1. Open the command file.
2. Replace `$CURRENT_DATE` with today's date.
3. Paste the contents as a prompt or instruction to your agent.

---

One source of truth — copy once into your agent's command location, update here
when you want to change the workflow.
