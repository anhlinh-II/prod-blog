import { Gender } from "./User";

export interface ApiResponse<T> {
     code: number;
     message: string;
     result: T;
}


export interface Page<T> {
     content: T[];
     page: {
          totalElements: number;
          totalPages: number;
          number: number;
          size: number;
     }
}

export interface User {
     id?: number;
     email: string;
     username: string;
     password?: string;
     firstName: string;
     lastName: string;
     phone: string;
     dob: string;
     gender: string;
     location: string;
     bio: string;
     role?: {
          id: string;
          name: string;
     }
     createdBy?: string;
     isDeleted?: boolean;
     deletedAt?: boolean | null;
     createdAt?: string;
     updatedAt?: string;
}

export interface GetAccount extends Omit<Account, "access_token"> { }

export interface Account {
     access_token: string ;
     user: {
          id: number;
          email: string;
          username: string;
          firstName: string;
          lastName?: string;
          avatarPublicId?: string;
          avatarUrl: string;
          coverPhotoPublicId?: string;
          coverPhotoUrl?: string;
          location?: string;
          bio?: string;
          job?: string;
          authorities: {
               id: string;
               authority: string;
          };
          phone?: string;
          dob?: string;
          createdAt?: string;
          updatedAt?: string;
          gender?: Gender;
          friendNum?: number;
          mutualFriendsNum?: number;
     }
}


////////////////////////////////////// Brand
export interface BrandRequest {
  name: string;
}

export interface BrandResponse {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

////////////////////////////////////// Category
export enum CategoryType {
    NEWS_TIPS = 'NEWS_TIPS',
    PRODUCT = 'PRODUCT'
}

export interface CategoryRequest {
  name: string;
  description?: string;
  type: CategoryType;
  parentId?: number;
}

export interface CategoryResponse {
     id: number;
     name: string;
     slug: string;
     description: string;
     parentCategoryName: string | null;
     parentId: number;
     children: CategoryResponse[];
}

////////////////////////////////////// Contact
export interface ContactRequest {
  name: string;
  email?: string;
  phone: string;
  message: string;
}

export interface ContactResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

////////////////////////////////////// Meida
export interface MediaResponse {
    id: number;
    fileName: string;
    url: string;
    fileType: string;
    size: number;
}