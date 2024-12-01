export type RegistrationRequestDto = {
    id?: number
    fullName?: string
    userName?: string
    icNumber?: string
    passportNumber?: string
    employeeNumber?: string
    employeeType?: string
    employeeStatus?: string
    resignDate?: string
    factory?: string
    departmentCode?: string
    departmentName?: string
    registrationDate?: string
    clinicId?: number
}

export type RegistrationResponseDto = {
    id: number
    fullName: string
    userName: string
    icNumber: string
    passportNumber: string
    employeeNumber: string
    employeeType: string
    employeeStatus: string
    resignDate: string
    factoryCode: string
    factoryName: string
    departmentCode: string
    departmentName: string
    registrationDate: string
    registrationType: string
    deleteReason: string
    status: boolean
    extendStatus: boolean
    extendToDate: string
    dateUpdated: string
    clinic: {
      id: number
      clinicCode: string
      name: string
      address1: string
      address2: string
      state: string
      postcode: string
      country: string
      email: string
      status: boolean
    }
    medicalRecords: [
      {
        id: number
        mcDays: number
        mcFrom: string
        mcTo: string
        consultantFeesAmount: number
        medicalFeesAmount: number
        grandTotalAmount: number
        medicalRemark: string
        deleteReason: string
        status: boolean
        dateUpdated: string
        sicknesses: [
          {
            id: number
            code: string
            description: string
            chronicDisease: string
            occupationalInjury: string
            infectiousDisease: string
            status: boolean
          }
        ]
      }
    ]
}
