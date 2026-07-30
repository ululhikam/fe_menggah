// =============================================
// Database model types (mirrors Supabase schema)
// =============================================

import type {
  UserRole,
  Gender,
  Religion,
  MaritalStatus,
  LetterType,
  LetterStatus,
  GalleryCategory,
  AnnouncementPriority,
} from './enums';

/** User profile linked to Supabase Auth */
export interface Profile {
  id: string;
  nik: string;
  full_name: string;
  birth_place: string;
  birth_date: string;
  gender: Gender;
  religion: Religion;
  marital_status: MaritalStatus;
  education: string;
  occupation: string;
  address: string;
  family_card_id: string | null;
  role: UserRole;
  phone: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

/** Kartu Keluarga */
export interface FamilyCard {
  id: string;
  no_kk: string;
  head_of_family: string;
  address: string;
  member_count: number;
  created_at: string;
}

/** Surat / Letter request */
export interface Letter {
  id: string;
  letter_number: string | null;
  letter_type: LetterType;
  requester_id: string;
  data: Record<string, unknown>;
  status: LetterStatus;
  rejection_reason: string | null;
  approved_by: string | null;
  pdf_url: string | null;
  submitted_at: string;
  processed_at: string | null;
}

/** Letter with requester profile populated */
export interface LetterWithRequester extends Letter {
  requester: Pick<Profile, 'id' | 'full_name' | 'nik' | 'address'>;
}

/** Attachment to a letter */
export interface LetterAttachment {
  id: string;
  letter_id: string;
  file_url: string;
  file_name: string;
  created_at: string;
}

/** News article */
export interface News {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  category: string;
  is_published: boolean;
  author_id: string;
  published_at: string | null;
  created_at: string;
}

/** News with author info */
export interface NewsWithAuthor extends News {
  author: Pick<Profile, 'id' | 'full_name'>;
}

/** Gallery item */
export interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: GalleryCategory;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
}

/** CMS-driven village profile section */
export interface VillageProfile {
  id: string;
  section_key: string;
  title: string;
  content: string;
  metadata: Record<string, unknown> | null;
  updated_at: string;
}

/** Budget transparency item */
export interface BudgetItem {
  id: string;
  fiscal_year: number;
  category: string;
  description: string;
  allocated_amount: number;
  realized_amount: number;
  source: string;
  created_at: string;
}

/** Announcement / Pengumuman */
export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: AnnouncementPriority;
  is_active: boolean;
  start_date: string;
  end_date: string | null;
  created_at: string;
}

/** Dashboard statistics aggregate */
export interface DashboardStats {
  total_residents: number;
  total_families: number;
  total_letters_pending: number;
  total_letters_completed: number;
  total_news: number;
  population_by_gender: { gender: string; count: number }[];
  population_by_age_group: { group: string; count: number }[];
  letters_by_month: { month: string; count: number }[];
}
