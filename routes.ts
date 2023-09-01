import { createDeleteRoute, createGetRoute, createPostRoute } from "./deps.ts";
import { urlPatternHostname } from "./config.ts";
import { serveWebsite } from "./services/website.ts";
import { addDomain, deleteDomain } from "./services/domain.ts";

const serveFilePattern = {
  hostname: urlPatternHostname,
  pathname: "*",
};
export const staticFilesRoute = createGetRoute(serveFilePattern)(
  serveWebsite("./static"),
);

const domainPattern = {
  hostname: "*",
  pathname: "/domain",
};
export const addDomainRoute = createPostRoute(domainPattern)(
  addDomain,
);
export const deleteDomainRoute = createDeleteRoute(domainPattern)(
  deleteDomain,
);
