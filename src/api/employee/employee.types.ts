export type EmployeeRequestDto = {
    searchValue: string
    filterType: string
}

export type EmployeeResponseDto = {
    fullname: string
    email:string
    username: string
    icNumber: string
    passportNumber: string
    employeeNumber: string
    entity: string
    factory: string
    location: string
    departmentCode: string
    departmentName: string
    resignDate: string
    employeeType: string
    employeeStatus: string
    profileImage: string
}