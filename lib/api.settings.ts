export const API_BASE_PATH = '';

export const BUSES_ENDPOINTS = {
  list: `${API_BASE_PATH}/api/buses`,
} as const;

export const USERS_ENDPOINTS = {
  create: `${API_BASE_PATH}/api/users`,
} as const;

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface FetchJsonOptions {
  method?: HttpMethod;
  signal?: AbortSignal;
  body?: unknown;
  headers?: Record<string, string>;
}

export async function fetchJson<TResponse>(url: string, options: FetchJsonOptions = {}): Promise<TResponse> {
  const headers: Record<string, string> = {
    ...options.headers,
  };

  if (options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    method: options.method ?? 'GET',
    cache: 'no-store',
    signal: options.signal,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const json = (await response.json()) as TResponse;
  return json;
}
