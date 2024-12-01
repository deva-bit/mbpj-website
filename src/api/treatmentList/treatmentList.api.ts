import api from "../api"
import { TreatmentListRequestDto, TreatmentListResponseDto,TreatmentListDeleteRequestDto } from "./treatmentList.types"

export const fetchTreatmentList = () => api.get<TreatmentListResponseDto[]>('treatment').then((res) => res.data)
export const addTreatmentList = (params: TreatmentListRequestDto) => api.post<TreatmentListResponseDto>('treatment', params).then((res) => res.data)
export const editTreatmentList = (params: TreatmentListRequestDto) => api.put<TreatmentListResponseDto>('treatment', params).then((res) => res.data)
export const deleteTreatmentList = (params: TreatmentListDeleteRequestDto) => api.delete<TreatmentListResponseDto>('treatment/'+params.id).then((res) => res.data)



