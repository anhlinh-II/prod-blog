'use client';

import { AppProvider } from '@/utils/AppContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      {children}
    </AppProvider>
  );
}
