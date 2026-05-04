export type HttpErrorPayload = unknown;

export class HttpError extends Error {
  readonly payload: HttpErrorPayload;
  readonly status: number;
  readonly statusText: string;
  readonly url: string;

  constructor({
    message,
    payload,
    status,
    statusText,
    url,
  }: {
    message: string;
    payload: HttpErrorPayload;
    status: number;
    statusText: string;
    url: string;
  }) {
    super(message);
    this.name = 'HttpError';
    this.payload = payload;
    this.status = status;
    this.statusText = statusText;
    this.url = url;
  }
}

export class ApiConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiConfigurationError';
  }
}
