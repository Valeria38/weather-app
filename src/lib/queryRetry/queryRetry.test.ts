import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';

import { ApiRequestError, NetworkRequestError } from '@/api';

import { shouldRetryQuery } from '../queryRetry/';

describe('shouldRetryQuery', () => {
  it('does not retry permanent client errors', () => {
    expect(shouldRetryQuery(0, new ApiRequestError('Forecast', 401))).toBe(
      false,
    );
  });

  it('retries transient server errors only up to the configured limit', () => {
    const error = new ApiRequestError('Forecast', 500);

    expect(shouldRetryQuery(0, error)).toBe(true);
    expect(shouldRetryQuery(1, error)).toBe(true);
    expect(shouldRetryQuery(2, error)).toBe(false);
  });

  it('does not retry invalid response data', () => {
    expect(shouldRetryQuery(0, new ZodError([]))).toBe(false);
  });

  it('retries network errors only up to the configured limit', () => {
    const error = new NetworkRequestError('Forecast');

    expect(shouldRetryQuery(0, error)).toBe(true);
    expect(shouldRetryQuery(2, error)).toBe(false);
  });

  it('does not retry unknown programming errors', () => {
    expect(shouldRetryQuery(0, new Error('Unexpected state'))).toBe(false);
    expect(shouldRetryQuery(0, new TypeError('Invalid property access'))).toBe(
      false,
    );
    expect(shouldRetryQuery(0, new SyntaxError('Invalid JSON'))).toBe(false);
  });
});
