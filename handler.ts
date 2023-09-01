import { Context, createHandler, fallBack, logger } from "./deps.ts";
import { hostname } from "./config.ts";
import {
  addDomainRoute,
  deleteDomainRoute,
  staticFilesRoute,
} from "./routes.ts";

export const handler = createHandler(Context)(
  staticFilesRoute,
  addDomainRoute,
  deleteDomainRoute,
)(fallBack)(
  logger(hostname),
);
