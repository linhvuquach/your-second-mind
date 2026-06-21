import { describe, it, expect } from "vitest";
import { renderTemplate } from "../../src/render.js";

describe("renderTemplate", () => {
  it("replaces a single variable", () => {
    expect(renderTemplate("Hello {{NAME}}!", { NAME: "Alice" })).toBe("Hello Alice!");
  });

  it("replaces multiple variables", () => {
    const result = renderTemplate("{{NAME}} is a {{ROLE}}", { NAME: "Alice", ROLE: "researcher" });
    expect(result).toBe("Alice is a researcher");
  });

  it("replaces the same variable appearing more than once", () => {
    expect(renderTemplate("{{X}} and {{X}}", { X: "y" })).toBe("y and y");
  });

  it("leaves unknown placeholders intact", () => {
    expect(renderTemplate("Hello {{UNKNOWN}}", { NAME: "Alice" })).toBe("Hello {{UNKNOWN}}");
  });

  it("handles an empty vars map", () => {
    expect(renderTemplate("no vars here", {})).toBe("no vars here");
  });

  it("handles content with no placeholders", () => {
    expect(renderTemplate("plain text", { NAME: "Alice" })).toBe("plain text");
  });
});
