import { Context, createHandler, fallBack, logger } from "./deps.ts";
import { serveOptions } from "./config.ts";
import { staticFilesRoute } from "./routes.ts";

const handler = createHandler(Context)(
  staticFilesRoute,
)(fallBack)(
  logger(),
);

Deno.serve(serveOptions, handler);
