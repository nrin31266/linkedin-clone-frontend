export interface ApiResponse<T = any> {
  data: T;
  code: number;
  message: string;
}

export interface ErrorResponse {
  status: number;
  code: number;
  message: string;
  details?: string | null;
}
