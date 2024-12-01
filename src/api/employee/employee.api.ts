import api from "../api"
import { EmployeeRequestDto, EmployeeResponseDto } from "./employee.types"

export const fetchEmployee = (params: EmployeeRequestDto) => api.get<EmployeeResponseDto>('employee', {params: params}).then((res) => res.data)

