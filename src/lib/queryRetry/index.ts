import { ZodError } from 'zod';

import { ApiRequestError, NetworkRequestError } from '@/api';

const MAX_RETRIES = 2;

export function shouldRetryQuery(failureCount: number, error: unknown) {
  if (error instanceof ZodError) {
    return false;
  }

  if (error instanceof ApiRequestError) {
    const isTransientStatus =
      error.status >= 500 || error.status === 408 || error.status === 429;
    return isTransientStatus && failureCount < MAX_RETRIES;
  }

  return error instanceof NetworkRequestError && failureCount < MAX_RETRIES;
}
