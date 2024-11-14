export interface StatusResponse<T = any> {
  status: number;
  data?: T;
  message?: string;
}
