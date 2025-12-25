export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
  details?: Record<string, string[]>;
}

export interface ApiSuccessResponse<T = void> {
  success: true;
  data: T;
  message?: string;
}

export interface DateRangeFilter {
  startDate?: string;
  endDate?: string;
}

export interface WorkLogFilters extends PaginationParams, DateRangeFilter {
  status?: string;
  categoryId?: number;
  tagId?: number;
  search?: string;
}
