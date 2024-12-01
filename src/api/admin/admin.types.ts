export type adminRequestDto = {
    username: string,
    name: string,
    email: string,
    roles: any,
}

export type adminResponseDto = {
    id: number,
    username: string,
    email: string,
    status: boolean,
    roles: [{
        id: number,
        description: string,
        status: boolean,
        pages: [
            {
                id: number,
                code: string,
                description: string,
                status: boolean
            }
        ]
    }]

}
export type adminDeleteRequestDto = {
    id: number;
}