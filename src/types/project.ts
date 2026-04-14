export interface Project {
  id: string;
  event_id: string;
  event_slug?: string;
  event_title?: string;
  slug: string;
  title: string;
  author: string;
  description: string;
  cost: string | null;
  item_type?: string | null;
  instagram_url?: string | null;
  image_url: string | null;
  currency?: string | null;
  category_label?: string | null;
  created_at: string;
  updated_at: string;
}
