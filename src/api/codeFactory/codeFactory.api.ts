import api from "../api"
import { codeFactoryRequestDto, codeFactoryResponseDto } from "./codeFactory.types"


export const fetchcodeFactory = () => api.get<codeFactoryResponseDto[]>('factory/ec').then((res) => res.data)
