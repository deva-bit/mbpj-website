export type medicalOverclaimReportRequestDto = {
    factoryId: string,
    startDate: string,
    endDate :string
}

export type medicalOverclaimReportResponseDto =[ {
    employeeName: string,
    employeeNumber: string,
    employeeType: string,
    hireDate: boolean,
    workingYear: number,
    specialEntitlement: string,
    medicalAllowanceEntitlement: number,
    balBf: string,
    eclinicAmount: number,
    eclaimAmount: number,
    totalAmount: number,
    totalClaim: number,
    overClaimAmount: number,
    overClaimStatus: string,
    paybackAmount: number,
    netAmount: number,

}]
