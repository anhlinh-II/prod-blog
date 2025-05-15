import { ApiResponse, ContactRequest, ContactResponse, Page } from "@/types";
import instance from "./Axios-customize";

// Lấy danh sách tất cả contact (phân trang)
export const getAllContacts = async (page: number = 0, size: number = 20) => {
    return (await instance.get<ApiResponse<Page<ContactResponse>>>(
        '/api/contacts',
        { params: { page, size } }
    )).data;
};

// Lấy contact theo ID
export const getContactById = async (id: number) => {
    return (await instance.get<ApiResponse<ContactResponse>>(`/api/contacts/${id}`)).data;
};

// Tạo contact mới
export const createContact = async (request: ContactRequest) => {
    return (await instance.post<ApiResponse<ContactResponse>>('/api/contacts', request)).data;
};

// Cập nhật contact theo ID
export const updateContact = async (id: number, request: ContactRequest) => {
    return (await instance.put<ApiResponse<ContactResponse>>(`/api/contacts/${id}`, request)).data;
};

// Xóa contact theo ID
export const deleteContact = async (id: number): Promise<void> => {
    await instance.delete<ApiResponse<void>>(`/api/contacts/${id}`);
};
