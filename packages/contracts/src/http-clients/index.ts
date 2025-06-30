export interface IHTTPClientProdessResult<Data> {
  result: Data;
  message?: string;
  error?: string;
  errors?: { code: string; message: string }[];
  status: number;
}
