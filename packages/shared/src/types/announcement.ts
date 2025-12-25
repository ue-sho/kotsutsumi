export type AnnouncementType = 'info' | 'warning' | 'maintenance';

export interface Announcement {
  id: number;
  title: string;
  content: string;
  announcementType: AnnouncementType;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnnouncementDto {
  title: string;
  content: string;
  announcementType?: AnnouncementType;
}

export interface UpdateAnnouncementDto {
  title?: string;
  content?: string;
  announcementType?: AnnouncementType;
}

export interface AnnouncementRead {
  id: number;
  userId: number;
  announcementId: number;
  readAt: string;
}
