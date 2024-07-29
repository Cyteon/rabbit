import { sql } from "$lib/db.server";

export async function GET({ url }) {
  let slug = url.pathname.split("/").pop();

  if (slug == "top") {
    var posts = await sql`select * from posts order by votes desc limit 5`;

    return Response.json({
      status: 200,
      posts: posts,
    });
  }

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

// JSON {
//  "subrabbit": "string",
//  "title": "string",
//  "content": "string",
//  "author": "string"
//}
export async function POST({ request }) {
  var body = await request.json();

  var result =
    await sql`select * from subrabbits where name = ${body.subrabbit}`;

  if (result.length === 0) {
    return Response.json({ message: "Subrabbit not found", status: 404 });
  }

  let id = Math.random().toString(36).substring(4);

  let user = await sql`select * from users where clerk_id = ${body.author}`;

  await sql`insert into posts (id_rand, title, content, subrabbit, subrabbit_name, author, author_clerk_id) values (${id}, ${body.title}, ${body.content}, ${result[0].id}, ${body.subrabbit}, ${user[0].id}, ${body.author})`;

  if (user[0].subrabbits_interacted_with.includes(body.subrabbit_name)) {
    let array = user[0].subrabbits_interacted_with;

    array = array.filter((item) => item !== body.subrabbit_name);

    user[0].subrabbits_interacted_with.push(body.subrabbit_name);

    await sql`update users set subrabbits_interacted_with = ${user[0].subrabbits_interacted_with} where id = ${user[0].id}`;
  } else {
    user[0].subrabbits_interacted_with.push(body.subrabbit);

    await sql`update users set subrabbits_interacted_with = ${user[0].subrabbits_interacted_with} where id = ${user[0].id}`;
  }

  return Response.json({
    message: "Created",
    status: 201,
    url: `/r/${body.subrabbit}/${id}`,
  });
}
