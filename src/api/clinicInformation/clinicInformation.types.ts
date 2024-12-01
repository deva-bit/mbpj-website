export type clinicInformationRequestDto = {
    clinicCode: string,
    name: string,
    address1: string,
    address2: string,
    state: string,
    postcode: string,
    country: string,
    email:string,
}

export type clinicInformationResponseDto = {
    id: number,
    clinicCode: string,
    name: string,
    address1: string,
    address2: string,
    state: string,
    postcode: string,
    country: string,
    status: boolean,
    email:string,
}
export type clinicInformationDeleteRequestDto = {
    id: number;
}