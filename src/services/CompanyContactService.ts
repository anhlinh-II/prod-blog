import { ApiResponse, ContactResponse, Page } from "@/types";
import instance from "./Axios-customize"

export interface CompanyContactResponse {
     id: string;
     facebook: string;
     messenger: string;
     zalo: string;
     phone: string;
}

export const getCompanyCOntact = async () => {
    return (await instance.get<ApiResponse<CompanyContactResponse>>(
        '/api/company-contacts',
    )).data;
};

export interface UpdateCompanyContactRequest {
  facebook: string;
  messenger: string;
  zalo: string;
  phone: string;
}

export const updateCompanyContact = async (data: UpdateCompanyContactRequest) => {
    return (await instance.post<ApiResponse<CompanyContactResponse>>(
        '/api/company-contacts/update',
        data
    )).data;
};