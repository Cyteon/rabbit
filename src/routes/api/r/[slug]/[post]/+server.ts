import { sql } from "$lib/db.server";

export async function GET({ url }) {
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

  return Response.json({
    status: 200,
    data: result[0],
    subrabbit: subrabbit[0],
  });
}
