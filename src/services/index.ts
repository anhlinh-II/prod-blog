import { ApiResponse, CategoryResponse } from "@/types";
import instance from "./Axios-customize";

// For React Query: fetchCategories should be a pure fetcher (no localStorage, no side effects)
export const fetchCategories = async (): Promise<CategoryResponse[]> => {
     const response = await fetch('http://localhost:8080/api/categories/product/tree');
     if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
     }
     const data: ApiResponse<CategoryResponse[]> = await response.json();
     return data.result;
};

export interface DashboardResponse {
     totalProducts: number;
     totalOrders: number;
     totalContacts: number;
     totalNews: number;
     totalViews: number;
     ordersByWeek: Record<string, number>;
     contactsByWeek: Record<string, number>;
     newsByWeek: Record<string, number>;
}

export const getDashboard = async (): Promise<DashboardResponse> => {
    const response = await instance.get<ApiResponse<DashboardResponse>>('/api/dashboard');
    return response.data.result;
};