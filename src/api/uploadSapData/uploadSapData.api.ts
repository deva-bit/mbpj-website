import api from "../api"
import { UploadSapDataRequestDto,UploadSapDataResponseDto,UploadSapDataRequestToPostDto } from "./uploadSapData.types"

export const getUploadSapData = (params:UploadSapDataRequestDto) => api.get<UploadSapDataResponseDto|any>('sap-upload/filter?month='+params.month+'&year='+params.year).then((res) => res.data)
export const addUploadSapData= (params: UploadSapDataRequestToPostDto) => api.post<UploadSapDataResponseDto>('sap-upload/', params).then((res) => res.data)
