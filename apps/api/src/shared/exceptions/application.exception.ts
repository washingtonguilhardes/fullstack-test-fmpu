import { AxiosError } from 'axios';

import { HttpException, HttpStatus } from '@nestjs/common';

export enum DefaultApplicationException {
  FORBIDDEN = 'FORBIDDEN',
  DUPLICATED_ENTRY = 'DUPLICATED_ENTRY',
  PARAMETER_NOT_FOUND = 'PARAMETER_NOT_FOUND',
  INVALID_PARAMETER = 'INVALID_PARAMETER',
  OBJECT_NOT_FOUND = 'OBJECT_NOT_FOUND',
  EXTERNAL_RESOURCE_EXCEPTION = 'EXTERNAL_RESOURCE_EXCEPTION',
  INTERNAL_EXECUTION_EXCEPTION = 'INTERNAL_EXECUTION_EXCEPTION',
  EXPIRED_TOKEN = 'EXPIRED_TOKEN',
  UNPROCESSABLE_ENTITY = 'UNPROCESSABLE_ENTITY',
}

export enum SeverityLevel {
  Verbose = 'Verbose',
  Information = 'Information',
  Warning = 'Warning',
  Error = 'Error',
  Critical = 'Critical',
}

export class ApplicationException extends HttpException {
  private exceptionCode = 'UNKNOW_ERROR';

  private metas: { value: unknown; key: string }[] = [];

  private _severity: SeverityLevel = SeverityLevel.Information;

  private static DEFAULT_WHITELISTED_METAS = [
    'previous-error',
    'previous-code',
    'previous-message',
    'x-',
    'resourceName',
    'errorstack',
  ];

  private whiteListedMetas: string[] =
    ApplicationException.DEFAULT_WHITELISTED_METAS;

  constructor(
    message: string,
    exceptionCode: string,
    code = HttpStatus.BAD_REQUEST,
  ) {
    super(message.trim(), code);
    this.exceptionCode = exceptionCode;
  }

  getWhiteListedMetas() {
    return this.whiteListedMetas;
  }

  getExceptionCode() {
    return this.exceptionCode;
  }

  setExceptionCode(code: string): this {
    this.exceptionCode = code;
    return this;
  }

  addMeta<T = unknown>(key, value: T, whitelist = false) {
    this.metas.push({ key, value });
    if (whitelist) {
      this.whiteListedMetas.push(key);
    }
    return this;
  }

  getMetas(whitelist = false) {
    if (!whitelist) {
      return this.metas;
    }

    return this.metas.filter((meta) =>
      meta.key.match(
        new RegExp(
          `^(${ApplicationException.DEFAULT_WHITELISTED_METAS.join('|')})`,
        ),
      ),
    );
  }

  setCausedBy(cause: string) {
    this.addMeta('caused-by', cause);
    return this;
  }

  getMessage() {
    return this.message;
  }

  previousError(data: Error) {
    return this.addMeta(
      'previous-error',
      `prev[message="${data.message}", name=${data.name}]`,
    );
  }

  exception(error: unknown, isMessageOverrideDisabled = false) {
    try {
      if (error instanceof AxiosError) {
        const { config } = error.toJSON() as { config: Record<string, string> };
        this.addMeta('ax-url', config.url);
        this.addMeta('ax-params', config.params);
        this.addMeta('ax-method', config.method);

        this.setCausedBy(error.code);
        if (error.request?._currentUrl)
          this.addMeta('request-url', error.request._currentUrl);
        if (error.response?.data) {
          console.log('error.response.data', error.response.data);
          for (const key in error.response.data) {
            this.addMeta(
              `error.response.data[${key}]`,
              JSON.stringify(error.response.data[key]),
            );
          }
          this.previousError({
            message:
              error.response.data?.error?.message ||
              JSON.stringify(error.response.data),
            name: 'RequestError',
          });
        }
        if (error.response.data) {
          const {
            message,
            messageCode,
            error: errorInfo,
          } = error.response.data;
          this.exceptionCode = [
            this.exceptionCode,
            messageCode ?? errorInfo.code,
          ]
            .filter(Boolean)
            .join(':');
          if (!isMessageOverrideDisabled)
            this.message = message ?? errorInfo?.message ?? this.message;
          this.addMeta('exception-code', this.exceptionCode);
          this.addMeta(
            'inner-http-code',
            `(${error.response.status}) ${error.response.statusText}`,
          );
        }
      } else if (error instanceof ApplicationException) {
        this.addMeta('previous-code', error.getExceptionCode());
        this.addMeta('previous-message', error.getMessage());
        this.metas = [...this.metas, ...error.getMetas()];
        this.exceptionCode = error.getExceptionCode();
      } else if (error instanceof Error) {
        this.addMeta('previous-code', `generic[${error.name}]`);
        this.addMeta('previous-message', error.message);
      }
      return this;
    } catch (error) {
      return this;
    }
  }

