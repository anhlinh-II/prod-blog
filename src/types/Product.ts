import { MediaResponse } from ".";

export interface ProductAttributeRequest {
  specKey: string;
  value: string;
  orderIndex?: number;
}

export interface ProductRequest {
  id?: number;
  name: string;
  description?: string;
  image?: string;
  price: number;
  discountPercent?: number;
  specialPrice?: number;
  stockQuantity?: number;
  isEnabled?: boolean;
  isActive?: boolean;
  brandId?: number;
  categoryIds?: number[];
  attributes?: ProductAttributeRequest[];
}

export interface ProductAttribute {
  specKey: string;
  value: string;
  orderIndex?: number;
}

export interface ProductResponse {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  discountPercent: number;
  specialPrice?: number;
  stockQuantity: number;
  quantitySold: number;
  views?: number;
  isEnabled: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  brandSlug: string;
  categorySlugs: string[];
  attributes: ProductAttribute[];
  images: string[];
}

export interface ProductShortResponse {
  id: number;
  name: string;
  slug: string;
  image: string;
  price: number;
  discountPercent: number;
  views?: number;
  isEnabled: boolean;
  isActive: boolean;
  createdAt: string;

  // brandSlug?: string;
  // categorySlugs?: Set<string>;
}
