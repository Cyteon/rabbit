import { connectToDatabase } from "$lib/db.server";

export async function POST({ request }) {
  var body = await request.json();

  var db = await connectToDatabase();

  var result = await db.collection("subrabbits").findOne({ name: body.name });

  if (result != null) {
    return Response.json({ message: "Subrabbit already exists", status: 409 });
  }

  var subrabbit = {
    name: body.name,
    description: body.description,
    owner: body.owner,
    posts: [],
  };

  await db.collection("subrabbits").insertOne(subrabbit);

  return Response.json({
    message: "Created",
    status: 201,
    url: `/r/${body.name}`,
  });
}
