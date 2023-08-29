import { assertEnv } from "./deps.ts";

export const isProduction = false;
export const [home] = isProduction ? assertEnv(["HOME"]) : [""];
const port = isProduction ? 8088 : 8088;
export const serveOptions = isProduction
  ? {
    port,
    // cert: await Deno.readTextFile(`${home}/.certs/fullchain.pem`),
    // key: await Deno.readTextFile(`${home}/.certs/key.pem`),
  }
  : { port };

export const urlPatternHostnameDevelopment =
  `{:subdomain.}*:secondLevelDomain(localhost)`;
export const urlPatternHostnameProduction =
  `{:subdomain.}*:secondLevelDomain.:topLevelDomain`;
export const urlPatternHostname = isProduction
  ? urlPatternHostnameProduction
  : urlPatternHostnameDevelopment;
export const nginxConfigUrl = new URL("file:///etc/nginx/sites-available/");
