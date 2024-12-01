import { SetStateAction, useEffect, useState } from "react";
import { EllipsisOutlined, SearchOutlined } from '@ant-design/icons';
import type { ProColumns, RequestData } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, DatePicker, Dropdown, Input, Select } from 'antd';
import enUS from 'antd/lib/locale/en_US';

import { ConfigProvider } from 'antd';

import { fetchHrReport, downloadReport } from "@/api/hrReport/hrReport.api"
import { useQuery } from "@tanstack/react-query";
import { HrReportRequestDto, HrReportResponseDto, HrReportDownloadRequestDto, HrReportDownloadResponseDto } from "@/api/hrReport/hrReport.types"
import { fetchFactory } from "@/api/factory/factory.api"
import { FactoryResponseDto } from "@/api/factory/factory.types"
import { fetchclinicInformation } from "@/api/clinicInformation/clinicInformation.api"
import { clinicInformationResponseDto } from "@/api/clinicInformation/clinicInformation.types"
import { fetchSicknessList } from "@/api/sicknessList/sicknessList.api"
import { SicknessListResponseDto } from "@/api/sicknessList/sicknessList.types"
import { fetchEmployee } from "@/api/employee/employee.api";
import { fetchdepartmentCode } from "@/api/departmentCode/departmentCode.api";
import { departmentCodeResponseDto } from "@/api/departmentCode/departmentCode.types"

const { RangePicker } = DatePicker;

const employeeType: { [key: string]: string } = {
    Staff: 'Staff',
    Worker: 'Worker',
};

const ExportToSap = () => {

    const [isSelectedFactory, setSelectedFactory] = useState<string[]>([]);
    const [isSelectedEmployeeType, setSelectedEmployeeType] = useState<string[]>([]);
    const [isSelectedVisitDateFrom, setSelectedVisitDateFrom] = useState<string | null>(null);
    const [isSelectedVisitDateTo, setSelectedVisitDateTo] = useState<string | null>(null);
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

    // Factory api successfully called
    useEffect(() => {
        if (isSuccessFactory) {
            const filteredData = dataFactories?.filter((item) => item.status === true);
            setFactory(filteredData);
        }
    }, [isSuccessFactory]);

    const handleFactoryChange = (value: string[]) => {
        setSelectedFactory(value);
    };

    const handleEmployeeTypeChange = (value: string[]) => {
        setSelectedEmployeeType(value);
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
    ];
    return (
        <ConfigProvider locale={enUS}>
            <ProTable<HrReportResponseDto>
                columns={columns}

                onLoad={async () => {
                    try {

                        const response = await fetchHrReport();

                        const data = response?.medicalRecords.map((record: { registration: { factoryCode: any; }; }) => ({
                            ...record.registration,
                            factory: record.registration.factoryCode,

                        }));

                        return {
                            data: data || [],
                            success: true,
                        };
                    } catch (error) {
                        console.error("Error fetching data:", error);
                        return {
                            data: [],
                            success: false,
                            total: 0,
                        };
                    }
                }}
                // @ts-ignore
                request={async (params, sorter, filter) => {

                    try {
                        const updatedFilter = {
                            factoryCode: isSelectedFactory.length > 0 ? isSelectedFactory.join(',') : null,
                            employeeType: isSelectedEmployeeType.length > 0 ? isSelectedEmployeeType.join(',') : null,
                            dateFrom: isSelectedVisitDateFrom !== null && isSelectedVisitDateFrom.length > 0 ? isSelectedVisitDateFrom : null,
                            dateTo: isSelectedVisitDateTo !== null && isSelectedVisitDateTo.length > 0 ? isSelectedVisitDateTo : null,
                        };


                        //             const response = await fetchHrReport(updatedFilter);
                        // console.log(response)
                        //             setFetchedData(updatedFilter)

                        // const data = response?.medicalRecords.map((factory: { registration: { factoryCode: string; employeeType: string; employeeStatus: string;departmentName:string; clinic:any }; }) => ({
                        //   ...factory.registration,
                        //   factory: factory.registration.factoryCode,
                        //   department:factory.registration.departmentName,
                        //   employeeType: factory.registration.employeeType,
                        //   employeeStatus: factory.registration.employeeStatus,
                        //   clinicName:factory.registration.clinic.name
                        // }));

                        return {
                            // data: data || [],
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

export default ExportToSap;
