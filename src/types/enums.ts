// =============================================
// Enums shared across frontend and backend
// =============================================

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  WARGA = 'warga',
}

export enum LetterType {
  SKCK = 'SKCK',
  DOMISILI = 'DOMISILI',
  SKTM = 'SKTM',
  UMUM = 'UMUM',
}

export enum LetterStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum Gender {
  MALE = 'laki-laki',
  FEMALE = 'perempuan',
}

export enum MaritalStatus {
  SINGLE = 'belum_kawin',
  MARRIED = 'kawin',
  DIVORCED = 'cerai_hidup',
  WIDOWED = 'cerai_mati',
}

export enum Religion {
  ISLAM = 'islam',
  KRISTEN = 'kristen',
  KATOLIK = 'katolik',
  HINDU = 'hindu',
  BUDDHA = 'buddha',
  KONGHUCU = 'konghucu',
}

export enum GalleryCategory {
  UMKM = 'umkm',
  WISATA = 'wisata',
  BUDAYA = 'budaya',
  KEGIATAN = 'kegiatan',
}

export enum AnnouncementPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}
