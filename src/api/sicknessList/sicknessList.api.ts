import api from "../api"
import { SicknessListRequestDto, SicknessListResponseDto,SicknessListDeleteRequestDto } from "./sicknessList.types"

export const fetchSicknessList = () => api.get<SicknessListResponseDto[]>('sickness').then((res) => res.data)
export const addSicknessList = (params: SicknessListRequestDto) => api.post<SicknessListResponseDto>('sickness', params).then((res) => res.data)
export const editSicknessList = (params: SicknessListRequestDto) => api.put<SicknessListResponseDto>('sickness', params).then((res) => res.data)
export const deleteSicknessList = (params: SicknessListDeleteRequestDto) => api.delete<SicknessListResponseDto>('sickness/'+params.id).then((res) => res.data)



