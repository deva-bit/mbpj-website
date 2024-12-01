export type HrReportRequestDto = {
    factoryCode: string | null
    departmentCode: string| null
    dateFrom: string|null
    dateTo: string |null
    employeeType: string | null
    employeeStatus: string|null
    employeeName: string|null
    employeeNumber: string|null
    clinicId: string | null
    sicknessId: number | null
    mcDaysFrom: number | null
    mcDaysTo: number | null
    consultantAmountFrom: number | null
    consultantAmountTo: number | null
    medicineAmountFrom: number | null
    medicineAmountTo: number | null
    totalAmountFrom: number | null
    totalAmountTo: number | null
}

export type HrReportResponseDto = {

    medicalRecords: [
        {
          id: number,
          mcDays: string,
          mcFrom: string,
          mcTo: string,
          consultantFeesAmount: string,
          medicineFeesAmount: string,
          totalAmount: string,
          status: boolean,
          sicknesses: [
            {
              id: number,
              code: string,
              description: string,
              chronicDisease: string,
              occupationalInjury: string,
              infectiousDisease: string,
              status: boolean
            }
          ],
          registration: {
            id: number,
            registrationDate: string,
            employeeNumber: string,
            fullName: string,
            factoryCode: string,
            factoryName: string,
            departmentCode: string,
            departmentName: string,
            employeeType: string,
            employeeStatus: string,
            status: boolean,
            clinic: {
              id: 0,
              clinicCode: string,
              name: string,
              address1: string,
              address2: string,
              state: string,
              postcode: string,
              country: string,
              email: string,
              status: boolean,
            }
          }
        }
      ],
      totalVisit: number,
      grandTotal: string
}

export type HrReportDownloadRequestDto = {
  factoryCode: string | null
  departmentCode: string| null
  dateFrom: string |null
  dateTo: string|null
  employeeType: string | null
  employeeStatus: string | null
  employeeName: string | null
  employeeNumber: string | null
  clinicId: string | null
  sicknessId: number | null
  mcDaysFrom: number | null
  mcDaysTo: number | null
  consultantAmountFrom: number | null
  consultantAmountTo: number | null
  medicineAmountFrom: number | null
  medicineAmountTo: number | null
  totalAmountFrom: number | null
  totalAmountTo: number | null
}
export type HrReportDownloadResponseDto = {
  data: BlobPart
}