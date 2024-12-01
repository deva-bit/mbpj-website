import api from "../api"
import { departmentCodeRequestDto, departmentCodeResponseDto } from "./departmentCode.types"


export const fetchdepartmentCode = () => api.get<departmentCodeResponseDto[]>('department/ec').then((res) => res.data)
