import { SetStateAction, useEffect, useRef, useState, } from "react";
import { Space, Table, Button, Modal, Form, Input, Card, message, Spin, InputRef } from 'antd';
import type { ColumnType, ColumnsType, TableProps } from 'antd/es/table';
import { PlusOutlined, SearchOutlined, } from '@ant-design/icons';
import AddModalClinicUser from './AddModalClinicUser';
import EditModalClinicUser from './EditModalClinicUser';
import ForgetPasswordModal from './ForgetPasswordModal';
import { useQuery } from "@tanstack/react-query";
import { fetchClinicUser, deleteClinicUser } from "@/api/clinicUser/clinicUser.api";
import { clinicUserResponseDto, clinicUserDeleteRequestDto } from "@/api/clinicUser/clinicUser.types";
import { FilterConfirmProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";

type DataIndex = string;

const ClinicUser = () => {

  const [dataSource, setDataSource] = useState<clinicUserResponseDto[] | undefined>([]);
  const [isEditData, setEditData] = useState<clinicUserResponseDto | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [searchText, setSearchText] = useState<string>('');
  const [searchedColumn, setSearchedColumn] = useState<string>('');
  const searchInput = useRef<InputRef>(null);
  const [isSuccessfullAdd, setSuccessfullAdd] = useState<boolean>(false);
  const [isSuccessfullEdit, setSuccessfullEdit] = useState<boolean>(false);
  const [isSuccessfullEditPassword, setSuccessfullEditPassword] = useState<boolean>(false);
  const [isEnableDelete, setDeleteEnable] = useState<boolean>(false)
  const [deleteValue, setDeleteValue] = useState<clinicUserDeleteRequestDto>({
    id: 0,
  })
  const {
    isLoading: isLoadingClinicUser, isFetching: isFetchingClinicUser, isError: isErrorClinicUser, isSuccess: isSuccessClinicUser, data: dataClinicUser, error: errorClinicUser, refetch: refetchClinicUser
  } = useQuery({
    queryKey: ['clinic/users'],
    queryFn: () => fetchClinicUser(),
  })

  const {
    isLoading: isLoadingDeleteClinicUser, isFetching: isFetchingDeleteClinicUser, isError: isErrorDeleteClinicUser, isSuccess: isSuccessDeleteClinicUser, data: dataDeleteClinicUser, error: deleteClinicUserError, refetch: deleteClinicUserRefetch
  } = useQuery({
    queryKey: ['deleteClinicUser', deleteValue],
    queryFn: () => deleteClinicUser(deleteValue),
    enabled: isEnableDelete
  })

  // Clinic User api successfully called
  useEffect(() => {
    if (isSuccessClinicUser) {
      const filteredData = dataClinicUser?.filter((item) => item.status === true);
      setDataSource(filteredData);
    }
  }, [isSuccessClinicUser]);

  //Refetch API after Add successfull
  useEffect(() => {
    if (isSuccessfullAdd) {
      refetchClinicUser().then((result) => {
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
      refetchClinicUser().then((result) => {
        const data = result.data;
        const filteredData = data?.filter((item) => item.status === true);
        setDataSource(filteredData);
      });
      setSuccessfullEdit(false)
    }
  }, [isSuccessfullEdit]);

  //Refetch API after edit password successfull
  useEffect(() => {
    if (isSuccessfullEditPassword) {
      refetchClinicUser().then((result) => {
        const data = result.data;
        const filteredData = data?.filter((item) => item.status === true);
        setDataSource(filteredData);
      });
      setSuccessfullEditPassword(false)
    }
  }, [isSuccessfullEditPassword]);

  //ClinicInformation data successfully deleted
  useEffect(() => {
    if (isSuccessDeleteClinicUser) {
      refetchClinicUser().then((result) => {
        const data = result.data;
        const filteredData = data?.filter((item) => item.status === true);
        setDataSource(filteredData);
      });
      message.success('Clinic Information deleted successfully.');
      setTimeout(() => {
      }, 2000);
    }
  }, [isSuccessDeleteClinicUser]);

  //Get data from AddModalClinicUser component
  const successfullAdd= (status: boolean): void => {
    setSuccessfullAdd(status)
  }
  //Get status from EditModalClinicUser component
  const successfullEdit = (status: boolean): void => {
    setSuccessfullEdit(status)
  }
  //Get status from ForgetPassword component
  const successfullEditPassword = (status: boolean): void => {
    setSuccessfullEditPassword(status)
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
  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<clinicUserResponseDto> => ({
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

  const columns: ColumnsType<clinicUserResponseDto> = [
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
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Clinic Name',
      dataIndex: ['clinic', 'name'],
      key: 'clinicName',
      ...getColumnSearchProps('clinic.name'),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: { id: number }) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>Edit</a>
          <a onClick={() => handleForgetPasswordModal(record)}>Forgot Password?</a>
          <a onClick={() => handleDelete(record.id)}>Delete</a>
        </Space>
      ),
    },
  ];

  const onChange: TableProps<clinicUserResponseDto>['onChange'] = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };


  //Handle edit record and modal
  const handleEdit = (record: { id: number }) => {
    const editData = dataSource?.find((u) => u.id === record.id);
    if (editData) {
      setEditData(editData);
      setIsEditModalOpen(true);
    }
  };

  const handleForgetPasswordModal = (record: { id: number }) => {
    const editData = dataSource?.find((u) => u.id === record.id);

    if (editData) {
      setEditData(editData);
      setIsForgotPasswordOpen(true);
    }
  };
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete this clinic user?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          const request: clinicUserDeleteRequestDto = { id: id };
          setDeleteValue(request);
          setDeleteEnable(true)
        } catch (error) {
          message.error('Failed to delete Clinic User.');
          console.error(deleteClinicUserError)
        }
      },
      onCancel: () => {

      },
    });
  };
  return (
    <div>
      <Spin spinning={isLoadingClinicUser} tip="Loading...">
        <Card title="Clinic User" extra={<div className="button-container">
          <Button type="primary" onClick={() => setIsModalOpen(true)}><PlusOutlined rev={undefined} /> Add Clinic User</Button>{isModalOpen && <AddModalClinicUser successfullAdd={successfullAdd} closeModal={() => setIsModalOpen(false)} />}</div>} className="my-card">
          <Table columns={columns} dataSource={dataSource} onChange={onChange} pagination={{ current: currentPage, pageSize: 10, onChange: (page: SetStateAction<number>) => setCurrentPage(page), showQuickJumper: true, showTotal: (total: any, range: any[]) => `${range[0]}-${range[1]} of ${total} items` }} />
        </Card>

        {isEditModalOpen && (
          <EditModalClinicUser successfullEdit={successfullEdit} editData={isEditData} closeModal={() => setIsEditModalOpen(false)} />
        )}
        {isForgotPasswordOpen && (
          <ForgetPasswordModal successfullEditPassword={successfullEditPassword} editData={isEditData} closeModal={() => setIsForgotPasswordOpen(false)} />
        )}
      </Spin>
    </div>
  );
}
export default ClinicUser;