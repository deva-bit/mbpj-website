import api from "../api"
import { factoryPicRequestDto, factoryPicResponseDto,factoryPicDeleteRequestDto } from "./factoryPic.types"

export const fetchFactoryPic = () => api.get<factoryPicResponseDto[]>('factory/pics').then((res) => res.data)
export const addFactoryPic = (params: factoryPicRequestDto) => api.post<factoryPicResponseDto>('factory/pics', params).then((res) => res.data)
export const editFactoryPic = (params: factoryPicRequestDto) => api.put<factoryPicResponseDto>('factory/pic', params).then((res) => res.data)
export const deleteFactoryPic = (params: factoryPicDeleteRequestDto) => api.delete<factoryPicResponseDto>('factory/pic/'+params.id).then((res) => res.data)



