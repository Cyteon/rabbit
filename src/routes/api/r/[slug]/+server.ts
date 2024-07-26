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
    data: result,
  });
}

export async function POST({ request }) {
  var body = await request.json();

  var db = await connectToDatabase();

  var result = await db
    .collection("subrabbits")
    .findOne({ name: body.subrabbit });

  if (result == null) {
    return Response.json({ message: "Subrabbit not found", status: 404 });
  }

  let id = Math.random().toString(36).substring(4);

  var post = {
    id: id,
    subrabbit: body.subrabbit,
    title: body.title,
    content: body.content,
    owner: body.owner,
    upvotes: 0,
    downvotes: 0,
    comments: [],
    awards: {},
  };

  result.posts.push(post);

  await db
    .collection("subrabbits")
    .updateOne({ name: body.subrabbit }, { $set: { posts: result.posts } });

  return Response.json({
    message: "Created",
    status: 201,
    url: `/r/${body.subrabbit}/${id}`,
  });
}
