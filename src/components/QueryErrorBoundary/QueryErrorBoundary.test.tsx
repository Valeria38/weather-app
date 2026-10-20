import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import QueryErrorBoundary from './';

function RequestResult({ shouldFail }: { shouldFail: boolean }) {
  if (shouldFail) {
    throw new Error('Request failed');
  }
  return <p>Weather loaded</p>;
}

function RetryableContent({ onReset }: { onReset: () => void }) {
  const [shouldFail, setShouldFail] = useState(true);

  return (
    <QueryErrorBoundary
      onReset={() => {
        onReset();
        setShouldFail(false);
      }}
      resource="weather data"
    >
      <RequestResult shouldFail={shouldFail} />
    </QueryErrorBoundary>
  );
}

describe('QueryErrorBoundary', () => {
  it('shows a retry action and renders content after retry', () => {
    const onReset = vi.fn();

    render(
      <QueryErrorResetBoundary>
        <RetryableContent onReset={onReset} />
      </QueryErrorResetBoundary>,
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Could not load weather data',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));

    expect(onReset).toHaveBeenCalledOnce();
    expect(screen.getByText('Weather loaded')).toBeInTheDocument();
  });
});
