export enum NewsType {
    NEWS = 'NEWS',
    TIPS = 'TIPS', 
    ANNOUNCEMENT = 'ANNOUNCEMENT'
}

export interface NewsRequest {
  title: string;
  content: string;
  type: NewsType;
  categoryIds?: number[]; 
  isActive?: boolean; 
  userId: number;
}

export interface NewsResponse {
  id: number;
  title: string;
  slug: string;
  imageUrl: string;
  description: string;
  content: string;
  type: NewsType;
  categorySlugs: string[]; 
  createdAt: string; 
  updatedAt: string;
  isActive: boolean;
  userId: number;
}

////////////////////////////////////// STATIC PAGE
export enum StaticPageType {
    ABOUT = 'ABOUT', 
    POLICY = 'POLICY', 
    GUIDE = 'GUIDE'
}

export interface StaticPageRequest {
  title: string;
  content: string;
  type: StaticPageType;
  userId: number;
  isActive?: boolean;
}

export interface StaticPageResponse {
  id: number;
  slug: string;
  title: string;
  content: string;
  type: StaticPageType;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}
