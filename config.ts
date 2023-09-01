import { assertEnv } from "./deps.ts";

export const isProduction = true;
const port = isProduction ? 8083 : 8083;
// const https = "https:";
// const http = "http:";
// const protocol = isProduction ? https : http;
const domain = isProduction ? "zaubrik.de" : "localhost";
const subdomain = "members";
export const hostname = `${subdomain}.${domain}`;
export const [home] = isProduction ? assertEnv(["HOME"]) : [""];
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
export const nginxConfigSitesAvailable = new URL(
  "file:///etc/nginx/sites-available/",
);
export const nginxConfigSitesEnabled = new URL(
  "file:///etc/nginx/sites-enabled/",
);
