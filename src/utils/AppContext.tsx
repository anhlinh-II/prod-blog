'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchCategories } from '@/services/index';
import { CategoryResponse } from '@/types/index';

type AppContextType = {
  categories: CategoryResponse[];
  setCategories: React.Dispatch<React.SetStateAction<CategoryResponse[]>>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  useEffect(() => {
    const cached = localStorage.getItem('categories');
    if (cached) {
      setCategories(JSON.parse(cached));
    }

    const fetchData = async () => {
      try {
        const response = await fetchCategories();
        if (response) {
          setCategories(response);
          localStorage.setItem('categories', JSON.stringify(response));
          localStorage.setItem('categories_updated_at', Date.now().toString());
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    if (!cached) fetchData();
    const lastUpdated = localStorage.getItem('categories_updated_at');
    const expired = !lastUpdated || (Date.now() - parseInt(lastUpdated)) > 300_000; // quá 5 phút

    if (expired) fetchData();

  }, []);

  return (
    <AppContext.Provider value={{ categories, setCategories }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
