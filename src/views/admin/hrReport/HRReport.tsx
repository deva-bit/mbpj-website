import { SetStateAction, useEffect, useState } from "react";
import { EllipsisOutlined, SearchOutlined } from '@ant-design/icons';
import type { ProColumns, RequestData } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, DatePicker, Dropdown, Input, Select } from 'antd';
import enUS from 'antd/lib/locale/en_US';
import './HRReport.css';
import { ConfigProvider } from 'antd';
import { InputNumber } from 'antd';
import { fetchHrReport, downloadReport } from "@/api/hrReport/hrReport.api"
import { useQuery } from "@tanstack/react-query";
import { HrReportRequestDto, HrReportResponseDto, HrReportDownloadRequestDto, HrReportDownloadResponseDto } from "@/api/hrReport/hrReport.types"
import { fetchFactory } from "@/api/factory/factory.api"
import { FactoryResponseDto } from "@/api/factory/factory.types"
import { fetchclinicInformation } from "@/api/clinicInformation/clinicInformation.api"
import { clinicInformationResponseDto } from "@/api/clinicInformation/clinicInformation.types"
import { fetchSicknessList } from "@/api/sicknessList/sicknessList.api"
import { SicknessListResponseDto } from "@/api/sicknessList/sicknessList.types"
import EmployeeAsyncSelectComponent from "@/components/filterAsyncSelect/FilterAsyncSelect";
import { fetchEmployee } from "@/api/employee/employee.api";
import { fetchdepartmentCode } from "@/api/departmentCode/departmentCode.api";
import { departmentCodeResponseDto } from "@/api/departmentCode/departmentCode.types"

const { RangePicker } = DatePicker;

const employeeType: { [key: string]: string } = {
  Staff: 'Staff',
  Worker: 'Worker',
};

const employeeStatus: { [key: string]: string } = {
  active: 'active',
  inactive: 'inactive',
  onhold: 'on-hold',
};

