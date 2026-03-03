export interface UserItem {
  id: string | number;
  name: string;
  email: string;
  role: "user" | "admin" | string;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UsersResponse {
  ok?: boolean;
  data?: unknown;
  message?: string;
}
