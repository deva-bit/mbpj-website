export type SicknessListRequestDto = {
    code: string,
    description: string,
    chronicDisease:any,
    occupationalInjury:any,
    infectiousDisease:any,
}

export type SicknessListResponseDto = {
    id: number,
    code: string,
    description: string,
    chronicDisease:any,
    occupationalInjury:any,
    infectiousDisease:any,
    status: boolean,
    
}
export type SicknessListDeleteRequestDto = {
    id: number;
}