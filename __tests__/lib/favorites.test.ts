import { normalizeUrl, faviconUrl } from "@/lib/favorites";

describe("normalizeUrl", () => {
  it("adds https when the scheme is missing", () => {
    expect(normalizeUrl("github.com")).toBe("https://github.com/");
  });

  it("keeps explicit http/https urls", () => {
    expect(normalizeUrl("http://example.com/a")).toBe("http://example.com/a");
  });

  it("trims whitespace", () => {
    expect(normalizeUrl("  youtube.com ")).toBe("https://youtube.com/");
  });

  it("rejects empty, invalid and non-http schemes", () => {
    expect(normalizeUrl("")).toBeNull();
    expect(normalizeUrl("not a url")).toBeNull();
    expect(normalizeUrl("javascript:alert(1)")).toBeNull();
    expect(normalizeUrl("ftp://example.com")).toBeNull();
  });
});

describe("faviconUrl", () => {
  it("builds the favicon service url from the host", () => {
    expect(faviconUrl("https://github.com/foo")).toBe(
      "https://www.google.com/s2/favicons?domain=github.com&sz=64",
    );
  });
});
