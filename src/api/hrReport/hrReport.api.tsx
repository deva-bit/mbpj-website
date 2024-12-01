import api from "../api"
import { HrReportRequestDto, HrReportResponseDto,HrReportDownloadResponseDto,HrReportDownloadRequestDto } from "./hrReport.types"


export const fetchHrReport = async (params: HrReportRequestDto | null = null) => {
    const options = params ? { params } : {}; 
  
    const res = await api.get<HrReportResponseDto>('report/hr', options);
  return res.data;
  };


export const downloadReport = async (params: HrReportDownloadRequestDto | null = null): Promise<Blob> => {
  const options = params ? { params } : {}; 

  const res = await api.get<Blob>('report/hr/excel', { ...options, responseType: 'blob' });
  return res.data;
};