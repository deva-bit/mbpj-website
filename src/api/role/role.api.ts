import api from "../api"
import { roleRequestDto, roleResponseDto,roleDeleteRequestDto } from "./role.types"

export const fetchRole = () => api.get<roleResponseDto[]>('roles').then((res) => res.data)
export const addRole = (params: roleRequestDto) => api.post<roleResponseDto>('role', params).then((res) => res.data).catch((err) => err.data)
export const editRole = (params:roleRequestDto) => api.put<roleResponseDto>('role', params).then((res) => res.data)
export const deleteRole = (params: roleDeleteRequestDto) => api.delete<roleResponseDto>('role/'+params.id).then((res) => res.data)










