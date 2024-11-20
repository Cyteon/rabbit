import { sql } from "$lib/db.server";

export async function POST({ request }) {
  var body = await request.json();

  var result = await sql`select * from subrabbits where name = ${body.name}`;
  console.log(result);
  if (result.length > 0) {
    return Response.json(
      {
        message: "Subrabbit already exists",
      },
      { status: 409 },
    );
  }

  var user = await sql`select * from users where clerk_id = ${body.owner}`;
  if (user.length === 0) {
    user =
      await sql`insert into users (clerk_id) values (${body.owner}) returning *`;
  }
  const userId = user[0].id;

  await sql`insert into subrabbits (name, description, owner) values (${body.name}, ${body.description}, ${userId})`;

  var subrabbit = {
    name: body.name,
    description: body.description,
    owner: body.owner,
  };

  return Response.json(
    {
      message: "Created",
      url: `/r/${body.name}`,
    },
    { status: 201 },
  );
}
