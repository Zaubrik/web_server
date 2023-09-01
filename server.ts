import { serveOptions } from "./config.ts";
import { handler } from "./handler.ts";

Deno.serve(serveOptions, handler);
