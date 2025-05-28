// hooks/useProductCategories.ts
import { useQuery } from '@tanstack/react-query';
import { CategoryResponse } from '@/types';
import { getProductCategoryTree } from '@/services/CategoryService';
import { getBannerImages } from '@/services/MediaService';
import { getOldNews } from '@/services/NewsService';
import { getSortedProducts, getAllProducts } from '@/services/ProductService';

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

export const useBanners = () => {
	return useQuery({
		queryKey: ['banners'],
		queryFn: getBannerImages,
    staleTime: 1000 * 60 * 15,
		gcTime: 1000 * 60 * 20,
	});
};


export const usePopularProducts = (size: number) =>
	useQuery({
		queryKey: ['products', 'popular', size],
		queryFn: async () => {
			const res = await getSortedProducts('popularity', 0, size);
			return shuffleArray(res.result.content);
		},
		enabled: size > 0,
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
	});

export const useNewProducts = (size: number) =>
	useQuery({
		queryKey: ['products', 'new', size],
		queryFn: async () => {
			const res = await getSortedProducts('latest', 0, size);
			return shuffleArray(res.result.content);
		},
		enabled: size > 0,
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
	});

export const useSaleProducts = (size: number) =>
	useQuery({
		queryKey: ['products', 'sale', size],
		queryFn: async () => {
			const res = await getSortedProducts('sale', 0, size);
			return shuffleArray(res.result.content);
		},
		enabled: size > 0,
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
	});

export const useOtherProducts = (size: number) =>
	useQuery({
		queryKey: ['products', 'others', size],
		queryFn: async () => {
			const res = await getAllProducts(0, size);
			return shuffleArray(res.result.content);
		},
		enabled: size > 0,
		staleTime: 15 * 60 * 1000,
		gcTime: 20 * 60 * 1000,
	});

export const useOldNews = () => {
	return useQuery({
		queryKey: ['oldNews'],
		queryFn: () => getOldNews(12),
	});
};



function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}