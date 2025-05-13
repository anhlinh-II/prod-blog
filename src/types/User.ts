export enum Gender {
    MALE = 'Male',
    FEMALE = 'Female',
    OTHER = 'Other'
}

export interface UserCreationRequest {
    username: string;
    password: string;
    email?: string | null;
    firstName?: string;
    lastName?: string;
    dob?: string;
    gender?: Gender;
}

export interface UserUpdateRequest {
    id: number;
    firstName?: string;
    lastName?: string;
    dob?: Date;
    gender?: string;
    bio?: string;
    location?: string;
    job?: string;
}

export interface UserDTO {
    id: number;
    firstName: string;
    lastName?: string;
    location?: string;
}

export interface UserResponse {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    location?: string;
    bio?: string;
    job?: string;
    authorities: {
         id: string;
         authority: string;
    };
    
    dob: string;
    createdAt: Date;
    updatedAt: Date;
    gender?: Gender;
}