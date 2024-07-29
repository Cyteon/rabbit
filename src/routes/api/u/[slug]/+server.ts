import { createClerkClient } from "@clerk/backend";
import { CLERK_SECRET_KEY } from "$env/static/private";
import { PUBLIC_CLERK_PUBLISHABLE_KEY } from "$env/static/public";
import { sql } from "$lib/db.server";

const clerkClient = createClerkClient({
  secretKey: CLERK_SECRET_KEY,
});

export async function GET({ url, request, locals }) {
  let slug = url.pathname.split("/").pop();

  if (slug == "self") {
    let user = await clerkClient.users.getUser(locals.session.userId);

    let data = await sql`select * from users where clerk_id = ${user.id}`;

    return Response.json({
      session: locals.session,
      user: user,
      data: data[0],
    });
  }

  let user = await clerkClient.users.getUser(slug);

  if (user == null) {
    return Response.json({ message: "User not found", status: 404 });
  }

  let result = await sql`select * from users where clerk_id = ${user.id}`;

  if (result.length === 0) {
    result =
      await sql`insert into users (clerk_id) values (${user.id}) returning *`;
  }

  let data = {
    status: 200,
    id: user.id,
    banned: user.banned,
    imageUrl: user.imageUrl,
    username: user.username,
    publicMetadata: user.publicMetadata,
    lastActiveAt: user.lastActiveAt,
    createdAt: user.createdAt,
  };

  return Response.json(data);
}
