import { createGetRoute, createPostRoute } from "./deps.ts";
import { urlPatternHostname } from "./config.ts";
import { serveWebsite } from "./services/website.ts";
import { addDomain } from "./services/domain.ts";

const serveFilePattern = {
  hostname: urlPatternHostname,
  pathname: "*",
};
export const staticFilesRoute = createGetRoute(serveFilePattern)(
  serveWebsite("./static"),
);

const addDomainPattern = {
  hostname: "*",
  pathname: "/domain",
};
export const addDomainRoute = createPostRoute(addDomainPattern)(
  addDomain,
);
