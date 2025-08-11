import { Toaster } from 'react-hot-toast';
import { useTheme } from '@/design-system/ThemeProvider';

const ThemedToaster = () => {
  const { theme } = useTheme();

  const toastStyle = {
    background: theme === 'dark' ? 'var(--color-bg-subtle)' : 'var(--color-bg-subtle)',
    color: 'var(--color-text)',
    border: `1px solid var(--color-border)`,
    boxShadow: 'var(--shadow-lg)',
    borderRadius: 'var(--rounded-lg)',
    padding: 'var(--space-4)',
  };

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: toastStyle,
      }}
    />
  );
};

export default ThemedToaster;
