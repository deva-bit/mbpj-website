export type factoryPicRequestDto = {
    name: string,
    email: string,
    factoryIds:[]
}

export type factoryPicResponseDto = {
    factoryIds(factoryIds: any): unknown
    id: number,
    name: string,
    email: string,
    status: boolean,
    factories:[ {
        id: number,
        code: string,
        name: string,
        address1: string,
        address2: string,
        state: string,
        postcode: string,
        country: string,
        status: boolean
      }
    ] 
}
export type factoryPicDeleteRequestDto = {
    id: number;
}