export type SyncType = 'upload' | 'download' | 'conflict';
export type SyncStatus = 'success' | 'failed' | 'pending';
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface SyncLog {
  id: number;
  userId: number;
  workLogId: number | null;
  syncType: SyncType;
  status: SyncStatus;
  errorMessage: string | null;
  syncedAt: string;
}

export interface Device {
  id: number;
  userId: number;
  deviceName: string | null;
  deviceType: DeviceType | null;
  lastSyncAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterDeviceDto {
  deviceName?: string;
  deviceType?: DeviceType;
}

export interface SyncUploadRequest {
  workLogs: LocalWorkLog[];
  deviceId?: number;
}

export interface LocalWorkLog {
  localId: string;
  title: string;
  content: string | null;
  workDate: string;
  durationMinutes: number;
  status: string;
  categoryIds?: number[];
  tagIds?: number[];
  createdAt: string;
  updatedAt: string;
}

export interface SyncDownloadResponse {
  workLogs: SyncedWorkLog[];
  lastSyncAt: string;
}

export interface SyncedWorkLog {
  id: number;
  localId: string | null;
  title: string;
  content: string | null;
  workDate: string;
  durationMinutes: number;
  status: string;
  categories: { id: number; name: string; color: string }[];
  tags: { id: number; name: string }[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ConflictResolution {
  localId: string;
  serverId: number;
  resolution: 'keep_local' | 'keep_server' | 'keep_both';
}

export interface SyncStatusResponse {
  lastSyncAt: string | null;
  pendingUploads: number;
  pendingDownloads: number;
}
