// import { defaultClient } from 'applicationinsights';

import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AbstractHttpAdapter } from '@nestjs/core';

import { ApplicationException } from './application.exception';

type ResponseBody = {
  message: unknown;
  statusCode: number;
  exceptionCode: string;
  validation?: unknown;
  metas: unknown[];
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapter: AbstractHttpAdapter,
    private readonly configService: ConfigService,
  ) {}

  private handleApplicationException(
    exception: ApplicationException,
  ): ResponseBody {
    const message = exception.getMessage();
    const exceptionCode = exception.getExceptionCode();
    const metas = exception.getMetas(
      this.configService.get('NODE_ENV') !== 'development',
    );
    const statusCode = exception.getStatus();

    return {
      message,
      statusCode,
      exceptionCode,
      metas,
    };
  }

  private handleHttpException(exception: HttpException): ResponseBody {
    const message = exception.message;
    const statusCode = exception.getStatus();

    return {
      message,
      statusCode,
      exceptionCode: 'UNKNOWN',
      metas: [],
    };
  }

  private handleBadRequestException(
    exception: BadRequestException,
  ): ResponseBody {
    const statusCode = exception.getStatus();
    const response = exception.getResponse();
    return {
      message: exception.message,
      validation: response,
      statusCode,
      exceptionCode: 'UNKNOWN',
      metas: [],
    };
  }

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    const path = this.httpAdapter.getRequestUrl(ctx.getRequest());
    const method = this.httpAdapter.getRequestMethod(ctx.getRequest());
    const logger = new Logger(`${method}(${path})`);
    let responseBody: ResponseBody;
    switch (true) {
      case exception instanceof ApplicationException:
        responseBody = this.handleApplicationException(exception);
        break;
      case exception instanceof BadRequestException:
        responseBody = this.handleBadRequestException(exception);
        break;

      case exception instanceof HttpException:
        responseBody = this.handleHttpException(exception);
        break;
      default:
        responseBody = {
          message: exception.message,
          statusCode: 500,
          exceptionCode: 'UNKNOWN',
          metas: [],
        };
        break;
    }

    logger.error(`${responseBody.statusCode} - ${responseBody.message}`);

    if (this.configService.get('NODE_ENV') !== 'development') {
      // if (defaultClient) {
      //   try {
      //     defaultClient.trackException({
      //       exception,
      //       properties: {
      //         requestUrl: path,
      //         requestMethod: method,
      //         contactId:
      //           ctx.getRequest<AppRequest>()?.user?.contactID ?? 'unknown',
      //         message: responseBody.message,
      //         statusCode: responseBody.statusCode,
      //         exceptionCode: responseBody.exceptionCode,
      //         metas: responseBody.metas,
      //       },
      //     });
      //   } catch (error) {
      //     logger.error(
      //       `unable to log exception to app insights: ${error.message}`,
      //     );
      //   }
      // }
      return this.httpAdapter.reply(
        ctx.getResponse(),
        responseBody,
        responseBody.statusCode,
      );
    }
    logger.debug(JSON.stringify(responseBody));
    return this.httpAdapter.reply(
      ctx.getResponse(),
      responseBody,
      responseBody.statusCode,
    );
  }
}
