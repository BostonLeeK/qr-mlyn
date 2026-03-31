export interface Project {
  id: string;
  event_id: string;
  event_slug?: string;
  event_title?: string;
  slug: string;
  title: string;
  author: string;
  description: string;
  cost: string;
  image_url: string | null;
  currency?: string | null;
  created_at: string;
  updated_at: string;
}
