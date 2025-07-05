import { AxiosError } from 'axios';

import { IHTTPClientErrorResponse } from '@driveapp/contracts/utils/http-clients';

export function parseErrorResponse(error: AxiosError | Error): IHTTPClientErrorResponse {
  if (error instanceof AxiosError) {
    return error.response?.data as IHTTPClientErrorResponse;
  }

  return {
    message: error.message,
    statusCode: 500,
    exceptionCode: 'INTERNAL_SERVER_ERROR',
    metas: []
  };
}
