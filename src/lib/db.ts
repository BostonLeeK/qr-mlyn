import { neon } from "@neondatabase/serverless";

function getSql() {
  const url =
    process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL or POSTGRES_URL is not set. Add it to .env.local or Vercel env."
    );
  }
  return neon(url);
}

export async function initDb() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      description TEXT NOT NULL,
      cost TEXT NOT NULL,
      image_url TEXT,
      font_size TEXT DEFAULT 'md',
      currency TEXT DEFAULT 'uah',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  try {
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS font_size TEXT DEFAULT 'md'`;
  } catch {
  }
  try {
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'uah'`;
  } catch {
  }
}

export async function getProjects() {
  const sql = getSql();
  return sql`
    SELECT * FROM projects
    ORDER BY created_at DESC
  `;
}

export async function getProjectBySlug(slug: string) {
  const sql = getSql();
  const rows = await sql`
    SELECT * FROM projects WHERE slug = ${slug}
  `;
  return rows[0] ?? null;
}

export async function createProject(data: {
  slug: string;
  title: string;
  author: string;
  description: string;
  cost: string;
  image_url?: string;
  font_size?: string;
  currency?: string;
}) {
  const sql = getSql();
  const [row] = await sql`
    INSERT INTO projects (slug, title, author, description, cost, image_url, font_size, currency)
    VALUES (
      ${data.slug},
      ${data.title},
      ${data.author},
      ${data.description},
      ${data.cost},
      ${data.image_url ?? null},
      ${data.font_size ?? "md"},
      ${data.currency ?? "uah"}
    )
    RETURNING *
  `;
  return row;
}

export async function updateProject(
  id: string,
  data: {
    slug: string;
    title: string;
    author: string;
    description: string;
    cost: string;
    image_url?: string;
    font_size?: string;
    currency?: string;
  }
) {
  const sql = getSql();
  const [row] = await sql`
    UPDATE projects SET
      slug = ${data.slug},
      title = ${data.title},
      author = ${data.author},
      description = ${data.description},
      cost = ${data.cost},
      image_url = ${data.image_url ?? null},
      font_size = ${data.font_size ?? "md"},
      currency = ${data.currency ?? "uah"},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return row;
}

export async function getProjectById(id: string) {
  const sql = getSql();
  const rows = await sql`SELECT * FROM projects WHERE id = ${id}`;
  return rows[0] ?? null;
}

export async function deleteProject(id: string) {
  const sql = getSql();
  await sql`DELETE FROM projects WHERE id = ${id}`;
}
