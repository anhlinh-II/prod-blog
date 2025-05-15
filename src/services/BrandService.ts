import { ApiResponse, BrandRequest, BrandResponse } from "@/types";
import instance from "./Axios-customize";

// Lấy danh sách tất cả thương hiệu
export const getAllBrands = async () => {
    return (await instance.get<ApiResponse<BrandResponse[]>>('/api/brands')).data;
};

// Lấy thương hiệu theo ID
export const getBrandById = async (id: number) => {
    return (await instance.get<ApiResponse<BrandResponse>>(`/api/brands/${id}`)).data;
};

// Tạo thương hiệu mới
export const createBrand = async (request: BrandRequest) => {
    return (await instance.post<ApiResponse<BrandResponse>>('/api/brands', request)).data;
};

// Cập nhật thương hiệu theo ID
export const updateBrand = async (id: number, request: BrandRequest) => {
    return (await instance.put<ApiResponse<BrandResponse>>(`/api/brands/${id}`, request)).data;
};

// Xóa thương hiệu theo ID
export const deleteBrand = async (id: number): Promise<void> => {
    await instance.delete<ApiResponse<void>>(`/api/brands/${id}`);
};
