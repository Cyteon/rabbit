import { createClerkClient } from "@clerk/backend";
import { CLERK_SECRET_KEY } from "$env/static/private";

const clerkClient = createClerkClient({
  secretKey: CLERK_SECRET_KEY,
});

export async function GET({ url }) {
  let slug = url.pathname.split("/").pop();

  let user = await clerkClient.users.getUser(slug);

  if (user == null) {
    return Response.json({ message: "User not found", status: 404 });
  }

  let data = {
    status: 200,
    id: user.id,
    banned: user.banned,
    imageUrl: user.imageUrl,
    username: user.username,
    publicMetadata: user.publicMetadata,
    lastActiveAt: user.lastActiveAt,
  };

  return Response.json(data);
}
