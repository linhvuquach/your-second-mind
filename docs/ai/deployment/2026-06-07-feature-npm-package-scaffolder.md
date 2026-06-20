---
phase: deployment
title: Deployment Strategy
description: Define deployment process, infrastructure, and release procedures
---

# Deployment Strategy

> **Revision (2026-06-20):** "Deployment" for `your-second-mind` means **publishing to the
> npm registry** — there is no server, database, or hosted environment. The generic
> web-app deployment template is dropped in favor of an npm release process.

## Infrastructure

**None hosted.** The artifact is an npm package (`your-second-mind`) consumed via
`npx your-second-mind@latest` or a global install. Distribution = the **npm registry**.
Source + CI live on GitHub. No servers, no databases, no environments to separate.

## Build Process

```bash
npm run typecheck      # tsc --noEmit
npm test               # vitest run
npm run build          # tsup → dist/ (ESM, .d.ts, shebang)
npm pack --dry-run     # inspect tarball contents before publish
```

- `tsup` emits `dist/cli.js` (with `#!/usr/bin/env node` banner) + types.
- `files: ["dist", "templates"]` controls tarball contents — verify `templates/` is included
  and `src/`/`test/` are excluded (testing doc, T7.1).
- `prepublishOnly` script runs typecheck + test + build so a bad artifact can't be published.

## CI/CD Pipeline (GitHub Actions)

**On PR / push to `main`:**
1. `npm ci`
2. `npm run typecheck`
3. `npm test` (vitest)
4. `npm run build`
5. Tarball check: `npm pack` then assert `dist/` + `templates/` present, no personal strings.

**On version tag `v*` (release):**
1. Steps 1–5 above (gate).
2. `npm publish --access public` using `NODE_AUTH_TOKEN` (repo secret).

`engines.node >=20` is set so npm warns on unsupported runtimes.

## Release process (semver)

1. Pre-release checklist: tests green, `--dry-run` smoke run clean, `npm pack` contents verified,
   CHANGELOG updated, README accurate.
2. Bump version (`npm version patch|minor|major`) — creates the commit + tag.
3. `git push --follow-tags` → CI publishes on the tag.
4. Post-publish validation: from a clean dir, `npx your-second-mind@latest --dry-run --name Smoke`
   and a full scaffold into a temp dir; confirm template path resolves and no `{{` leaks.

Versioning: `0.x` while pre-stable; `1.0.0` once the CLI surface and templates are settled.
Breaking changes to flags/template variables → major bump.

## Configuration / environments

- **Local/dev:** `npm run dev` (tsup watch); run `node dist/cli.js …`.
- **CI:** Node 20 matrix (optionally 20 + 22); `NODE_AUTH_TOKEN` secret for publish only.
- **"Production":** the published npm package. No runtime config — behavior is driven entirely
  by CLI flags/prompts.

## Secrets Management

- Only secret: **`NODE_AUTH_TOKEN`** (npm automation token), stored as a GitHub Actions secret,
  used solely in the tag-publish job. Never committed; scoped to publish.
- No application secrets — the tool makes no network calls.

## Rollback Plan

- **Bad release:** publish a fixed patch version immediately (preferred — npm discourages
  unpublish). `npm deprecate your-second-mind@<bad> "use >=<fixed>"` to steer users off it.
- **Within 72h / severe:** `npm unpublish your-second-mind@<version>` as a last resort.
- **`dist-tag`:** keep `latest` pointing at the last known-good version; promote a new version
  to `latest` only after post-publish validation passes.
- Users are unaffected mid-run (one-shot CLI); rollback only affects which version `npx` fetches next.
