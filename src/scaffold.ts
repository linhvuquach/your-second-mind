import fs from "node:fs";
import path from "node:path";
import type { Config } from "./config.js";
import {
  AGENT_FILES,
  COMMAND_FILES,
  FOLDER_META,
  NAV_FILES,
  NOTE_TEMPLATES,
  TOP_FOLDERS,
  readTemplate,
} from "./templates.js";
import { renderTemplate } from "./render.js";

export interface ScaffoldOptions {
  force?: boolean;
  dryRun?: boolean;
}

export interface ScaffoldResult {
  created: number;
  skipped: number;
  overwritten: number;
  tree: string[];
}

function ensureDir(dirPath: string, dryRun: boolean): void {
  if (!dryRun) fs.mkdirSync(dirPath, { recursive: true });
}

function writeOne(
  filePath: string,
  content: string,
  base: string,
  force: boolean,
  dryRun: boolean,
  result: ScaffoldResult,
): void {
  const rel = path.relative(base, filePath);
  if (dryRun) {
    result.tree.push(rel);
    result.created++;
    return;
  }
  const exists = fs.existsSync(filePath);
  if (exists && !force) {
    result.skipped++;
    result.tree.push(`[skip] ${rel}`);
    return;
  }
  fs.writeFileSync(filePath, content, "utf8");
  if (exists) {
    result.overwritten++;
    result.tree.push(`[overwrite] ${rel}`);
  } else {
    result.created++;
    result.tree.push(`[create] ${rel}`);
  }
}

export function scaffold(
  config: Config,
  vars: Record<string, string>,
  options: ScaffoldOptions = {},
): ScaffoldResult {
  const { force = false, dryRun = false } = options;
  const base = config.vaultPath;
  const result: ScaffoldResult = { created: 0, skipped: 0, overwritten: 0, tree: [] };

  // 1. Top-level PARA folders
  for (const folder of TOP_FOLDERS) {
    ensureDir(path.join(base, folder), dryRun);
  }

  // 2. Area subfolders under 30-Areas
  for (const area of config.areas) {
    ensureDir(path.join(base, "30-Areas", `area-${area}`), dryRun);
  }

  // 3. Raw source subfolders
  for (const src of config.rawSources) {
    ensureDir(path.join(base, "raw", src), dryRun);
  }

  // 4. 90-Meta sub-dirs
  ensureDir(path.join(base, "90-Meta", "Templates"), dryRun);
  ensureDir(path.join(base, "90-Meta", "AI-Sessions"), dryRun);

  // 5. agents-workflow dir
  ensureDir(path.join(base, "agents-workflow"), dryRun);

  // 6. Agent schema files — only for config.agents
  for (const agent of config.agents) {
    const [destName, tmplPath] = AGENT_FILES[agent];
    const content = renderTemplate(readTemplate(tmplPath), vars);
    writeOne(path.join(base, destName), content, base, force, dryRun, result);
  }

  // 7. Vault nav files
  for (const [destName, tmplPath] of NAV_FILES) {
    const content = renderTemplate(readTemplate(tmplPath), vars);
    writeOne(path.join(base, destName), content, base, force, dryRun, result);
  }

  // 8. _index.md per top-level folder (per-folder vars injected here)
  const indexTmpl = readTemplate("vault/_index.md.tmpl");
  for (const folder of TOP_FOLDERS) {
    const meta = FOLDER_META[folder];
    const folderVars: Record<string, string> = {
      ...vars,
      FOLDER_NAME: folder,
      FOLDER_PATH: `${folder}/`,
      FOLDER_PURPOSE: meta.purpose,
      FOLDER_AGENT_INSTRUCTION: meta.agentInstruction,
    };
    const content = renderTemplate(indexTmpl, folderVars);
    writeOne(path.join(base, folder, "_index.md"), content, base, force, dryRun, result);
  }

  // 9. Note templates — verbatim (Templater <% %> syntax preserved)
  for (const [destName, tmplPath] of NOTE_TEMPLATES) {
    const content = readTemplate(tmplPath);
    writeOne(
      path.join(base, "90-Meta", "Templates", destName),
      content,
      base,
      force,
      dryRun,
      result,
    );
  }

  // 10. agents-workflow files — verbatim ($CURRENT_DATE/$ARGUMENTS must survive)
  for (const [destName, tmplPath] of COMMAND_FILES) {
    const content = readTemplate(tmplPath);
    writeOne(
      path.join(base, "agents-workflow", destName),
      content,
      base,
      force,
      dryRun,
      result,
    );
  }

  // 11. .gitkeep in empty leaf dirs that hold no files
  if (!dryRun) {
    for (const area of config.areas) {
      const areaDir = path.join(base, "30-Areas", `area-${area}`);
      if (fs.readdirSync(areaDir).length === 0) {
        fs.writeFileSync(path.join(areaDir, ".gitkeep"), "", "utf8");
      }
    }
    for (const src of config.rawSources) {
      const rawDir = path.join(base, "raw", src);
      if (fs.readdirSync(rawDir).length === 0) {
        fs.writeFileSync(path.join(rawDir, ".gitkeep"), "", "utf8");
      }
    }
    const sessionsDir = path.join(base, "90-Meta", "AI-Sessions");
    if (fs.readdirSync(sessionsDir).length === 0) {
      fs.writeFileSync(path.join(sessionsDir, ".gitkeep"), "", "utf8");
    }
  }

  return result;
}
