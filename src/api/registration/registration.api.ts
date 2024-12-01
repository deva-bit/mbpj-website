import api from "../api"
import { RegistrationRequestDto, RegistrationResponseDto } from "./registration.types"

export const submitRegistration = (params: RegistrationRequestDto) => api.post<RegistrationResponseDto>('registration/qr', params).then((res) => res.data)

export const fetchRegistration = async (params: RegistrationRequestDto) => api.get<RegistrationResponseDto>('registration/'+params.id).then((res) => res.data)