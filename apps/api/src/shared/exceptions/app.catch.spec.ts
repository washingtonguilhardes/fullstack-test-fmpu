import { ArgumentsHost, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AbstractHttpAdapter } from '@nestjs/core';
import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { AllExceptionsFilter } from './app.catch';
import { ApplicationException } from './application.exception';

jest.mock('@nestjs/common', () => ({
  ...jest.requireActual('@nestjs/common'),
  Logger: jest.fn().mockReturnValue({
    error: jest.fn(),
    debug: jest.fn(),
  }),
}));

describe('AllExceptionsFilter', () => {
  let httpAdapter: jest.Mocked<AbstractHttpAdapter>;
  let host: jest.Mocked<ArgumentsHost>;
  let config: jest.Mocked<ConfigService>;

  beforeEach(() => {
    httpAdapter = {
      getRequestUrl: jest.fn().mockReturnValue('url'),
      getRequestMethod: jest.fn().mockReturnValue('method'),
      reply: jest.fn(),
    } as any;
    host = { switchToHttp: jest.fn() } as any;
    config = { get: jest.fn().mockReturnValue('development') } as any;
  });

  it('catch() [generic]', () => {
    const ctxFn = {
      getRequest: jest.fn().mockReturnValue('request'),
      getResponse: jest.fn().mockReturnValue('response'),
    };
    host.switchToHttp.mockReturnValue(ctxFn as any);
    jest.useFakeTimers().setSystemTime(new Date('2023-03-20'));
    const exceptionFilter = new AllExceptionsFilter(httpAdapter, config);
    expect(exceptionFilter).toBeInstanceOf(AllExceptionsFilter);
    expect(exceptionFilter.catch({ message: '' }, host));

    expect(httpAdapter.reply).toHaveBeenCalledWith(
      'response',
      { message: '', statusCode: 500, exceptionCode: 'UNKNOWN', metas: [] },
      500,
    );
  });
  it('catch() [ApplicationException]', () => {
    const exception = ApplicationException.objectNotFound('not-found');
    const ctxFn = {
      getRequest: jest.fn().mockReturnValue('request'),
      getResponse: jest.fn().mockReturnValue('response'),
    };
    config.get.mockReturnValue('production');

    host.switchToHttp.mockReturnValue(ctxFn as any);
    jest.useFakeTimers().setSystemTime(new Date('2023-03-20'));
    exception.addMeta('key', ' value');
    const exceptionFilter = new AllExceptionsFilter(httpAdapter, config);
    expect(exceptionFilter).toBeInstanceOf(AllExceptionsFilter);
    expect(exceptionFilter.catch(exception, host));

    expect(httpAdapter.reply).toHaveBeenCalledWith(
      'response',
      {
        message: 'not-found',
        statusCode: 400,
        exceptionCode: 'OBJECT_NOT_FOUND',
        metas: [],
      },
      400,
    );
  });
  it('catch() [ApplicationException:dev]', () => {
    const exception = ApplicationException.objectNotFound('not-found');
    const ctxFn = {
      getRequest: jest.fn().mockReturnValue('request'),
      getResponse: jest.fn().mockReturnValue('response'),
    };
    config.get.mockReturnValue('development');
    host.switchToHttp.mockReturnValue(ctxFn as any);
    jest.useFakeTimers().setSystemTime(new Date('2023-03-20'));
    exception.addMeta('key', ' value');
    const exceptionFilter = new AllExceptionsFilter(httpAdapter, config);

    exceptionFilter.catch(exception, host);

    expect(httpAdapter.reply).toHaveBeenCalledWith(
      'response',
      {
        message: 'not-found',
        statusCode: 400,
        exceptionCode: 'OBJECT_NOT_FOUND',
        metas: [{ key: 'key', value: ' value' }],
      },
      400,
    );
  });

  it('catch() [HttpException:dev]', () => {
    const exception = new HttpException('message', 401);
    const ctxFn = {
      getRequest: jest.fn().mockReturnValue('request'),
      getResponse: jest.fn().mockReturnValue('response'),
    };
    host.switchToHttp.mockReturnValue(ctxFn as any);
    const exceptionFilter = new AllExceptionsFilter(httpAdapter, config);

    exceptionFilter.catch(exception, host);

    expect(httpAdapter.reply).toHaveBeenCalledWith(
      'response',
      {
        message: 'message',
        statusCode: 401,
        exceptionCode: 'UNKNOWN',
        metas: [],
      },
      401,
    );
  });
});
