import { SetStateAction, useEffect, useState } from "react";
import type { ProColumns, RequestData } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Card, DatePicker, Form, Input, Modal, Select, Space } from 'antd';
import enUS from 'antd/lib/locale/en_US';
import './UserRecord.css';
import { ConfigProvider } from 'antd';
import { useQuery } from "@tanstack/react-query";
import { getUserRecord } from "@/api/userRecord/userRecord.api"
import { UserRecordRequestDto, UserRecordResponseDto } from "@/api/userRecord/userRecord.types"
import { fetchFactory } from "@/api/factory/factory.api"
import { FactoryResponseDto } from "@/api/factory/factory.types"
import { useAppSelector } from "@/store/hooks";
import dayjs from "dayjs";
import { fetchAdminList } from "@/api/admin/admin.api";

const UserRecord = () => {
  const [isSelectedFactory, setSelectedFactory] = useState<string>("");
  const [dataUserRecord, setUserRecord] = useState<any>();
  const [dataFactory, setFactory] = useState<FactoryResponseDto[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isGettingUserRecord, setGettingUserRecord] = useState<boolean>(false)
  const [isSelectedYear, setSelectedYear] = useState<string>("");
  const [isSelectedFilterType, setSelectedFilterType] = useState<string>("");
  const [isSelectedSearchValue, setSearchValue] = useState<string>("");
  const [showFilterPanel, setShowFilterPanel] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const [userRecordSearchValue, setUserRecordSearchValue] = useState<UserRecordRequestDto>({
    factory: "",
    year: "",
    filterType: "",
    searchValue: ""
  })

  const userRole = useAppSelector((state) => state.userRole)
  const {
    isLoading: isLoadingFactory, isFetching: isFetchingFactory, isError: isErrorFactory, isSuccess: isSuccessFactory, data: dataFactories, error: errorFactory, refetch: FactoryRefetch
  } = useQuery({
    queryKey: ['factory'],
    queryFn: () => fetchFactory(),
  })

  const {
    isLoading: isLoadingUserRecord, isFetching: isFectchingUserRecord, isError: isErrorUserRecord, isSuccess: isSuccessUserRecord, data: userRecord, error: UserRecordError, refetch: UserRecordRefetch
  } = useQuery({
    queryKey: userRecordSearchValue ? ['userRecord', userRecordSearchValue]: ['userRecord'],
  queryFn: () => getUserRecord(userRecordSearchValue),
  enabled: isGettingUserRecord && !!userRecordSearchValue
  })
  const {
    isLoading: isLoadingAdmin, isFetching: isFectchingAdmin, isError: isErrorAdmin, isSuccess: isSuccessAdmin, data: admin, error: adminError, refetch: adminRefetch
  } = useQuery({
    queryKey: ['admin'],
    queryFn: () => fetchAdminList(),
  })
  // Factory api successfully called
  useEffect(() => {
    if (isSuccessFactory) {
      const filteredData = dataFactories?.filter((item) => item.status === true);
      setFactory(filteredData);
    }
  }, [isSuccessFactory]);

  useEffect(() => {
    if (isSuccessUserRecord) {
      const filteredData = userRecord?.filter((item) => item.status === true);
      setUserRecord(filteredData);
    }
  }, [isSuccessUserRecord]);

  //show the filter
  useEffect(() => {
    if (admin?.map((name)=>name.username)  && admin?.map((status)=>status.status)) {
      setShowFilterPanel(true);
    } else {
      setShowFilterPanel(false);
    }
  }, [admin]);

  const handleFactoryChange = (value: string) => {
    setSelectedFactory(value);
  };

  const handledYearChange = (date: any) => {
    setSelectedYear(date.format('YYYY'))

  }
  const handleFilterType = (value: string) => {
    setSelectedFilterType(value);
  };
  const handleSearchValue = (value: string) => {
    setSearchValue(value);
  };

  const searchConfigShow = {
    layout: 'vertical',
    defaultCollapsed: true,
  };
  const searchConfig = showFilterPanel ? searchConfigShow : false;

  const columns: ProColumns<UserRecordResponseDto>[] = [
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
      hideInTable: true,
      key: 'factory',
      dataIndex: 'factory',
      filters: true,
      onFilter: true,
      ellipsis: true,
      valueType: 'select',

      renderFormItem: (_item, { value, onChange }) => (
        <Form.Item
          name="factory"
          rules={[
            {
              required: true,
              message: "Please select a Factory!",
            }
          ]}
        >
          <Select
            loading={isFetchingFactory}
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
        </Form.Item>
      ),
    },
    {
      title: 'Year',
      key: 'year',
      valueType: 'dateRange',
      dataIndex: 'clinicVisitDate',
      hideInTable: true,
      renderFormItem: (_item, { value, onChange }) => (
        <DatePicker renderExtraFooter={() => 'extra footer'}
          allowClear
          onChange={handledYearChange}
          picker="year" />
      ),
    },
    {
      title: "Filter Type",
      key: "filterType",
      valueType: "select",
      dataIndex: "filterType",
      hideInTable: true,
      renderFormItem: (_item, { value, onChange }) => (
        <Form.Item
          name="filterType"
          rules={[
            {
              required: true,
              message: "Please select a Filter Type!",
            }
          ]}
        >
          <Select
            onChange={handleFilterType}
            allowClear
            defaultValue={value}
            placeholder="Select Filter Type"
          >
            <Select.Option value="username">Username</Select.Option>
            <Select.Option value="badgeId">Badge ID</Select.Option>
          </Select>
        </Form.Item>
      ),
    },
    {
      title: 'Search Value',
      hideInTable: true,
      key: 'searchValue',
      dataIndex: 'searchValue',
      renderFormItem: (_item, { value, onChange }) => (
        <Form.Item
          name="searchValue"
          rules={[
            {
              required: true,
              message: "Please enter the Search Value!",
            }
          ]}
        >
          <Input placeholder="Input Search Value"
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => handleSearchValue(e.target.value)}
          />
        </Form.Item>
      ),
    },
    {
      title: 'Clinic Name',
      hideInSearch: true,
      key: 'clinicName',
      dataIndex: 'clinicName',
    },
    {
      title: 'Registration Date',
      hideInSearch: true,
      key: 'registrationDate',
      dataIndex: 'registrationDate',
    },
    {
      title: 'Sickness',
      hideInSearch: true,
      key: 'sicknesses',
      dataIndex: 'sicknesses',
    },

    // {
    //   title: 'More Details',
    //   key: 'action',
    //   hideInSearch: true,
    //   render: (text, record, index) =>  (
    //     <Space size="middle">
    //        <a onClick={() => handleMoreDetails(record)}>More Details</a>

    //     </Space>
    //   ),
    // },
  ];
  
    // //edit modal start
    // const handleMoreDetails = (record: UserRecordResponseDto) => {
    //   setIsEditModalOpen(true)
    //   // const editData = dataSource?.find((u) => u.id === record.id);

    //   // if (editData) {
    //   //   setEditData(editData);
    //   //   setIsForgotPasswordOpen(true);
    //   // }
    // };
    const handleaddCancel = () => {
      setIsEditModalOpen(false);
  };
  return (
    <ConfigProvider locale={enUS}>
      <ProTable<UserRecordResponseDto>
        columns={columns}
       
         // @ts-ignore
        request={async (params, sort, filter) => {
          try {
            if (isSelectedFactory.length > 0) {
              const updatedFilter = {
                factory: isSelectedFactory,
                year: isSelectedYear,
                filterType: isSelectedFilterType,
                searchValue: isSelectedSearchValue
              };
              const response = await getUserRecord(updatedFilter)
              console.log(response.map((fg)=>fg.medicalRecords.map((sick)=>sick.sicknesses.map((sickneses)=>sickneses.code))))
              const data = response?.map((userRecordData) => ({
                clinicName: userRecordData.clinic.name,
                registrationDate: dayjs(userRecordData.registrationDate).format("DD/MM/YYYY h:mm A"),
                sicknesses: userRecordData.medicalRecords.map((sick)=>sick.sicknesses.map((sickneses)=>sickneses.code)),
                
              }));
              return {
                data: data || [],
                success: true,
              }
            }
            else {
              const response = await getUserRecord()

              const data = response?.map((userRecordData) => ({
                clinicName: userRecordData.clinic.name,
                registrationDate: dayjs(userRecordData.registrationDate).format("DD/MM/YYYY h:mm A"),
                sicknesses: userRecordData.medicalRecords.map((sick)=>sick.sicknesses.map((sickneses)=>sickneses.description)),
              }));
              return {
                data: data || [],
                success: true,
              }
            }
          } catch (error) {
            console.error('Error fetching data:', error);
            return {
              data: [],
              success: false,
              total: 0,
            } as Partial<RequestData<UserRecordResponseDto>>;;
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
        // @ts-ignore
        search={searchConfig}
        dateFormatter="string"
        tableExtraRender={() => {
          return (<Card>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p ><b>Total Outstanding:</b></p>
              <p ><b>Total Claim:</b></p>
              <p ><b>Exclude Claim:</b></p>
            </div>
          </Card>
          );
        }}
      />
  
       {/* <Modal
                title="More Details"
                open={isEditModalOpen}
                cancelButtonProps={{ style: { display: 'none' } }}
                width={700}
                onOk={handleaddCancel}
                onCancel={handleaddCancel }
            >
                <p>Some contents...</p>
            </Modal> */}
                
    </ConfigProvider>
  );
};

export default UserRecord;
