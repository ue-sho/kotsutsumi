export type ReportStatus = 'pending' | 'in_progress' | 'resolved' | 'rejected';

export interface Report {
  id: number;
  reporterUserId: number;
  reportedWorkLogId: number | null;
  reason: string;
  status: ReportStatus;
  adminNote: string | null;
  resolvedByUserId: number | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReportDto {
  reportedWorkLogId: number;
  reason: string;
}

export interface UpdateReportDto {
  status?: ReportStatus;
  adminNote?: string;
}
