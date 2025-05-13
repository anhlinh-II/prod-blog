import { ApiResponse, Page } from "@/types";
import instance from "./Axios-customize";
import { ProductShortResponse, ProductResponse, ProductRequest } from "@/types/Product";


export const getAllProducts = async (page = 0, size = 12) => {
    return (await instance.get<ApiResponse<Page<ProductShortResponse>>>(
        `/api/products`,
        { params: { page, size } }
    )).data;
};

export const getSortedProducts = async (sortOption: string, categorySlug: string, page = 0, size = 12) => {
    return (await instance.get<ApiResponse<Page<ProductShortResponse>>>(
        `/api/products/sorted`,
        { params: { sortOption, categorySlug, page, size } }
    )).data;
};

export const getProductsWithMultiSort = async (sortOption: string[], categorySlug: string, page = 0, size = 12) => {
    return (await instance.get<ApiResponse<Page<ProductShortResponse>>>(
        `/api/products/multi-sort`,
        { params: { sortOption, categorySlug, page, size } }
    )).data;
};

export const getProductsByBrand = async (brandName: string, page = 0, size = 12) => {
    return (await instance.get<ApiResponse<Page<ProductShortResponse>>>(
        `/api/products/brand`,
        { params: { brandName, page, size } }
    )).data;
};

export const getProductsByCategory = async (categoryName: string, page = 0, size = 12) => {
    return (await instance.get<ApiResponse<Page<ProductShortResponse>>>(
        `/api/products/category`,
        { params: { categoryName, page, size } }
    )).data;
};

export const searchProductsWithKeyword = async (keyword: string, page = 0, size = 12) => {
    return (await instance.get<ApiResponse<Page<ProductShortResponse>>>(
        `/api/products/search`,
        { params: { keyword, page, size } }
    )).data;
};

export const findSimilarProducts = async (productId: number) => {
    return (await instance.get<ApiResponse<ProductShortResponse[]>>(
        `/api/products/similar`,
        { params: { productId } }
    )).data;
};

export const getProductById = async (id: number) => {
    return (await instance.get<ApiResponse<ProductResponse>>(
        `/api/products/id`,
        { params: { id } }
    )).data;
};

export const getAllDeletedProducts = async (page = 0, size = 12) => {
    return (await instance.get<ApiResponse<Page<ProductShortResponse>>>(
        `/api/products/deleted`,
        { params: { page, size } }
    )).data;
};

export const getAllDeactivatedProducts = async (page = 0, size = 12) => {
    return (await instance.get<ApiResponse<Page<ProductShortResponse>>>(
        `/api/products/deactivated`,
        { params: { page, size } }
    )).data;
};

export const createProduct = async (request: ProductRequest) => {
    return (await instance.post<ApiResponse<ProductResponse>>(
        `/api/products`,
        request
    )).data;
};

export const updateProduct = async (request: ProductRequest) => {
    return (await instance.put<ApiResponse<ProductResponse>>(
        `/api/products`,
        request
    )).data;
};

export const deactivateProduct = async (id: number) => {
    return (await instance.put<ApiResponse<void>>(
        `/api/products/deactivate`,
        null,
        { params: { id } }
    )).data;
};

export const deleteProduct = async (id: number): Promise<void> => {
    await instance.delete<ApiResponse<void>>(`/api/products/${id}`);
};
