import { useCallback, useState } from 'react';
import { SavedView, LeadFilters, TableSort } from '@/types';
import { leadsAPI } from '@/services/api';
import toast from 'react-hot-toast';

export function useSavedViews(initial: SavedView[] = [], deps: { filters: LeadFilters; sort: TableSort }) {
  const [savedViews, setSavedViews] = useState<SavedView[]>(initial);
  const [activeViewId, setActiveViewId] = useState<string | null>(null);
  const { filters, sort } = deps;

  const saveView = useCallback(async (name: string) => {
    if (!name.trim()) return null;
    try {
      const view = await leadsAPI.createSavedView(name.trim(), filters, sort);
      setSavedViews(prev => [...prev, view]);
      setActiveViewId(view.id);
      toast.success('View saved');
      return view;
    } catch {
      toast.error('Failed to save view');
      return null;
    }
  }, [filters, sort]);

  const deleteView = useCallback(async (id: string) => {
    try { await leadsAPI.deleteSavedView(id); toast.success('View deleted'); } catch { toast.error('Delete view failed'); }
    setSavedViews(prev => prev.filter(v => v.id !== id));
    setActiveViewId(v => v === id ? null : v);
  }, []);

  const applyView = useCallback((id: string, setters: { setFilters: (f: LeadFilters) => void; setSort: (s: TableSort) => void; resetPage?: () => void; }) => {
    if (!id) { setActiveViewId(null); return; }
    const view = savedViews.find(v => v.id === id);
    if (!view) return;
    setters.setFilters(view.filters);
    setters.setSort(view.sort);
    setters.resetPage?.();
    setActiveViewId(id);
  }, [savedViews]);

  return { savedViews, activeViewId, saveView, deleteView, applyView, setSavedViews };
}
