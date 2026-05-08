export type ApiResponse<T> = {
  success: true;
  data: T;
  cachedAt?: string;
};

export type ApiError = {
  success: false;
  error: {
    message: string;
    status: number;
    details?: unknown;
  };
};

export type ApiResult<T> = ApiResponse<T> | ApiError;
