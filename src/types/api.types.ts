// =============================================
// Standardized API request/response types
// =============================================

/** Standard API success response */
export interface ApiResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

/** Standard API error response */
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

/** Paginated response wrapper */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

/** Pagination query params */
export interface PaginationParams {
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  search?: string;
}

/** Login request body */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Register request body */
export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  nik: string;
  phone?: string;
}

/** Letter creation request */
export interface CreateLetterRequest {
  letter_type: string;
  data: Record<string, unknown>;
  attachments?: File[];
}

/** Letter status update */
export interface UpdateLetterStatusRequest {
  status: 'approved' | 'rejected';
  rejection_reason?: string;
}

/** News creation/update */
export interface UpsertNewsRequest {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  cover_image_url?: string;
  is_published: boolean;
}

/** Gallery item creation */
export interface CreateGalleryRequest {
  title: string;
  description?: string;
  category: string;
  is_featured?: boolean;
  sort_order?: number;
}

/** Resident creation/update */
export interface UpsertResidentRequest {
  nik: string;
  full_name: string;
  birth_place: string;
  birth_date: string;
  gender: string;
  religion: string;
  marital_status: string;
  education: string;
  occupation: string;
  address: string;
  family_card_id?: string;
  phone?: string;
}
