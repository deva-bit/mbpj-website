export type TreatmentListRequestDto = {
}

export type TreatmentListResponseDto = {
    id: number,
    description: string,
    status: boolean,
    
}
export type TreatmentListDeleteRequestDto = {
    id: number;
}