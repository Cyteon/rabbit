import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { handleClerk } from "clerk-sveltekit/server";
import { CLERK_SECRET_KEY } from "$env/static/private";
import { createTables } from "$lib/db.server";

await createTables().catch((err) => {
  console.error("Failed to create tables:", err);
  process.exit(1); // Exit the process if table creation fails
});

export const handle: Handle = sequence(
  handleClerk(CLERK_SECRET_KEY, {
    debug: true,
    protectedPaths: ["/api/subrabbits/new"],
    signInUrl: "/login",
  }),
);
