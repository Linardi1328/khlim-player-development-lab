import { afterEach, describe, expect, it } from "vitest";
import { checkOrigin } from "../src/lib/http";
import {
  createLabResetToken,
  readLabResetEmail,
  verifyLabResetToken,
} from "../src/lib/lab-reset";
import { normalizeLocale, tr } from "../src/lib/i18n";

describe("localization", () => {
  it("normalizes supported locale preferences", () => {
    expect(normalizeLocale("ms")).toBe("ms");
    expect(normalizeLocale("zh-CN")).toBe("zh-CN");
    expect(normalizeLocale("fr")).toBe("en");
  });
  it("translates core interface strings without touching English", () => {
    expect(tr("ms", "Password")).toBe("Kata laluan");
    expect(tr("zh-CN", "Password")).toBe("密码");
    expect(tr("en", "Password")).toBe("Password");
  });
});

describe("request origin validation", () => {
  it("accepts the browser-facing host even when the framework reconstructs another URL", () => {
    const request = new Request("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        origin: "http://127.0.0.1:3001",
        host: "127.0.0.1:3001",
        "x-forwarded-host": "127.0.0.1:3001",
        "x-forwarded-proto": "http",
        "content-type": "application/json",
      },
    });
    expect(() => checkOrigin(request)).not.toThrow();
  });

  it("accepts a direct same-origin request", () => {
    const request = new Request("http://127.0.0.1:3001/api/auth/login", {
      method: "POST",
      headers: {
        origin: "http://127.0.0.1:3001",
        host: "127.0.0.1:3001",
        "content-type": "application/json",
      },
    });
    expect(() => checkOrigin(request)).not.toThrow();
  });

  it("rejects a different browser origin", () => {
    const request = new Request("http://127.0.0.1:3001/api/auth/login", {
      method: "POST",
      headers: {
        origin: "http://evil.example.test",
        host: "127.0.0.1:3001",
        "content-type": "application/json",
      },
    });
    expect(() => checkOrigin(request)).toThrow(
      "This request could not be verified",
    );
  });
});

describe("lab password reset tokens", () => {
  afterEach(() => {
    delete process.env.LAB_RESET_SECRET;
  });
  it("binds a short-lived token to the current password hash", () => {
    process.env.LAB_RESET_SECRET = "test-secret";
    const token = createLabResetToken(
      "coach1@playerlab.example.test",
      "hash-v1",
    );
    expect(readLabResetEmail(token)).toBe("coach1@playerlab.example.test");
    expect(verifyLabResetToken(token, "hash-v1")).toBe(
      "coach1@playerlab.example.test",
    );
    expect(() => verifyLabResetToken(token, "hash-v2")).toThrow(
      "invalid or expired",
    );
  });
});
