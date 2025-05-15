import { ApiResponse, CategoryResponse } from "@/types";

export const fetchCategories = async () => {
     try {
          const response = await fetch('http://localhost:8080/api/categories/product/tree');
          if (!response.ok) {
               throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data: ApiResponse<CategoryResponse[]> = await response.json();
          console.log('Fetched categories:', data.result);
          return data.result;

     } catch (error) {
          console.error('Error fetching categories:', error);
     }
};