import { useState, useRef, useEffect, SetStateAction } from "react";
import { Space, Table, Button, Modal, Form, Input, Card, message, Spin, InputRef } from 'antd';
import type { ColumnType, ColumnsType, TableProps } from 'antd/es/table';
import { AppstoreAddOutlined, PlusOutlined, SearchOutlined, SisternodeOutlined, UserAddOutlined } from '@ant-design/icons';

import { useQuery } from "@tanstack/react-query";
import { clinicInformationResponseDto, clinicInformationDeleteRequestDto } from "@/api/clinicInformation/clinicInformation.types";
import { fetchclinicInformation, deleteclinicInformation } from "@/api/clinicInformation/clinicInformation.api";
import { FilterConfirmProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";

const CajTransaksi = () => {

  const [dataSource, setDataSource] = useState<clinicInformationResponseDto[] | undefined>([]);
  const [isEditData, setEditData] = useState<clinicInformationResponseDto | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchText, setSearchText] = useState<string>('');
  const [searchedColumn, setSearchedColumn] = useState<string>('');
  const searchInput = useRef<InputRef>(null);
  const [isSuccessfullAdd, setSuccessfullAdd] = useState<boolean>(false);
  const [isSuccessfullEdit, setSuccessfullEdit] = useState<boolean>(false);
  const [isEnableDelete, setDeleteEnable] = useState<boolean>(false)
  const [deleteValue, setDeleteValue] = useState<clinicInformationDeleteRequestDto>({
    id: 0,
  })

  const {
    isLoading: isLoadingClinicInformation, isFetching: isFetchingClinicInformation, isError: isErrorClinicInformation, isSuccess: isSuccessClinicInformation, data: dataClinicInformation, error: errorClinicInformation, refetch: refetchClinicInformation
  } = useQuery({
    queryKey: ['clinics'],
    queryFn: () => fetchclinicInformation(),
  })

  const {
    isLoading: isLoadingDeleteClinicInformation, isFetching: isFetchingDeleteClinicInformation, isError: isErrorDeleteClinicInformation, isSuccess: isSuccessDeleteClinicInformation, data: dataDeleteClinicInformation, error: deleteClinicInformationError, refetch: deleteClinicInformationRefetch
  } = useQuery({
    queryKey: ['deleteAnnouncement', deleteValue],
    queryFn: () => deleteclinicInformation(deleteValue),
    enabled: isEnableDelete
  })

  // Clinic Information api successfully called
  useEffect(() => {
    if (isSuccessClinicInformation) {
      const filteredData = dataClinicInformation?.filter((item) => item.status === true);
      setDataSource(filteredData);
    }
  }, [isSuccessClinicInformation]);

  //Refetch API after Add successfull
  useEffect(() => {
    if (isSuccessfullAdd) {
      refetchClinicInformation().then((result) => {
        const data = result.data;
        const filteredData = data?.filter((item) => item.status === true);
        setDataSource(filteredData);
      });
      setSuccessfullAdd(false)
    }
  }, [isSuccessfullAdd]);

  //Refetch API after edit successfull
  useEffect(() => {
    if (isSuccessfullEdit) {
      refetchClinicInformation().then((result) => {
        const data = result.data;
        const filteredData = data?.filter((item) => item.status === true);
        setDataSource(filteredData);
      });
      setSuccessfullEdit(false)
    }
  }, [isSuccessfullEdit]);

  //ClinicInformation data successfully deleted
  useEffect(() => {
    if (isSuccessDeleteClinicInformation) {
      refetchClinicInformation().then((result) => {
        const data = result.data;
        const filteredData = data?.filter((item) => item.status === true);
        setDataSource(filteredData);
      });
      message.success('Clinic Information deleted successfully.');
      setTimeout(() => {
      }, 2000);
    }
  }, [isSuccessDeleteClinicInformation]);

  //Get status from AddModalClinicInformation component
  const successfullAdd = (status: boolean): void => {
    setSuccessfullAdd(status)
  }

  //Get status from EditModalClinicInformation component
  const successfullEdit = (status: boolean): void => {
    setSuccessfullEdit(status)
  }

  //start for handle search
  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<clinicInformationResponseDto> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined rev={undefined} />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} rev={undefined} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  //end for handle search

  type DataIndex = keyof clinicInformationResponseDto;
  const columns: ColumnsType<clinicInformationResponseDto> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: any, record: any, index: number) => {
        const pageIndex = (currentPage - 1) * 10 + index + 1;
        return <span>{pageIndex}</span>;
      },
    },
    {
      title: 'Jenis Transaksi',
      dataIndex: 'clinicCode',
      key: 'clinicCode',
      filterMode: 'tree',
      filterSearch: true,
      ...getColumnSearchProps('clinicCode'),
    },
    {
      title: 'Last Updated',
      dataIndex: 'name',
      key: 'name',
      filterMode: 'tree',
      filterSearch: true,
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Oleh',
      dataIndex: 'email',
      key: 'email',
      filterMode: 'tree',
      filterSearch: true,
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Jumlah',
      dataIndex: 'role',
      key: 'role',
      filterMode: 'tree',
      filterSearch: true,
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: { id: number }) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>Edit</a>
          <a onClick={() => handleDelete(record.id)}>Delete</a>
        </Space>
      ),
    },
  ];

  const onChange: TableProps<clinicInformationResponseDto>['onChange'] = (pagination, filters, sorter, extra) => {
    // console.log('params', pagination, filters, sorter, extra);
  };

  const handleEdit = (record: { id: number }) => {
    const editData = dataSource?.find((u) => u.id === record.id);
    if (editData) {
      setEditData(editData);
      setIsEditModalOpen(true);
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete this clinic information?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          const request: clinicInformationDeleteRequestDto = { id: id };
          setDeleteValue(request);
          setDeleteEnable(true)
        } catch (error) {
          message.error('Failed to delete clinic information.');
          console.error(deleteClinicInformationError)
        }
      },

    });
  };

  return (
    <div>
     
        <Card title="Konfigurasi Caj Transaksi Bayaran"
          extra={<div className="button-container">
            <Button type="primary" onClick={() => setIsModalOpen(true)}><PlusOutlined  rev={undefined} /> Tambah Baru</Button> 
            </div>} className="my-card">
          <Table columns={columns} dataSource={dataSource} onChange={onChange} pagination={{ current: currentPage, pageSize: 10, onChange: (page: SetStateAction<number>) => setCurrentPage(page), showQuickJumper: true, showTotal: (total: any, range: any[]) => `${range[0]}-${range[1]} of ${total} items` }}/>
        </Card>

    
    </div>
  );
}
  ;
export default CajTransaksi;