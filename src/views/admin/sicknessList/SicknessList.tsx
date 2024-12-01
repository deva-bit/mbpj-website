import { useEffect, useRef, useState, } from "react";
import { Space, Table, Button, Modal, Form, Input, Card, message, Spin, InputRef } from 'antd';
import type { ColumnType, ColumnsType, TableProps } from 'antd/es/table';
import { PlusOutlined, SearchOutlined, } from '@ant-design/icons';
import AddModalSicknessList from './AddModalSicknessList';
import EditModalSicknessList from './EditModalSicknessList';
import { SicknessListDeleteRequestDto, SicknessListResponseDto } from "@/api/sicknessList/sicknessList.types";
import { useQuery } from "@tanstack/react-query";
import { fetchSicknessList, deleteSicknessList } from "@/api/sicknessList/sicknessList.api";

import { FilterConfirmProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";

const SicknessList = () => {

  const [dataSource, setDataSource] = useState<SicknessListResponseDto[] | undefined>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [isSuccessfullAdd, setSuccessfullAdd] = useState<boolean>(false);
  const [isSuccessfullEdit, setSuccessfullEdit] = useState<boolean>(false);
  const [isEnableDelete, setDeleteEnable] = useState<boolean>(false)
  const [isEditData, setEditData] = useState<SicknessListResponseDto>({
    id: 0,
    code: "",
    description: "",
    chronicDisease: "",
    occupationalInjury: "",
    infectiousDisease: "",
    status: true,
  });
  const [deleteValue, setDeleteValue] = useState<SicknessListDeleteRequestDto>({
    id: 0,
  })
  const {
    isLoading: isLoadingSickness, isFetching: isFetchingSickness, isError: isErrorSickness, isSuccess: isSuccessSickness, data: dataSickness, error: errorSickness, refetch: refetchSickness
  } = useQuery({
    queryKey: ['sickness'],
    queryFn: () => fetchSicknessList(),
  })

  const {
    isLoading: isLoadingDeleteFactory, isFetching: isFetchingDeleteFactory, isError: isErrorDeleteFactory, isSuccess: isSuccessDeleteFactory, data: dataDeleteFactory, error: errordeleteFactory, refetch: deleteFactoryRefetch
  } = useQuery({
    queryKey: ['deleteSickness', deleteValue],
    queryFn: () => deleteSicknessList(deleteValue),
    enabled: isEnableDelete
  })

  // Sickness api successfully called
  useEffect(() => {
    if (isSuccessSickness) {
      const filteredData = dataSickness?.filter((item) => item.status === true);
      setDataSource(filteredData);
    }
  }, [isSuccessSickness]);

  //Refetch API after Add successfull
  useEffect(() => {
    if (isSuccessfullAdd) {
      refetchSickness().then((result) => {
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
      refetchSickness().then((result) => {
        const data = result.data;
        const filteredData = data?.filter((item) => item.status === true);
        setDataSource(filteredData);
      });
      setSuccessfullEdit(false)
    }
  }, [isSuccessfullEdit]);

  //Sickness data successfully deleted
  useEffect(() => {
    if (isSuccessDeleteFactory) {
      refetchSickness().then((result) => {
        const data = result.data;
        const filteredData = data?.filter((item) => item.status === true);
        setDataSource(filteredData);
      });
      message.success('Sickness deleted successfully.');
      setTimeout(() => {
      }, 2000);
    }
  }, [isSuccessDeleteFactory]);
  //Get data from AddModalSicknessList component
  const successfullAdd = (status: boolean): void => {
    setSuccessfullAdd(status)
  }

  //Get status from EditModalSicknessList component
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
  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<SicknessListResponseDto> => ({
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


  type DataIndex = keyof SicknessListResponseDto;
  const columns: ColumnsType<SicknessListResponseDto> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      filterMode: 'tree',
      filterSearch: true,
      ...getColumnSearchProps('code'),

    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      filterMode: 'tree',
      filterSearch: true,
      ...getColumnSearchProps('description'),

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

  const onChange: TableProps<SicknessListResponseDto>['onChange'] = (pagination, filters, sorter, extra) => {
    // console.log('params', pagination, filters, sorter, extra);
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
      content: 'Are you sure you want to delete this sickness?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          const request: SicknessListDeleteRequestDto = { id: id };
          setDeleteValue(request);
          setDeleteEnable(true)
        } catch (error) {
          message.error('Failed to delete sickness.');
        }
      },
      onCancel: () => {

      },
    });
  };

  return (
    <div>
      <Spin spinning={isLoadingSickness} tip="Loading...">
        <Card title="Sickness List" extra={<div className="button-container">
          <Button type="primary" onClick={() => setIsModalOpen(true)}><PlusOutlined rev={undefined} /> Add Sickness</Button>{isModalOpen && <AddModalSicknessList successfullAdd={successfullAdd} closeModal={() => setIsModalOpen(false)} />}</div>} className="my-card">
          <Table columns={columns} dataSource={dataSource} onChange={onChange} />
        </Card>

        {isEditModalOpen && (
          <EditModalSicknessList successfullEdit={successfullEdit} editData={isEditData} closeModal={() => setIsEditModalOpen(false)} />
        )}

      </Spin>
    </div>
  );
}
export default SicknessList;

