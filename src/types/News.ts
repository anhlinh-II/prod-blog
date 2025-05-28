import { MediaResponse } from ".";

export enum NewsType {
    NEWS = 'NEWS',
    TIPS = 'TIPS', 
    ANNOUNCEMENT = 'ANNOUNCEMENT'
}

export interface NewsRequest {
    title: string;
    content: string;
    type: NewsType;
    categoryIds?: number[] | null;
}

export interface NewsResponse {
    id: number;
    title: string;
    slug: string;
    description: string;
    content: string;
    type: NewsType;
    images: MediaResponse[];  // Change this to MediaResponse[]
    views: number;
    isPublished: boolean;
    isDeleted: boolean;
    categorySlugs: string[];
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
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
  images: MediaResponse[];
}
