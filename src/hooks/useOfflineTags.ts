import { useCallback, useEffect, useState } from 'react';
import { Tag, Lead } from '@/types';
import { leadsAPI } from '@/services/api';
import { QueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

interface UseOfflineTagsArgs {
  queryClient: QueryClient;
  queryKey: any[];
}

export interface UseOfflineTagsReturn {
  tags: Tag[];
  addTag: (leadId: number, tagId: string) => Promise<void>;
  removeTag: (leadId: number, tagId: string) => Promise<void>;
  createTag: (name: string, color: string) => Promise<Tag>;
  syncPendingTags: () => Promise<{ synced: number; remaining: number }>;
}

const OFFLINE_TAGS_KEY = 'leadflowx_offline_tags_v1';

export function useOfflineTags({ queryClient, queryKey }: UseOfflineTagsArgs): UseOfflineTagsReturn {
  const [tags, setTags] = useState<Tag[]>([]);

  // initial load
  useEffect(() => {
    (async () => {
      try {
        const serverTags = await leadsAPI.getTags();
        setTags(prev => {
          const existingIds = new Set(prev.map(t => t.id));
          return [...prev.filter(t => t.pending), ...serverTags.filter(t => !existingIds.has(t.id))];
        });
      } catch {/* ignore */}
    })();
    try {
      const raw = localStorage.getItem(OFFLINE_TAGS_KEY);
      if (raw) {
        const stored: Tag[] = JSON.parse(raw);
        setTags(prev => {
          const existing = new Set(prev.map(t => t.id));
            return [...prev, ...stored.filter(t => !existing.has(t.id))];
        });
      }
    } catch {/* ignore */}
  }, []);

  const addTag = useCallback(async (leadId: number, tagId: string) => {
    const tagObj = tags.find(t => t.id === tagId);
    if (tagObj?.pending) return; // wait for sync
    await leadsAPI.addTag(leadId, tagId);
    queryClient.setQueryData(queryKey, (old: any) => {
      if (!old) return old;
      return {
        ...old,
        data: old.data.map((l: Lead) => l.id === leadId ? { ...l, tags: [...(l.tags || []), ...(tagObj ? [tagObj] : [])] } : l)
      };
    });
  }, [tags, queryClient, queryKey]);

  const removeTag = useCallback(async (leadId: number, tagId: string) => {
    try { await leadsAPI.removeTag(leadId, tagId); } catch { toast.error('Failed removing tag'); }
    queryClient.setQueryData(queryKey, (old: any) => {
      if (!old) return old;
      return {
        ...old,
        data: old.data.map((l: Lead) => l.id === leadId ? { ...l, tags: (l.tags || []).filter(t => t.id !== tagId) } : l)
      };
    });
  }, [queryClient, queryKey]);

  const createTag = useCallback(async (name: string, color: string) => {
    const tempId = `temp-${Date.now()}`;
    const localTag: Tag = { id: tempId, name, color, pending: true };
    setTags(prev => [...prev, localTag]);
    try {
      const existing: Tag[] = JSON.parse(localStorage.getItem(OFFLINE_TAGS_KEY) || '[]');
      localStorage.setItem(OFFLINE_TAGS_KEY, JSON.stringify([...existing, localTag]));
    } catch {/* ignore */}
    try {
      const tag = await leadsAPI.createTag(name, color);
      setTags(prev => prev.map(t => t.id === tempId ? tag : t));
      try {
        const existing: Tag[] = JSON.parse(localStorage.getItem(OFFLINE_TAGS_KEY) || '[]');
        localStorage.setItem(OFFLINE_TAGS_KEY, JSON.stringify(existing.filter(t => t.id !== tempId)));
      } catch {/* ignore */}
      toast.success('Tag created');
      return tag;
    } catch {
      toast.error('Tag queued (offline)');
      return localTag;
    }
  }, []);

  // backoff sync
  useEffect(() => {
    let backoff = 4000;
    let cancelled = false;
    const attempt = async () => {
      if (cancelled) return;
      const pending = tags.filter(t => t.pending);
      if (!pending.length) { backoff = 4000; }
      else {
        for (const p of pending) {
          try {
            const real = await leadsAPI.createTag(p.name, p.color);
            setTags(prev => prev.map(t => t.id === p.id ? real : t));
            const existing: Tag[] = JSON.parse(localStorage.getItem(OFFLINE_TAGS_KEY) || '[]');
            localStorage.setItem(OFFLINE_TAGS_KEY, JSON.stringify(existing.filter(t => t.id !== p.id)));
            toast.success(`Synced tag ${p.name}`);
          } catch {/* keep pending */}
        }
        backoff = Math.min(backoff * 1.5, 60_000);
      }
      setTimeout(attempt, backoff);
    };
    const id = setTimeout(attempt, backoff);
    window.addEventListener('focus', attempt);
    return () => { cancelled = true; clearTimeout(id); window.removeEventListener('focus', attempt); };
  }, [tags]);

  const syncPendingTags = useCallback(async () => {
    const pending = tags.filter(t => t.pending);
    let success = 0;
    for (const p of pending) {
      try {
        const real = await leadsAPI.createTag(p.name, p.color);
        setTags(prev => prev.map(t => t.id === p.id ? real : t));
        const existing: Tag[] = JSON.parse(localStorage.getItem(OFFLINE_TAGS_KEY) || '[]');
        localStorage.setItem(OFFLINE_TAGS_KEY, JSON.stringify(existing.filter(t => t.id !== p.id)));
        success++;
      } catch {/* keep pending */}
    }
    if (success) toast.success(`Synced ${success} tag(s)`); else toast('No tags synced');
    return { synced: success, remaining: pending.length - success };
  }, [tags]);

  return { tags, addTag, removeTag, createTag, syncPendingTags };
}
