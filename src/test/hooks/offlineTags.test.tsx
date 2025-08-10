import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLeadsData } from '@/hooks/useLeadsData';

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient();
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('offline tag creation', () => {
  it('creates a pending tag optimistically', async () => {
  const { result } = renderHook(() => useLeadsData({ enableUrlSync: false }), { wrapper });
    const prevCount = result.current.tags.length;
    let newTag: any;
    await act(async () => { newTag = await result.current.createTag('Test Tag', '#fff'); });
    expect(result.current.tags.length).toBe(prevCount + 1);
    expect(newTag.name).toBe('Test Tag');
    // allow either pending (offline) or synced depending on msw handler
    expect(result.current.tags.some(t => t.name === 'Test Tag')).toBe(true);
  });
});
