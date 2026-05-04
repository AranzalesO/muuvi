import { ApiConfigurationError, HttpError } from './http-error';

const DEFAULT_TMDB_API_URL = 'https://api.themoviedb.org/3';

type RequestParams = Record<string, number | string | undefined>;

const getAccessToken = () => process.env.EXPO_PUBLIC_TMDB_ACCESS_TOKEN;

const getBaseUrl = () =>
  process.env.EXPO_PUBLIC_TMDB_API_URL ?? DEFAULT_TMDB_API_URL;

const buildUrl = (path: string, params?: RequestParams) => {
  const url = new URL(`${getBaseUrl()}${path}`);

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
};

const parseResponsePayload = async (response: Response) => {
  const contentType = response.headers.get('content-type');

  if (contentType?.includes('application/json')) {
    return response.json();
  }

  return response.text();
};

export const tmdbClient = {
  async get<TResponse>(path: string, params?: RequestParams): Promise<TResponse> {
    const token = getAccessToken();

    if (!token) {
      throw new ApiConfigurationError(
        'Missing EXPO_PUBLIC_TMDB_ACCESS_TOKEN environment variable.',
      );
    }

    const url = buildUrl(path, params);
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const payload = await parseResponsePayload(response);

    if (!response.ok) {
      throw new HttpError({
        message: `TMDB request failed with ${response.status} ${response.statusText}`,
        payload,
        status: response.status,
        statusText: response.statusText,
        url,
      });
    }

    return payload as TResponse;
  },
};
