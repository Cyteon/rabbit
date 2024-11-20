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
    if (!locals.session) {
      return Response.json(
        { message: "Unauthorized", status: 401 },
        { status: 401 },
      );
    }

    let user = await clerkClient.users.getUser(locals.session.userId);

    let data = await sql`select * from users where clerk_id = ${user.id}`;

    if (data.length === 0) {
      data =
        await sql`insert into users (clerk_id) values (${user.id}) returning *`;
    }

    return Response.json(
      {
        session: locals.session,
        user: user,
        data: data[0],
      },
      { status: 200 },
    );
  }

  if (slug.startsWith("id_")) {
    try {
      slug = slug.slice(3);

      let user = await clerkClient.users.getUser(slug);

      if (user == null) {
        return Response.json({ message: "User not found" }, { status: 404 });
      }

      let result = await sql`select * from users where clerk_id = ${user.id}`;

      if (result.length === 0) {
        result =
          await sql`insert into users (clerk_id) values (${user.id}) returning *`;
      }

      return Response.json(
        {
          id: user.id,
          banned: user.banned,
          imageUrl: user.imageUrl,
          username: user.username,
          publicMetadata: user.publicMetadata,
          lastActiveAt: user.lastActiveAt,
          createdAt: user.createdAt,
        },
        { status: 200 },
      );
    } catch (error) {
      return new Response(null, { status: 404 });
    }
  }

  let data = await sql`select * from users where id = ${parseInt(slug)}`;

  if (data.length === 0) {
    return Response.json({ message: "User not found" }, { status: 404 });
  }

  let user = await clerkClient.users.getUser(data[0].clerk_id);

  return Response.json(
    {
      id: user.id,
      banned: user.banned,
      imageUrl: user.imageUrl,
      username: user.username,
      publicMetadata: user.publicMetadata,
      lastActiveAt: user.lastActiveAt,
      createdAt: user.createdAt,
    },
    { status: 200 },
  );
}
