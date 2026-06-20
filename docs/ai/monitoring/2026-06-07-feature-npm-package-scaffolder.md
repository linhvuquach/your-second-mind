---
phase: monitoring
title: Monitoring & Observability
description: Define monitoring strategy, metrics, alerts, and incident response
---

# Monitoring & Observability

> **Revision (2026-06-20):** `your-second-mind` is a **client-side, one-shot CLI** with no
> server, no telemetry, and no network calls. Traditional APM/latency/uptime monitoring is
> **N/A**. "Observability" here = release health, npm signals, and user-reported issues.
> The generic web-app monitoring template is dropped.

## What we do NOT collect

- **No runtime telemetry / analytics / phone-home.** The tool never contacts the network.
  Privacy by default — we have no visibility into individual user runs, by design.

## Signals we DO watch (post-release)

### Release / package health
- **CI status** — typecheck + vitest + build must be green; tag-publish job success.
- **npm registry** — published version, `latest` dist-tag points at the validated build.
- **Post-publish smoke** — manual (or CI) `npx your-second-mind@latest --dry-run` from a clean
  environment after each release (deployment doc).
- **npm weekly downloads** — coarse adoption signal (npmjs.com / `npm view your-second-mind`).

### Quality signals
- **GitHub Issues** — primary channel for bug reports/feature requests. Triage label + repro.
- **Install/peer warnings** — watch for `engines` (Node <20) or dependency-resolution warnings
  reported by users.

## Logging strategy

- **User-facing CLI output only** — `@clack` prompts + `ui.ts` summary (created/skipped/overwritten
  counts, next steps). No log files written, no structured logs shipped anywhere.
- **Errors** print a single clear line to stderr with a non-zero exit code; full stack only when
  an env flag like `DEBUG=1` is set (optional, dev aid).

## Alerts & notifications

- **CI failure on `main` / release tag** → GitHub Actions notification (email/Slack if wired).
  Action: fix forward, re-tag.
- **New GitHub Issue labeled `bug`** → maintainer notified. Action: triage, repro, patch release.
- No paging/on-call — this is a developer tool, not a live service.

## Dashboards

- Lightweight: GitHub repo Insights (traffic, issues) + npm package page (downloads, versions).
  No custom dashboards warranted.

## Incident response

For a published-package "incident" (broken release, personal-data leak in tarball, template bug):
1. **Detect** — CI red, user issue, or failed post-publish smoke.
2. **Diagnose** — reproduce with `npx your-second-mind@<version>` in a clean dir; check the
   packed tarball (`npm pack`) for the offending file/string.
3. **Mitigate** — ship a patch version; `npm deprecate` the bad version; keep `latest` on the
   last good build (see deployment Rollback Plan). Unpublish only if severe and within window.
4. **Post-mortem** — add a regression test (e.g. tarball-contents / no-personal-string / no-`{{`
   assertion) so the same class of bug can't republish.

## Health checks

- **Pre-release gate:** typecheck + full vitest suite + tarball-contents check.
- **Post-release smoke:** scaffold into a temp dir from the published package; assert no `{{`
  leakage and that template paths resolve from a foreign CWD.
- **Periodic:** re-run the smoke on a dependency bump (e.g. `@clack/prompts` major) before tagging.
