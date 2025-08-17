import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { leadsAPI } from '@/services/api';
import { Lead, LeadFilters, TableSort, Tag, SavedView } from '@/types';
import { useOfflineTags } from '@/hooks/useOfflineTags';
import { useSavedViews } from '@/hooks/useSavedViews';
import { useLeadsWebSocket } from '@/hooks/useLeadsWebSocket';

export interface UseLeadsOptions {
  initialPage?: number;
  pageSize?: number;
  initialFilters?: LeadFilters;
  initialSort?: TableSort;
  enableUrlSync?: boolean;
  debounceMs?: number;
}

interface PaginationState { page: number; pageSize: number; total: number; totalPages: number; }

interface UseLeadsReturn {
  leads: Lead[];
  loading: boolean; // deprecated (kept for compatibility)
  isInitialLoading: boolean;
  isLoadingPage: boolean;
  error: unknown;
  pagination: PaginationState;
  filters: LeadFilters;
  sort: TableSort;
  setFilters: (f: LeadFilters | ((prev: LeadFilters) => LeadFilters)) => void;
  setSort: (s: TableSort) => void;
  setPage: (p: number) => void;
  refresh: () => void;
  updateLeadOptimistic: (id: number, data: Partial<Lead>) => Promise<void>;
  bulkApprove: (ids: number[]) => Promise<void>;
  bulkReject: (ids: number[], reason?: string) => Promise<void>;
  // Tag management
  tags: Tag[];
  addTag: (leadId: number, tagId: string) => Promise<void>;
  removeTag: (leadId: number, tagId: string) => Promise<void>;
  createTag: (name: string, color: string) => Promise<Tag>;
  syncPendingTags: () => Promise<{ synced: number; remaining: number }>; // manual trigger
  // Saved views
  savedViews: SavedView[];
  saveView: (name: string) => Promise<SavedView | null>;
  deleteView: (id: string) => Promise<void>;
  applyView: (id: string) => void;
  activeViewId: string | null;
}

const buildQueryKey = (page: number, pageSize: number, filters: LeadFilters, sort: TableSort) => [
  'leads',
  { page, pageSize, filters, sort }
];

