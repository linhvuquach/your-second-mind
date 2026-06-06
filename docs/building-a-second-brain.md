# Building a Second Brain with Obsidian + AI Agents

> A software engineer's field guide for setting up a personal knowledge management (PKM) system that mixes personal experience, technical knowledge, and learning notes — powered by Obsidian and AI agents (Claude, Claude Code, Cursor, MCP servers, local LLMs).

A second brain is a personal knowledge management system that externalizes thinking so you can capture, connect, and retrieve ideas reliably across years. Obsidian — a local-first, plain-markdown editor with strong bidirectional linking — has become the de facto host for this kind of system, and in the last 18 months the AI-agent ecosystem around it (Claude Desktop via MCP, Claude Code agentic CLI, Cursor, local LLMs via Ollama, and a dozen Obsidian plugins) has matured to the point where you can treat your vault as a workspace shared between you and one or more AI agents.

---

## 1. Foundational concepts

### Tiago Forte's CODE framework

Tiago Forte's *Building a Second Brain* (BASB) defines the CODE loop as "a 4-step process for consistently turning the information you consume into creative output and concrete results":

- **Capture** — Pull anything that resonates into your vault: web clippings, voice memos, quotes, code snippets, half-formed ideas. The bar is "does this resonate?" not "is this important?"
- **Organize** — File by actionability, not by topic. This is where PARA comes in.
- **Distill** — Progressively summarize. Each time you revisit a note, bold the most important parts, then highlight the bolded parts, etc. Layer the note so a future-you can scan it in 10 seconds.
- **Express** — Ship something. Blog posts, design docs, code, decisions, talks. Output is what justifies the system; without it, you're just collecting.

### Why Obsidian fits

- **Local-first plain markdown.** Your vault is a folder of `.md` files. No vendor lock-in, no proprietary database, no cloud dependency. This is the property that makes the AI integration story work — any LLM, agent, or script can read and write your notes.
- **Bidirectional linking + graph view.** `[[Note Name]]` creates a link both ways. The graph shows clusters of related thinking.
- **Plugin ecosystem.** Over 2,000 community plugins covering everything from query engines (Dataview) to drawing (Excalidraw) to AI chat (Smart Connections, Copilot, Smart Composer).
- **Templater + properties (YAML frontmatter).** Lets you treat notes like typed records, which Dataview and AI agents can query.
- **Free for personal use.** Sync, Publish, and commercial use are paid; the editor is free.

### Methodology comparison

| Methodology | Mental model | Best for | Trade-offs |
|---|---|---|---|
| **PARA** (Forte) | Projects, Areas, Resources, Archives. Answers "where does this live *now*?" | Action-oriented people who move work between active and reference states often. | Locations aren't permanent — notes drift between folders as projects close. |
| **Zettelkasten** (Luhmann) | Atomic, permanent notes that link to each other. Knowledge emerges from the link graph. | Researchers, writers, deep thinkers building cumulative arguments. | High maintenance; the linking discipline is real work. Easy to over-engineer IDs. |
| **MOCs (Maps of Content)** (Nick Milo) | Hand-curated index notes that group related atomic notes. A "table of contents you write." | The 80/20 of Zettelkasten with modern tooling — backlinks and search do most discovery, MOCs handle thematic curation. | You still have to write and maintain the MOCs. |
| **Johnny Decimal** | 10 categories × 10 subcategories × notes. Every note gets a permanent address like `05.02.book-notes`. | People who hate folder reshuffling and want strong filesystem-level memorability. | Initial setup is rigid; categories burn slots fast; not great for emergent topics. |
| **LATCH** (Wurman) | Location, Alphabet, Time, Category, Hierarchy — five universal ways to organize info. | Choosing the right *retrieval* dimension for a given context (e.g., daily notes by Time, code snippets by Category). | Not a system in itself; a lens for choosing one. |
| **ACCESS** (Nick Milo, Linking Your Thinking) | Atlas, Calendar, Cards, Extras, Sources, Spaces. A Zettelkasten/PARA hybrid. | People who already do LYT or want a more flexible PARA. | More vocabulary to learn. |

**Practical recommendation for a software engineer:** Use PARA as the top-level folder skeleton, drop atomic Zettelkasten-style notes into Resources or a dedicated `Slipbox/`, and use MOCs (one-page indexes) to surface clusters. This is the 80/20 hybrid the Obsidian community has converged on: "things that are useful tend to become linked correctly anyway."

