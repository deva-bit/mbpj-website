import api from "../api"
import { clinicInformationRequestDto, clinicInformationResponseDto,clinicInformationDeleteRequestDto } from "./clinicInformation.types"

export const fetchclinicInformation = () => api.get<clinicInformationResponseDto[]>('clinics').then((res) => res.data)
export const addclinicInformation = (params: clinicInformationRequestDto) => api.post<clinicInformationResponseDto>('clinic', params).then((res) => res.data).catch((err) => err.data)
export const editclinicInformation = (params: clinicInformationRequestDto) => api.put<clinicInformationResponseDto>('clinic', params).then((res) => res.data)
export const deleteclinicInformation = (params: clinicInformationDeleteRequestDto) => api.delete<clinicInformationResponseDto>('clinic/'+params.id).then((res) => res.data)



