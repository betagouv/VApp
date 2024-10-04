import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { filePath, generateRobotsTxt } from "../prebuild";
import fs from "fs";

vi.spyOn(fs, "writeFileSync");

describe("robots.txt", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("should generate production robots.txt", () => {
    const host = "localhost";
    const robotsProd = ["User-agent: *", "Allow: /"].join("\n");
    generateRobotsTxt(true, host);
    expect(fs.writeFileSync).toBeCalledWith(filePath, robotsProd);
  });
  it("should generate development robots.txt", () => {
    const host = "localhost";
    const robotsDev = ["User-agent: *", "Disallow: /"].join("\n");
    generateRobotsTxt(false, host);
    expect(fs.writeFileSync).toBeCalledWith(filePath, robotsDev);
  });
});
