export interface ApiResponse<T> {
     code: number;
     message: string;
     result: T;
}

export interface CategoryResponse {
     id: string;
     name: string;
     slug: string;
     description: string;
     children: CategoryResponse[];
}