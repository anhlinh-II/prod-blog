
export enum OrderStatus {
    NEW = 'NEW', 
    PROCESSING = 'PROCESSING', 
    COMPLETED = 'COMPLETED', 
    CANCELLED = 'CANCELLED'
}

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}


export interface OrderRequest {
  shippingCost?: number;
  tax?: number;
  orderItems: OrderItemRequest[];
  customerInfo: CustomerInfoRequest;
}

export interface OrderSearchRequest {
  orderId?: number;
  customerName?: string;
  customerPhone?: string;
  status?: OrderStatus;
  createdFrom?: string; // ISO 8601 date string
  createdTo?: string;
  minTotal?: number;
  maxTotal?: number;
}


export interface OrderResponse {
  id: number;
  date: string;
  shippingCost: number;
  tax: number;
  total: number;
  status: OrderStatus;
  customerInfo: CustomerInfoRequest;
  orderItems: OrderItemDetail[];
  userId?: number;
  userEmail?: string;
}

export interface OrderItemDetail {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderShortResponse {
  id: number;
  date: string;
  total: number;
  status: OrderStatus;
  orderItems: OrderItemDetail[];
}

export interface CustomerInfoRequest {
  firstName?: string;
  lastName?: string;
  phone: string;
  email?: string;
  address: string;
  note?: string;
}