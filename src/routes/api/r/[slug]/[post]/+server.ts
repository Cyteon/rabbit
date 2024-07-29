import { createClerkClient } from "@clerk/backend";
import { CLERK_SECRET_KEY } from "$env/static/private";
import { PUBLIC_CLERK_PUBLISHABLE_KEY } from "$env/static/public";
import { sql } from "$lib/db.server";

const clerkClient = createClerkClient({
  secretKey: CLERK_SECRET_KEY,
  publishableKey: PUBLIC_CLERK_PUBLISHABLE_KEY,
});

export async function GET({ url, request }) {
  let slug = url.pathname.split("/")[3];
  let post = url.pathname.split("/")[4];

  var subrabbit = await sql`select * from subrabbits where name = ${slug}`;

  if (subrabbit.length === 0) {
    return Response.json({ message: "404 Not Found", status: 404 });
  }

  var result =
    await sql`select * from posts where id_rand = ${post} and subrabbit = ${subrabbit[0].id}`;

  if (result.length === 0) {
    return Response.json({ message: "404 Not Found", status: 404 });
  }

  var comments =
    await sql`select * from comments where post = ${result[0].id} order by created_at desc`;

  return Response.json({
    status: 200,
    data: result[0],
    comments: comments,
    subrabbit: subrabbit[0],
  });
}

export async function POST({ url, request }) {
  try {
    var session = await clerkClient.authenticateRequest(request);

    if (!session.isSignedIn) {
      return Response.json({ message: "Unauthorized", status: 401 });
    }
  } catch (error) {
    console.log(error);

    return Response.json({
      message: "Internal Server Error",
      error: error,
      status: 500,
    });
  }

  let body = await request.json();

  let id = Math.random().toString(36).substring(4);

  await sql`insert into comments (id_rand, post, author, author_clerk_id, content) values (${id}, ${body.post}, ${body.user_id}, ${body.clerk_id}, ${body.content})`;

  let comment = await sql`select * from comments where id_rand = ${id}`;

  return Response.json({
    message: "Created",
    status: 201,
    comment: comment[0],
  });
}
