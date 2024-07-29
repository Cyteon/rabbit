import { sql } from "$lib/db.server";

export async function GET({ url }) {
  let slug = url.pathname.split("/").pop();

  var posts;

  switch (slug) {
    case "top":
      posts = await sql`select * from posts order by votes desc`;
      break;
    case "new":
      posts = await sql`select * from posts order by created_at desc`;
      break;
    case "old":
      posts = await sql`select * from posts order by created_at asc`;
      break;
    case "random":
      posts = await sql`select * from posts order by random()`;
  }

  return Response.json({
    status: 200,
    posts: posts,
  });
}
