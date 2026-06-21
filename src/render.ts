export function renderTemplate(content: string, vars: Record<string, string>): string {
  for (const [k, v] of Object.entries(vars)) {
    content = content.replaceAll(`{{${k}}}`, v);
  }
  return content;
}
