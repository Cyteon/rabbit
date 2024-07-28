import { DB_URL } from "$env/static/private";
import postgres from "postgres";

const sql = postgres(DB_URL);

async function createTables() {
  await sql`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    clerk_id TEXT UNIQUE NOT NULL
  );`;

  await sql`CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    token TEXT UNIQUE NOT NULL
  );`;

  await sql`CREATE TABLE IF NOT EXISTS subrabbits (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    owner INTEGER REFERENCES users(id)
  );`;

  await sql`CREATE TABLE IF NOT EXISTS posts (
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
  );`;

  await sql`CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    post INTEGER REFERENCES posts(id),
    author INTEGER REFERENCES users(id),
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0
  );`;
}

export { sql, createTables };
