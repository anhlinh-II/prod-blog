import { ApiResponse, MediaResponse } from "@/types";
import instance from "./Axios-customize";


export const uploadBannerImages = async (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append("files", file));

    const response = await instance.post<ApiResponse<MediaResponse[]>>(
        `/api/medias/images/banner`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data;
};

export const uploadProductImages = async (productId: number, files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append("files", file));

    const response = await instance.post<ApiResponse<MediaResponse[]>>(
        `/api/medias/images/product/${productId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data;
};

export const uploadNewsImages = async (newsId: number, files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append("files", file));

    const response = await instance.post<ApiResponse<MediaResponse[]>>(
        `/api/medias/images/news/${newsId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data;
};

export const uploadPageContentImages = async (pageId: number, files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append("files", file));

    const response = await instance.post<ApiResponse<MediaResponse[]>>(
        `/api/medias/images/page/${pageId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data;
};


export const getBannerImages = async () => {
    const response = await instance.get<ApiResponse<MediaResponse[]>>(
        `/api/medias/images/banner`,
        { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data;
};

export const deleteImage = async (mediaId: number) => {
    return (await instance.delete<ApiResponse<void>>(
        `/api/medias/delete/one`,
        { params: { mediaId } }
    )).data;
};

