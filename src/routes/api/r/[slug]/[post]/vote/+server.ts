import { createClerkClient } from "@clerk/backend";
import { CLERK_SECRET_KEY } from "$env/static/private";
import { PUBLIC_CLERK_PUBLISHABLE_KEY } from "$env/static/public";
import { sql } from "$lib/db.server";

const clerkClient = createClerkClient({
  secretKey: CLERK_SECRET_KEY,
  publishableKey: PUBLIC_CLERK_PUBLISHABLE_KEY,
});

export async function POST({ url, request }) {
  let slug = url.pathname.split("/")[3];

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

  var body = await request.json();

  var users = await sql`select * from users where id = ${body.user_id}`;

  if (users.length === 0) {
    return Response.json({ message: "Unauthorized", status: 401 });
  }

  let user = users[0];

  var posts =
    await sql`select * from posts where id = ${body.post} and subrabbit = ${body.subrabbit}`;

  if (posts.length === 0) {
    return Response.json({ message: "404 Not Found", status: 404 });
  }

  let post = posts[0];

  if (post.id in user.votes) {
    let old_vote = user.votes[post.id];
    user.votes[post.id] = body.vote;

    await sql`update users set votes = ${user.votes} where id = ${user.id}`;

    await sql`update posts set votes = ${post.votes + body.vote + old_vote * -1} where id = ${post.id}`;

    post.votes = post.votes + body.vote + old_vote * -1;
  } else {
    await sql`update posts set votes = ${post.votes + body.vote} where id = ${post.id}`;

    user.votes[post.id] = body.vote;

    await sql`update users set votes = ${user.votes} where id = ${user.id}`;

    post.votes = post.votes + body.vote;
  }

  return Response.json({ post: post });
}
