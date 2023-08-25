import { createGetRoute } from "./deps.ts";
import { urlPatternHostname } from "./config.ts";
import { serveWebsite } from "./services/website.ts";

export const serveFilePattern = {
  hostname: urlPatternHostname,
  pathname: "*",
};
export const staticFilesRoute = createGetRoute(serveFilePattern)(
  serveWebsite("./static"),
);
