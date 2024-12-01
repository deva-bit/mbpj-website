export type UploadSapDataRequestDto = {
    month: string | undefined,
    year: string |undefined,
}
export type UploadSapDataRequestToPostDto = {
    month: string|any,
    year: string|any,
    employeeId: string|any,
    deductedAmount: string|any,
    deductionCode: string|any
}[]
export type UploadSapDataResponseDto = {
    id: number,
    month: number,
    year: number,
    employeeId: string,
    deductedAmount: string,
    deductionCode: string,
    status: boolean

}