import { ApiResponse, CategoryResponse } from "@/types";

// For React Query: fetchCategories should be a pure fetcher (no localStorage, no side effects)
export const fetchCategories = async (): Promise<CategoryResponse[]> => {
     const response = await fetch('http://localhost:8080/api/categories/product/tree');
     if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
     }
     const data: ApiResponse<CategoryResponse[]> = await response.json();
     return data.result;
};