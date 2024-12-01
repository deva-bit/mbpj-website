import api from "../api"
import { FactoryRequestDto, FactoryResponseDto,FactoryDeleteRequestDto } from "./factory.types"

export const fetchFactory = () => api.get<FactoryResponseDto[]>('factories').then((res) => res.data)
export const addFactory = (params: FactoryRequestDto) => api.post<FactoryResponseDto>('factory', params).then((res) => res.data).catch((err) => err.data)
export const editFactory = (params: FactoryRequestDto) => api.put<FactoryResponseDto>('factory', params).then((res) => res.data)
export const deleteFactory = (params: FactoryDeleteRequestDto) => api.delete<FactoryResponseDto>('factory/'+params.id).then((res) => res.data)




