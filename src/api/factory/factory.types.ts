export type FactoryRequestDto = {
  code: string,
  name: string,
  addressLine1: string,
  addressLine2: string,
  state: string,
  postcode: string,
  country: string,
  picIds:[],
}

export type FactoryResponseDto = {
    id: number,
    code: string,
    name: string,
    addressLine1: string,
    addressLine2: string,
    state: string,
    postcode: string,
    country: string,
    description: string,
    status: boolean,
    pics: [
        {
          id: number,
          name: string,
          email: string,
          status: boolean
        }
      ]
}
export type FactoryDeleteRequestDto = {
    id: number;
}