import api from "../api"
import { ccListRequestDto, ccListResponseDto,ccListDeleteRequestDto } from "./ccList.types"

export const fetchCcList = () => api.get<ccListResponseDto[]>('cc/lists').then((res) => res.data)
export const addCcList = (params: ccListRequestDto) => api.post<ccListResponseDto>('cc/list', params).then((res) => res.data)
export const editCcList = (params: ccListRequestDto) => api.put<ccListResponseDto>('cc/list', params).then((res) => res.data)
export const deleteCcList = (params: ccListDeleteRequestDto) => api.delete<ccListResponseDto>('cc/list/'+params.id).then((res) => res.data)





