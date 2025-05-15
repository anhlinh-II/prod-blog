import { ApiResponse, Page } from "@/types";
import { UserCreationRequest, UserResponse, UserUpdateRequest, UserShortResponse } from "@/types/User";
import instance from "./Axios-customize";

// Tạo user mới
export const createUser = async (request: UserCreationRequest) => {
  return (await instance.post<ApiResponse<UserResponse>>('/api/users', request)).data;
};

// Cập nhật user
export const updateUser = async (request: UserUpdateRequest) => {
  return (await instance.put<ApiResponse<UserResponse>>('/api/users/updateUser', request)).data;
};

// Vô hiệu hóa user theo ID
export const deactivateUserById = async (id: number): Promise<void> => {
  await instance.put<ApiResponse<void>>(`/api/users/${id}`);
};

// Xóa user theo ID
export const deleteUserById = async (id: number): Promise<void> => {
  await instance.delete<ApiResponse<void>>(`/api/users/${id}`);
};

// Lấy user theo ID
export const getUserById = async (id: number) => {
  return (await instance.get<ApiResponse<UserResponse>>(`/api/users/${id}`)).data;
};

// Lấy danh sách user phân trang
export const getAllUsers = async (page = 0, size = 20) => {
  return (await instance.get<ApiResponse<Page<UserShortResponse>>>('/api/users/all', {
    params: { page, size },
  })).data;
};

// Lấy danh sách user đã vô hiệu hóa phân trang
export const getAllDeactivatedUsers = async (page = 0, size = 20) => {
  return (await instance.get<ApiResponse<Page<UserShortResponse>>>('/api/users/all/deactivated', {
    params: { page, size },
  })).data;
};

// Tìm kiếm user theo tên (có kèm userId)
export const searchUsersByName = async (
  userId: number,
  name: string,
  pageNum = 0
) => {
  return (await instance.get<ApiResponse<Page<UserShortResponse>>>('/api/users/search/name', {
    params: { userId, name, pageNum },
  })).data;
};
