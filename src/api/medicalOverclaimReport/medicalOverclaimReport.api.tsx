import api from "../api"
import { medicalOverclaimReportRequestDto, medicalOverclaimReportResponseDto, } from "./medicalOverclaimReport.types"

export const fetchmedicalOverclaimReport = async (params: medicalOverclaimReportRequestDto | null = null) => {
    const options = params ? { params } : {}; 
  
    const res = await api.get<medicalOverclaimReportResponseDto>('report/registrations-overclaim', options);
  return res.data;
  };
