import { Observable } from 'rxjs';

// import { SetRequestCookiesService } from '@/domains/authentication';
import { CanActivate, ExecutionContext, Logger } from '@nestjs/common';

export class AuthSessionGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    throw new Error('Method not implemented.');
  }

  private readonly logger = new Logger(AuthSessionGuard.name);

  // constructor(
  //   private readonly reflector: Reflector,
  //   private readonly setRequestCookiesService: SetRequestCookiesService,
  // ) {}

  // private getRequest(context: ExecutionContext): Request {
  //   const isGraphql = context.getType<GqlContextType>() === 'graphql';
  //   if (isGraphql) {
  //     const ctx = GqlExecutionContext.create(context);
  //     const { req } = ctx.getContext();
  //     return req;
  //   }
  //   return context.switchToHttp().getRequest<Request>();
  // }

  // private getResponse(context: ExecutionContext): Response {
  //   const isGraphql = context.getType<GqlContextType>() === 'graphql';
  //   if (isGraphql) {
  //     const ctx = GqlExecutionContext.create(context);
  //     const { res } = ctx.getContext();
  //     return res;
  //   }
  //   return context.switchToHttp().getResponse<Response>();
  // }

  // private getSession(context: ExecutionContext) {
  //   const req = this.getRequest(context);

  //   const sessionId =
  //     req.cookies['DriveappSessionId'] ??
  //     req.header('Authorization')?.replace('Bearer ', '') ??
  //     '';
  //   const refreshToken =
  //     req.cookies['DriveappRefreshToken'] ??
  //     req.header('x-driveapp-refresh-token')?.replace('', '');

  //   return { sessionId, refreshToken };
  // }

  // async canActivate(context: ExecutionContext): Promise<boolean> {
  //   const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
  //     context.getHandler(),
  //     context.getClass(),
  //   ]);

  //   if (isPublic) {
  //     return true;
  //   }

  //   const res = this.getResponse(context);
  //   const req = this.getRequest(context);

  //   try {
  //     const { sessionId, refreshToken } = this.getSession(context);
  //     if (!sessionId && !refreshToken) {
  //       this.logger.debug('UNAUTHORIZED: no sessionId and refreshToken');
  //       return false;
  //     }

  //     const {
  //       status,
  //       refreshToken: newRefreshToken,
  //       accessToken: newAccessToken,
  //     } = {
  //       status: 'valid',
  //       refreshToken: 'newRefreshToken',
  //       accessToken: 'newAccessToken',
  //     };

  //     console.log({
  //       status,
  //       newRefreshToken,
  //       newAccessToken,
  //       sessionId,
  //       refreshToken,
  //     });

  //     if (status === 'valid') {
  //       this.logger.debug('valid');

  //       req.headers['authorization'] = `Bearer ${sessionId}`;
  //       req.headers['x-driveapp-refresh-token'] = refreshToken;
  //       req.cookies['DriveappSessionId'] = sessionId;
  //       req.cookies['DriveappRefreshToken'] = refreshToken;

  //       return true;
  //     }
  //     if (status === 'revalidated') {
  //       console.log('revalidated');
  //       this.setRequestCookiesService.execute(
  //         res,
  //         newAccessToken,
  //         newRefreshToken,
  //       );
  //       // update current request with new tokens
  //       req.headers['authorization'] = `Bearer ${newAccessToken}`;
  //       req.headers['x-driveapp-refresh-token'] = newRefreshToken;
  //       req.cookies['DriveappSessionId'] = newAccessToken;
  //       req.cookies['DriveappRefreshToken'] = newRefreshToken;

  //       res.cookie('DriveappSessionId', newAccessToken, {
  //         httpOnly: true,
  //         secure: true,
  //         expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
  //         path: '/',
  //       });
  //       res.cookie('DriveappRefreshToken', newRefreshToken, {
  //         httpOnly: true,
  //         secure: true,
  //         expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
  //         path: '/',
  //       });

  //       return true;
  //     }
  //     if (status === 'invalid') {
  //       this.setRequestCookiesService.execute(res, '', '');
  //       return false;
  //     }
  //     return false;
  //   } catch (error) {
  //     this.logger.error(`UNAUTHORIZED: ${error}`);
  //     return false;
  //   }
  // }
}
