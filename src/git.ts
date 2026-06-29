import { spawnSync } from "node:child_process";

export function isGitAvailable(): boolean {
  const result = spawnSync("git", ["--version"], { encoding: "utf8" });
  return result.status === 0;
}

export function gitInit(vaultPath: string): void {
  spawnSync("git", ["-C", vaultPath, "init"], { encoding: "utf8" });
  spawnSync("git", ["-C", vaultPath, "add", "."], { encoding: "utf8" });
  spawnSync("git", ["-C", vaultPath, "commit", "-m", "feat: scaffold second-mind vault via your-second-mind"], {
    encoding: "utf8",
  });
}
