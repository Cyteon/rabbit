import Dexie, { type EntityTable } from "dexie";

interface CachedUser {
  id: string;
  username: string;
  imageUrl: string;
  createdAt: BigInt;
  lastActiveAt: BigInt;
  banned: boolean;
  publicMetadata: any;
  cachedAt: Date;
}

const cache = new Dexie("cache") as Dexie & {
  users: EntityTable<CachedUser, "id">;
};

cache.version(1).stores({
  users:
    "id, username, imageUrl, createdAt, lastActiveAt, banned, publicMetadata, cachedAt",
});

export type { CachedUser };
export default cache;
