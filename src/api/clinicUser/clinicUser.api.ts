import api from "../api"
import { clinicUserRequestDto, clinicUserResponseDto,clinicUserDeleteRequestDto,clinicUserPasswordDto,clinicUserAddRequestDto } from "./clinicUser.types"

export const fetchClinicUser = () => api.get<clinicUserResponseDto[]>('clinic/users').then((res) => res.data)
export const addClinicUser= (params: clinicUserAddRequestDto) => api.post<clinicUserResponseDto>('clinic/user', params).then((res) => res.data)
export const editClinicUser = (params: clinicUserRequestDto) => api.put<clinicUserResponseDto>('clinic/user', params).then((res) => res.data)
export const editClinicUserPassword = (params: clinicUserPasswordDto) => api.put<clinicUserPasswordDto>('clinic/user/password', params).then((res) => res.data)
export const deleteClinicUser = (params: clinicUserDeleteRequestDto) => api.delete<clinicUserResponseDto>('clinic/user/'+params.id).then((res) => res.data)



