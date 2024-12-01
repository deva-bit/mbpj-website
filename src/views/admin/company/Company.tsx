import { SetStateAction, useEffect, useRef, useState, } from "react";
import { Space, Table, Button, Modal, Form, Input, Card, Spin, message, InputRef } from 'antd';
import type { ColumnType, ColumnsType, TableProps } from 'antd/es/table';
import { PlusOutlined, SearchOutlined, } from '@ant-design/icons';
// import AddModalFactoryPic from './AddModalFactoryPic';
// import EditModalFactoryPic from './EditModalFactoryPic';
import { fetchCompany } from "@/api/company/company.api";
import { companyResponseDto,companyDeleteRequestDto,companyRequestDto } from "@/api/company/company.types";
import { factoryPicRequestDto, factoryPicResponseDto, factoryPicDeleteRequestDto } from "@/api/factoryPic/factoryPic.types";
import { useQuery } from "@tanstack/react-query";
import { fetchFactoryPic, deleteFactoryPic } from "@/api/factoryPic/factoryPic.api";
import Highlighter from "react-highlight-words";
import { FilterConfirmProps } from "antd/es/table/interface";
const Company = () => {

  const [dataSource, setDataSource] = useState<factoryPicResponseDto[] | undefined>([]);
  const [isEditData, setEditData] = useState<factoryPicResponseDto | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isDataFactory, setFactory] = useState<companyResponseDto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [searchedColumn, setSearchedColumn] = useState<string>('');
  const searchInput = useRef<InputRef>(null);
  const [isSuccessfullAdd, setSuccessfullAdd] = useState<boolean>(false);
  const [isSuccessfullEdit, setSuccessfullEdit] = useState<boolean>(false);
  const [isEnableDelete, setDeleteEnable] = useState<boolean>(false)
  const [deleteValue, setDeleteValue] = useState<companyDeleteRequestDto>({
    id: 0,
  })
  const {
    isLoading: isLoadingFactoryPIC, isFetching: isFetchingFactoryPIC, isError: isErrorFactoryPIC, isSuccess: isSuccessFactoryPIC, data: dataFactoryPIC, error: errorFactoryPIC, refetch: refetchFactoryPIC
  } = useQuery({
    queryKey: ['factoryPIC'],
    queryFn: () => fetchFactoryPic(),
  })

  // const {
  //   isLoading: isLoadingFactory, isFetching: isFetchingFactory, isError: isErrorFactory, isSuccess: isSuccessFactory, data: dataFactory, error: errorFactory, refetch: refetchFactory
  // } = useQuery({
  //   queryKey: ['factories'],
  //   queryFn: () => fetchFactory(),
  // })

  const {
    isLoading: isLoadingDeleteFactoryPIC, isFetching: isFetchingDeleteFactoryPIC, isError: isErrorDeleteFactoryPIC, isSuccess: isSuccessDeleteFactoryPIC, data: dataDeleteFactoryPIC, error: deleteFactoryPICError, refetch: refetchDeleteFactoryPIC
  } = useQuery({
    queryKey: ['deleteFactoryPIC', deleteValue],
    queryFn: () => deleteFactoryPic(deleteValue),
    enabled: isEnableDelete
  })

  // // Factory api successfully called
  // useEffect(() => {
  //   if (isSuccessFactory) {
  //     const filteredData = dataFactory?.filter((item: { status: boolean; }) => item.status === true);
  //     setFactory(filteredData);
  //   }
  // }, [isSuccessFactory]);

  // Factory PIC api successfully called
  useEffect(() => {
    if (isSuccessFactoryPIC) {
      const filteredData = dataFactoryPIC?.filter((item) => item.status === true);
      setDataSource(filteredData);
    }
  }, [isSuccessFactoryPIC]);

  //Refetch API after Add successfull
  useEffect(() => {
    if (isSuccessfullAdd) {
      refetchFactoryPIC().then((result) => {
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
      refetchFactoryPIC().then((result) => {
        const data = result.data;
        const filteredData = data?.filter((item) => item.status === true);
        setDataSource(filteredData);
      });
      setSuccessfullEdit(false)
    }
  }, [isSuccessfullEdit]);

  //Factory PIC data successfully deleted
  useEffect(() => {
    if (isSuccessDeleteFactoryPIC) {
      refetchFactoryPIC().then((result) => {
        const data = result.data;
        const filteredData = data?.filter((item) => item.status === true);
        setDataSource(filteredData);
      });
      message.success('Factory PIC deleted successfully.');
      setTimeout(() => {
      }, 2000);
    }
  }, [isSuccessDeleteFactoryPIC]);

  //Get status from AddModalFactoryPIC component
  const successfullAdd = (status: boolean): void => {
    setSuccessfullAdd(status)
  }

   //Get status from EditModalFactoryPIC component
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
  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<factoryPicResponseDto> => ({
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
  type DataIndex = keyof factoryPicResponseDto;

  const columns: ColumnsType<factoryPicResponseDto> = [
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
      title: 'Name',
      dataIndex: 'name',
      key: 'name',

      filterMode: 'tree',
      filterSearch: true,
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
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


  const onChange: TableProps<factoryPicResponseDto>['onChange'] = (pagination, filters, sorter, extra) => {

  };

  //edit modal start
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
      content: 'Are you sure you want to delete this factory PIC?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        try {
          const request: factoryPicDeleteRequestDto = { id: id, };
          setDeleteValue(request);
          setDeleteEnable(true)
        } catch (error) {
          message.error('Failed to delete factory PIC.');
          console.error(deleteFactoryPICError)
        }
      },

    });
  };

  return (
    <div>
      <Spin spinning={isLoadingFactoryPIC} tip="Loading...">
        <Card title="Company" >
          <Table columns={columns} dataSource={dataSource} onChange={onChange} pagination={{ current: currentPage, pageSize: 10, onChange: (page: SetStateAction<number>) => setCurrentPage(page), showQuickJumper: true, showTotal: (total: any, range: any[]) => `${range[0]}-${range[1]} of ${total} items` }} />
        </Card>

        {/* {isEditModalOpen && (
          <EditModalFactoryPic successfullEdit={successfullEdit} editData={isEditData} factory={isDataFactory} loadingFactoryCode={isLoadingFactory} closeModal={() => setIsEditModalOpen(false)} />
        )} */}

      </Spin>
    </div>
  );
}
export default Company;