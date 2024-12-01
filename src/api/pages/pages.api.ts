import api from "../api"
import { pagesResponseDto,} from "./pages.types"

export const fetchPages = () => api.get<pagesResponseDto[]>('pages').then((res) => res.data)