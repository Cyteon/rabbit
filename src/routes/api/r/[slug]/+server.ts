import { connectToDatabase } from "$lib/db.server";

export async function GET({ url }) {
  var db = await connectToDatabase();

  let slug = url.pathname.split("/").pop();

  var result = await db.collection("subrabbits").findOne({ name: slug });

  if (result == null) {
    return Response.json({ message: "Subrabbit not found", status: 404 });
  }

  return Response.json({
    status: 200,
  });
}
