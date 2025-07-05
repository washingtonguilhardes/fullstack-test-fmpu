import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AccessToken = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return (request.cookies['access_token'] ??
      request.headers['authorization']?.split(' ')[1] ??
      '') as string;
  },
);
