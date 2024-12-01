export type clinicUserRequestDto = {
    name: string,
    clinicId: number,
}
export type clinicUserAddRequestDto = {
    name: string,
    email:string,
    password:string,
    clinicId: number,
}
export type clinicUserResponseDto = {
    id: number,
    name: string,
    email: string,
    status: boolean,
    clinic: {
        id: number,
        clinicCode: string,
        name: string,
        address1: string,
        address2: string,
        state: string,
        postcode: string,
        country: string,
        email: string,
        status: boolean
    }
}
export type clinicUserPasswordDto = {
    id: number|undefined,
    password: string
}
export type clinicUserDeleteRequestDto = {
    id: number;
}