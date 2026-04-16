import { neon } from "@neondatabase/serverless";

const DEFAULT_EVENT = {
  slug: "mlyn-ceramic-fair-2025",
  title: "MLYN CERAMIC FAIR",
  subtitle: "Виставка кераміки та мистецтва",
  poster_image_url: null as string | null,
  date_label: "13.03 — 22.03",
  location: "MLYN design hub | простір де живе український дизайн",
  instagram_handle: "@mlyn_dhp",
};

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
    CREATE TABLE IF NOT EXISTS blog_posts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT,
      content TEXT NOT NULL,
      cover_image_url TEXT,
      published_at TIMESTAMPTZ DEFAULT NOW(),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS events (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      poster_image_url TEXT,
      date_label TEXT,
      location TEXT,
      instagram_handle TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      event_id UUID REFERENCES events(id) ON DELETE RESTRICT,
      slug TEXT NOT NULL,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      description TEXT NOT NULL,
      cost TEXT,
      item_type TEXT DEFAULT 'price',
      instagram_url TEXT,
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
  try {
    await sql`ALTER TABLE projects ALTER COLUMN cost DROP NOT NULL`;
  } catch {
  }
  try {
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS item_type TEXT DEFAULT 'price'`;
  } catch {
  }
  try {
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS instagram_url TEXT`;
  } catch {
  }
  try {
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS category_label TEXT`;
  } catch {
  }
  try {
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT TRUE`;
  } catch {
  }
  await sql`
    UPDATE projects
    SET category_label = 'Кераміка'
    WHERE category_label IS NULL OR TRIM(category_label) = ''
  `;
  await sql`
    UPDATE projects
    SET item_type = 'price'
    WHERE item_type IS NULL
  `;
  try {
    await sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS subtitle TEXT NOT NULL DEFAULT ''`;
  } catch {
  }
  try {
    await sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS date_label TEXT`;
  } catch {
  }
  try {
    await sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS poster_image_url TEXT`;
  } catch {
  }
  try {
    await sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS location TEXT`;
  } catch {
  }
  try {
    await sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS instagram_handle TEXT`;
  } catch {
  }
  try {
    await sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT TRUE`;
  } catch {
  }
  try {
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS event_id UUID`;
  } catch {
  }
  try {
    await sql`ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_slug_key`;
  } catch {
  }
  try {
    await sql`CREATE UNIQUE INDEX IF NOT EXISTS projects_event_id_slug_key ON projects (event_id, slug)`;
  } catch {
  }
  await sql`
    INSERT INTO events (slug, title, subtitle, poster_image_url, date_label, location, instagram_handle)
    VALUES (
      ${DEFAULT_EVENT.slug},
      ${DEFAULT_EVENT.title},
      ${DEFAULT_EVENT.subtitle},
      ${DEFAULT_EVENT.poster_image_url},
      ${DEFAULT_EVENT.date_label},
      ${DEFAULT_EVENT.location},
      ${DEFAULT_EVENT.instagram_handle}
    )
    ON CONFLICT (slug) DO NOTHING
  `;
  await sql`
    UPDATE projects
    SET event_id = (
      SELECT id FROM events WHERE slug = ${DEFAULT_EVENT.slug}
    )
    WHERE event_id IS NULL
  `;
}

export async function getProjects() {
  return getProjectsByVisibility();
}

export async function getProjectsByVisibility(options?: { publishedOnly?: boolean }) {
  const sql = getSql();
  const publishedOnly = options?.publishedOnly ?? false;
  if (publishedOnly) {
    return sql`
      SELECT
        projects.*,
        events.slug AS event_slug,
        events.title AS event_title
      FROM projects
      JOIN events ON events.id = projects.event_id
      WHERE projects.is_published = TRUE
      ORDER BY projects.created_at DESC
    `;
  }
  return sql`
    SELECT
      projects.*,
      events.slug AS event_slug,
      events.title AS event_title
    FROM projects
    JOIN events ON events.id = projects.event_id
    ORDER BY projects.created_at DESC
  `;
}

export async function getProjectBySlug(slug: string, options?: { includeDrafts?: boolean }) {
  const sql = getSql();
  const includeDrafts = options?.includeDrafts ?? false;
  if (includeDrafts) {
    const rows = await sql`
      SELECT
        projects.*,
        events.slug AS event_slug,
        events.title AS event_title,
        events.subtitle AS event_subtitle,
        events.date_label AS event_date_label,
        events.location AS event_location,
        events.instagram_handle AS event_instagram_handle
      FROM projects
      JOIN events ON events.id = projects.event_id
      WHERE projects.slug = ${slug}
      ORDER BY projects.created_at DESC
      LIMIT 1
    `;
    return rows[0] ?? null;
  }
  const rows = await sql`
    SELECT
      projects.*,
      events.slug AS event_slug,
      events.title AS event_title,
      events.subtitle AS event_subtitle,
      events.date_label AS event_date_label,
      events.location AS event_location,
      events.instagram_handle AS event_instagram_handle
    FROM projects
    JOIN events ON events.id = projects.event_id
    WHERE projects.slug = ${slug}
      AND projects.is_published = TRUE
    ORDER BY projects.created_at DESC
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function getProjectByEventAndSlug(eventSlug: string, slug: string, options?: { includeDrafts?: boolean }) {
  const sql = getSql();
  const includeDrafts = options?.includeDrafts ?? false;
  if (includeDrafts) {
    const rows = await sql`
      SELECT
        projects.*,
        events.slug AS event_slug,
        events.title AS event_title,
        events.subtitle AS event_subtitle,
        events.date_label AS event_date_label,
        events.location AS event_location,
        events.instagram_handle AS event_instagram_handle
      FROM projects
      JOIN events ON events.id = projects.event_id
      WHERE events.slug = ${eventSlug}
        AND projects.slug = ${slug}
    `;
    return rows[0] ?? null;
  }
  const rows = await sql`
    SELECT
      projects.*,
      events.slug AS event_slug,
      events.title AS event_title,
      events.subtitle AS event_subtitle,
      events.date_label AS event_date_label,
      events.location AS event_location,
      events.instagram_handle AS event_instagram_handle
    FROM projects
    JOIN events ON events.id = projects.event_id
    WHERE events.slug = ${eventSlug}
      AND projects.slug = ${slug}
      AND projects.is_published = TRUE
  `;
  return rows[0] ?? null;
}

export async function createProject(data: {
  slug: string;
  title: string;
  author: string;
  description: string;
  cost?: string;
  item_type?: string;
  instagram_url?: string;
  image_url?: string;
  font_size?: string;
  currency?: string;
  event_id?: string;
  event_slug?: string;
  category_label?: string;
  is_published?: boolean;
}) {
  const sql = getSql();
  let eventId = data.event_id;
  if (!eventId) {
    const targetSlug = data.event_slug ?? DEFAULT_EVENT.slug;
    const eventRows = await sql`SELECT id FROM events WHERE slug = ${targetSlug}`;
    eventId = eventRows[0]?.id;
  }
  if (!eventId) {
    throw new Error("Event not found");
  }
  const [row] = await sql`
    INSERT INTO projects (event_id, slug, title, author, description, cost, item_type, instagram_url, image_url, font_size, currency, category_label, is_published)
    VALUES (
      ${eventId},
      ${data.slug},
      ${data.title},
      ${data.author},
      ${data.description},
      ${data.cost ?? null},
      ${data.item_type ?? "price"},
      ${data.instagram_url ?? null},
      ${data.image_url ?? null},
      ${data.font_size ?? "md"},
      ${data.currency ?? "uah"},
      ${data.category_label?.trim() ? data.category_label.trim() : "Кераміка"},
      ${data.is_published ?? true}
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
    cost?: string;
    item_type?: string;
    instagram_url?: string;
    image_url?: string;
    font_size?: string;
    currency?: string;
    event_id?: string;
    event_slug?: string;
    category_label?: string;
    is_published?: boolean;
  }
) {
  const sql = getSql();
  let eventId = data.event_id;
  if (!eventId && data.event_slug) {
    const eventRows = await sql`SELECT id FROM events WHERE slug = ${data.event_slug}`;
    eventId = eventRows[0]?.id;
  }
  const [row] = await sql`
    UPDATE projects SET
      event_id = COALESCE(${eventId ?? null}, event_id),
      slug = ${data.slug},
      title = ${data.title},
      author = ${data.author},
      description = ${data.description},
      cost = ${data.cost ?? null},
      item_type = ${data.item_type ?? "price"},
      instagram_url = ${data.instagram_url ?? null},
      image_url = ${data.image_url ?? null},
      font_size = ${data.font_size ?? "md"},
      currency = ${data.currency ?? "uah"},
      category_label = ${data.category_label?.trim() ? data.category_label.trim() : "Кераміка"},
      is_published = ${data.is_published ?? true},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return row;
}

export async function getProjectById(id: string) {
  const sql = getSql();
  const rows = await sql`
    SELECT
      projects.*,
      events.slug AS event_slug,
      events.title AS event_title
    FROM projects
    JOIN events ON events.id = projects.event_id
    WHERE projects.id = ${id}
  `;
  return rows[0] ?? null;
}

export async function deleteProject(id: string) {
  const sql = getSql();
  await sql`DELETE FROM projects WHERE id = ${id}`;
}

export async function getEvents() {
  return getEventsByVisibility();
}

export async function getEventsByVisibility(options?: { publishedOnly?: boolean }) {
  const sql = getSql();
  const publishedOnly = options?.publishedOnly ?? false;
  if (publishedOnly) {
    return sql`
      SELECT * FROM events
      WHERE is_published = TRUE
      ORDER BY created_at DESC
    `;
  }
  return sql`
    SELECT * FROM events
    ORDER BY created_at DESC
  `;
}

export async function getEventBySlug(slug: string, options?: { includeDrafts?: boolean }) {
  const sql = getSql();
  const includeDrafts = options?.includeDrafts ?? false;
  if (includeDrafts) {
    const rows = await sql`
      SELECT * FROM events WHERE slug = ${slug}
    `;
    return rows[0] ?? null;
  }
  const rows = await sql`
    SELECT * FROM events WHERE slug = ${slug} AND is_published = TRUE
  `;
  return rows[0] ?? null;
}

export async function getProjectsByEventSlug(slug: string) {
  return getProjectsByEventSlugVisibility(slug);
}

export async function getProjectsByEventSlugVisibility(slug: string, options?: { publishedOnly?: boolean }) {
  const sql = getSql();
  const publishedOnly = options?.publishedOnly ?? false;
  if (publishedOnly) {
    return sql`
      SELECT projects.*
      FROM projects
      JOIN events ON events.id = projects.event_id
      WHERE events.slug = ${slug}
        AND projects.is_published = TRUE
      ORDER BY projects.created_at DESC
    `;
  }
  return sql`
    SELECT projects.*
    FROM projects
    JOIN events ON events.id = projects.event_id
    WHERE events.slug = ${slug}
    ORDER BY projects.created_at DESC
  `;
}

export async function createEvent(data: {
  slug: string;
  title: string;
  subtitle: string;
  poster_image_url?: string;
  date_label?: string;
  location?: string;
  instagram_handle?: string;
  is_published?: boolean;
}) {
  const sql = getSql();
  const [row] = await sql`
    INSERT INTO events (slug, title, subtitle, poster_image_url, date_label, location, instagram_handle, is_published)
    VALUES (
      ${data.slug},
      ${data.title},
      ${data.subtitle},
      ${data.poster_image_url ?? null},
      ${data.date_label ?? null},
      ${data.location ?? null},
      ${data.instagram_handle ?? null},
      ${data.is_published ?? true}
    )
    RETURNING *
  `;
  return row;
}

export async function getEventById(id: string) {
  const sql = getSql();
  const rows = await sql`
    SELECT * FROM events WHERE id = ${id}
  `;
  return rows[0] ?? null;
}

export async function updateEvent(
  id: string,
  data: {
    slug: string;
    title: string;
    subtitle: string;
    poster_image_url?: string;
    date_label?: string;
    location?: string;
    instagram_handle?: string;
    is_published?: boolean;
  }
) {
  const sql = getSql();
  const [row] = await sql`
    UPDATE events SET
      slug = ${data.slug},
      title = ${data.title},
      subtitle = ${data.subtitle},
      poster_image_url = ${data.poster_image_url ?? null},
      date_label = ${data.date_label ?? null},
      location = ${data.location ?? null},
      instagram_handle = ${data.instagram_handle ?? null},
      is_published = ${data.is_published ?? true},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return row;
}

export async function deleteEvent(id: string) {
  const sql = getSql();
  await sql`DELETE FROM events WHERE id = ${id}`;
}

export async function getBlogPosts() {
  return getBlogPostsByVisibility();
}

export async function getBlogPostsByVisibility(options?: { publishedOnly?: boolean }) {
  const sql = getSql();
  const publishedOnly = options?.publishedOnly ?? false;
  if (publishedOnly) {
    return sql`
      SELECT * FROM blog_posts
      WHERE published_at IS NOT NULL
      ORDER BY published_at DESC, created_at DESC
    `;
  }
  return sql`
    SELECT * FROM blog_posts
    ORDER BY published_at DESC, created_at DESC
  `;
}

export async function getBlogPostBySlug(slug: string, options?: { includeDrafts?: boolean }) {
  const sql = getSql();
  const includeDrafts = options?.includeDrafts ?? false;
  if (includeDrafts) {
    const rows = await sql`
      SELECT * FROM blog_posts
      WHERE slug = ${slug}
    `;
    return rows[0] ?? null;
  }
  const rows = await sql`
    SELECT * FROM blog_posts
    WHERE slug = ${slug}
      AND published_at IS NOT NULL
  `;
  return rows[0] ?? null;
}

export async function getBlogPostById(id: string) {
  const sql = getSql();
  const rows = await sql`
    SELECT * FROM blog_posts
    WHERE id = ${id}
  `;
  return rows[0] ?? null;
}

export async function createBlogPost(data: {
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  cover_image_url?: string;
  published_at?: string;
}) {
  const sql = getSql();
  const [row] = await sql`
    INSERT INTO blog_posts (slug, title, excerpt, content, cover_image_url, published_at)
    VALUES (
      ${data.slug},
      ${data.title},
      ${data.excerpt ?? null},
      ${data.content},
      ${data.cover_image_url ?? null},
      ${data.published_at ?? null}
    )
    RETURNING *
  `;
  return row;
}

export async function updateBlogPost(
  id: string,
  data: {
    slug: string;
    title: string;
    excerpt?: string;
    content: string;
    cover_image_url?: string;
    published_at?: string;
  }
) {
  const sql = getSql();
  const [row] = await sql`
    UPDATE blog_posts SET
      slug = ${data.slug},
      title = ${data.title},
      excerpt = ${data.excerpt ?? null},
      content = ${data.content},
      cover_image_url = ${data.cover_image_url ?? null},
      published_at = ${data.published_at ?? null},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return row;
}

export async function deleteBlogPost(id: string) {
  const sql = getSql();
  await sql`DELETE FROM blog_posts WHERE id = ${id}`;
}