---

## 2. Vault structure & organization

### Recommended top-level structure (mixed personal + technical)

```
SecondBrain/
├── CLAUDE.md                     # Agent instructions (root)
├── README.md                     # Vault index / dashboard for humans
├── 00-Inbox/                     # Fleeting captures, unprocessed
├── 10-Daily/                     # Daily notes (YYYY-MM-DD.md)
├── 20-Projects/                  # Active, time-bound outcomes
│   ├── proj-second-brain-setup/
│   └── proj-payments-redesign/
├── 30-Areas/                     # Ongoing responsibilities
│   ├── area-engineering-craft/
│   ├── area-health/
│   ├── area-finances/
│   └── area-relationships/
├── 40-Resources/                 # Reference + evergreen knowledge
│   ├── tech/
│   │   ├── languages/
│   │   ├── system-design/
│   │   ├── snippets/             # Code snippets, organized by lang
│   │   └── tools/
│   ├── learning/                 # Course notes, book notes
│   └── general/
├── 50-Slipbox/                   # Atomic evergreen notes (Zettelkasten)
├── 60-MOCs/                      # Maps of Content (hand-curated indexes)
├── 70-People/                    # CRM-style notes per person
├── 80-Archive/                   # Inactive projects + old notes
├── 90-Meta/
│   ├── Templates/
│   ├── Attachments/
│   └── AI-Sessions/              # Agent session logs
└── .obsidian/                    # Plugin & workspace config
```

The numeric prefixes are a Johnny-Decimal-lite touch — they keep the file explorer in deterministic order without committing to the full JD discipline.

### Note types and templates

- **Fleeting note** — A raw thought, dropped in `00-Inbox/`. No structure required. Triaged during weekly review.
- **Daily note** — One per day in `10-Daily/`. Holds journal, meetings, todos for the day. Use the Periodic Notes plugin to auto-create.
- **Literature note** — A note *about a source* (book, article, talk, paper). Stored in `40-Resources/learning/`. Frontmatter includes source URL, author, date read.
- **Permanent / evergreen note** — Single atomic idea expressed in your own words. Stored in `50-Slipbox/`. Title is a full sentence claim ("Caches should expire by event, not by time").
- **Project note** — README-like front page for a project. Each project gets its own folder with a `_index.md` (or `README.md`) Claude Code can read first.
- **MOC** — A hand-written index of related notes. Lives in `60-MOCs/`. Example: `MOC - Distributed Systems.md` links to all your distributed-systems atomic notes and resources.
- **Person note** — Lives in `70-People/`. Recent interactions, projects shared, things they care about.

### Naming conventions

- Filenames are titles (Obsidian convention). Use sentence case for concepts (`Caches should expire by event.md`), kebab-case for projects (`proj-payments-redesign.md`).
- Daily notes: `YYYY-MM-DD.md` (sortable, machine-friendly).
- Prefix conventions: `MOC -`, `proj-`, `area-`, `lit-` are all helpful for both humans and agents grepping by type.

### Tags vs folders vs links

The community has largely converged:

- **Folders** = PARA "where does this live?" (low cardinality, structural)
- **Tags** = Status and cross-cutting attributes (`#status/active`, `#type/lit`, `#needs-review`). Keep the tag taxonomy small — tag explosion is real (see Section 7).
- **Links** = Semantic relationships between ideas. This is the most important layer; let it grow organically.
- **Frontmatter properties** = Typed metadata Dataview and AI agents can query (`status:`, `created:`, `tags:`, `related:`, `source:`).

### Example frontmatter contract

```yaml
---
created: 2026-05-31
updated: 2026-05-31
type: evergreen        # one of: fleeting, daily, lit, evergreen, project, area, moc, person
tags: [systems, caching]
status: seedling       # seedling | budding | evergreen
source: [[lit - Designing Data-Intensive Applications]]
related: [[Cache invalidation is the second hard thing]]
---
```

Document this contract in `CLAUDE.md` so agents respect it.

---

## 3. Capture workflows

The capture surface area is wide; pick a small number of paths and make each fast.

### Mobile capture

