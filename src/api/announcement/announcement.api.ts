import api from "../api"
import { announcementRequestDto, announcementResponseDto,announcementDeleteRequestDto } from "./announcement.types"

export const fetchAnnouncement = () => api.get<announcementResponseDto[]>('announcements').then((res) => res.data)
export const addAnnouncement= (params: announcementRequestDto) => api.post<announcementResponseDto>('announcement', params).then((res) => res.data)
export const editAnnouncement = (params: announcementRequestDto) => api.put<announcementResponseDto>('announcement', params).then((res) => res.data)
export const deleteAnnouncement = (params: announcementDeleteRequestDto) => api.delete<announcementResponseDto>('announcement/'+params.id).then((res) => res.data)



