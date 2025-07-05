import axios from 'axios';

import { parseErrorResponse } from './parse-error-response';

export const restClient = axios.create({
  baseURL: '/api/v1',
  withCredentials: true
});

restClient.interceptors.response.use(
  response => response,
  error => {
    return Promise.reject(parseErrorResponse(error));
  }
);

export const restClientServer = axios.create({
  baseURL: `${process.env.DRIVEAPP_API_URL_INTERNAL}/api/v1`,
  withCredentials: true
});
