export type ccListRequestDto = {
    name: string,
    email:string,
}

export type ccListResponseDto = {
    id: number,
    name: string,
    email:string,
    status: boolean,
  
}
export type ccListDeleteRequestDto = {
    id: number;
}