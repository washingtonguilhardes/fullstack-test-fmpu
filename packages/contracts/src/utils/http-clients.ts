export interface IHTTPClientResult<Data> {
  result: Data;
  message?: string;
  error?: string;
  errors?: { code: string; message: string }[];
  status: number;
}
export interface IHTTPClientErrorResponse {
  message: string;
  statusCode: number;
  exceptionCode: string;
  metas: { value: unknown; key: string }[];
  validation?: unknown;
}
