import { ApiResponse, Page } from "@/types";
import { StaticPageResponse, StaticPageRequest } from "@/types/News";
import instance from "./Axios-customize";


// Lấy tất cả trang tĩnh với phân trang
export const getAllStaticPages = async (page = 0, size = 12) => {
  return (
    await instance.get<ApiResponse<Page<StaticPageResponse>>>('/api/pages', {
      params: { page, size },
    })
  ).data;
};

// Lấy trang tĩnh theo ID
export const getStaticPageById = async (id: number) => {
  return (
    await instance.get<ApiResponse<StaticPageResponse>>(`/api/pages/${id}`)
  ).data;
};

// Lấy trang tĩnh theo slug
export const getStaticPageBySlug = async (slug: string) => {
  const response = await instance.get<ApiResponse<StaticPageResponse>>(`/api/pages/slug`, { params: { slug } });
  return response.data;
};

// Tìm kiếm trang tĩnh với query và phân trang
export const searchStaticPages = async (
  query: string,
  page = 0,
  size = 12
) => {
  return (
    await instance.get<ApiResponse<Page<StaticPageResponse>>>('/api/pages/search', {
      params: { query, page, size },
    })
  ).data;
};

// Lấy trang About Us với phân trang
export const getAboutUsPages = async (page = 0, size = 12) => {
  return (
    await instance.get<ApiResponse<Page<StaticPageResponse>>>('/api/pages/about-us', {
      params: { page, size },
    })
  ).data;
};

// Lấy trang Policy với phân trang
export const getPolicyPages = async (page = 0, size = 12) => {
  return (
    await instance.get<ApiResponse<Page<StaticPageResponse>>>('/api/pages/policy', {
      params: { page, size },
    })
  ).data;
};

// Lấy trang Guide với phân trang
export const getGuidePages = async (page = 0, size = 12) => {
  return (
    await instance.get<ApiResponse<Page<StaticPageResponse>>>('/api/pages/guide', {
      params: { page, size },
    })
  ).data;
};

// Tạo trang tĩnh mới
export const createStaticPage = async (request: StaticPageRequest) => {
  return (
    await instance.post<ApiResponse<StaticPageResponse>>('/api/pages', request)
  ).data;
};

// Cập nhật trang tĩnh theo ID
export const updateStaticPage = async (
  id: number,
  request: StaticPageRequest
) => {
  return (
    await instance.put<ApiResponse<StaticPageResponse>>(`/api/pages/${id}`, request)
  ).data;
};

export const increaseStaticPageViews = async (slug: string) => {
    const response = await instance.post<ApiResponse<Number>>(
        `/api/pages/views/${slug}`, null);
    return response.data;
};

// Xóa trang tĩnh theo ID
export const deleteStaticPage = async (id: number): Promise<void> => {
  await instance.delete<ApiResponse<void>>(`/api/pages/${id}`);
};
