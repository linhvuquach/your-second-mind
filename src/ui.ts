import pc from "picocolors";
import { outro } from "@clack/prompts";
import type { ScaffoldResult } from "./scaffold.js";

export function printSummary(result: ScaffoldResult, dryRun: boolean): void {
  if (dryRun) {
    console.log(pc.cyan("\nDry-run preview — nothing written:"));
    for (const line of result.tree) {
      console.log(pc.dim("  " + line));
    }
    console.log(pc.cyan(`\n${result.created} file(s) would be created`));
  } else {
    if (result.created) console.log(pc.green(`  ${result.created} created`));
    if (result.overwritten) console.log(pc.yellow(`  ${result.overwritten} overwritten`));
    if (result.skipped) console.log(pc.dim(`  ${result.skipped} skipped`));
  }
}

export function printOutro(vaultPath: string, gitDone: boolean): void {
  const steps = [
    `Open Obsidian → "Open folder as vault" → ${vaultPath}`,
    "Copy a workflow: see agents-workflow/README.md for per-agent instructions.",
  ];
  if (gitDone) steps.push("Git init done — first commit created.");

  outro(
    pc.green("Vault ready!") +
      "\n\nNext steps:\n" +
      steps.map((s, i) => `  ${i + 1}. ${s}`).join("\n"),
  );
}
