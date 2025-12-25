export type WorkLogStatus = 'in_progress' | 'completed' | 'on_hold';
export type ConflictStatus = 'pending' | 'resolved' | null;

export interface WorkLog {
  id: number;
  userId: number;
  title: string;
  content: string | null;
  workDate: string;
  durationMinutes: number;
  status: WorkLogStatus;
  published: boolean;
  localId: string | null;
  synced: boolean;
  lastSyncedAt: string | null;
  conflictStatus: ConflictStatus;
  createdAt: string;
  updatedAt: string;
  categories?: Category[];
  tags?: Tag[];
  attachments?: Attachment[];
}

export interface CreateWorkLogDto {
  title: string;
  content?: string;
  workDate: string;
  durationMinutes?: number;
  status?: WorkLogStatus;
  categoryIds?: number[];
  tagIds?: number[];
  localId?: string;
}

export interface UpdateWorkLogDto {
  title?: string;
  content?: string;
  workDate?: string;
  durationMinutes?: number;
  status?: WorkLogStatus;
  categoryIds?: number[];
  tagIds?: number[];
}

export interface Category {
  id: number;
  userId: number;
  name: string;
  color: string;
  icon: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
  color?: string;
  icon?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  color?: string;
  icon?: string;
  sortOrder?: number;
}

export interface Tag {
  id: number;
  userId: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTagDto {
  name: string;
}

export interface Attachment {
  id: number;
  workLogId: number;
  fileName: string;
  fileType: string | null;
  fileSize: number | null;
  fileUrl: string | null;
  createdAt: string;
}
