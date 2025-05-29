import { UserCreationRequest } from "@/types/User";
import instance from "./Axios-customize"
import { Account, ApiResponse, GetAccount, User } from "@/types";

export const callRegister = (request: UserCreationRequest) => {
    const response = instance.post<ApiResponse<User>>('/api/auth/register', request);
    return response;
};

export const callLogin = (username: string, password: string) => {
    return instance.post<ApiResponse<Account>>('/api/auth/login', { username, password })
}

export const callLogout = () => {
    return instance.post<ApiResponse<void>>('/api/auth/logout')
}

export const callFetchAccount = () => {
    return instance.get<ApiResponse<GetAccount>>('/api/auth/account')
}

export const callVerifyOtp = (email: string, otp: string) => {
    return instance.post<ApiResponse<void>>(`/api/auth/verify-otp`, {
        param: {
            email, otp
        }
    })
}