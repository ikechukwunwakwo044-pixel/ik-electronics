export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
};

export type Product = {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  price: number | string;
  compare_at_price: number | string | null;
  sku: string | null;
  track_quantity: boolean;
  stock_quantity: number;
  images: string[];
  specs: Record<string, string>;
  tags: string[];
  is_featured: boolean;
  is_published: boolean;
};
