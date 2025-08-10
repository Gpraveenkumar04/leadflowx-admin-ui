import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLeadsData } from '@/hooks/useLeadsData';

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient();
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('useLeadsData', () => {
  it('fetches first page of leads', async () => {
  const { result } = renderHook(() => useLeadsData({ pageSize: 5, enableUrlSync: false, debounceMs: 0 }), { wrapper });
  await waitFor(() => expect(result.current.leads.length).toBeGreaterThan(0));
    expect(result.current.pagination.page).toBe(1);
  expect(result.current.leads.length).toBeGreaterThan(0);
  });

  it('advances page', async () => {
  const { result } = renderHook(() => useLeadsData({ pageSize: 5, enableUrlSync: false, debounceMs: 0 }), { wrapper });
  await waitFor(() => expect(result.current.leads.length).toBeGreaterThan(0));
  act(() => { result.current.setPage(2); });
  await waitFor(() => result.current.pagination.page === 2);
    expect(result.current.leads.length).toBe(5);
  });
});
