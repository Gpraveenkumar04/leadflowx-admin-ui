import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { ThemeProvider, useTheme } from '@/design-system/ThemeProvider';
import { AuthProvider } from '../context/AuthContext';
import ThemedToaster from '@/components/ThemedToaster';
import { ConfigProvider, theme as antdTheme, ThemeConfig } from 'antd';
import 'antd/dist/reset.css';
import '../src/styles/globals.css';

function AntdThemeBridge({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const config = useMemo<ThemeConfig>(() => ({
    algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: '#6366f1',
      borderRadius: 8,
    },
  }), [theme]);
  return <ConfigProvider theme={config}>{children}</ConfigProvider>;
}

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
      },
    },
  }));
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AntdThemeBridge>
          <AuthProvider>
            <Component {...pageProps} />
            <ThemedToaster />
          </AuthProvider>
        </AntdThemeBridge>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