export function useLeadsData(opts: UseLeadsOptions = {}): UseLeadsReturn {
  const {
    initialPage = 1,
    pageSize = 25,
    initialFilters = {},
    initialSort = { field: 'createdAt', direction: 'desc' },
    enableUrlSync = true,
    debounceMs = 300
  } = opts;
  const router = useRouter();
  const queryClient = useQueryClient();

  const urlHydrated = useRef(false);
  const [filters, setFiltersState] = useState<LeadFilters>(initialFilters);
  const [sort, setSort] = useState<TableSort>(initialSort);
  const [page, setPageState] = useState(initialPage);
  const [pagination, setPagination] = useState<PaginationState>({ page: initialPage, pageSize, total: 0, totalPages: 0 });

  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  // Saved views handled by composable
  const [initialSavedViewsLoaded, setInitialSavedViewsLoaded] = useState(false);
  const { savedViews, activeViewId, saveView, deleteView, applyView, setSavedViews } = useSavedViews([], { filters, sort });
  useEffect(() => {
    const handle = setTimeout(() => setDebouncedFilters(filters), debounceMs);
    return () => clearTimeout(handle);
  }, [filters, debounceMs]);

  useEffect(() => {
    if (!enableUrlSync) return;
    if (!urlHydrated.current) {
      const q = router.query;
      const parsed: LeadFilters = { ...initialFilters };
      if (q.search && typeof q.search === 'string') parsed.search = q.search;
      if (q.source) parsed.source = Array.isArray(q.source) ? q.source as string[] : [q.source as string];
      if (q.qaStatus) parsed.qaStatus = Array.isArray(q.qaStatus) ? q.qaStatus as any : [q.qaStatus as any];
      if (q.tags) parsed.tags = Array.isArray(q.tags) ? q.tags as string[] : [q.tags as string];
      if (q.dateFrom && typeof q.dateFrom === 'string') parsed.dateFrom = q.dateFrom;
      if (q.dateTo && typeof q.dateTo === 'string') parsed.dateTo = q.dateTo;
      const qp = q.page ? parseInt(q.page as string, 10) : initialPage;
      const sortField = typeof q.sortField === 'string' ? q.sortField : initialSort.field;
      const sortDirection = typeof q.sortDirection === 'string' ? q.sortDirection : initialSort.direction;
      setFiltersState(parsed);
      setPageState(qp);
      setSort({ field: sortField as any, direction: sortDirection as any });
      urlHydrated.current = true;
      return;
    }
    const nextQuery: Record<string, any> = {
      ...router.query,
      page,
      sortField: sort.field,
      sortDirection: sort.direction
    };
    Object.entries(filters).forEach(([k, v]) => {
      if (v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0)) {
        delete nextQuery[k];
      } else {
        nextQuery[k] = v;
      }
    });
    router.replace({ pathname: router.pathname, query: nextQuery }, undefined, { shallow: true });
  }, [enableUrlSync, filters, sort, page, router, initialFilters, initialPage, initialSort]);

  const setFilters = useCallback((f: LeadFilters | ((prev: LeadFilters) => LeadFilters)) => {
    setPageState(1);
    setFiltersState(prev => typeof f === 'function' ? (f as any)(prev) : f);
  }, []);

  const setPage = useCallback((p: number) => setPageState(p), []);

  const queryKey = useMemo(() => buildQueryKey(page, pageSize, debouncedFilters, sort), [page, pageSize, debouncedFilters, sort]);

  const abortRef = useRef<AbortController | null>(null);
  const { data, isFetching, error, refetch, isPending, isRefetching } = useQuery({
    queryKey,
    queryFn: async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        return await leadsAPI.getLeads(page, pageSize, debouncedFilters, sort, controller.signal);
      } catch (e: any) {
        if (e.name === 'CanceledError' || e.name === 'AbortError') {
          // silent for cancellations
          return Promise.reject(e);
        }
        if (e.response?.status === 500) {
          toast.error('Server error occurred. Please try again later or contact support if the issue persists.');
        } else if (e.response?.status === 400) {
          toast.error('Invalid request. Please check your sorting and filtering options.');
        } else if (e.code === 'ECONNABORTED') {
          toast.error('Request timed out. Please check your connection and try again.');
        } else {
          toast.error('Failed to load leads. Please try again.');
        }
        throw e;
      }
    },
    placeholderData: (prev) => prev,
    staleTime: 15_000,
    gcTime: 5 * 60_000,
    retry: (failureCount, err: any) => {
      if (err?.response?.status === 404) return false;
      if (err?.response?.status === 400) return false; // Don't retry invalid requests
      if (err?.response?.status === 500) return failureCount < 1; // Only retry server errors once
      return failureCount < 2; // gentle retry for other errors
    }
  });

  // Load initial saved views (tags loaded via useOfflineTags internally)
  useEffect(() => {
    if (initialSavedViewsLoaded) return;
    (async () => {
      try {
        const views = await leadsAPI.getSavedViews();
        setSavedViews(views);
      } catch { /* ignore */ }
      setInitialSavedViewsLoaded(true);
    })();
  }, [initialSavedViewsLoaded, setSavedViews]);

  useEffect(() => {
    if (data && (data as any).pagination) {
      setPagination(prev => ({ ...prev, ...(data as any).pagination }));
    }
  }, [data]);

  const updateLeadOptimistic = useCallback(async (id: number, changes: Partial<Lead>) => {
    const key = queryKey;
    await queryClient.cancelQueries({ queryKey: key });
    const previous = queryClient.getQueryData<any>(key);
    if (previous) {
      queryClient.setQueryData(key, (old: any) => ({
        ...old,
        data: old.data?.map((l: Lead) => l.id === id ? { ...l, ...changes } : l)
      }));
    }
    try {
      await leadsAPI.updateLead(id, changes);
    } catch (e) {
      if (previous) queryClient.setQueryData(key, previous);
      toast.error('Failed to update lead');
      throw e;
    } finally {
      queryClient.invalidateQueries({ queryKey: key });
    }
  }, [queryClient, queryKey]);

  const bulkApprove = useCallback(async (ids: number[]) => {
    try {
      await leadsAPI.bulkApprove(ids);
      toast.success(`Approved ${ids.length} leads`);
    } catch {
      toast.error('Bulk approve failed');
    } finally {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    }
  }, [queryClient]);

  const bulkReject = useCallback(async (ids: number[], reason?: string) => {
    try {
      await leadsAPI.bulkReject(ids, reason);
      toast.success(`Rejected ${ids.length} leads`);
    } catch {
      toast.error('Bulk reject failed');
    } finally {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    }
  }, [queryClient]);

  // Integrate composable offline tags (after queryKey ready)
  const { tags, addTag, removeTag, createTag, syncPendingTags } = useOfflineTags({ queryClient, queryKey });

  // WebSocket invalidation hookup (passively listens)
  useLeadsWebSocket({ queryClient });

  // Bridge applyView to internal setters & page reset
  const applyViewWrapped = useCallback((id: string) => {
    applyView(id, {
      setFilters: (f) => setFilters(f),
      setSort: (s) => { setSort(s); setPageState(1); },
      resetPage: () => setPageState(1)
    });
  }, [applyView, setFilters]);

  const isInitialLoading = !data && isFetching;
  const isLoadingPage = !!data && isFetching;

  return {
    leads: data?.data || [],
    loading: isFetching && !data, // legacy
    isInitialLoading,
    isLoadingPage,
    error,
    pagination,
    filters,
    sort,
    setFilters,
    setSort: (s: TableSort) => { setSort(s); setPageState(1); },
    setPage,
    refresh: () => refetch(),
    updateLeadOptimistic,
    bulkApprove,
    bulkReject,
    tags,
    addTag,
    removeTag,
    createTag,
    savedViews,
    saveView,
    deleteView,
  applyView: applyViewWrapped,
    activeViewId,
    syncPendingTags
  };
}
