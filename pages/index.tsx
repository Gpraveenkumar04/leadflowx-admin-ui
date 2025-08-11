import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Add a slight delay before redirecting to dashboard
    // This gives time for any services to initialize
    const redirectTimer = setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
    
    return () => clearTimeout(redirectTimer);
  }, [router]);

  return (
    <div className="min-h-screen bg-[var(--color-bg-canvas)] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary-500)] mx-auto"></div>
        <p className="mt-4 text-[var(--color-text-muted)]">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