- **Obsidian Mobile** — Full vault on iOS/Android. The native share sheet lets you drop a clipped article or selected text directly into a configured note (e.g., `00-Inbox/captures.md`).
- **Quick capture via shortcut** — On iOS use Shortcuts.app to append to a single inbox file. Pair with QuickAdd on desktop for symmetric capture.
- **Voice memos** — Record into your phone's voice app, drop into inbox folder, or use Whisper/Macwhisper later to transcribe. Some users pipe directly through a Shortcut → Whisper → append-to-inbox.

### Web clipping

- **Obsidian Web Clipper** — Official browser extension (Chrome/Firefox/Safari/Edge). Converts pages to clean markdown, applies user-defined templates and frontmatter, drops into a vault folder.
- **Readwise + Readwise Reader** — Best-in-class read-later, highlighter, and aggregator. Sync highlights to Obsidian via the official Readwise plugin. Workflow: save to Reader → highlight while reading → highlights appear as a note in `40-Resources/learning/readwise/`.
- **Web2MD / similar** — Lightweight "URL → markdown" services for archiving cleanly.

### Code & technical snippet capture

- A `40-Resources/tech/snippets/` folder with one file per snippet, plus a frontmatter `lang: ts` etc. Dataview can then render a "browse by language" page.
- For richer code-as-content workflows, the Codeblock Customizer plugin and Snippet Vault patterns work well.
- Many engineers also pipe `gh` issue/PR threads into the vault using Claude Code (e.g., "fetch the conversation on PR #123 and write me a lit note about the design decision").

### Voice → text

- Whisper.cpp locally, or paid Otter/Whisper API for longer recordings.
- Plugin: **Whisper** (community plugin) does in-vault voice → text using OpenAI's API.

### Daily journaling

- **Periodic Notes** + **Templater** + a daily template with sections: AM intent, log, evening review, tomorrow.
- Keep it short. Daily notes are working memory, not artifacts.

---

## 4. AI agent integration (the important section)

The integrations split into four architectural patterns. Pick the one that matches your trust and infrastructure preferences.

### Pattern A — Claude Desktop + MCP server pointed at your vault

Claude Desktop talks to MCP servers; an MCP server exposes vault read/write/search tools. This is the highest-ergonomics option for chat-style PKM ("summarize what I worked on this week").

Three main MCP server options:

