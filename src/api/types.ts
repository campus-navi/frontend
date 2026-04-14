import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export type ApiObjectData = Record<string, unknown>;

export interface ApiPagination {
  page: number;
  size: number;
  hasNext: boolean;
  totalElements?: number;
  totalPages?: number;
}

export interface ApiListData<TItem = unknown> extends ApiPagination {
  content: TItem[];
  [key: string]: unknown;
}

export interface ApiSuccessResponse<TData extends ApiObjectData = ApiObjectData> {
  success?: boolean;
  code: string;
  message: string;
  data: TData;
}

export interface ApiFailureResponse {
  success: false;
  code: string;
  message: string;
  data?: ApiObjectData | null;
}

export type ApiResponse<TData extends ApiObjectData = ApiObjectData> = ApiSuccessResponse<TData> | ApiFailureResponse;

export interface ApiRequestConfig<D = unknown> extends AxiosRequestConfig<D> {
  requiresAuth?: boolean;
  skipAuthRefresh?: boolean;
}

export interface QueuedRequest {
  config: InternalAxiosRequestConfig;
  reject: (reason?: unknown) => void;
  resolve: (value: AxiosResponse) => void;
}
