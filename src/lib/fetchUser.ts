import cache, { type CachedUser } from "./cache";

export default async function fetchUser(id: string) {
  let cached = await cache.users.get(id);

  if (cached) {
    if (new Date().getTime() - cached.cachedAt.getTime() < 1000 * 60 * 60) {
      console.log("Returning cached user");
      return cached;
    } else {
      cache.users.delete(id);
    }
  }

  let user = await fetch(`/api/u/id_${id}`);

  if (!user.ok) {
    return null;
  }

  let userData = await user.json();

  cache.users.put({
    id: userData.id,
    username: userData.username,
    imageUrl: userData.imageUrl,
    createdAt: BigInt(userData.createdAt),
    lastActiveAt: BigInt(userData.lastActiveAt),
    banned: userData.banned,
    publicMetadata: userData.publicMetadata,
    cachedAt: new Date(),
  });

  return userData;
}
