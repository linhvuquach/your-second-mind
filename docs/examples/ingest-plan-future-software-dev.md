# Ingest Plan — Future of Software Development

## Sources

| # | Type | URL | Raw target |
|---|---|---|---|
| 1 | Article | https://www.linkedin.com/pulse/future-software-development-thoughtworks-bdtzc/ | `raw/articles/future-software-development-thoughtworks.md` |
| 2 | Video | https://www.youtube.com/watch?v=g8um2AEf5ZA | `raw/videos/future-of-software-development-<channel>.md` |

---

## Phase 1 — Capture raw sources

### Source 1: LinkedIn article (Thoughtworks)

Action: Fetch article content and save to `raw/articles/future-software-development-thoughtworks.md`

Raw file frontmatter:
```yaml
---
created: 2026-06-07
updated: 2026-06-07
type: article
source: https://www.linkedin.com/pulse/future-software-development-thoughtworks-bdtzc/
author: Thoughtworks
---
```

### Source 2: YouTube video

Action: Save URL stub + key notes to `raw/videos/future-of-software-development.md`

Raw file frontmatter:
```yaml
---
created: 2026-06-07
updated: 2026-06-07
type: video
source: https://www.youtube.com/watch?v=g8um2AEf5ZA
author: <channel name>
duration: <mm:ss>
watched: false
---
```

---

## Phase 2 — Ingest each source

For each raw file, run the 6-step ingest workflow:

1. Read source in `raw/`
2. Discuss key takeaways
3. Write lit note in `40-Resources/learning/`
4. Update `50-Slipbox/` (atomic claims) and `60-MOCs/` (MOC - AI Tools or new MOC)
5. Update `index.md`
6. Append to `log.md`

### Expected wiki output per source

| Output | Location | Estimated count |
|---|---|---|
| Lit note | `40-Resources/learning/` | 1 per source |
| Atomic slipbox claims | `50-Slipbox/` | 2–5 per source |
| MOC updates | `60-MOCs/` | 1–2 (likely MOC - AI Tools or new MOC - Software Engineering) |
| `index.md` entries | `index.md` | 3–8 lines per source |
| `log.md` entry | `log.md` | 1 per source |

### Candidate MOCs to update or create

- `60-MOCs/MOC - AI Tools.md` — already exists (stub); AI-assisted development angle
- `60-MOCs/MOC - Software Engineering.md` — may need to create if source covers broad SE topics

### Candidate slipbox claims (hypothetical — confirm after reading sources)

- "AI shifts software engineers from code writers to intent specifiers"
- "The bottleneck moves from implementation to requirements clarity"
- "Developer experience becomes a first-class product concern"
- "Software quality gates move left — from QA to design"

---

## Phase 3 — Review and approve

- AI proposes each wiki page before writing
- Reviewer approves, edits, or skips each file
- No file is written without explicit approval

---

## Phase 4 — Commit

```bash
git add .
git commit -m "ingest: future of software development — Thoughtworks + video"
```

---

## Status

- [ ] Phase 1a: LinkedIn article saved to `raw/articles/`
- [ ] Phase 1b: YouTube video saved to `raw/videos/`
- [ ] Phase 2a: Ingest article
- [ ] Phase 2b: Ingest video
- [ ] Phase 3: All wiki pages reviewed and approved
- [ ] Phase 4: Committed
