import { ApiResponse, CategoryRequest, CategoryResponse } from "@/types";
import instance from "./Axios-customize";

// Lấy danh sách tất cả danh mục
export const getAllCategories = async () => {
    return (await instance.get<ApiResponse<CategoryResponse[]>>('/api/categories')).data;
};

// Lấy danh mục theo ID
export const getCategoryById = async (id: number) => {
    return (await instance.get<ApiResponse<CategoryResponse>>(`/api/categories/${id}`)).data;
};

// Lấy danh mục theo Slug
export const getCategoryBySlug = async (slug: string) => {
    return (await instance.get<ApiResponse<CategoryResponse>>(`/api/categories/slug/${slug}`)).data;
};

// Tạo danh mục mới
export const createCategory = async (request: CategoryRequest) => {
    return (await instance.post<ApiResponse<CategoryResponse>>('/api/categories', request)).data;
};

// Cập nhật danh mục theo ID
export const updateCategory = async (id: number, request: CategoryRequest) => {
    return (await instance.put<ApiResponse<CategoryResponse>>(`/api/categories/${id}`, request)).data;
};

// Xóa danh mục theo ID
export const deleteCategory = async (id: number): Promise<void> => {
    await instance.delete<ApiResponse<void>>(`/api/categories/${id}`);
};

// Lấy cây danh mục sản phẩm
export const getProductCategoryTree = async () => {
    return (await instance.get<ApiResponse<CategoryResponse[]>>('/api/categories/product/tree')).data;
};

// Lấy cây danh mục tin tức & mẹo
export const getNewsTipsCategoryTree = async () => {
    return (await instance.get<ApiResponse<CategoryResponse[]>>('/api/categories/news-tips/tree')).data;
};
