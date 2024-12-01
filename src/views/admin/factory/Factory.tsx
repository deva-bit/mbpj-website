import { SetStateAction, useEffect, useRef, useState, } from "react";
import { Space, Table, Button, Modal, Form, Input, Card, Spin, message, InputRef } from 'antd';
import type { ColumnType, ColumnsType, TableProps } from 'antd/es/table';
import { PlusOutlined, SearchOutlined, } from '@ant-design/icons';
import AddModalFactory from './AddModalFactory';
import EditModalFactory from './EditModalFactory';
import { FactoryResponseDto, FactoryDeleteRequestDto } from "@/api/factory/factory.types";
import { useQuery } from "@tanstack/react-query";
import { fetchFactory, deleteFactory } from "@/api/factory/factory.api";
import { codeFactoryResponseDto, } from "@/api/codeFactory/codeFactory.types";
import { fetchcodeFactory } from "@/api/codeFactory/codeFactory.api";
import { fetchFactoryPic } from "@/api/factoryPic/factoryPic.api";
import { factoryPicResponseDto } from "@/api/factoryPic/factoryPic.types";
import { FilterConfirmProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
const Factory = () => {

  const [dataSource, setDataSource] = useState<FactoryResponseDto[] | undefined>([]);
  const [dataCodeFactory, setCodeFactory] = useState<codeFactoryResponseDto[]>([]);
  const [dataFactoryPics, setFactoryPics] = useState<factoryPicResponseDto[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isEditData, setEditData] = useState<FactoryResponseDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [searchedColumn, setSearchedColumn] = useState<string>('');
  const searchInput = useRef<InputRef>(null);
  const [isEnableDelete, setDeleteEnable] = useState<boolean>(false)
  const [isSuccessfullAdd, setSuccessfullAdd] = useState<boolean>(false);
  const [isSuccessfullEdit, setSuccessfullEdit] = useState<boolean>(false);
  const [deleteValue, setDeleteValue] = useState<FactoryDeleteRequestDto>({
    id: 0,
  })
  const {
    isLoading: isLoadingFactory, isFetching: isFetchingFactory, isError: isErrorFactory, isSuccess: isSuccessFactory, data: dataFactory, error: errorFactory, refetch: refetchFactory
  } = useQuery({
    queryKey: ['factories'],
    queryFn: () => fetchFactory(),
  })

  const {
    isLoading: isLoadingFactoryCode, isFetching: isFetchingFactoryCode, isError: isErrorFactoryCode, isSuccess: isSuccessFactoryCode, data: dataFactoryCode, error: errorFactoryCode, refetch: refetchFactoryCode
  } = useQuery({
    queryKey: ['factoryCode'],
    queryFn: () => fetchcodeFactory(),
  })

  const {
    isLoading: isLoadingFactoryPic, isFetching: isFetchingFactoryPic, isError: isErrorFactoryPic, isSuccess: isSuccessFactoryPic, data: dataFactoryPic, error: errorFactoryPic, refetch: refetchFactoryPic
  } = useQuery({
    queryKey: ['factoryPic'],
    queryFn: () => fetchFactoryPic(),
  })

  const {
    isLoading: isLoadingDeleteFactory, isFetching: isFetchingDeleteFactory, isError: isErrorDeleteFactory, isSuccess: isSuccessDeleteFactory, data: dataDeleteFactory, error: errordeleteFactory, refetch: deleteFactoryRefetch
  } = useQuery({
    queryKey: ['deleteClinicUser', deleteValue],
    queryFn: () => deleteFactory(deleteValue),
    enabled: isEnableDelete
  })

  // Factory api successfully called
  useEffect(() => {
    if (isSuccessFactory) {
      const filteredData = dataFactory?.filter((item) => item.status === true);
      setDataSource(filteredData);
    }
  }, [isSuccessFactory]);

  // Factory Code api successfully called
  useEffect(() => {
    if (isSuccessFactoryCode) {
      const filteredData = dataFactoryCode?.filter(item => item.status === 'A');
      setCodeFactory(filteredData);
    }
  }, [isSuccessFactoryCode]);

  // Factory PIC successfully called
  useEffect(() => {
    if (isSuccessFactoryPic) {
      const filteredData = dataFactoryPic?.filter((item) => item.status === true);
      setFactoryPics(filteredData);
    }
  }, [isSuccessFactoryPic]);

  //Refetch API after Add successfull
  useEffect(() => {
    if (isSuccessfullAdd) {
      refetchFactory().then((result) => {
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
      refetchFactory().then((result) => {
        const data = result.data;
        const filteredData = data?.filter((item) => item.status === true);
        setDataSource(filteredData);
      });
      setSuccessfullEdit(false)
    }
  }, [isSuccessfullEdit]);

  //Factory data successfully deleted
  useEffect(() => {
    if (isSuccessDeleteFactory) {
      refetchFactory().then((result) => {
        const data = result.data;
        const filteredData = data?.filter((item) => item.status === true);
        setDataSource(filteredData);
      });
      message.success('Factory deleted successfully.');
      setTimeout(() => {
      }, 2000);
    }
  }, [isSuccessDeleteFactory]);


  //Get status from AddModalClinicInformation component
  const successfullAdd = (status: boolean): void => {
    setSuccessfullAdd(status)
  }
  //Get status from EditModalClinicInformation component
  const successfullEdit = (status: boolean): void => {
    setSuccessfullEdit(status)
  }
  //search props
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
  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<FactoryResponseDto> => ({
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

  //edit modal start
  const handleEdit = (record: { id: number }) => {
    const user = dataSource?.find((u) => u.id === record.id);

    if (user) {
      const updatedUser = { ...user };
      setEditData(updatedUser);
      setIsEditModalOpen(true);
    }
  };


  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete this factory?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          const request: FactoryDeleteRequestDto = { id: id };
          setDeleteValue(request);
          setDeleteEnable(true)
        } catch (error) {
          message.error('Failed to delete factory.');
          console.error(errordeleteFactory)
        }
      },
    });
  };

  type DataIndex = keyof FactoryResponseDto;
  const columns: ColumnsType<FactoryResponseDto> = [
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
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      ...getColumnSearchProps('code'),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
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


  const onChange: TableProps<FactoryResponseDto>['onChange'] = (pagination, filters, sorter, extra) => {
    // console.log('params', pagination, filters, sorter, extra);
  };

  return (
    <div>
      <Spin spinning={isLoadingFactory} tip="Loading...">
        <Card title="Factory" extra={<div className="button-container">
          <Button type="primary" onClick={() => setIsModalOpen(true)}><PlusOutlined rev={undefined} /> Add Factory</Button>{isModalOpen && <AddModalFactory factoryCode={dataCodeFactory} factoryPIC={dataFactoryPics} loadingFactoryCode={isLoadingFactoryCode} loadingFactoryPIC={isLoadingFactoryPic} successfullAdd={successfullAdd} closeModal={() => setIsModalOpen(false)} />}</div>} className="my-card">
          <Table columns={columns} dataSource={dataSource} onChange={onChange} pagination={{ current: currentPage, pageSize: 10, onChange: (page: SetStateAction<number>) => setCurrentPage(page), showQuickJumper: false, showTotal: (total: any, range: any[]) => `${range[0]}-${range[1]} of ${total} items` }} />
        </Card>

        {isEditModalOpen && (
          <EditModalFactory successfullEdit={successfullEdit} loadingFactoryCode={isLoadingFactoryCode} loadingFactoryPIC={isLoadingFactoryPic} factoryCode={dataCodeFactory} factoryPIC={dataFactoryPics} editData={isEditData} closeModal={() => setIsEditModalOpen(false)} />
        )}

      </Spin>
    </div>
  );
}
export default Factory;