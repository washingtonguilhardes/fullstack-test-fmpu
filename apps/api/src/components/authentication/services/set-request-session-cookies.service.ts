import { Response } from 'express';

export interface ISetRequestCookiesService {
  execute(res: Response, accessToken: string, refreshToken: string): Response;
}

export abstract class SetRequestCookiesService
  implements ISetRequestCookiesService
{
  abstract execute(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ): Response;
}
