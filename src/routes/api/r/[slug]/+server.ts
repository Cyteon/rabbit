import { sql } from "$lib/db.server";

export async function GET({ url }) {
  let slug = url.pathname.split("/").pop();

  var result = await sql`select * from subrabbits where name = ${slug}`;

  if (result.length === 0) {
    return Response.json({ message: "404 Not Found", status: 404 });
  }

  var posts =
    await sql`select * from posts where subrabbit = ${result[0].id} order by votes desc`;

  return Response.json({
    status: 200,
    data: result[0],
    posts: posts,
  });
}

export async function POST({ request }) {
  var body = await request.json();

  var result =
    await sql`select * from subrabbits where name = ${body.subrabbit}`;

  if (result.length === 0) {
    return Response.json({ message: "Subrabbit not found", status: 404 });
  }

  let id = Math.random().toString(36).substring(4);

  let user = await sql`select * from users where clerk_id = ${body.author}`;

  /*
  id SERIAL PRIMARY KEY,
  id_rand TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  subrabbit INTEGER REFERENCES subrabbits(id),
  author INTEGER REFERENCES users(id),
  author_clerk_id TEXT NOT NULL ,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  */

  await sql`insert into posts (id_rand, title, content, subrabbit, author, author_clerk_id) values (${id}, ${body.title}, ${body.content}, ${result[0].id}, ${user[0].id}, ${body.author})`;

  return Response.json({
    message: "Created",
    status: 201,
    url: `/r/${body.subrabbit}/${id}`,
  });
}
