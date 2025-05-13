export interface ProductSpecRequest {
  specKey: string;
  value: string;
  orderIndex?: number; // optional nếu có thể null
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
  categoryIds?: Set<number>;
  specifications?: ProductSpecRequest[];
}

export interface ProductSpecification {
  specKey: string;
  value: string;
  orderIndex?: number;
}

export interface ProductResponse {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  price: number;
  discountPercent: number;
  specialPrice?: number;
  stockQuantity?: number;
  quantitySold?: number;
  views?: number;
  isEnabled: boolean;
  isActive: boolean;
  createdAt: string;  // hoặc `Date` nếu bạn muốn xử lý dạng đối tượng
  updatedAt: string;

  brandSlug: string;
  categorySlugs: Set<string>;
  specifications: ProductSpecification[];
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