  withMessage(message: string): this {
    this.message = message;
    return this;
  }

  withExceptionCode(code: string): this {
    this.exceptionCode = code;
    return this;
  }

  exceptions(exceptions: ApplicationException[]) {
    for (const exception of exceptions) {
      this.addMeta(`errorstack[${exception.getExceptionCode()}]`, {
        message: exception.getMessage(),
        metas: exception.getMetas(),
      });
    }
    return this;
  }

  severity(severity: SeverityLevel) {
    this._severity = severity;
    return this;
  }

  information() {
    this._severity = SeverityLevel.Information;
    return this;
  }

  warning() {
    this._severity = SeverityLevel.Warning;
    return this;
  }

  error() {
    this._severity = SeverityLevel.Error;
    return this;
  }

  critical() {
    this._severity = SeverityLevel.Critical;
    return this;
  }

  verbose() {
    this._severity = SeverityLevel.Verbose;
    return this;
  }

  dispatchTrace() {
    // try {
    //   if (defaultClient)
    //     defaultClient.trackException({
    //       exception: this,
    //       severity: this._severity,
    //       properties: {
    //         ...this.getMetas().reduce((acc, meta) => {
    //           acc[meta.key] = meta.value;
    //           return acc;
    //         }, {}),
    //         message: this.message,
    //         exceptionCode: this.exceptionCode,
    //         env: process.env.NODE_ENV,
    //         stage: process.env.STAGE,
    //       },
    //     });
    // } catch {}
    return this;
  }

  static parameterNotFound<T>(parameter: keyof T, message = '') {
    return new ApplicationException(
      `Parameter not found on request payload: '${String(parameter)}'. ${message}`.trim(),
      DefaultApplicationException.PARAMETER_NOT_FOUND,
    );
  }

  static invalidParameter<T = Record<string, string>>(
    parameter: keyof T,
    message: string,
  ) {
    const error = new ApplicationException(
      `${message}`.trim(),
      DefaultApplicationException.INVALID_PARAMETER,
    );
    error.addMeta('parameter', parameter);
    return error;
  }

  static objectNotFound(message: string) {
    return new ApplicationException(
      message.trim(),
      DefaultApplicationException.OBJECT_NOT_FOUND,
    );
  }

  static externalResourceError(resourceName: string, message = '') {
    const error = new ApplicationException(
      `Resource '${resourceName}' was executed with exceptions. ${message}`,
      DefaultApplicationException.EXTERNAL_RESOURCE_EXCEPTION,
    );
    error.addMeta('resourceName', resourceName);
    return error;
  }

  static internalExecutionError(resourceName: string, message?: string) {
    const error = new ApplicationException(
      message ?? `Internal Error. It was failed to excetute ${resourceName}.`,
      DefaultApplicationException.INTERNAL_EXECUTION_EXCEPTION,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    error.addMeta('resourceName', resourceName);
    return error;
  }

  static unauthenticatedRequest() {
    return new ApplicationException(
      'Access Token not found or invalid signature',
      DefaultApplicationException.INVALID_PARAMETER,
    );
  }

  static unauthorizedResource(
    message = 'User can only access this resource with right credentials',
  ) {
    return new ApplicationException(
      message,
      DefaultApplicationException.INVALID_PARAMETER,
      HttpStatus.UNAUTHORIZED,
    );
  }

  static basicAuthRequired(message = 'Credentials are missing to resource') {
    return new ApplicationException(
      message,
      DefaultApplicationException.INVALID_PARAMETER,
      HttpStatus.UNAUTHORIZED,
    );
  }

  static forbiddenResource() {
    return new ApplicationException(
      'Target resource is not allowed to be accessed by the source',
      DefaultApplicationException.FORBIDDEN,
      HttpStatus.FORBIDDEN,
    );
  }

  static noDuplicatedAllowed(
    message = "Unable to insert/update, it's already exists",
  ) {
    return new ApplicationException(
      message,
      DefaultApplicationException.DUPLICATED_ENTRY,
      HttpStatus.FORBIDDEN,
    );
  }

  static forbiddenRequest(reason = 'Unknown') {
    return new ApplicationException(
      reason,
      DefaultApplicationException.FORBIDDEN,
      HttpStatus.FORBIDDEN,
    );
  }

  static notAcceptableRequest(
    reason = 'Unknown',
    exceptionCode: string = DefaultApplicationException.UNPROCESSABLE_ENTITY,
  ) {
    return new ApplicationException(
      reason,
      exceptionCode,
      HttpStatus.NOT_ACCEPTABLE,
    );
  }

  static expiredToken() {
    return new ApplicationException(
      'Session expired, please login again',
      DefaultApplicationException.EXPIRED_TOKEN,
      HttpStatus.FORBIDDEN,
    );
  }
}
