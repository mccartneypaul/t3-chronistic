import { createNextApiHandler } from "@trpc/server/adapters/next";

import { env } from "@chronistic/env.mjs";
import { createTRPCContext } from "@chronistic/server/api/trpc";
import { appRouter } from "@chronistic/server/api/root";

// Increase body size limit for file uploads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", // Set a higher limit - adjust as needed
    },
  },
};

// Create API handler with increased size limit
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError:
    env.NODE_ENV === "development"
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
          );
        }
      : undefined,
});
