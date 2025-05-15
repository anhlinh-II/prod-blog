import { ApiResponse, MediaResponse } from "@/types";
import instance from "./Axios-customize";


export const uploadProductImages = async (productId: number, files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append("files", file));

    const response = await instance.post<ApiResponse<MediaResponse[]>>(
        `/api/medias/product/${productId}/images`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data;
};

export const uploadNewsImages = async (newsId: number, files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append("files", file));

    const response = await instance.post<ApiResponse<MediaResponse[]>>(
        `/api/medias/news/${newsId}/images`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data;
};

export const uploadPageContentImages = async (pageId: number, files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append("files", file));

    const response = await instance.post<ApiResponse<MediaResponse[]>>(
        `/api/medias/page/${pageId}/images`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data;
};
