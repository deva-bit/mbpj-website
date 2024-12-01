import api from "../api"
import { adminRequestDto, adminResponseDto,adminDeleteRequestDto } from "./admin.types"

export const fetchAdminList = () => api.get<adminResponseDto[]>('admin').then((res) => res.data)
export const addAdminList = (params: adminRequestDto) => api.post<adminResponseDto>('admin', params).then((res) => res.data)
export const editAdminList = (params: adminRequestDto) => api.put<adminResponseDto>('admin', params).then((res) => res.data)
export const deleteAdminList = (params: adminDeleteRequestDto) => api.delete<adminResponseDto>('admin/'+params.id).then((res) => res.data)





