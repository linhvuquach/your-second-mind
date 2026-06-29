# Local Dev & Test Guide — your-second-mind

Quick reference for iterating on the package locally before publishing.

---

## Prerequisites

- Node ≥ 20
- npm ≥ 7
- Git (for the git integration tests)

---

## One-time setup

```bash
cd /path/to/second-mind
npm install
```

---

## Daily workflow

### 1. Build

```bash
# Single build (always use the explicit timeout — tsup is fast but needs ~400ms)
timeout 120 ./node_modules/.bin/tsup

# Or via npm script
npm run build
```

Output: `dist/cli.js` (~16 KB), `dist/cli.d.ts`, `dist/cli.js.map`.

**Watch mode** (rebuilds on source change):

```bash
npm run dev
```

### 2. Typecheck (no emit)

```bash
npm run typecheck
```

### 3. Test suite

```bash
npm test                          # all 8 test files, ~500ms
npx vitest run test/unit/         # unit tests only
npx vitest run test/integration/  # integration tests only
npx vitest run --reporter=verbose # show individual test names
```

The CLI integration tests (`test/integration/cli.test.ts`) require a built `dist/cli.js` and are wrapped in `describe.skipIf(!DIST_EXISTS)` — always build first.

### 4. Run the CLI directly

```bash
# From repo root (must build first)
node dist/cli.js --help
node dist/cli.js --version

# Dry-run (no files written)
node dist/cli.js --yes --name "Dev" --dry-run

# Full run into a temp vault
node dist/cli.js --yes --name "Dev" --vault-path /tmp/my-vault --no-git

# Interactive run
node dist/cli.js
```

---

## Test the bin as if installed globally

Use `npm link` to wire the `your-second-mind` binary to your PATH:

```bash
# In repo root
npm run build
npm link

# Now available anywhere
your-second-mind --help
your-second-mind --yes --name "Test" --vault-path /tmp/linked-vault --no-git --dry-run

# Unlink when done
npm unlink -g your-second-mind
```

---

## Test the packed tarball (pre-publish smoke test)

Simulates exactly what a user gets from `npx your-second-mind@latest`.

```bash
# 1. Build and pack
npm run build
npm pack
# Produces: your-second-mind-<version>.tgz

# 2. Install into a throwaway project
SMOKE=$(mktemp -d)
cd "$SMOKE"
npm init -y
npm install /path/to/second-mind/your-second-mind-*.tgz

# 3. Run from a different CWD (validates import.meta.url template resolution)
VAULT=$(mktemp -d)
node node_modules/your-second-mind/dist/cli.js \
  --yes --name "SmokeTest" --vault-path "$VAULT" --no-git --agents "claude-code"

# 4. Verify output
ls "$VAULT"                          # should see 10 PARA folders + CLAUDE.md + README.md …
grep -r "{{" "$VAULT" && echo "LEAKAGE" || echo "CLEAN"
cat "$VAULT/CLAUDE.md" | head -5     # should contain "SmokeTest"

# 5. Cleanup
cd -
rm -rf "$SMOKE" "$VAULT"
rm your-second-mind-*.tgz
```

### Verify tarball contents (no surprises)

```bash
npm pack --dry-run
```

Expected: `dist/` + `templates/` + `package.json` only. No `src/`, `test/`, `docs/`, config files.

```bash
# Check for personal strings
npm pack --dry-run 2>/dev/null | grep -i "linh\|linhvuquach" && echo "FOUND" || echo "CLEAN"
grep -ri "linh\|linhvuquach" templates/                        && echo "FOUND" || echo "CLEAN"
```

---

## Common checks before a PR

```bash
npm run typecheck   # must exit 0
npm test            # 123 tests must pass
npm run build       # dist/cli.js must build clean
npm pack --dry-run  # review file list
```

---

## Version bump

The package starts at `0.0.0`. Before publishing:

```bash
# Patch release (bug fixes)
npm version patch   # 0.0.0 → 0.0.1

# Minor release (new features, backwards-compatible)
npm version minor   # 0.0.0 → 0.1.0

# Runs `git tag v<version>` automatically; push both commits and tags:
git push && git push --tags
# Pushing a v* tag triggers .github/workflows/publish.yml → npm publish
```

---

## Useful one-liners

```bash
# Count all test cases
npm test 2>&1 | grep "Tests "

# See what tsup puts in dist
ls -lh dist/

# Check shebang is present (required for `npx` to work)
head -1 dist/cli.js   # must be #!/usr/bin/env node

# Confirm bin field resolves
node -e "import('./dist/cli.js')" 2>&1 | head -3

# List templates shipped
find templates -type f | sort
```

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| `dist/cli.js` not updated after source change | `tsup` was backgrounded by shell | Use `timeout 120 ./node_modules/.bin/tsup` |
| CLI tests all skipped | `dist/cli.js` missing | Run `npm run build` first |
| `unknown option` in tests | `parseArgs` strict mode | Check `args.ts` options list |
| Template `{{VAR}}` appears in output | Missing variable mapping | Add to `buildVariables()` in `variables.ts` |
| `your-second-mind: command not found` after `npm link` | Build missing | `npm run build && npm link` |
