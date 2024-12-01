import api from "../api"
import { companyRequestDto, companyResponseDto,companyDeleteRequestDto } from "./company.types"

export const fetchCompany = () => api.get<companyResponseDto[]>('companies').then((res) => res.data)
export const addCompany  = (params: companyRequestDto) => api.post<companyResponseDto>('company', params).then((res) => res.data)
export const editCompany = (params: companyRequestDto) => api.put<companyResponseDto>('company', params).then((res) => res.data)
export const deleteCompany  = (params: companyDeleteRequestDto) => api.delete<companyResponseDto>('company'+params.id).then((res) => res.data)