const HRReport = () => {
  const [isSelectedFactory, setSelectedFactory] = useState<string[]>([]);
  const [isSelectedEmployeeType, setSelectedEmployeeType] = useState<string[]>([]);
  const [isSelectedDepartment, setSelectedDepartment] = useState<string[]>([]);
  const [isSelectedEmployeeStatus, setSelectedEmployeeStatus] = useState<string[]>([]);
  const [isSelectedVisitDateFrom, setSelectedVisitDateFrom] = useState<string | null>(null);
  const [isSelectedVisitDateTo, setSelectedVisitDateTo] = useState<string | null>(null);
  const [isBadgeID, setBadgeID] = useState<string | null>(null);
  const [isSelectedClinic, setSelectedClinic] = useState<string[]>([]);
  const [isSickness, setSicknesses] = useState<number | null>(null);
  const [isMCDaysFrom, setMCDaysFrom] = useState<number | null>(null);
  const [isMCDaysTo, setMCDaysTo] = useState<number | null>(null);
  const [isConsultationFeeFrom, setConsultationFeeFrom] = useState<number | null>(null);
  const [isConsultationFeeTo, setConsultationFeeTo] = useState<number | null>(null);
  const [isMedicineAmountFrom, setMedicineAmountFrom] = useState<number | null>(null);
  const [isMedicineAmountTo, setMedicineAmountTo] = useState<number | null>(null);
  const [isTotalAmountFrom, setTotalAmountFrom] = useState<number | null>(null);
  const [isTotalAmountTo, setTotalAmountTo] = useState<number | null>(null);
  const [dataDepartmentCode, setDepartmentCode] = useState<departmentCodeResponseDto[]>([]);

  const [dataFactory, setFactory] = useState<FactoryResponseDto[]>([]);
  const [dataClinic, setClinic] = useState<clinicInformationResponseDto[]>([]);
  const [dataSickness, setSickness] = useState<SicknessListResponseDto[]>([]);
  const [fetchedData, setFetchedData] = useState<HrReportRequestDto | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedName, setSelectedName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    isLoading: isLoadingFactory, isFetching: isFetchingFactory, isError: isErrorFactory, isSuccess: isSuccessFactory, data: dataFactories, error: errorFactory, refetch: FactoryRefetch
  } = useQuery({
    queryKey: ['factory'],
    queryFn: () => fetchFactory(),
  })

  const {
    isLoading: isLoadingClinicInformation, isFetching: isFetchingClinicInformation, isError: isErrorClinicInformation, isSuccess: isSuccessClinicInformation, data: dataClinicInformation, error: errorClinicInformation, refetch: refetchClinicInformation
  } = useQuery({
    queryKey: ['clinics'],
    queryFn: () => fetchclinicInformation(),
  })

  const {
    isLoading: isLoadingSickness, isFetching: isFetchingSickness, isError: isErrorSickness, isSuccess: isSuccessSickness, data: dataSicknesses, error: errorSickness, refetch: refetchSickness
  } = useQuery({
    queryKey: ['sickness'],
    queryFn: () => fetchSicknessList(),
  })

  const {
    isLoading: isLoadingDepartment, isFetching: isFetchingDepartment, isError: isErrorDepartment, isSuccess: isSuccessDepartment, data: dataDepartment, error: errorDepartment, refetch: refetchDepartment
  } = useQuery({
    queryKey: ['department/ec'],
    queryFn: () => fetchdepartmentCode(),
  })

  // Factory api successfully called
  useEffect(() => {
    if (isSuccessFactory) {
      const filteredData = dataFactories?.filter((item) => item.status === true);
      setFactory(filteredData);
    }
  }, [isSuccessFactory]);

  // ClinicInformation api successfully called
  useEffect(() => {
    if (isSuccessClinicInformation) {
      const filteredData = dataClinicInformation;
      setClinic(filteredData);
    }
  }, [isSuccessClinicInformation]);

  // Sickness api successfully called
  useEffect(() => {
    if (isSuccessSickness) {
      const filteredData = dataSicknesses?.filter((item) => item.status === true);
      setSickness(filteredData);
    }
  }, [isSuccessSickness]);

  // Department form Ec successfully called
  useEffect(() => {
    if (isSuccessDepartment) {
      const filteredData = dataDepartment.filter(item => item.status === 'A');
      setDepartmentCode(filteredData);
    }
  }, [isSuccessDepartment]);

  //Employee username
  const handleOptionSelect = async (selectedOption: any) => {
  
    try {
      const inputValueObj = {
        searchValue: selectedOption.value,
        filterType: 'username',
      };

      const response = await fetchEmployee(inputValueObj);

      setSelectedName(response.fullname);
    } catch (error) {
      console.error('Error fetching employee data:', error);
      setSelectedName("");
    }
  };
  const handleFactoryChange = (value: string[]) => {
    setSelectedFactory(value);
  };
  const handleEmployeeTypeChange = (value: string[]) => {
    setSelectedEmployeeType(value);
  };
  const handledDepartmentChange = (value: string[]) => {
    setSelectedDepartment(value);
  };
  const handledEmployeeStatusChange = (value: string[]) => {
    setSelectedEmployeeStatus(value);
  };
  const handledVisitDateChange = (date: any) => {

    if (date === null || date.length === 0) {
      setSelectedVisitDateFrom(null);
      setSelectedVisitDateTo(null);
    } else {
      let startDate = date[0];
      let endDate = date[1];
      setSelectedVisitDateFrom(startDate.format('YYYY-MM-DD'))
      setSelectedVisitDateTo(endDate.format('YYYY-MM-DD'))
    }
  };
  const handleBadgeIDChange = (value: string) => {
    setBadgeID(value);
  };
  const handleClinicChange = (key: string[]) => {
    console.log(key)
    setSelectedClinic(key);
  };
  const handleDiagnosisChange = (value: number | null) => {
    setSicknesses(value);
  };
  const handleMCDaysFromChange = (value: number | null) => {
    setMCDaysFrom(value);
  };
  const handleMCDaysToChange = (value: number | null) => {
    setMCDaysTo(value);
  };
  const handleConsultationFeeFromChange = (value: number | null) => {
    setConsultationFeeFrom(value);
  };
  const handleConsultationFeeToChange = (value: number | null) => {
    setConsultationFeeTo(value);
  };
  const handleMedicineAmountFromChange = (value: number | null) => {
    setMedicineAmountFrom(value);
  };
  const handleMedicineAmountToChange = (value: number | null) => {
    setMedicineAmountTo(value);
  };
  const handleTotalAmountFromChange = (value: number | null) => {
    setTotalAmountFrom(value);
  };
  const handleTotalAmountToChange = (value: number | null) => {
    setTotalAmountTo(value);
  };

  const handleDownload = async () => {
    try {
      try {
        setIsLoading(true)
        const response = await downloadReport(fetchedData);
        // console.log( response )
        const link = document.createElement('a');
        link.href = URL.createObjectURL(response);
        link.download = 'report.xlsx';
        link.style.display = 'none';

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      }
      catch (error) {
        console.error('Error downloading data:', error);

      }
    } catch (error) {
      console.error('Error downloading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: ProColumns<HrReportResponseDto>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (text, record, index) => {
        const pageIndex = (currentPage - 1) * 10 + index + 1;
        return <span>{pageIndex}</span>;
      },
      valueType: 'indexBorder',
    },
    {
      title: 'Factory Code and Name',
      hideInTable: false,
      key: 'factory',
      dataIndex: 'factory',
      filters: true,
      onFilter: true,
      ellipsis: true,
      valueType: 'select',
      renderFormItem: (_item, { value, onChange }) => (
        <Select
          mode="multiple"
          value={value}
          onChange={(newValue) => {
            if (onChange) {
              onChange(newValue);
            }
            handleFactoryChange(newValue);
          }}
          placeholder="Select a factory "
        >
          {dataFactory && dataFactory.map(factory => (
            <Select.Option key={factory.id} value={factory.code}>
              {factory.code} - {factory.name}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Department',
      key: 'department',
      dataIndex: 'department',
      filters: true,
      onFilter: true,
      ellipsis: true,
      renderFormItem: (_item, { value, onChange }) => (
        <Select
          mode="multiple"
          value={value}
          onChange={(newValue) => {
            if (onChange) {
              onChange(newValue);
            }
            const departmentIds = newValue.map((selectedDepartment: string) => {
              const selectedDepartments = dataDepartmentCode.find((department) => department.departmentName === selectedDepartment);
              return selectedDepartments ? selectedDepartments.code : null;
            });
            handledDepartmentChange(departmentIds.filter((code:number) => code !== null));
          }}
          placeholder="Select a Department"
        >
          {dataDepartmentCode && dataDepartmentCode.map(factory => (
            <Select.Option key={factory.code} value={factory.departmentName}>
              {factory.departmentName}
            </Select.Option>
          ))}
        </Select>
      ),
    },

    {
      title: 'Employee Type',
      key: 'employeeType',
      dataIndex: 'employeeType',
      valueEnum: {
        Staff: 'Staff',
        Worker: 'Worker',
      },
      renderFormItem: (_item, { value, onChange }) => (
        <Select
          mode="multiple"
          value={value}
          onChange={(newValue) => {
            if (onChange) {
              onChange(newValue);
            }
            handleEmployeeTypeChange(newValue);
          }}
          placeholder="Select a Employee Type"
        >
          {Object.keys(employeeType).map(key => (
            <Select.Option key={key} value={key}>
              {employeeType[key]}
            </Select.Option>
          ))}
        </Select>
      ),

    },
    {
      title: 'Employee Status',
      key: 'employeeStatus',
      dataIndex: 'employeeStatus',
      renderFormItem: (_item, { value, onChange }) => (
        <Select
          mode="multiple"
          value={value}
          onChange={(newValue) => {
            if (onChange) {
              onChange(newValue);
            }
            handledEmployeeStatusChange(newValue);
          }}
          placeholder="Select a Employee Status"
        >
          {Object.entries(employeeStatus).map(([key, label]) => (
            <Select.Option key={key} value={employeeStatus[key]}>
              {label}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Clinic visit date',
      key: 'clinicVisitDate',
      valueType: 'dateRange',
      dataIndex: 'clinicVisitDate',
      hideInTable: true,
      renderFormItem: (_item, { value, onChange }) => (
        <RangePicker
          allowClear
          onChange={handledVisitDateChange}

          placeholder={['Start date', 'End date']}
        />
      ),
    },
    {
      title: 'Username',
      dataIndex: 'name',
      filters: true,
      onFilter: true,
      hideInTable: true,
      key: 'name',
      renderFormItem: (_item, { onChange }) => (
        <EmployeeAsyncSelectComponent handleOptionSelect={handleOptionSelect} />

      ),
    },
    {
      title: 'Badge ID',
      dataIndex: 'creator',
      key: 'badgeID',
      hideInTable: true,
      renderFormItem: (_item, { value, onChange }) => (
        <Input
          value={value}
          onChange={(e) => {
            if (onChange) {
              onChange(e.target.value);
            }
            handleBadgeIDChange(e.target.value);
          }}
          placeholder="Badge ID"
        />
      ),
    },
    {
      title: 'Clinic Name',
      key: 'clinicName',
      dataIndex: 'clinicName',
      filters: true,
      onFilter: true,
      ellipsis: true,
      renderFormItem: (_item, { value, onChange }) => (
        <Select
          mode="multiple"
          value={value}
          onChange={(newValue) => {
            if (onChange) {
              onChange(newValue);
            }
            const clinicIds = newValue.map((selectedName: string) => {
              const selectedClinic = dataClinic.find((clinic) => clinic.name === selectedName);
              return selectedClinic ? selectedClinic.id : null;
            });
            handleClinicChange(clinicIds.filter((id:number) => id !== null));
          }}
          placeholder="Select a Clinic Name"
        >
          {dataClinic && dataClinic.map(clinic => (
            <Select.Option key={clinic.id} value={clinic.name}>
              {clinic.name}
            </Select.Option>
          ))}
        </Select>
      ),

    },
    {
      title: 'Diagnosis',
      hideInTable: true,
      key: 'diagnosis',
      dataIndex: 'diagnosis',
      
      renderFormItem: (_item, { value, onChange }) => (
        <Select
        showSearch
          value={value}
          allowClear
          onChange={(newValue) => {
            if (onChange) {
              onChange(newValue);
            }
        
              const selectedDiagnosises =dataSickness.find((diagnosis) => diagnosis.description === newValue);
    
            handleDiagnosisChange(selectedDiagnosises? selectedDiagnosises.id : null);
           
          }}
          placeholder="Select a Diagnosis"
        >
          {dataSickness && dataSickness.map(diagnosis => (
            <Select.Option key={diagnosis.id} value={diagnosis.description}>
              {diagnosis.description}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'MC Days (From)',
      hideInTable: true,
      key: 'mcDaysFrom',
      renderFormItem: (_item, { value, onChange }) => (
        <InputNumber
          min={1}
          value={value}
          onChange={(newValue) => {
            if (onChange) {
              onChange(newValue);
            }

            handleMCDaysFromChange(newValue);
          }}
          placeholder="MC Days (From)"
        />
      ),
    },
    {
      title: 'MC Days (To)',
      hideInTable: true,
      key: 'mcDaysTo',
      renderFormItem: (_item, { value, onChange }) => (
        <InputNumber
          min={1}
          value={value}
          onChange={(newValue) => {
            if (onChange) {
              onChange(newValue);
            }

            handleMCDaysToChange(newValue);
          }}
          placeholder="MC Days (To)"
        />
      ),
    },

    {
      title: 'Consultation Amount (From)',
      key: 'consultationFeeFrom',
      hideInTable: true,
      renderFormItem: (_item, { value, onChange }) => (
        <InputNumber
          min={1.00}
          value={value}

          onChange={(newValue) => {
            if (onChange) {
              onChange(newValue);
            }
            handleConsultationFeeFromChange(newValue);
          }}
          placeholder="Consultation Amount (From)"
          step={0.01}
        />
      ),
    },
    {
      title: 'Consultation Amount (To)',
      key: 'consultationFeeTo',
      hideInTable: true,
      renderFormItem: (_item, { value, onChange }) => (
        <InputNumber
          min={1.00}
          value={value}

          onChange={(newValue) => {
            if (onChange) {
              onChange(newValue);
            }
            handleConsultationFeeToChange(newValue);
          }}
          placeholder="Consultation Amount (To)"
          step={0.01}
        />
      ),
    },
    {
      title: 'MedicineAmount (From)',
      key: 'medicalAmountFrom',
      hideInTable: true,
      renderFormItem: (_item, { value, onChange }) => (
        <InputNumber
          min={1.00}
          value={value}

          onChange={(newValue) => {
            if (onChange) {
              onChange(newValue);
            }
            handleMedicineAmountFromChange(newValue);
          }}
          placeholder="MedicineAmount (From)"
          step={0.01}
        />
      ),
    },
    {
      title: 'MedicineAmount (To)',
      key: 'medicalAmountTo',
      hideInTable: true,
      renderFormItem: (_item, { value, onChange }) => (
        <InputNumber
          min={1.00}
          value={value}

          onChange={(newValue) => {
            if (onChange) {
              onChange(newValue);
            }
            handleMedicineAmountToChange(newValue);
          }}
          placeholder="MedicineAmount (To)"
          step={0.01}
        />
      ),
    },
    {
      title: 'Total Amount (From)',
      key: 'totalAmountFrom',
      hideInTable: true,
      renderFormItem: (_item, { value, onChange }) => (
        <InputNumber
          min={1.00}
          value={value}

          onChange={(newValue) => {
            if (onChange) {
              onChange(newValue);
            }
            handleTotalAmountFromChange(newValue);
          }}
          placeholder="Total Amount (From)"
          step={0.01}
        />
      ),
    },
    {
      title: 'Total Amount (To)',
      key: 'totalAmountTo',
      hideInTable: true,
      renderFormItem: (_item, { value, onChange }) => (
        <InputNumber
          min={1.00}
          value={value}

          onChange={(newValue) => {
            if (onChange) {
              onChange(newValue);
            }
            handleTotalAmountToChange(newValue);
          }}
          placeholder="Total Amount (To)"
          step={0.01}
        />
      ),
    },

  ];

  return (
    <ConfigProvider locale={enUS}>
      <ProTable<HrReportResponseDto>
        columns={columns}
      
        // @ts-ignore
        request={async (params, sorter, filter) => {

          try {
            const updatedFilter = {
              factoryCode: isSelectedFactory.length > 0 ? isSelectedFactory.join(',') : null,
              employeeType: isSelectedEmployeeType.length > 0 ? isSelectedEmployeeType.join(',') : null,
              departmentCode: isSelectedDepartment.length > 0 ? isSelectedDepartment.join(',') : null,
              employeeStatus: isSelectedEmployeeStatus.length > 0 ? isSelectedEmployeeStatus.join(',') : null,
              employeeName: selectedName.length > 0 ? selectedName : null,
              employeeNumber: isBadgeID !== null && isBadgeID.length > 0 ? isBadgeID : null,
              clinicId: isSelectedClinic.length > 0 ? isSelectedClinic.join(',') : null,
              sicknessId: isSickness,
              mcDaysFrom: isMCDaysFrom,
              mcDaysTo: isMCDaysTo,
              consultantAmountFrom: isConsultationFeeFrom,
              consultantAmountTo: isConsultationFeeTo,
              medicineAmountFrom: isMedicineAmountFrom,
              medicineAmountTo: isMedicineAmountTo,
              totalAmountFrom: isTotalAmountFrom,
              totalAmountTo: isTotalAmountTo,
              dateFrom: isSelectedVisitDateFrom !== null && isSelectedVisitDateFrom.length > 0 ? isSelectedVisitDateFrom : null,
              dateTo: isSelectedVisitDateTo !== null && isSelectedVisitDateTo.length > 0 ? isSelectedVisitDateTo : null,
            };


            const response = await fetchHrReport(updatedFilter);
           
            setFetchedData(updatedFilter)

            const data = response?.medicalRecords.map((factory: { registration: { factoryCode: string; employeeType: string; employeeStatus: string; departmentName: string; clinic: any }; }) => ({
              ...factory.registration,
              factory: factory.registration.factoryCode,
              department: factory.registration.departmentName,
              employeeType: factory.registration.employeeType,
              employeeStatus: factory.registration.employeeStatus,
              clinicName: factory.registration.clinic.name
            }));

            return {
              data: data || [],
              success: true,

            }
          } catch (error) {
            console.error('Error fetching data:', error);
            return {
              data: [],
              success: false,
              total: 0,
            } as Partial<RequestData<HrReportResponseDto>>;;
          }
        }}

        rowKey="key"
        pagination={{
          // @ts-ignore
          current: currentPage,
          pageSize: 10,
          onChange: (page: SetStateAction<number>) => setCurrentPage(page),
          showQuickJumper: true,
          showTotal: (total: any, range: any[]) => `${range[0]}-${range[1]} of ${total} items`,
        }}
        search={{
          layout: 'vertical',
          defaultCollapsed: true,
        }}

        dateFormatter="string"
        toolBarRender={() => [
          <Button loading={isLoading} type="primary" key="primary" onClick={handleDownload}>
            Download
          </Button>
        ]}
      />
    </ConfigProvider>
  );
};

export default HRReport;
