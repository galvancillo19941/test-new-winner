import { describe, expect, test } from "vite-plus/test";
import rawConfig from "../../content/config.json";
import { siteConfigSchema } from "./schema.ts";

const passes = (config: unknown) => siteConfigSchema.safeParse(config).success;

describe("content/config.json", () => {
  test("passes the schema", () => {
    expect(passes(rawConfig)).toBe(true);
  });

  test("fails without a name or the environments", () => {
    expect(passes({ ...rawConfig, name: "" })).toBe(false);
    expect(passes({ name: "Site" })).toBe(false);
  });

  test("siteUrl is an https origin only", () => {
    const withSiteUrl = (siteUrl: string) =>
      passes({ ...rawConfig, environments: { test: {}, prod: { siteUrl } } });
    expect(withSiteUrl("https://www.example.com")).toBe(true);
    expect(withSiteUrl("https://www.example.com/")).toBe(false);
    expect(withSiteUrl("https://www.example.com/path")).toBe(false);
    expect(withSiteUrl("http://www.example.com")).toBe(false);
  });
});
