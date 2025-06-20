'use client';

import { AppProvider } from '@/utils/AppContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  
  return (
    <QueryClientProvider client={queryClient}>
    <AppProvider>
      {children}
    </AppProvider>
    </QueryClientProvider>
  );
}
