import api from "../api"
import { UserRecordRequestDto,UserRecordResponseDto } from "./userRecord.types"

export const getUserRecord = async (params: UserRecordRequestDto | null = null) => {
    const options = params ? { params } : {}; 
  
    const res = await api.get<UserRecordResponseDto>('registrations', options);
  return res.data;
  };