1. **[`MarkusPfundstein/mcp-obsidian`](https://github.com/MarkusPfundstein/mcp-obsidian)** — Python MCP server that talks to the **Obsidian Local REST API** community plugin. Exposes `list_files_in_vault`, `list_files_in_dir`, `get_file_contents`, `search`, `patch_content`, `append_content`, `delete_file`. Requires the REST API plugin running inside Obsidian.

   ```json
   // ~/Library/Application Support/Claude/claude_desktop_config.json
   {
     "mcpServers": {
       "mcp-obsidian": {
         "command": "uvx",
         "args": ["mcp-obsidian"],
         "env": {
           "OBSIDIAN_API_KEY": "<your-key>",
           "OBSIDIAN_HOST": "127.0.0.1",
           "OBSIDIAN_PORT": "27124"
         }
       }
     }
   }
   ```

2. **[`jacksteamdev/obsidian-mcp-tools`](https://github.com/jacksteamdev/obsidian-mcp-tools)** — Obsidian plugin + paired local MCP server. Adds *semantic search* (embedding-based, not just keyword) and the ability to **execute Templater templates** from the AI side. One-click "Install Server" auto-wires Claude Desktop. SLSA-verified binaries. Best for users who want semantic retrieval out of the box.

3. **[`iansinnott/obsidian-claude-code-mcp`](https://github.com/iansinnott/obsidian-claude-code-mcp)** — Obsidian plugin that opens both a WebSocket (for Claude Code's `/ide` integration) and HTTP/SSE (for Claude Desktop). Default port `22360`. Exposes file ops (`view`, `str_replace`, `create`, `insert`), workspace ops (`get_current_file`, `get_workspace_files`), and a raw `obsidian_api` escape hatch. The only option that gives Claude Code awareness of which file you're *currently looking at* in Obsidian.

   ```json
   {
     "mcpServers": {
       "obsidian": {
         "command": "npx",
         "args": ["mcp-remote", "http://localhost:22360/sse"]
       }
     }
   }
   ```

> Real-world reports note Claude Desktop can be slow (5–10 minutes per multi-step prompt) over very large vaults and that performance degrades past ~4000 notes. The community recommendation is to test in a sandbox vault first.

### Pattern B — Claude Code with the vault as a working directory

This is the most powerful pattern for engineers. Claude Code is Anthropic's agentic CLI; it can read, write, search, and reason over any directory. Point it at your vault and it becomes a teammate that can do multi-step work on your notes.

**Setup:**

```bash
cd ~/SecondBrain
claude
```

**The `CLAUDE.md` convention.** Claude Code automatically loads `CLAUDE.md` from the working directory at the start of every session. Treat it like the README you'd give a new hire on day one. A working template:

```markdown
# CLAUDE.md — Second Brain Operating Manual

## Who I am
Linh, a software engineer. I work mostly on backend systems and developer
tools. I write in English. I am terse and prefer bullets over prose.

## What this vault is
A PARA-structured second brain with a Zettelkasten slipbox.

## Folder map
- `00-Inbox/` — Raw captures. Triage during weekly review.
- `10-Daily/` — Daily journal. Filename `YYYY-MM-DD.md`.
- `20-Projects/` — Active projects. Each has `_index.md` you should read first.
- `30-Areas/` — Ongoing responsibilities.
- `40-Resources/` — Reference + learning.
- `50-Slipbox/` — Atomic evergreen notes. Title is a full-sentence claim.
- `60-MOCs/` — Hand-curated index notes.
- `70-People/` — One file per person.
- `80-Archive/` — Read-only history. Do not modify.
- `90-Meta/Templates/` — Templates. Use these when creating notes.
- `90-Meta/AI-Sessions/` — Write your session summaries here.

## Frontmatter contract
Every non-daily note has YAML frontmatter:
  created, updated, type, tags[], status, related[]
Allowed `type`: fleeting, daily, lit, evergreen, project, area, moc, person.
Allowed `status`: seedling, budding, evergreen.

## How I want you to work
- Read `_index.md` (or `README.md`) in any folder before touching files in it.
- Wikilinks use `[[Note title]]`. Always check that the target exists; if not, ask.
- Tags use kebab-case. Don't invent new top-level tags.
- Prefer linking over tagging.
- Never modify anything in `80-Archive/`.
- When you create or delete a file, update the relevant `_index.md`.
- At the end of every session, write a summary to `90-Meta/AI-Sessions/YYYY-MM-DD-<topic>.md`.

## Things I commonly ask
- "Triage my inbox" — read `00-Inbox/`, propose where each item belongs,
  ask before moving.
- "Process this week" — summarize my daily notes from the last 7 days into
  this week's weekly note in `10-Daily/`.
- "Find knowledge gaps in <topic>" — scan related notes and propose what's
  missing.
- "Generate an MOC for <topic>" — propose a draft MOC in `60-MOCs/`.
```

**Key Claude Code workflows seen in the wild:**

- Walking the vault and generating an `_index.md` in every folder on first setup.
- Daily inbox triage as a one-shot prompt.
- Weekly review generation from daily notes.
- Drafting MOCs and proposing missing links.
- Refactoring tag taxonomies.

A benchmark from one integration guide cited Claude Code + Obsidian achieving 54× faster orphan-note detection vs. raw grep (0.26s vs 15.6s on a 4,663-file vault) when leveraging the right tools.

### Pattern C — Cursor with the vault open as a project

Because notes are just markdown, Cursor can open the vault as a workspace and use its built-in chat (`Cmd/Ctrl + L`) with the entire vault as RAG context. Cursor automatically embeds files for semantic search.

- Setup: `cursor ~/SecondBrain`
- Use `@filename` to pin specific notes into context.
- The **Cursor Bridge** Obsidian plugin lets you "Open in Cursor" from inside Obsidian for quick jumps.
- A frequently reported win: answering long support/customer emails by pulling context from years of prior support notes — something base ChatGPT cannot do because it has no access to your history.

Cursor is great for *writing-with-AI inside notes*. Claude Code is great for *agentic batch work across the vault*. Many users run both.

### Pattern D — Obsidian-native AI plugins

These keep AI inside the editor, no external clients needed.

| Plugin | Strength | Notes |
|---|---|---|
| **[Smart Connections](https://github.com/brianpetro/obsidian-smart-connections)** (Brian Petro) | Surfaces semantically related notes as you write; built-in zero-config local embedding model; Smart Chat for vault Q&A. | Source-available, privacy-first, local by default. Best "always-on" companion. |
| **Copilot for Obsidian** (Logan Yang) | Chat panel + Vault QA mode + agentic edits; broad model support including Ollama; YouTube/web tools. | Strongest chat UX; CORS-friendly with Ollama. |
| **[Smart Composer](https://github.com/glowingjade/obsidian-smart-composer)** | "Cursor for Obsidian": `@filename` to include specific files, one-click apply edits, vault RAG via `Cmd+Shift+Enter`, MCP client, slash-command prompt templates. | Best for in-editor writing assistance with precise context control. |
| **Text Generator** | Prompt-template-driven generation; supports local LLMs. | Older, simpler, very scriptable. |
| **BMO Chatbot** | Sidebar chat against Ollama, LM Studio, Anthropic, Gemini, Mistral, OpenAI. | Light, good for "any model anywhere." |
| **Khoj** | Self-hostable "AI second brain" backend with desktop+mobile apps; web/doc retrieval, agents, scheduled automations. | The most ambitious local option; runs as a service. |
| **Smart Second Brain** | Local LLM chat against your vault via Ollama. | Privacy-first; pair with Smart Connections. |
| **Local GPT** (pfrankov) | Ollama/OpenAI-compatible inline assist with maximum privacy. | Strong for offline editing. |

### Local LLMs via Ollama (privacy-first stack)

If you don't want anything leaving your machine, the canonical recipe is:

```bash
brew install ollama        # or download from ollama.com
ollama pull qwen2.5:14b    # chat model — adjust to your VRAM
ollama pull nomic-embed-text   # ~274MB embedding model for RAG
curl http://localhost:11434    # verify the server is up
```

Then install Copilot or Smart Composer or Smart Connections, point them at `http://localhost:11434`, and configure `nomic-embed-text` as the embedding model. Hardware sizing reported by community guides:

- 8GB VRAM → Qwen 2.5 7B Q4 (~25–35 tok/s)
- 12GB VRAM → Qwen 2.5 14B Q4 (~15–30 tok/s)
- 16GB+ VRAM or Apple Silicon 16GB+ → 14B–32B Q4 models
- First index on 5000+ notes can take 30–60 minutes; incremental after.

Set `OLLAMA_KEEP_ALIVE=30m` and bump `num_ctx` (e.g., 8192) for better throughput.

### RAG over the vault — how it actually works

All "chat with your vault" features are RAG under the hood: each note (or chunk) is embedded into a vector, queries are embedded too, top-k nearest chunks are retrieved, then stuffed into an LLM prompt as context. Smart Connections, Copilot Vault QA, Smart Composer, Cursor's workspace embedding, and Khoj all do versions of this. Key implications:

- The quality of your *atomic note titles and first paragraphs* dominates retrieval quality. Write claims, not file labels.
- Huge monolithic daily notes retrieve poorly. Atomic evergreens retrieve great.
- Most plugins re-embed on file change; very large vaults need to budget compute.

---

## 5. Concrete end-to-end workflows

### The capture → process → connect → retrieve loop

1. **Capture** (continuous, low friction). Everything lands in `00-Inbox/` or a daily note: clippings, Slack screenshots, voice memos, code snippets, questions.
2. **Process** (daily, 5–10 minutes). Open the inbox. For each item: delete, file into a Resource, attach to a Project, or promote to a Slipbox idea. Ask Claude Code to do a first pass: *"Triage my inbox. For each item, propose a destination folder and a 1-line summary. Do not move anything; just list."*
3. **Connect** (during weekly review). Run Smart Connections on recently-touched notes and link 1–2 most-relevant existing notes. Ask an agent for missing-link suggestions.
4. **Retrieve** (on demand). Search, graph, Smart Chat, Claude Code, Cursor — whichever fits the question.

### Weekly review (the keystone habit)

Schedule it. Most people do 30–45 minutes on a Sunday. A working script:

```markdown
# Weekly review — week of 2026-05-25

## Step 1 — Review daily notes
Prompt to Claude Code:
"Read 10-Daily/2026-05-25.md through 2026-05-31.md.
Produce a markdown summary with sections: What I shipped, Decisions
made, Open loops, People I owe something, Things I learned.
Then list any TODOs that I marked done so I can celebrate them."

## Step 2 — Project sweep
For each folder in 20-Projects/: open _index.md, mark status
(active/blocked/done/archive), update next action.

## Step 3 — Inbox to zero
Empty 00-Inbox/. Each item gets deleted, filed, or promoted.

## Step 4 — Slipbox grooming
Prompt: "Show me notes in 50-Slipbox/ created this week. For each, suggest
3 existing slipbox notes it should link to, based on semantic similarity."

## Step 5 — Plan next week
Three priorities. One project I'll close. One person I'll reach out to.
```

### Using AI to suggest links between notes

- Passive: keep **Smart Connections** open in the sidebar. It surfaces 5–10 related notes for the open file.
- Active: *"For the current note, propose 5 wikilinks to existing notes in `50-Slipbox/` or `40-Resources/`. Show me the relevant excerpt from each candidate so I can decide."*

### Using AI to summarize literature notes

After clipping a long article: *"Summarize the attached source into a literature note using the template at `90-Meta/Templates/lit-note.md`. Pull out 3–5 atomic claims I should consider promoting to the slipbox."*

### Using AI to generate MOCs and indexes

*"Walk `50-Slipbox/` and `40-Resources/tech/system-design/`. Identify clusters of 5+ related notes. For each cluster, draft an MOC in `60-MOCs/` named `MOC - <cluster-name>.md` that links the notes and adds a 1-paragraph orientation. Show me the drafts first; don't write anything yet."*

### Using AI for spaced repetition

Two paths:
- **Plugin route**: `Obsidian Spaced Repetition` or `Obsidian to Anki` plus tags like `#flashcard`. Claude Code can author flashcards: *"For each evergreen note tagged #systems created this month, generate Anki-style Q/A pairs as a `## Flashcards` section."*
- **Daily prompt route**: in your daily note template, have the agent surface 3 random old slipbox notes for review.

### Using AI to find knowledge gaps

*"I want to deepen my understanding of distributed consensus. Look at `60-MOCs/MOC - Distributed Systems.md` and the linked slipbox notes. List concepts you'd expect to see covered that are missing, and suggest 5 source-worthy reading items I should add to `40-Resources/learning/queue.md`."*

---

## 6. Recommended plugin stack

### Core / always-on

- **Periodic Notes** — Daily/weekly/monthly/yearly note scaffolding.
- **Templater** — Dynamic templates with JavaScript hooks.
- **Dataview** — Query language over frontmatter; turns the vault into a DB.
- **QuickAdd** — Single-keystroke capture, macros, multi-step note creation.
- **Tasks** — Full task system inline in markdown (due dates, recurrence, dependencies).
- **Calendar** — Sidebar calendar that opens daily notes.
- **Omnisearch** — Better full-text search.
- **Obsidian Git** — Auto-commit/auto-pull for git-backed vaults.

### Knowledge & visualization

- **Excalidraw** — Drawing/diagramming, freeform thinking.
- **Kanban** — Markdown kanban boards (good for project pipelines).
- **Canvas** (core) — Infinite-canvas for visual MOCs.
- **Outliner** — Better bullet ergonomics.
- **Quick Switcher++** or **Notebook Navigator** — Faster navigation.

### AI plugins (pick 1–2, not all)

- **Smart Connections** — Sidebar related-notes panel + Smart Chat. Local embeddings by default.
- **Copilot for Obsidian** — Best in-editor chat UX; pairs well with Ollama.
- **Smart Composer** — Best for "Cursor-like" editing with precise file mentions.
- **obsidian-mcp-tools** or **obsidian-claude-code-mcp** — If you want Claude Desktop / Claude Code to talk to the vault.

### Sync — choose one based on threat model

| Option | Cost | Privacy | Conflicts | Mobile | Best for |
|---|---|---|---|---|---|
| **Obsidian Sync** | $4–10/mo | E2E encrypted | Best-handled | Native | Pay-for-peace, multi-device, version history. |
| **iCloud Drive** | Free/Apple plan | Apple-trusted | OK but flaky on iOS | Native | Apple-only users. |
| **Syncthing** | Free | Fully P2P, you own data | Manageable | Works, occasionally finicky | Self-hosters who want zero cloud. |
| **Git** (GitHub/GitLab) | Free | Encrypted in transit; cleartext in repo unless you encrypt | Manual but reviewable | Working Copy on iOS, Termux on Android | Engineers who want full diff history and CI hooks. |

Most engineers go Git + obsidian-git plugin, with optional Syncthing for mobile. Git also enables CI (e.g., a nightly Claude Code job over the vault).

---

## 7. Avoiding common pitfalls

### Collector's fallacy

"To know about something isn't the same as knowing something." Saving an article is dopamine; processing it is work. Mitigation: enforce inbox-zero at weekly review; ban tools that make capturing trivially easy from interfering with processing time.

### Over-engineering the system

Tinkering with templates, tags, and folder schemes *feels* like progress but produces no expressions. Symptom: you've been "setting up your system" for a month. Cure: start writing/shipping output before week two; constrain plugin installs to the core stack for the first 30 days.

### Tag explosion

You start with `#systems`, `#systems/distributed`, `#systems-distributed`, `#dist-systems`, then can't find anything. Mitigation: a single `tags.md` MOC documenting the allowed taxonomy. Run periodic agent cleanups: *"List all tags used fewer than 3 times. For each, propose either deletion or merge into a canonical tag."*

### Plugin bloat

Every plugin is code in your editor; more plugins = slower startup, more conflicts, more attack surface. Audit quarterly; uninstall anything you haven't used in 90 days.

### Letting AI write everything

The cost: you lose the "thinking" benefit of writing. Notes become dead text retrievable but not internalized. Guardrails seen in the community:

- **"Agents read, humans write"** as a principle. Evergreens are yours; agents propose, you accept.
- Keep agent output in a separate folder (`90-Meta/AI-Sessions/` or `/AI/`) so it doesn't pollute your authentic slipbox.
- Distinguish *drafts you'll rewrite* from *agent summaries you'll consume*. Don't blur the line.

---

## 8. Getting started

### 7-day starter plan

- **Day 1** — Install Obsidian. Create the PARA + Slipbox folder skeleton above. Install the core plugins (Periodic Notes, Templater, Dataview, QuickAdd, Tasks, Calendar). Set up daily note template. Commit vault to git.
- **Day 2** — Write your first daily note. Capture 5 things to inbox. Don't process yet.
- **Day 3** — Install Obsidian Web Clipper. Clip 3 articles. Install Readwise if you read on mobile.
- **Day 4** — Install Smart Connections. Let it index. Open a few notes and watch related-notes appear.
- **Day 5** — Write `CLAUDE.md` at the vault root (use the template from Section 4). Install Claude Code, `cd` into vault, run `claude`, ask it to generate `_index.md` files for each folder.
- **Day 6** — First inbox triage with Claude Code's help. Promote 1 idea from inbox into a slipbox note. Write it as a full-sentence claim.
- **Day 7** — First weekly review. Use the script in Section 5. Adjust `CLAUDE.md` based on what you noticed.

### 30-day expansion plan

- **Week 2** — Add an AI plugin (Copilot or Smart Composer). Decide on one. Set up at least one Templater template for literature notes. Start clipping articles into proper literature notes.
- **Week 3** — Pick a sync strategy and commit. If git: add obsidian-git for auto-commit. Set up mobile (Obsidian Mobile + share-sheet capture). Wire up one MOC by hand for a topic you care about.
- **Week 4** — Try an MCP server (start with `obsidian-mcp-tools` for semantic search) if you want Claude Desktop integration. Set up spaced repetition tags. Run a "knowledge gap" prompt over one of your MOCs. Decide whether to add Ollama for local/private chat. Audit your tag taxonomy.

By day 30 you should have: ~20 daily notes, 5–15 literature notes, 10–30 atomic slipbox notes, 1–3 MOCs, a `CLAUDE.md` that has been edited at least three times based on lived experience, and a weekly review habit that survives at least one boring Sunday.

---

> The system is not the goal. *Expression* is the goal — shipping code, decisions, designs, posts, talks, conversations. The vault and the agents are leverage on top of your thinking. Keep them sharp by using them; trim them when they slow you down.

---

## Sources

- [Building a Second Brain (official site)](https://www.buildingasecondbrain.com/) — Authoritative definition of the CODE framework and PARA method.
- [MOCs vs Zettelkasten — 80/20 thread (Obsidian Forum)](https://forum.obsidian.md/t/mocs-vs-zettelkasten-an-80-20-approach-for-those-of-us-who-arent-luhmann/106518) — Community consensus on combining MOCs with PARA instead of strict Zettelkasten.
- [Johnny Decimal in Obsidian (Shuvangkar Das)](https://blog.shuvangkardas.com/johnny-decimal-obsidian-organization-method/) — Concrete Johnny Decimal layout with examples and category map.
- [iansinnott/obsidian-claude-code-mcp](https://github.com/iansinnott/obsidian-claude-code-mcp) — MCP plugin with WebSocket (Claude Code) + HTTP/SSE (Claude Desktop) transports, current-file awareness, default port 22360.
- [MarkusPfundstein/mcp-obsidian](https://github.com/MarkusPfundstein/mcp-obsidian) — Python MCP server using Obsidian Local REST API; exposes the canonical 7 file/search tools.
- [jacksteamdev/obsidian-mcp-tools](https://github.com/jacksteamdev/obsidian-mcp-tools) — Plugin + server bundle with semantic search and Templater execution; one-click Claude Desktop install.
- [Obsidian MCP servers — community thread](https://forum.obsidian.md/t/obsidian-mcp-servers-experiences-and-recommendations/99936) — Honest user experiences including perf issues with large vaults.
- [brianpetro/obsidian-smart-connections](https://github.com/brianpetro/obsidian-smart-connections) — Source for the canonical RAG+related-notes plugin with built-in local embeddings.
- [glowingjade/obsidian-smart-composer](https://github.com/glowingjade/obsidian-smart-composer) — "Cursor for Obsidian" with `@filename` mentions, MCP client support, apply-edits.
- [Obsidian + Claude Code complete integration guide (Starmorph)](https://blog.starmorph.com/blog/obsidian-claude-code-integration-guide) — Five integration strategies with concrete vault layouts and Dataview queries.
- [How I turned my Obsidian vault into Claude Code's brain (Michael Crist)](https://michaelcrist.substack.com/p/context-engineering) — The CLAUDE.md template and index.md convention that most engineers now use.
- [Building an AI Second Brain with Claude Code and Obsidian (MindStudio)](https://www.mindstudio.ai/blog/build-ai-second-brain-claude-code-obsidian) — Step-by-step setup with folder layout, frontmatter, session-log persistence patterns.
- [Claude Code + Obsidian (Markana Media)](https://markanamedia.com/blog/claude-code-obsidian/) — Concrete example prompts and an example CLAUDE.md.
- [Turn Obsidian into AI-Powered Second Brain Using Cursor (Web Highlights)](https://web-highlights.com/blog/turn-obsidian-into-an-ai-powered-second-brain-using-cursor/) — Cursor-as-vault-client setup and the customer-support example.
- [LLM-Powered Work Notes with Obsidian + Cursor (Daniel Pickem)](https://danielpickem.com/posts/2026_01_13_obsidian_note_taking_system/) — Engineer's vault-and-Cursor workflow.
- [Obsidian + Local LLM Guide (InsiderLLM)](https://insiderllm.com/guides/obsidian-local-llm-guide/) — Ollama + Qwen + nomic-embed-text setup with VRAM-sized model recommendations.
- [BMO Chatbot plugin](https://github.com/longy2k/obsidian-bmo-chatbot) — Multi-provider in-vault chat (Ollama, LM Studio, Anthropic, Gemini, Mistral, OpenAI).
- [pfrankov/obsidian-local-gpt](https://github.com/pfrankov/obsidian-local-gpt) — Inline Ollama/OpenAI-compatible assistance focused on offline privacy.
- [Must-have Obsidian plugins for 2026 (Sébastien Dubois)](https://www.dsebastien.net/the-must-have-obsidian-plugins-for-2026/) — Current curated list (Dataview, Templater, QuickAdd, Periodic Notes, Excalidraw, etc.).
- [Obsidian Web Clipper article (Sébastien Dubois)](https://www.dsebastien.net/supercharge-your-knowledge-capture-workflow-with-the-obsidian-web-clipper/) — Capture workflow with Obsidian's official clipper.
- [Obsidian sync alternatives comparison (synch.run)](https://synch.run/blog/obsidian-sync-alternatives/) — Cost/privacy/conflict tradeoffs across Obsidian Sync, iCloud, Syncthing, Git.
- [The Collector's Fallacy (Zettelkasten.de)](https://zettelkasten.de/posts/collectors-fallacy/) — Canonical write-up of the over-collection trap second-brain practitioners fall into.
- [Periodic Notes plugin (liamcain)](https://github.com/liamcain/obsidian-periodic-notes) — Underlying tool for the weekly-review habit.
- [Weekly review workflow (Christian Houmann)](https://bagerbach.com/blog/weekly-review-obsidian/) — Real engineer's weekly-review script that informed Section 5.
