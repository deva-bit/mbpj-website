export type companyRequestDto = {
    code: string,
    name: string,
}

export type companyResponseDto = {
    id: number,
    code: string,
    name: string,
    status: boolean
}
export type companyDeleteRequestDto = {
    id: number;
}