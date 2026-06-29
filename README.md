# your-second-mind

[![npm version](https://img.shields.io/npm/v/your-second-mind)](https://www.npmjs.com/package/your-second-mind)
[![npm downloads](https://img.shields.io/npm/dm/your-second-mind)](https://www.npmjs.com/package/your-second-mind)
[![license](https://img.shields.io/npm/l/your-second-mind)](LICENSE)

Scaffold a personalized, agent-ready [second brain](https://www.buildingasecondbrain.com/) Obsidian vault in under a minute.

```
npx your-second-mind@latest
```

## What you get

A ready-to-open Obsidian vault structured around **PARA + Zettelkasten**:

```
00-Inbox/          ← capture anything here first
10-Daily/          ← daily notes
20-Projects/       ← active projects
30-Areas/          ← ongoing areas of responsibility
40-Resources/      ← reference material
50-Slipbox/        ← atomic, evergreen notes (Zettelkasten)
60-MOCs/           ← maps of content
70-People/         ← contact / relationship notes
80-Archive/        ← completed projects & inactive areas
90-Meta/           ← vault config: templates, AI sessions
  Templates/       ← 6 Obsidian note templates
  AI-Sessions/

raw/               ← raw source subfolders (papers, articles, …)
agents-workflow/   ← copy-paste commands for your AI agent
CLAUDE.md          ← Claude Code operating manual (if selected)
.cursorrules       ← Cursor rules (if selected)
AGENTS.md          ← Codex / OpenAI instructions (if selected)
README.md          ← this vault's README
index.md           ← vault index
log.md             ← running log
.gitignore         ← .obsidian/, .DS_Store
```

Each folder gets a `_index.md` with a Dataview query stub.

## Quick start

```bash
# Interactive (recommended for first run)
npx your-second-mind@latest

# Non-interactive (CI / scripted)
npx your-second-mind@latest \
  --yes \
  --name "Alice" \
  --vault-path ~/second-brain \
  --agents claude-code,cursor \
  --areas engineering-craft,writing,health \
  --no-git
```

## Flags

| Flag | Short | Description |
|------|-------|-------------|
| `--yes` | `-y` | Skip prompts; use defaults + any flags supplied |
| `--name <n>` | | Your name (used in AI schema files) |
| `--role <r>` | | Your role (default: `software engineer`) |
| `--vault-path <p>` | | Destination directory (default: `~/second-brain`) |
| `--agents <list>` | | Comma-separated: `claude-code`, `cursor`, `codex` |
| `--areas <list>` | | Comma-separated area names (prefixed with `area-`) |
| `--raw-sources <list>` | | Comma-separated raw source folders under `raw/` |
| `--no-git` | | Skip `git init` |
| `--dry-run` | | Preview what would be created; write nothing |
| `--force` | | Overwrite existing files |
| `--help` | `-h` | Show help |
| `--version` | `-V` | Print version |

## Multi-agent setup

Your vault ships with an `agents-workflow/` directory containing ready-to-use slash commands:

- **Claude Code** → copy `weekly-review.md` and `monthly-lint.md` to `.claude/commands/`
- **Cursor** → copy to `.cursor/commands/` (check Cursor docs for the exact path)
- **Codex / OpenAI** → copy to your agent's commands directory
- **Other agents** → see `agents-workflow/README.md` for generic instructions

## After scaffolding

1. Open Obsidian → **Open folder as vault** → select your vault path
2. Install the [Dataview](https://github.com/blacksmithgu/obsidian-dataview) plugin (used by `_index.md` files)
3. Install [Templater](https://github.com/SilentVoid13/Templater) plugin and point it at `90-Meta/Templates/`
4. Copy `agents-workflow/weekly-review.md` to your agent's commands folder and run `/weekly-review`

## Requirements

- Node.js ≥ 20
- npm ≥ 7 (ships with Node 16+)

## License

MIT
