import { Context } from "../deps.ts";
import { assertEquals } from "../test_deps.ts";
import {
  urlPatternHostnameDevelopment,
  urlPatternHostnameProduction,
} from "../config.ts";
import { getHost } from "./website.ts";

Deno.test("getHost in production", () => {
  const urlPattern = new URLPattern({ hostname: urlPatternHostnameProduction });
  const request = new Request("http://zaubrik.de/index.html");
  // deno-lint-ignore no-explicit-any
  const ctx = new Context(request, {} as any);
  const urlPatternResult = urlPattern.exec(ctx.url);
  const result = getHost(urlPatternResult!);
  assertEquals(result, "zaubrik.de");
});

Deno.test("getHost in production with subdomain", () => {
  const urlPattern = new URLPattern({ hostname: urlPatternHostnameProduction });
  const request = new Request("http://auth.zaubrik.de/index.html");
  // deno-lint-ignore no-explicit-any
  const ctx = new Context(request, {} as any);
  const urlPatternResult = urlPattern.exec(ctx.url);
  const result = getHost(urlPatternResult!);
  assertEquals(result, "auth.zaubrik.de");
});

Deno.test("getHost in development", () => {
  const urlPattern = new URLPattern({
    hostname: urlPatternHostnameDevelopment,
  });
  const request = new Request("https://zaubrik.de.localhost:8088/index.html");
  // deno-lint-ignore no-explicit-any
  const ctx = new Context(request, {} as any);
  const urlPatternResult = urlPattern.exec(ctx.url);
  const result = getHost(urlPatternResult!);
  assertEquals(result, "zaubrik.de");
});
