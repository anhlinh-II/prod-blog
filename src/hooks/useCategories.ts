// hooks/useProductCategories.ts
import { useQuery } from '@tanstack/react-query';
import { CategoryResponse } from '@/types';
import { getProductCategoryTree } from '@/services/CategoryService';

export const useProductCategories = () => {
  return useQuery<CategoryResponse[]>({
    queryKey: ['product-categories'],
    queryFn: async () => {
      const res = await getProductCategoryTree();
      return res.result;
    },
    staleTime: 5 * 60 * 1000, // 5 phút
    gcTime: 10 * 60 * 1000,
  });
};
