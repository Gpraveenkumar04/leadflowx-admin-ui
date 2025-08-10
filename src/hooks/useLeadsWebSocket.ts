import { useEffect } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { io, Socket } from 'socket.io-client';

interface UseLeadsWebSocketOptions {
  queryClient: QueryClient;
  events?: string[]; // events which trigger invalidation
  url?: string;
}

export function useLeadsWebSocket({ queryClient, events = ['lead_updated','lead_created','lead_deleted','tag_updated'], url = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8080' }: UseLeadsWebSocketOptions) {
  useEffect(() => {
    let socket: Socket | null = null;
    try {
      socket = io(url, { transports: ['websocket'], reconnection: true, reconnectionAttempts: 5 });
      events.forEach(evt => {
        socket!.on(evt, () => queryClient.invalidateQueries({ queryKey: ['leads'] }));
      });
    } catch { /* ignore */ }
    return () => { if (socket) socket.disconnect(); };
  }, [queryClient, events, url]);
}
