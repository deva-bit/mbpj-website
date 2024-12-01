import React, { useEffect, useRef, useState, } from "react";
import { Space, Table, Button, Modal, Form, Input, Card, Select, Cascader, Row, Col, message, Spin, InputRef } from 'antd';
import type { ColumnType, ColumnsType, TableProps } from 'antd/es/table';
import { PlusOutlined, MinusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import './CClist.css';
import AddCCList from './AddModalCCList';
import { useQuery } from "@tanstack/react-query";
import { ccListResponseDto, ccListDeleteRequestDto } from "@/api/ccList/ccList.types";
import { fetchCcList, deleteCcList } from "@/api/ccList/ccList.api";
import { fetchEmployee } from "@/api/employee/employee.api";
import Highlighter from "react-highlight-words";
import { FilterConfirmProps } from "antd/es/table/interface";

const CCList = () => {

  const [dataSource, setDataSource] = useState<ccListResponseDto[] | undefined>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [isSuccessfullAdd, setSuccessfullAdd] = useState<boolean>(false);
  const [isEnableDelete, setDeleteEnable] = useState<boolean>(false)
  const [deleteValue, setDeleteValue] = useState<ccListDeleteRequestDto>({
    id: 0,
  })

  const {
    isLoading: isLoadingCCList, isFetching: isFetchingCCList, isError: isErrorCCList, isSuccess: isSuccessCCList, data: dataCCList, error: errorCCList, refetch: refetchCCList
  } = useQuery({
    queryKey: ['ccList'],
    queryFn: () => fetchCcList(),
  })

  const {
    isLoading: isLoadingDeleteCCList, isFetching: isFetchingDeleteCCList, isError: isErrorDeleteCCList, isSuccess: isSuccessDeleteCCList, data: dataDeleteCCList, error: errordeleteCCList, refetch: refetchDeleteCCList
  } = useQuery({
    queryKey: ['deleteCCList', deleteValue],
    queryFn: () => deleteCcList(deleteValue),
    enabled: isEnableDelete
  })
  // Factory api successfully called
  useEffect(() => {
    if (isSuccessCCList) {
      const filteredData = dataCCList?.filter((item) => item.status === true);
      setDataSource(filteredData);
    }
  }, [isSuccessCCList]);

   //Refetch API after Add successfull
   useEffect(() => {
    if (isSuccessfullAdd) {
      refetchCCList().then((result) => {
        const data = result.data;
        const filteredData = data?.filter((item) => item.status === true);
        setDataSource(filteredData);
      });
      setSuccessfullAdd(false)
    }
  }, [isSuccessfullAdd]);
  //Factory data successfully deleted
  useEffect(() => {
    if (isSuccessDeleteCCList) {
      refetchCCList().then((result) => {
        const data = result.data;
        const filteredData = data?.filter((item) => item.status === true);
        setDataSource(filteredData);
      });
      message.success('CC List deleted successfully.');
      setTimeout(() => {
      }, 2000);
    }
  }, [isSuccessDeleteCCList]);

  //Get data from AddModalClinicUser component
  const successfullAdd = (status: boolean): void => {
    setSuccessfullAdd(status)
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
  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<ccListResponseDto> => ({
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

  //Delete 
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete this CC List user?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        try {
          const request: ccListDeleteRequestDto = { id: id };
          setDeleteValue(request);
          setDeleteEnable(true)
        } catch (error) {
          message.error('Failed to delete CC List.');
          console.error(errordeleteCCList)
        }
      },
    });
  };

  type DataIndex = keyof ccListResponseDto;
  const columns: ColumnsType<ccListResponseDto> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },

    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      // filters: emailFilters,
      filterMode: 'tree',
      filterSearch: true,
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      // filters: emailFilters,
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value: string | number | boolean, record: ccListResponseDto) => record.email.startsWith(value.toString()),
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: { id: number }) => (
        <Space size="middle">
          {/* <a onClick={() => handleEdit(record)}>Edit</a> */}
          <a onClick={() => handleDelete(record.id)}>Delete</a>
        </Space>
      ),
    },
  ];

  const onChange: TableProps<ccListResponseDto>['onChange'] = (pagination, filters, sorter, extra) => {
    // console.log('params', pagination, filters, sorter, extra);
  };

  return (
    <div>
      <Spin spinning={isLoadingCCList} tip="Loading...">
        <Card title="CC List"
          extra={<div className="button-container">
            <Button type="primary" onClick={() => setIsModalOpen(true)}><PlusOutlined rev={undefined} /> Add CC List</Button>{isModalOpen && <AddCCList successfullAdd={successfullAdd} closeModal={() => setIsModalOpen(false)} />}</div>} className="my-card">
          <Table columns={columns} dataSource={dataSource} onChange={onChange} />
        </Card>

      </Spin>
    </div>
  );
}
  ;
export default CCList;