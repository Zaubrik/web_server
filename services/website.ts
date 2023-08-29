import { Context, getGroup, serveStatic } from "../deps.ts";

export function serveWebsite(root: string) {
  return async <C extends Context>(ctx: C) => {
    const host = getHost(ctx.result);
    return await serveStatic(`${root}/${host}`)(ctx);
  };
}

export function getHost(result: URLPatternResult) {
  const secondLevelDomain = getGroup(result, "hostname", "secondLevelDomain");
  if (secondLevelDomain === "localhost") {
    const subdomain = getGroup(result, "hostname", "subdomain");
    return subdomain;
  } else {
    const topLevelDomain = getGroup(result, "hostname", "topLevelDomain");
    const subdomain = result.hostname.groups.subdomain;
    return `${
      subdomain ? subdomain === "www" ? "" : `${subdomain}.` : ""
    }${secondLevelDomain}.${topLevelDomain}`;
  }
}
