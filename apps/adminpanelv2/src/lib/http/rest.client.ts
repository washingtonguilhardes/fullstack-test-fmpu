import axios from 'axios';

export const restClient = axios.create({
  baseURL: '/api',
});

export const restClientServer = axios.create({
  baseURL: `${process.env.DRIVEAPP_API_URL_INTERNAL}/api`,
});
