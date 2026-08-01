import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ErrorBoundary from '@/components/ErrorBoundary';

function BrokenComponent() {
  throw new Error('Test render failure');
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders fallback UI when a child throws', () => {
    render(
      <MemoryRouter>
        <ErrorBoundary>
          <BrokenComponent />
        </ErrorBoundary>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: '發生錯誤' })).toBeInTheDocument();
    expect(screen.getByText('頁面載入時發生問題，請稍後再試。')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '返回首頁' })).toHaveAttribute('href', '/');
  });

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <p>正常內容</p>
      </ErrorBoundary>
    );

    expect(screen.getByText('正常內容')).toBeInTheDocument();
  });
});
