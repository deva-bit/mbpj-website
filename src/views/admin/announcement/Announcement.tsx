import { useEffect, useRef, useState, } from "react";
import { Space, Table, Button, Modal, Input, Card, message, Spin, InputRef } from 'antd';
import type { ColumnType, ColumnsType, TableProps } from 'antd/es/table';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import './Announcement.css';
import AddModalAnnouncement from './AddModalAnnouncement';
import EditModalAnnouncement from './EditModalAnnouncement';
import { useQuery } from "@tanstack/react-query";
import { announcementResponseDto, announcementDeleteRequestDto } from "@/api/announcement/announcement.types";
import { fetchAnnouncement, deleteAnnouncement } from "@/api/announcement/announcement.api";
import { FilterConfirmProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
const Announcement = () => {

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [searchedColumn, setSearchedColumn] = useState<string>('');
  const searchInput = useRef<InputRef>(null);
  const [dataSource, setDataSource] = useState<announcementResponseDto[] | undefined>([]);
  const [isEditData, setEditData] = useState<announcementResponseDto | null>(null);
  const [isSuccessfullEdit, setSuccessfullEdit] = useState<boolean>(false);
  const [isSuccessfullAdd, setSuccessfullAdd] = useState<boolean>(false);
  const [isEnableDelete, setDeleteEnable] = useState<boolean>(false)
  const [deleteValue, setDeleteValue] = useState<announcementDeleteRequestDto>({
    id: 0,
  })

  const {
    isLoading: isLoadingAnnouncement, isFetching, isError: isErrordataAnnouncement, isSuccess: isSuccessAnnouncement, data: dataAnnouncement, error, refetch
  } = useQuery({
    queryKey: ['announcement'],
    queryFn: () => fetchAnnouncement(),
  })

  const {
    isLoading: isLoadingDeleteAnnouncement, isFetching: isFetchingDeleteAnnouncement, isError: isErrorDeleteAnnouncement, isSuccess: isSuccessDeleteAnnouncement, data: dataDeleteAnnouncement, error: deleteAnnouncementError, refetch: deleteAnnouncementRefetch
  } = useQuery({
    queryKey: ['deleteAnnouncement', deleteValue],
    queryFn: () => deleteAnnouncement(deleteValue),
    enabled:isEnableDelete
  })

  // Announcement api successfully called
  useEffect(() => {
    if (isSuccessAnnouncement) {
      const filteredData = dataAnnouncement?.filter((item) => item.published === true);
      setDataSource(filteredData);
    }
  }, [isSuccessAnnouncement]);

  //Refetch API after Add successfull
  useEffect(() => {
    if (isSuccessfullAdd) {
      refetch().then((result) => {
        const data = result.data;
        const filteredData = data?.filter((item) => item.published === true);
        setDataSource(filteredData);
      });
      setSuccessfullAdd(false)
    }
  }, [isSuccessfullAdd]);

  //Refetch API after edit successfull
  useEffect(() => {
    if (isSuccessfullEdit) {
      refetch().then((result) => {
        const data = result.data;
        const filteredData = data?.filter((item) => item.published === true);
        setDataSource(filteredData);
      });
      setSuccessfullEdit(false)
    }
  }, [isSuccessfullEdit]);

  //Handle edit record and modal
  const handleEdit = (record: { id: number }) => {
    const editData = dataSource?.find((u) => u.id === record.id);
    if (editData) {
      setEditData(editData);
      setIsEditModalOpen(true);
    }
  };

  //Announcement data successfully deleted
  useEffect(() => {
    if (isSuccessDeleteAnnouncement) {
      refetch().then((result) => {
        const data = result.data;
        const filteredData = data?.filter((item) => item.published === true);
        setDataSource(filteredData);
      });
      message.success('Announcement deleted successfully.');
      setTimeout(() => {

      }, 2000);
    }
  }, [isSuccessDeleteAnnouncement]);

  //Get data from AddModalAnnouncement component
  const successfullAdd= (status: boolean): void => {
    setSuccessfullAdd(status)
  }

  //Get data from EditModalAnnouncement component
  const successfullEdit = (status: boolean): void => {
    setSuccessfullEdit(status)
  }

  //Modal Delete
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete this announcement?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          const request: announcementDeleteRequestDto = {
            id: id,
          };
          setDeleteValue(request);
          setDeleteEnable(true)
        } catch (error) {
          message.error('Failed to delete announcement.');
        }
      },
    });
  };

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
  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<announcementResponseDto> => ({
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

  type DataIndex = keyof announcementResponseDto;
  const columns: ColumnsType<announcementResponseDto> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      // filters: nameFilters,
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

  const onChange: TableProps<announcementResponseDto>['onChange'] = (pagination, filters, sorter, extra) => {
    // console.log('params', pagination, filters, sorter, extra);
  };


  return (
    <div>
      <Spin spinning={isLoadingAnnouncement} tip="Loading...">
        <Card title="Announcement"
          extra={<div className="button-container">
            <Button type="primary" onClick={() => setIsModalOpen(true)}><PlusOutlined rev={undefined} /> Add Announcement</Button>{isModalOpen && <AddModalAnnouncement successfullAdd={successfullAdd} closeModal={() => setIsModalOpen(false)} />}</div>} className="my-card">
          <Table columns={columns} dataSource={dataSource} onChange={onChange} />
        </Card>

        {isEditModalOpen && (
          <EditModalAnnouncement successfullEdit={successfullEdit} editData={isEditData} closeModal={() => setIsEditModalOpen(false)} />
        )}
      </Spin>
    </div>
  );
}
  ;
export default Announcement;