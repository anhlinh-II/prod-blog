import type { ApiResponse, Page } from "@/types";
import instance from "./Axios-customize";
import { NewsRequest, NewsResponse } from "@/types/News";

export const getAllNews = async (page = 0, size = 20) => {
    const response = await instance.get<ApiResponse<Page<NewsResponse>>>(
        `/api/news`,
        { params: { page, size } }
    );
    return response.data;
};

export const getAllDeletedNews = async (page = 0, size = 20) => {
    const response = await instance.get<ApiResponse<Page<NewsResponse>>>(
        `/api/news/deleted`,
        { params: { page, size } }
    );
    return response.data;
};

export const getNewsByType = async (type: string, page = 0, size = 12) => {
    const response = await instance.get<ApiResponse<Page<NewsResponse>>>(
        `/api/news/type`,
        { params: { type, page, size } }
    );
    return response.data;
};

export const getNewsByCategory = async (categorySlug: string, page = 0, size = 12) => {
    const response = await instance.get<ApiResponse<Page<NewsResponse>>>(
        `/api/news/category`,
        { params: { categorySlug, page, size } }
    );
    return response.data;
};

export const getNewsById = async (id: number) => {
    const response = await instance.get<ApiResponse<NewsResponse>>(`/api/news/${id}`);
    return response.data;
};

export const createNews = async (request: NewsRequest) => {
    const response = await instance.post<ApiResponse<NewsResponse>>(`/api/news`, request);
    return response.data;
};

export const updateNews = async (id: number, request: NewsRequest) => {
    const response = await instance.put<ApiResponse<NewsResponse>>(`/api/news/${id}`, request);
    return response.data;
};

export const increaseNewsViews = async (id: number) => {
    const response = await instance.put<ApiResponse<NewsResponse>>(
        `/api/news/views/increase`,
        null,
        { params: { id } }
    );
    return response.data;
};

export const deleteNews = async (id: number) => {
    const response = await instance.delete<ApiResponse<void>>(`/api/news/${id}`);
    return response.data;
};
