import { sql } from "$lib/db.server";

export async function GET({}) {
  var result = await sql`select * from subrabbits order by created_at desc`;

  return Response.json(
    {
      data: result,
    },
    { status: 200 },
  );
}
