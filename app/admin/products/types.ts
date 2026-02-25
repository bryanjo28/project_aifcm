export interface Product {
  id: number;
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  thumbnail_url: string | null;
  type: "course" | "ebook" | "template";
  price: string; // DECIMAL dari API
  currency: string;
  status: "draft" | "active" | "inactive";
  published_at: string | null;
  created_at: string;
  updated_at: string;

  total_views: number | null;
  total_sales: number | null;
  total_revenue: string | null;
  owner_id: number | null;
  owner_name: string | null;
  category_ids: number[];
  category_names: string[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductsResponse {
  ok: boolean;
  data: {
    items: Product[];
    pagination: Pagination;
  };
}
