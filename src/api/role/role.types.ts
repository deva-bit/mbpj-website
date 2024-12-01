export type roleRequestDto = {
    description: string,
    pages:[]
}

export type roleResponseDto = {
    id: number,
    description: string,
    status: boolean,
    pages:
    [
        {
            id: number,
            code: string,
            description: string,
            status: boolean
        }
    ]
}

export type roleDeleteRequestDto = {
    id: number;
}
