import { ApiResponse, Page } from "@/types";
import { OrderRequest, OrderShortResponse, OrderStatus, OrderResponse, OrderSearchRequest } from "@/types/Order";
import instance from "./Axios-customize";


// Đặt đơn hàng mới
export const placeOrder = async (request: OrderRequest) => {
  return (
    await instance.post<ApiResponse<number>>('/api/orders', request)
  ).data;
};

// Lấy tất cả đơn hàng có phân trang
export const getAllOrders = async (page = 0, size = 12) => {
  return (
    await instance.get<ApiResponse<Page<OrderShortResponse>>>('/api/orders', {
      params: { page, size },
    })
  ).data;
};

// Lấy tất cả đơn hàng đã xóa
export const getAllDeletedOrders = async (page = 0, size = 12) => {
  return (
    await instance.get<ApiResponse<Page<OrderShortResponse>>>(
      '/api/orders/deleted',
      { params: { page, size } }
    )
  ).data;
};

// Lấy đơn hàng theo bộ lọc
export const getOrdersWithFilter = async (
  status?: OrderStatus,
  fromDate?: string, // ISO date string yyyy-mm-dd
  toDate?: string,
  minTotal?: number,
  maxTotal?: number,
  sortBy = 'createdAt',
  sortDirection = 'asc',
  page = 0,
  size = 12
) => {
  return (
    await instance.get<ApiResponse<Page<OrderShortResponse>>>(
      '/api/orders/filter',
      {
        params: {
          status,
          fromDate,
          toDate,
          minTotal,
          maxTotal,
          sortBy,
          sortDirection,
          page,
          size,
        },
      }
    )
  ).data;
};

// Lấy đơn hàng theo ID
export const getOrderById = async (id: number) => {
  return (
    await instance.get<ApiResponse<OrderResponse>>(`/api/orders/${id}`)
  ).data;
};

// Lấy đơn hàng theo userId có phân trang
export const findByUserIdSorted = async (
  userId: number,
  page = 0,
  size = 12
) => {
  return (
    await instance.get<ApiResponse<Page<OrderShortResponse>>>('/api/orders/user', {
      params: { userId, page, size },
    })
  ).data;
};

// Tìm kiếm đơn hàng với request và phân trang
export const searchOrders = async (
  request: OrderSearchRequest,
  page = 0,
  size = 12
) => {
  return (
    await instance.post<ApiResponse<Page<OrderShortResponse>>>(
      '/api/orders/search',
      request,
      { params: { page, size } }
    )
  ).data;
};

// Xóa đơn hàng theo ID
export const deleteOrder = async (id: number): Promise<void> => {
  await instance.delete<ApiResponse<void>>(`/api/orders/${id}`);
};

// Cập nhật trạng thái đơn hàng
export const updateStatus = async (id: number, status: string): Promise<void> => {
  await instance.put<ApiResponse<void>>(`/api/orders/${id}`, null, {
    params: { status },
  });
};
