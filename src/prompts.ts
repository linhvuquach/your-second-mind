import { intro, text, multiselect, confirm, isCancel, cancel } from "@clack/prompts";
import { DEFAULTS, type Agent, type Config } from "./config.js";

function guardCancel<T>(value: T | symbol): T {
  if (isCancel(value)) {
    cancel("Cancelled.");
    process.exit(1);
  }
  return value as T;
}

export async function runPrompts(): Promise<Partial<Config>> {
  intro("your-second-mind — scaffold your PARA + Zettelkasten vault");

  const name = guardCancel(
    await text({
      message: "Your name (used in AI schema files)",
      validate: (v) => ((v ?? "").trim() ? undefined : "Name is required."),
    }),
  );

  const role = guardCancel(
    await text({
      message: "Your role",
      placeholder: DEFAULTS.role,
      defaultValue: DEFAULTS.role,
    }),
  );

  const vaultPath = guardCancel(
    await text({
      message: "Vault directory",
      placeholder: DEFAULTS.vaultPath,
      defaultValue: DEFAULTS.vaultPath,
    }),
  );

  const agents = guardCancel(
    await multiselect<Agent>({
      message: "AI agents to configure",
      options: [
        { value: "claude-code", label: "Claude Code (CLAUDE.md)" },
        { value: "cursor", label: "Cursor (.cursorrules)" },
        { value: "codex", label: "Codex / OpenAI (AGENTS.md)" },
      ],
      initialValues: [...DEFAULTS.agents] as Agent[],
      required: true,
    }),
  );

  const gitInit = guardCancel(
    await confirm({
      message: "Initialize a git repository?",
      initialValue: DEFAULTS.gitInit,
    }),
  );

  return {
    name: name as string,
    role: role as string,
    vaultPath: vaultPath as string,
    agents: agents as Agent[],
    gitInit: gitInit as boolean,
  };
}
